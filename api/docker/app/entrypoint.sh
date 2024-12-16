#!/bin/bash
set -e

# データベースのマイグレーションを実行
poetry run db-upgrade

# アプリケーションを起動
poetry run start
