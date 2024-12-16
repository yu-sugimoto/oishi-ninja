# ベースイメージ
FROM python:3.13-slim

# 作業ディレクトリを設定
WORKDIR /app

# 必要なシステムパッケージをインストール
RUN apt-get update && apt-get install -y curl && apt-get clean

# Poetry のインストール
ENV POETRY_VERSION=1.8.1
RUN curl -sSL https://install.python-poetry.org | python3 -

# Poetry のパスを環境変数に追加
ENV PATH="/root/.local/bin:$PATH"

# Poetry の仮想環境をコンテナ外に作成しない設定
RUN poetry config virtualenvs.create false

# 必要なパッケージをインストール
COPY pyproject.toml poetry.lock ./
RUN poetry install --no-root

# アプリケーションのソースコードをコピー
COPY . .

# エントリポイントスクリプトをコピー
COPY docker/app/entrypoint.sh /app/entrypoint.sh

# エントリポイントスクリプトを実行
CMD ["/app/entrypoint.sh"]
