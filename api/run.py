from flask import jsonify, request
from flask_cors import CORS
from api import create_app, db
from dotenv import load_dotenv

from api.utilities import get_country_code_from_request
from api.config import get_gunicorn_options
from api.models import Recipe, Ingredient, IngredientQuantity, Like
from api.services.gunicorn_app import GunicornApp

load_dotenv()

app = create_app()
CORS(app)

# ルーティングテスト
@app.route('/', methods=['GET'])
def health_check():
    return jsonify({'message': 'Hello World'}), 200

# 全データの取得（RDBの確認テスト）
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

        # レシピとページネーションのデータをJSON形式で返す
        recipe_data = [
            {
                "id": f"{recipe.recipe_id}",
                "name": recipe.recipe_name,
                "thumbnail": recipe.thumbnail,
                "instructions": recipe.instructions,
                'ingredientQuantities': [
                    {
                        "ingredient": {
                            "id": f"{ingredient_quantity.ingredient.ingredient_id}", 
                            "name": ingredient_quantity.ingredient.ingredient_name
                        },
                        "quantity": ingredient_quantity.quantity
                    }
                    for ingredient_quantity in recipe.ingredient_quantities
                ],                
                'likes': sum((like.like_count for like in recipe.likes if like.country == country)) 
            }
            for recipe in recipes
        ]

        pagination_data = {
            "total": len(recipes),
            "offset": offset,
            "limit": count
        }

        return jsonify({"recipes": recipe_data, "pagination": pagination_data}), 200
    except Exception as e:
        app.logger.error(f"Error occurred: {str(e)}")
        return jsonify({"message": "Internal server error"}), 500

# ヘッダーで指定された国のレシピを取得
@app.route('/recipes/<string:recipe_id>', methods=['GET'])
def get_recipe_by_id(recipe_id):
    try:
        # ヘッダーから国情報を取得
        country = get_country_code_from_request(request=request)

        # レシピをデータベースから取得
        recipe = (
            db.session.query(Recipe)
            .join(Like)
            .filter(Recipe.recipe_id == recipe_id, Like.country == country)
            .first()
        )

        if not recipe:
            return jsonify({"message": "Not found"}), 404

        # レシピのデータをJSON形式で返す
        recipe_data = {
            "id": f"{recipe.recipe_id}",
            "name": recipe.recipe_name,
            "thumbnail": recipe.thumbnail,
            "instructions": recipe.instructions,
            'ingredientQuantities': [
                {
                    "ingredient": {
                        "id": f"{ingredient_quantity.ingredient.ingredient_id}", 
                        "name": ingredient_quantity.ingredient.ingredient_name
                    },
                    "quantity": ingredient_quantity.quantity
                }
                for ingredient_quantity in recipe.ingredient_quantities
            ],
            "likes": sum((like.like_count for like in recipe.likes if like.country == country))
        }

        return jsonify(recipe_data), 200

    except Exception as e:
        app.logger.error(f"Error occurred: {str(e)}")
        return jsonify({"message": "Internal server error"}), 500

# ヘッダーで指定された国のレシピをいいねする
@app.route('/recipes/<string:recipe_id>/likes', methods=['POST'])
def like_recipe(recipe_id):
    try:
        # ヘッダーから国情報を取得
        country = get_country_code_from_request(request=request)

        # レシピの存在確認
        recipe = Recipe.query.get(recipe_id)
        if not recipe:
            return jsonify({"message": "Not found"}), 404

        # いいねを増やす（likesテーブルを更新）
        like = Like.query.filter_by(recipe_id=recipe_id, country=country).first()
        like.like_count += 1
        db.session.commit()

        return jsonify({'message': 'いいねしました', "likes": like.like_count}), 200
    except Exception as e:
        app.logger.error(f"Error occurred: {str(e)}")
        return jsonify({"message": "Internal server error"}), 500

# いいねを削除する
@app.route('/recipes/<string:recipe_id>/likes', methods=['DELETE'])
def unlike_recipe(recipe_id):
    try:
        # ヘッダーから国情報を取得
        country = get_country_code_from_request(request=request)

        # レシピの存在確認
        recipe = Recipe.query.get(recipe_id)
        if not recipe:
            return jsonify({"message": "Not found"}), 404

        # いいねを減らす（likesテーブルを更新）
        like = Like.query.filter_by(recipe_id=recipe_id, country=country).first()
        if like.like_count > 0:
            like.like_count -= 1
        db.session.commit()

        return jsonify({'message': 'いいねを削除しました', "likes": like.like_count}), 200
    except Exception as e:
        app.logger.error(f"Error occurred: {str(e)}")
        return jsonify({"message": "Internal server error"}), 500

# 起動（開発環境）
# def start_app():
#     """Flask アプリケーションを起動するスクリプト"""
#     import os
#     port = int(os.getenv("PORT", 4000))
#     print(f"ポート {port} でアプリケーションを起動します")
#     app.run(host="0.0.0.0", port=port)

# if __name__ == "__main__":
#     start_app()

# 起動
def start_app():
    options = get_gunicorn_options()
    GunicornApp(app, options).run()

if __name__ == "__main__":
    start_app()