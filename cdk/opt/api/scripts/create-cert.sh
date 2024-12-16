#!/bin/bash

# 引数のチェック
if [[ $# -ne 4 ]]; then
  echo "Usage: $0 <domain_name> <admin_email> <cert_path> <nginx_conf_path>"
  echo "Example: $0 ./docker/nginx/nginx.conf your-email@example.com your-domain.com /path/to/certs"
  exit 1
fi

# 引数を変数に設定
DOMAIN_NAME=$1
ADMIN_EMAIL=$2
CERT_PATH=$3
NGINX_CONF_PATH=$4

# Dockerが動いているか確認
if ! docker info >/dev/null 2>&1; then
  echo "ERROR: Dockerが動いていません。Dockerを起動してください。"
  exit 1
fi

# Nginxコンテナが稼働しているか確認
NGINX_CONTAINER=$(docker ps --filter "name=nginx" --format "{{.Names}}")
if [[ -n "$NGINX_CONTAINER" ]]; then
  echo "INFO: Nginxコンテナ ($NGINX_CONTAINER) を停止します。"
  docker stop "$NGINX_CONTAINER"
fi

# Let's Encrypt証明書の作成
echo "INFO: Let's Encrypt証明書を作成しています..."
docker run --rm -v "${CERT_PATH}:/etc/letsencrypt" certbot/certbot certonly \
  --standalone \
  --preferred-challenges http \
  --agree-tos \
  --email "$ADMIN_EMAIL" \
  -d "$DOMAIN_NAME"

if [[ $? -ne 0 ]]; then
  echo "ERROR: 証明書の作成に失敗しました。"
  exit 1
fi

# Nginx設定ファイルの生成
echo "INFO: Nginx設定ファイルを生成しています ($NGINX_CONF_PATH)..."
mkdir -p "$(dirname "$NGINX_CONF_PATH")"
cat >"$NGINX_CONF_PATH" <<EOL
server {
    listen 80;
    server_name $DOMAIN_NAME;
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    server_name $DOMAIN_NAME;

    ssl_certificate $CERT_PATH/live/$DOMAIN_NAME/fullchain.pem;
    ssl_certificate_key $CERT_PATH/live/$DOMAIN_NAME/privkey.pem;

    location / {
        proxy_pass http://app:4000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOL

if [[ $? -ne 0 ]]; then
  echo "ERROR: Nginx設定ファイルの生成に失敗しました。"
  exit 1
fi

echo "INFO: 処理が完了しました！"
echo "  - 証明書: $CERT_PATH/live/$DOMAIN_NAME/"
echo "  - Nginx設定: $NGINX_CONF_PATH"
