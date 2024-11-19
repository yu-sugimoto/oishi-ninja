# Oishi-Ninja API

# 環境構築

## [Python](https://www.python.org/)

```
% python --version
Python 3.13.0
```

## [Poetry](https://python-poetry.org/)

```
% poetry --version
Poetry (version 1.8.4)
```

## [PostgreSQL](https://www.postgresql.org/)

```
% psql --version
psql (PostgreSQL) 14.14
```

# 環境変数

| 環境変数名 | 説明 |
| --- | --- |
| PORT | ポート番号 |
| DATABASE_URL | データベースのURL |

```
PORT=4000
DATABASE_URL=postgresql://<ユーザー名>:<パスワード>@<ホスト名>/<データベース名>
```

# 依存パッケージのインストール

```
% poetry install
```

# データベースのマイグレーション

## マイグレーションの反映

```
% poetry run flask --app api:create_app db upgrade
```

## マイグレーションの追加

`/api/models/` にモデルを追加した場合、以下のコマンドでマイグレーションを追加する。

```
% poetry run flask --app api:create_app db migrate -m "<メッセージ>"
```

追加後は、マイグレーションの反映を行う。

# 起動

```
% poetry run flask --app api run
```
