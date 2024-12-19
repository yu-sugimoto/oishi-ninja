#!/bin/bash
set -e

# .env ファイルを読み込む
export $(grep -v '^#' .env | xargs)

S3_DATA_PATH='data'

if [ -z "$S3_BUCKET" ]; then
  echo "S3_BUCKET is not set"
  exit 1
fi

cd /home/ec2-user
mkdir -p data/recipes
cd data/recipes
aws s3 cp s3://$S3_BUCKET/$S3_DATA_PATH/recipes . --recursive
