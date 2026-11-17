from pathlib import Path
from flask import jsonify, Blueprint, request, send_from_directory
from services.database_pages import get_categories, get_pages
pages_bp = Blueprint("pages", __name__, url_prefix="/api")
IMAGES_DIR = Path(__file__).resolve().parent.parent.parent / "Pildid"

@pages_bp.route("/categories", methods=["GET"])
def categories():
    return jsonify(get_categories()), 200

@pages_bp.route("/pages", methods=["GET"])
def pages():
    category = request.args.get("category")

    if category is None:
        return jsonify(get_pages()), 200

    if not category.isdigit():
        return jsonify({"error": "category peab olema number"}), 400

    return jsonify(get_pages(int(category))), 200


@pages_bp.route("/images/<path:file_path>", methods=["GET"])
def image(file_path):
    return send_from_directory(IMAGES_DIR, file_path)