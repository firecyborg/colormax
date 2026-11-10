from flask import Flask
import os
from pathlib import Path
from dotenv import load_dotenv
from API.api_account import account_bp


def create_app():
    load_dotenv(Path(__file__).with_name(".env"))
    app = Flask(__name__)
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
    app.register_blueprint(account_bp)
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)