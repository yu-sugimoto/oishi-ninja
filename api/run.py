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
                    # 'dislike_count': like.dislike_count,
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
        recipe_data = []
        for recipe in recipes:
            likes = 0
            for like in recipe.likes:
                if like.country == country:
                    likes += like.like_count

            recipe_data.append({
                "id": f"{recipe.recipe_id}",
                "name": recipe.recipe_name,
                "thumbnail": recipe.thumbnail,
                "instructions": recipe.instructions,
                'likes': likes
            })

        return jsonify({"recipes": recipe_data}), 200
    except Exception as e:
        # サーバーエラーの場合
        return jsonify({"error": str(e)}), 500

# ヘッダーでした国のレシピランキングを取得（僕のローカル環境上で上記コードが動かなかったため）
# @app.route('/recipes/ranking', methods=['GET'])
# def get_recipe_ranking():
#     try:
#         # ヘッダーから国情報を取得
#         country = request.headers.get('Country')  # Countryヘッダーを取得
#         if not country:
#             return jsonify({"error": "Country header is required"}), 400

#         # クエリパラメータを取得
#         count = request.args.get('count', default=10, type=int)  # デフォルトで10件
#         offset = request.args.get('offset', default=0, type=int)  # デフォルトで0

#         # レシピランキングのロジック（いいね数でソート）
#         recipes = db.session.query(Recipe).join(Like).filter(Like.country == country) \
#             .order_by(Like.like_count.desc()).offset(offset).limit(count).all()

#         # レシピをJSON形式で返す
#         recipe_data = [
#             {
#                 "recipe_id": f"{recipe.recipe_id}",
#                 "recipe_name": recipe.recipe_name,
#                 "thumbnail": recipe.thumbnail,
#                 "instructions": recipe.instructions,
#                 'likes': next((like.like_count for like in recipe.likes if like.country == country), 0) # likesとして参照可能なように変更
#             }
#             for recipe in recipes
#         ]

#         return jsonify({"recipes": recipe_data}), 200
#     except Exception as e:
#         # サーバーエラーの場合
#         return jsonify({"error": str(e)}), 500

# レシピ詳細ページ
@app.route('/recipes/<int:recipe_id>', methods=['GET'])
def get_recipe_by_id(recipe_id):

    try:
        # ヘッダーから国情報を取得
        country = get_country_code_from_request(request=request)
        if not country:
            return jsonify({"error": "Country header is required"}), 400

        # レシピをデータベースから取得
        recipe = (
            db.session.query(Recipe)
            .join(Like)
            .filter(Recipe.recipe_id == recipe_id, Like.country == country)
            .first()
        )

        if not recipe:
            return jsonify({"error": "Recipe not found"}), 404

        # レシピのデータをシリアライズ
        recipe_data = {
            "recipe_id": recipe.recipe_id,
            "recipe_name": recipe.recipe_name,
            "thumbnail": recipe.thumbnail,
            "instructions": recipe.instructions,
            'ingredients': [
                {
                    'ingredient_name': ingredient_quantity.ingredient.ingredient_name,
                    'quantity': ingredient_quantity.quantity
                }
                for ingredient_quantity in recipe.ingredient_quantities
            ],
            "likes": next((like.like_count for like in recipe.likes if like.country == country), 0)
        }

        return jsonify(recipe_data), 200

    except Exception as e:
        app.logger.error(f"Error occurred: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

# いいねを送信する
@app.route('/recipes/<int:recipe_id>/likes', methods=['POST'])
def like_recipe(recipe_id):

    # ヘッダーから国情報を取得
    country = get_country_code_from_request(request=request)

    if not country:
        return jsonify({"error": "Country header is required"}), 400

    # レシピの存在確認
    recipe = Recipe.query.get(recipe_id)
    if not recipe:
        return jsonify({'error': 'Recipe not found'}), 404

    # いいねを追加（likesテーブルを更新）
    Like.query.filter_by(recipe_id=recipe_id, country=country).update({Like.like_count: Like.like_count + 1}, synchronize_session=False)
    db.session.commit()

    return jsonify({'message': 'Liked successfully'}), 201

# いいねを削除する
@app.route('/recipes/<int:recipe_id>/likes', methods=['DELETE'])
def unlike_recipe(recipe_id):
    # ヘッダーから国情報を取得
    country = get_country_code_from_request(request=request)
    if not country:
        return jsonify({"error": "Country header is required"}), 400

    # レシピの存在確認
    recipe = Recipe.query.get(recipe_id)
    if not recipe:
        return jsonify({'error': 'Recipe not found'}), 404
    
    # いいねを減らす
    Like.query.filter_by(recipe_id=recipe_id, country=country).update({Like.like_count: Like.like_count - 1}, synchronize_session=False)
    db.session.commit()

    return jsonify({'message': 'Unlike successfully'}), 200

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