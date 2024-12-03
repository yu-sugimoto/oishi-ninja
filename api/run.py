from gunicorn.app.base import BaseApplication
from flask import jsonify, request
from api import create_app, db
from api.models import Recipe, Ingredient, IngredientQuantity, Like
from dotenv import load_dotenv

load_dotenv()

app = create_app()

# ルーティング設定

# ルーティングテスト
@app.route('/', methods=['GET'])
def health_check():
    return jsonify({'message': 'Hello World'}), 200

# 全データの取得（RDBの確認）
@app.route('/recipes', methods=['GET'])
def get_users():
    recipes = Recipe.query.all()
    return jsonify([
        {
            'recipe_id': recipe.recipe_id,
            'recipe_name': recipe.recipe_name,
            'thumbnail': recipe.thumbnail,
            'instructions': recipe.instructions,
            'ingredients': [
                {
                    'ingredient_name': ingredient_quantity.ingredient.ingredient_name,
                    'quantity': ingredient_quantity.quantity
                }
                for ingredient_quantity in recipe.ingredient_quantities
            ],
            'likes': [
                {
                    'country': like.country,
                    'like_count': like.like_count,
                    'dislike_count': like.dislike_count,
                    'created_at': like.created_at.isoformat()
                }
                for like in recipe.likes
            ]
        }
        for recipe in recipes
    ])

# ヘッダーでした国のレシピランキングを取得
@app.route('/recipes/ranking', methods=['GET'])
def get_recipe_ranking():
    try:
        # ヘッダーから国情報を取得
        country = request.headers.get('Country')  # Countryヘッダーを取得
        if not country:
            return jsonify({"error": "Country header is required"}), 400

        # クエリパラメータを取得
        count = request.args.get('count', default=10, type=int)  # デフォルトで10件
        offset = request.args.get('offset', default=0, type=int)  # デフォルトで0

        # レシピランキングのロジック（いいね数でソート）
        recipes = db.session.query(Recipe).join(Like).filter(Like.country == country) \
            .order_by(Like.like_count.desc()).offset(offset).limit(count).all()

        # レシピをJSON形式で返す
        recipe_data = [
            {
                "recipe_id": recipe.recipe_id,
                "recipe_name": recipe.recipe_name,
                "thumbnail": recipe.thumbnail,
                "instructions": recipe.instructions
            }
            for recipe in recipes
        ]

        return jsonify({"recipes": recipe_data}), 200
    except Exception as e:
        # サーバーエラーの場合
        return jsonify({"error": str(e)}), 500

class GunicornApp(BaseApplication):
    # Gunicorn をカスタマイズして起動するためのクラス
    def __init__(self, app, options=None):
        self.app = app
        self.options = options or {}
        super().__init__()

    def load_config(self):
        # Gunicorn の設定を適用
        for key, value in self.options.items():
            self.cfg.set(key.lower(), value)

    def load(self):
        # Flask アプリケーションをロード
        return self.app

# 起動
def start_app():
    # Gunicorn を使ってアプリケーションを起動
    import os
    port = int(os.getenv("PORT", 4000))
    workers = int(os.getenv("GUNICORN_WORKERS", 2))  # 環境変数からワーカー数を設定
    timeout = int(os.getenv("GUNICORN_TIMEOUT", 120))  # タイムアウト設定

    options = {
        "bind": f"0.0.0.0:{port}",
        "workers": workers,
        "timeout": timeout,
    }
    GunicornApp(app, options).run()


if __name__ == "__main__":
    start_app()
