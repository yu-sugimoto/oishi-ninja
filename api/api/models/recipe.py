from api import db

class Recipe(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), unique=True, nullable=False)
    description = db.Column(db.String(80), unique=False, nullable=True)

    def __repr__(self):
        return f"<Recipe {self.title}, {self.description}>"
