from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from dotenv import load_dotenv
import os

load_dotenv()

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)

    # 環境変数からデータベース接続情報を生成
    db_user = os.getenv("DB_USER")
    db_password = os.getenv("DB_PASSWORD")
    db_host = os.getenv("DB_HOST", "localhost")
    db_port = os.getenv("DB_PORT", "5432")
    db_name = os.getenv("DB_NAME")

    app.config["SQLALCHEMY_DATABASE_URI"] = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # 日本語文字化け対応（flask>=3.02）
    app.json.ensure_ascii = False

    # DB と Migrate の初期化
    db.init_app(app)
    migrate.init_app(app, db)

    from api.models import Recipe
    from api.models import Ingredient
    from api.models import IngredientQuantity
    from api.models import Like

    return app
