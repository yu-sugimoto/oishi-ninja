from api import db

class Recipe(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), unique=True, nullable=False)

    def __repr__(self):
        return f"<Recipe {self.title}>"
