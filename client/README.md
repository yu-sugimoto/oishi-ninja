# Oishi-Ninja Client

Vue を使ってクライアントサイドを構築します。

# OpenAPI 仕様書

`../docs/specification.yml` に OpenAPI 仕様書がある。

## 型の生成

次のコマンドで型を生成する。生成された方はgitで管理する。

```
% npm run generate
```

# 環境変数

例

```
VITE_API_URL=http://localhost:4000
VITE_ENABLE_MOCK_API=true
```

| 変数名 | 説明 | 必須 |
| --- | --- | --- |
| VITE_API_URL | API の URL | ○ |
| VITE_ENABLE_MOCK_API | モック API を有効にするか |  |

# モックサーバー

次のライブラリを使ってモックサーバーを構築している

- [msw](https://mswjs.io/)
- [msw/data](https://github.com/mswjs/data)
