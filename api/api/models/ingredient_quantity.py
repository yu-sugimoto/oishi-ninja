from api import db

class IngredientQuantity(db.Model):
    __tablename__ = 'ingredient_quantities'

    recipe_id = db.Column(db.Integer, db.ForeignKey('recipes.recipe_id'), primary_key=True)
    ingredient_id = db.Column(db.Integer, db.ForeignKey('ingredients.ingredient_id'), primary_key=True)
    quantity = db.Column(db.String(50), nullable=False)

    # それぞれの外部キーと関連付け
    recipe = db.relationship('Recipe', back_populates='ingredient_quantities')
    ingredient = db.relationship('Ingredient', back_populates='ingredient_quantities')

    def __repr__(self):
        return f"<IngredientQuantity {self.recipe_id}, {self.ingredient_id}, {self.quantity}>"