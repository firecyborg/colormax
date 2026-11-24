from flask import Blueprint, request, jsonify, session
from services.database_book import make_book_database

book_bp = Blueprint('book', __name__, url_prefix='/api/book')

@book_bp.route('/make_book', methods=['POST'])
def make_book():
    data = request.get_json(silent=True) or {}
    title = data.get('title')
    pages = data.get('pages')
    length = data.get('length')
    user_id = session.get('user_id')
    if user_id is None:
        return jsonify({"error": "Kasutaja peab sisse logitud olema"}), 401
    return make_book_database(title, pages, length, user_id)

