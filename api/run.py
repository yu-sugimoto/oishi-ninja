from flask import jsonify, request
from api import create_app, db
from dotenv import load_dotenv

from api.utilities import get_country_code_from_request
from api.config import get_gunicorn_options
from api.models import Recipe, Ingredient, IngredientQuantity, Like
from api.services.gunicorn_app import GunicornApp

load_dotenv()

app = create_app()

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
        country = get_country_code_from_request(request=request)

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
                "instructions": recipe.instructions,
                'likes': [
                    {
                        'like_count': like.like_count
                    }
                    for like in recipe.likes if like.country == country
                ]
            }
            for recipe in recipes
        ]

        return jsonify({"recipes": recipe_data}), 200
    except Exception as e:
        # サーバーエラーの場合
        return jsonify({"error": str(e)}), 500

# 起動
def start_app():
    options = get_gunicorn_options()
    GunicornApp(app, options).run()

if __name__ == "__main__":
    start_app()
