# Oishi-Ninja API

Oishi Ninja の API

# 環境構築

| ツール | バージョン |
| --- | --- |
| Python | 3.13.x |
| Poetry | 1.8.x |
| PostgreSQL | 14.x |

# セットアップ

## Python と関連するツールの準備

### Python

```bash
$ python --version
Python 3.13.0
```

### Poetry

```bash
$ poetry --version
Poetry (version 1.8.4)
```

### 依存パッケージのインストール

```bash
$ poetry install
```

## データベースの準備

### PostgreSQL

```bash
$ psql --version
psql (PostgreSQL) 14.14
```

### データベースの作成

```bash
$ psql -U postgres
postgres=# CREATE DATABASE oishi_ninja;
postgres=# CREATE USER oishi_ninja WITH PASSWORD 'oishi_ninja';
postgres=# GRANT ALL PRIVILEGES ON DATABASE oishi_ninja TO oishi_ninja;
```

### データベースの初期化

```bash
$ poetry run db-upgrade
```

## 環境変数

`.env` ファイルを作成し、以下の内容を記述する。

```
# app
APP_PORT=4000
FLASK_ENV=development

# db
DB_HOST=db
DB_PORT=5432
DB_NAME=oishi_ninja
DB_USER=oishi_ninja
DB_PASSWORD=oishi_ninja
```

## 起動

```bash
$ poetry run start
```

# データベースのマイグレーション

## マイグレーションの追加

`/api/models/` にモデルを追加した場合、以下のコマンドでマイグレーションを追加する。

```
% poetry run flask --app api:create_app db migrate -m "<メッセージ>"
```
