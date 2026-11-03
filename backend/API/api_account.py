from flask import Blueprint, request, jsonify
from datetime import datetime
from services.database_account import register_database, login_database

account_bp = Blueprint('account', __name__, url_prefix='/api/account')

@account_bp.route('/data', methods=['GET'])
def get_account_data():
    """Näiteandmetega"""
    username = request.args.get("username")

    return jsonify({"id": 1, "username": username, "books": "loomad", "tellimused": "loomad_tellimus"}), 200


@account_bp.route('/login', methods=['POST'])
def login():
    """Näiteandmetega"""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    return login_database(username, password)


@account_bp.route('/logout', methods=['POST'])
def logout():
    """Näiteandmetega"""
    return jsonify({"message": "väljalogimine õnnestus"}), 200


@account_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    email = data.get("email")
    birthday = data.get("birthday")
    return register_database(username, password, email, birthday)


@account_bp.route('/change_password', methods=['PATCH'])
def change_password():
    correct_previous_password = "1234"
    data = request.get_json()
    previous_password = data.get("previous_password")
    new_password = data.get("new_password")
    if not isinstance(previous_password, str) or not previous_password:
        return jsonify({"error": "Sisesta praegune parool."}), 400
    if not isinstance(new_password, str) or not new_password:
        return jsonify({"error": "Sisesta uus parool."}), 400
    if previous_password != correct_previous_password:
        return jsonify({"error": "Vale parool."}), 401
    return jsonify({"message": "Parooli vahetus õnnestus"}), 200


@account_bp.route('/delete', methods=['DELETE'])
def delete_account():
    return jsonify({"message": "Kasutaja kustutatud"}), 200









