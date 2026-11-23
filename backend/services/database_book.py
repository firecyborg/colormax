from flask import Blueprint, request, jsonify, session
from database import get_connection
from psycopg import Error


def insert_book(cursor, title, pages, user_id):
    """Salvesta raamat ja selle leheküljed pooleliolevas tehingus."""
    cursor.execute(
        """
        INSERT INTO books (user_id, title)
        VALUES (%s, %s)
        RETURNING id, user_id, title
        """,
        (user_id, title),
    )
    book = cursor.fetchone()
    created_pages = []
    for position, page_id in enumerate(pages, start=1):
        cursor.execute(
            """
            INSERT INTO book_pages (book_id, page_id, position)
            VALUES (%s, %s, %s)
            RETURNING page_id
            """,
            (book["id"], page_id, position),
        )
        created_pages.append(cursor.fetchone()["page_id"])

    return book, created_pages


def make_book_database(title, pages, length, user_id):
    """Make a book."""

    if not isinstance(title, str):
        return jsonify({"error": "Pealkiri peab olema str"}), 400
    title = title.strip()
    if not title:
        return jsonify({"error": "pealkiri on kohustuslik"}), 400
    if len(title) > 100:
        return jsonify({"error": "Pealkiri võib olla kuni 100 märki"}), 400

    if len(set(pages)) != len(pages):
        return jsonify({"error": "Lehed peavad olema unikaalsed."}), 400

    if not isinstance(length, int):
        return jsonify({"error": "Lehtede arv peab olema int"}), 400
    if not 0 < length < 21:
        return jsonify({"error": "Lehtede arv peab olema 1-20"}), 400
    if len(pages) != length:
        return jsonify({"error": "Lehtede arv ja raamatu pikkus peavad olema samad"}), 400
    try:
        with get_connection() as connection:
            with connection.cursor() as cursor:
                book, created_pages = insert_book(cursor, title, pages, user_id)

    except Error as error:
        print(error)
        return jsonify({"error": "Raamatu loomine ebaõnnestus. Proovi hiljem uuesti."}), 500

    return jsonify({"message": "Raamatu loomine õnnestus", "book": {"id": book["id"], "owner": book["user_id"], "title": book["title"], "pages": created_pages, "length": length}}), 200
