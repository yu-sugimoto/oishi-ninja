from api import db

class Recipe(db.Model):
    __tablename__ = 'recipes'

    recipe_id = db.Column(db.Integer, primary_key=True)
    recipe_name = db.Column(db.String(255), nullable=False)
    thumbnail = db.Column(db.String(255), nullable=True)
    instructions = db.Column(db.Text, nullable=False)

    # 中間テーブル（ingredient_quantities）とのリレーション
    ingredient_quantities = db.relationship('IngredientQuantity', back_populates='recipe')

    # レシピに関連するいいねを取得
    likes = db.relationship('Like', backref='recipe', lazy=True)

    def __repr__(self):
        return f"<Recipe {self.recipe_name}>"
