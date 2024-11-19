from flask import jsonify
from api import create_app
from api.models import Recipe
from dotenv import load_dotenv

load_dotenv()

app = create_app()

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({'message': 'Hello World'}), 200

@app.route('/recipes', methods=['GET'])
def get_users():
    recipes = Recipe.query.all()
    return jsonify([{'id': recipe.id, 'title': recipe.title} for recipe in recipes])


def start_app():
    """Flask アプリケーションを起動するスクリプト"""
    import os
    port = int(os.getenv("PORT", 4000))
    print(f"ポート {port} でアプリケーションを起動します")
    app.run(host="0.0.0.0", port=port)

if __name__ == "__main__":
    start_app()
