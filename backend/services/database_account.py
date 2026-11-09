from datetime import datetime
from flask import jsonify, current_app
from psycopg import Error
from psycopg.errors import UniqueViolation
from werkzeug.security import generate_password_hash
from database import get_connection
from flask import session
"""Connect functions with database."""

from flask import Blueprint, request, jsonify
from datetime import datetime

def login_database(username, password):
    """Login."""
    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT id, username, password_hash, email, birthday
                FROM users
                WHERE username = %s OR email = %s
                """,
                (username, username),
            )
            user = cursor.fetchone()
    if user is None:
        return jsonify({"error": "Vale kasutajanimi või parool"}), 401
    if (username != user["username"] and username != user["email"]) or  password != user["password_hash"]:
        return jsonify({"error": "Vale kasutajanimi, email või parool"}), 401
    return jsonify({"message": "Sisselogimine õnnestus", "user": {"id": user["id"], "username": user["username"], "email": user["email"], "birthday": user["birthday"].strftime("%d/%m/%Y")}}), 200

def register_database(username, password, email, birthday):
    """Register account."""

    username = username.strip()
    email = email.strip()

    if not username:
        return jsonify({"error": "kasutajanimi on kohustuslik"}), 400
    if not password:
        return jsonify({"error": "parool on kohustuslik"}), 400
    if not email:
        return jsonify({"error": "email on kohustuslik"}), 400

    if len(username) > 50:
        return jsonify({"error": "Kasutajanimi võib olla kuni 50 märki"}), 400
    if len(email) > 255:
        return jsonify({"error": "Email võib olla kuni 255 märki"}), 400

    try:
        datetime.strptime(birthday, "%d/%m/%Y")
    except (ValueError, TypeError):
        return jsonify({"error": "Sisesta korrektne sünnikuupäev kujul pp/kk/aaaa."}), 400
    birthday_date = datetime.strptime(birthday, "%d/%m/%Y").date()

    try:
        with get_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    INSERT INTO users
                        (username, email, password_hash, birthday)
                    VALUES (%s, %s, %s, %s) 
                    RETURNING id, username, email, birthday
                    """,
                    (username, email, password, birthday_date),
                )
                user = cursor.fetchone()

    except UniqueViolation:
        return jsonify({"error": "See kasutajanimi või email on juba kasutusel."}), 409

    except Error as error:
        print(error)
        return jsonify({"error": "Kasutaja loomine ebaõnnestus. Proovi hiljem uuesti."}), 500

    return jsonify({"message": "Kasutaja loomine õnnestus", "user": {"id": user["id"], "username": user["username"], "email": user["email"], "birthday": user["birthday"].strftime("%d/%m/%Y")}}), 200