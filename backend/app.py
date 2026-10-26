from flask import Flask

from API.api_account import account_bp


def create_app():
    app = Flask(__name__)
    app.register_blueprint(account_bp)
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)