import os
import time
import psycopg2

from flask import Flask
from flask_migrate import upgrade
from api import create_app
from api import create_app

def wait_for_db(max_retries=10, wait_time=5):
    """
    データベースが接続可能になるまで待機。
    max_retries: 最大リトライ回数
    wait_time: リトライ間隔（秒）
    """
    db_host = os.getenv("DB_HOST", "localhost")
    db_port = os.getenv("DB_PORT", "5432")
    db_user = os.getenv("DB_USER")
    db_password = os.getenv("DB_PASSWORD")
    db_name = os.getenv("DB_NAME")

    retries = 0
    while retries < max_retries:
        try:
            print(f"データベースへの接続を試みています... ({retries + 1}/{max_retries})")
            conn = psycopg2.connect(
                dbname=db_name,
                user=db_user,
                password=db_password,
                host=db_host,
                port=db_port,
            )
            conn.close()
            print("データベース接続成功！")
            return True
        except psycopg2.OperationalError as e:
            print(f"データベース接続失敗: {e}")
            retries += 1
            time.sleep(wait_time)

    print("データベース接続に失敗しました。")
    return False

def upgrade_db():
    """
    データベースの準備を待機し、マイグレーションを実行
    """
    if wait_for_db():
        app = create_app()
        with app.app_context():
            upgrade()
        print("データベースが最新の状態にアップグレードされました。")
    else:
        print("データベースが準備されていないため、起動を中止します。")
