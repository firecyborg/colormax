from flask import Flask, send_from_directory
import os
from pathlib import Path
from dotenv import load_dotenv
from API.api_account import account_bp
from API.api_pages import pages_bp
from API.api_book import book_bp
from API.api_order import order_bp



def create_app():
    load_dotenv(Path(__file__).with_name(".env"))
    frontend_dist = Path(__file__).resolve().parent.parent / "frontend" / "dist"
    app = Flask(__name__, static_folder=None)
    app.register_blueprint(pages_bp)
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
    app.register_blueprint(account_bp)
    app.register_blueprint(book_bp)
    app.register_blueprint(order_bp)

    if os.getenv("RENDER"):
        app.config.update(
            SESSION_COOKIE_SECURE=True,
            SESSION_COOKIE_HTTPONLY=True,
            SESSION_COOKIE_SAMESITE="Lax",
        )

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def frontend(path):
        requested_file = frontend_dist / path
        if path and requested_file.is_file():
            return send_from_directory(frontend_dist, path)
        return send_from_directory(frontend_dist, "index.html")

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)
