import re

from flask import current_app, jsonify
from psycopg import Error

from database import get_connection
from services.database_book import insert_book


BASE_PRICE_CENTS = 800
PAGE_PRICE_CENTS = 45
DELIVERY_OPTIONS = {
    "courier": ("kuller", 290),
    "founder": ("asutaja", 3900),
    "worldwide": ("ulemaailmne", 1000000),
}
PAYMENT_METHODS = {
    "card": "kaart",
    "banklink": "pangalink",
    "invoice": "arve",
}


def register_order_database(*, title, page_ids, delivery, payment, customer, user_id, book_id=None):
    """Salvesta tellimus olemasolevale või uuele raamatule."""
    if book_id is not None:
        if type(book_id) is not int or not 1 <= book_id:
            return jsonify({"error": "Raamatu ID peab olema kehtiv täisarv."}), 400
    else:
        if title is None:
            title = ""
        if not isinstance(title, str):
            return jsonify({"error": "Pealkiri peab olema tekst."}), 400

        title = title.strip()
        if not title:
            title = "Minu värviraamat"
        if len(title) > 100 or "\x00" in title:
            return jsonify({"error": "Sisesta korrektne kuni 100 märgi pikkune pealkiri."}), 400

        if not isinstance(page_ids, list):
            return jsonify({"error": "Raamatus peab olema 1–20 lehekülge."}), 400

        page_count = len(page_ids)
        if not 1 <= page_count <= 20:
            return jsonify({"error": "Raamatus peab olema 1–20 lehekülge."}), 400

        for page_id in page_ids:
            if type(page_id) is not int or not 1 <= page_id <= 2_147_483_647:
                return jsonify({"error": "Lehekülgede ID-d peavad olema kehtivad täisarvud."}), 400

        if len(set(page_ids)) != page_count:
            return jsonify({"error": "Leheküljed peavad olema erinevad."}), 400

    if not isinstance(customer, dict):
        return jsonify({"error": "Kliendi andmed on kohustuslikud."}), 400

    customer_name = customer.get("name")
    if not isinstance(customer_name, str):
        customer_name = ""
    customer_name = customer_name.strip()
    if not customer_name or len(customer_name) > 100 or "\x00" in customer_name:
        return jsonify({"error": "Sisesta korrektne nimi (kuni 100 märki)."}), 400

    customer_email = customer.get("email")
    if not isinstance(customer_email, str):
        customer_email = ""
    customer_email = customer_email.strip()
    if not customer_email or len(customer_email) > 255 or "\x00" in customer_email:
        return jsonify({"error": "Sisesta korrektne e-post (kuni 255 märki)."}), 400

    if not re.fullmatch(r"[^@\s]+@[^@\s]+", customer_email):
        return jsonify({"error": "Sisesta korrektne e-posti aadress."}), 400

    address = customer.get("address")
    if not isinstance(address, str):
        address = ""
    address = address.strip()
    if not address or len(address) > 255 or "\x00" in address:
        return jsonify({"error": "Sisesta korrektne aadress (kuni 255 märki)."}), 400

    if not isinstance(delivery, str) or delivery not in DELIVERY_OPTIONS:
        return jsonify({"error": "Vali kehtiv tarneviis."}), 400
    if not isinstance(payment, str) or payment not in PAYMENT_METHODS:
        return jsonify({"error": "Vali kehtiv makseviis."}), 400

    delivery_method, delivery_price_cents = DELIVERY_OPTIONS[delivery]
    payment_method = PAYMENT_METHODS[payment]

    try:
        with get_connection() as connection:
            with connection.cursor() as cursor:
                if book_id is None:
                    cursor.execute(
                        "SELECT id FROM coloring_pages WHERE id = ANY(%s) FOR KEY SHARE",
                        (page_ids,),
                    )
                    if len(cursor.fetchall()) != page_count:
                        return jsonify({"error": "Vähemalt üks valitud lehekülg puudub."}), 400

                    book, _ = insert_book(cursor, title, page_ids, user_id)
                    book_id = book["id"]
                else:
                    cursor.execute(
                        """
                        SELECT id FROM books
                        WHERE id = %s AND user_id = %s
                        FOR SHARE
                        """,
                        (book_id, user_id),
                    )
                    if cursor.fetchone() is None:
                        return jsonify({"error": "Salvestatud raamatut ei leitud."}), 404

                    cursor.execute(
                        "SELECT COUNT(*) AS page_count FROM book_pages WHERE book_id = %s",
                        (book_id,),
                    )
                    page_count = cursor.fetchone()["page_count"]
                    if not 1 <= page_count <= 20:
                        return jsonify({"error": "Raamatus peab olema 1–20 lehekülge."}), 400

                pages_price_cents = page_count * PAGE_PRICE_CENTS
                total_price_cents = BASE_PRICE_CENTS + pages_price_cents + delivery_price_cents
                cursor.execute(
                    """
                    INSERT INTO orders (
                        user_id, book_id, customer_name, customer_email, address,
                        delivery_method, payment_method, page_count, base_price,
                        pages_price, delivery_price, total_price
                    )
                    VALUES (
                        %s, %s, %s, %s, %s, %s, %s, %s,
                        %s / 100.0, %s / 100.0, %s / 100.0, %s / 100.0
                    )
                    RETURNING id, book_id, page_count, total_price, status
                    """,
                    (
                        user_id,
                        book_id,
                        customer_name,
                        customer_email,
                        address,
                        delivery_method,
                        payment_method,
                        page_count,
                        BASE_PRICE_CENTS,
                        pages_price_cents,
                        delivery_price_cents,
                        total_price_cents,
                    ),
                )
                order = cursor.fetchone()
    except Error as error:
        current_app.logger.error("Tellimuse salvestamine ebaõnnestus (%s).", type(error).__name__)
        return jsonify({"error": "Tellimuse salvestamine ebaõnnestus. Proovi hiljem uuesti."}), 500

    return jsonify({"message": "Tellimus on salvestatud.", "order": order}), 201
