from flask import Flask
from flask_migrate import upgrade
from api import create_app

def upgrade_db():
    """データベースのマイグレーションを実行"""
    app = create_app()
    with app.app_context():
        upgrade()
    print("データベースが最新の状態にアップグレードされました。")
