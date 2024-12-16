from api import db

class Like(db.Model):
    __tablename__ = 'likes'

    like_id = db.Column(db.Integer, primary_key=True)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipes.recipe_id'), nullable=False)
    country = db.Column(db.String(255), nullable=False)
    like_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, nullable=False)

    def __repr__(self):
        return f"<Like {self.like_id}, {self.recipe_id}, {self.country}, {self.like_count}, {self.created_at}>"
