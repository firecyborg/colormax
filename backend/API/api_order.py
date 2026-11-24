from flask import Blueprint, jsonify, request, session

from services.database_order import register_order_database

order_bp = Blueprint('order', __name__, url_prefix='/api/order')


@order_bp.route('/register_order', methods=['POST'])
def register_order():
    user_id = session.get("user_id")
    if user_id is None:
        return jsonify({"error": "Tellimiseks pead olema sisse logitud."}), 401

    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Vigased tellimuse andmed."}), 400

    return register_order_database(
        title=data.get("title"),
        page_ids=data.get("pageIds"),
        delivery=data.get("delivery"),
        payment=data.get("payment"),
        customer=data.get("customer"),
        user_id=user_id,
    )
