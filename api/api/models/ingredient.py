from api import db

class Ingredient(db.Model):
    __tablename__ = 'ingredients'

    ingredient_id = db.Column(db.Integer, primary_key=True)
    ingredient_name = db.Column(db.String(255), nullable=False)

    # リレーション：中間テーブル（ingredient_quantities）とのリレーション
    ingredient_quantities = db.relationship('IngredientQuantity', back_populates='ingredient')

    def __repr__(self):
        return f"<Ingredient {self.ingredient_name}>"