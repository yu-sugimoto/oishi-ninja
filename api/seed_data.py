from api import create_app, db
from api.models import Recipe, Ingredient, IngredientQuantity, Like
import random
from datetime import datetime

app = create_app()

with app.app_context():
    # シードデータの挿入
    def seed_data():
        # テストデータの削除（必要に応じて）
        db.session.query(IngredientQuantity).delete()
        db.session.query(Like).delete()
        db.session.query(Ingredient).delete()
        db.session.query(Recipe).delete()

        # recipes
        recipe1 = Recipe(
            recipe_name="からあげ",
            thumbnail="https://dummyimage.com/400x400/000/fff?text=唐揚げ",
            instructions="""
            1. 鶏肉を一口大に切ります。
            2. ボウルに醤油、酒、みりん、にんにく、しょうがを入れて混ぜます。
            3. 切った鶏肉をボウルに入れ、よく混ぜて30分ほど漬け込みます。
            4. 別のボウルに片栗粉を用意します。
            5. 漬け込んだ鶏肉を片栗粉にまぶします。
            6. フライパンに油を熱し、鶏肉を揚げます。
            7. 鶏肉がきつね色になったら取り出し、油を切ります。
            8. お皿に盛り付けて完成です。
            """
        )
        recipe2 = Recipe(
          recipe_name="ソース焼きそば",
          thumbnail="https://dummyimage.com/400x400/000/fff?text=ソース焼きそば",
          instructions="""
          1. 焼きそば麺をほぐします。
          2. キャベツ、人参、豚肉を食べやすい大きさに切ります。
          3. フライパンに油を熱し、豚肉を炒めます。
          4. 豚肉の色が変わったら、キャベツと人参を加えて炒めます。
          5. 焼きそば麺を加え、さらに炒めます。
          6. ソースを加え、全体に絡めます。
          7. お皿に盛り付けて完成です。
          """
        )
        recipe3 = Recipe(
            recipe_name="肉じゃが",
            thumbnail="https://dummyimage.com/400x400/000/fff?text=肉じゃが",
            instructions="""
            1. 牛肉を一口大に切ります。
            2. じゃがいも、人参、玉ねぎを食べやすい大きさに切ります。
            3. 鍋に油を熱し、牛肉を炒めます。
            4. 牛肉の色が変わったら、じゃがいも、人参、玉ねぎを加えて炒めます。
            5. 水を加え、煮立ったらアクを取ります。
            6. 醤油、砂糖、みりん、酒を加え、弱火で煮込みます。
            7. 具材が柔らかくなったら火を止めます。
            8. お皿に盛り付けて完成です。
            """
        )
        recipe4 = Recipe(
          recipe_name="ひじきの煮物",
          thumbnail="https://dummyimage.com/400x400/000/fff?text=ひじきの煮物",
          instructions="""
          1. 乾燥ひじきを水で戻します。
          2. 人参を細切りにします。
          3. 油揚げを細切りにします。
          4. 鍋に油を熱し、ひじき、人参、油揚げを炒めます。
          5. だし汁、醤油、みりん、砂糖を加え、煮立たせます。
          6. 弱火にして、汁気がなくなるまで煮ます。
          7. お皿に盛り付けて完成です。
          """
        )
        recipe5 = Recipe(
          recipe_name="切り干し大根",
          thumbnail="https://dummyimage.com/400x400/000/fff?text=切り干し大根",
          instructions="""
          1. 切り干し大根を水で戻します。
          2. 人参を細切りにします。
          3. 油揚げを細切りにします。
          4. 鍋に油を熱し、切り干し大根、人参、油揚げを炒めます。
          5. だし汁、醤油、みりん、砂糖を加え、煮立たせます。
          6. 弱火にして、汁気がなくなるまで煮ます。
          7. お皿に盛り付けて完成です。
          """
        )

        db.session.add_all([recipe1, recipe2, recipe3, recipe4, recipe5])
        db.session.flush()

        ingredient1 = Ingredient(ingredient_name="鶏肉")
        ingredient2 = Ingredient(ingredient_name="醤油")
        ingredient3 = Ingredient(ingredient_name="酒")
        ingredient4 = Ingredient(ingredient_name="みりん")
        ingredient5 = Ingredient(ingredient_name="にんにく")
        ingredient6 = Ingredient(ingredient_name="しょうが")
        ingredient7 = Ingredient(ingredient_name="片栗粉")
        ingredient8 = Ingredient(ingredient_name="油")
        ingredient9 = Ingredient(ingredient_name="焼きそば麺")
        ingredient10 = Ingredient(ingredient_name="キャベツ")
        ingredient11 = Ingredient(ingredient_name="人参")
        ingredient12 = Ingredient(ingredient_name="豚肉")
        ingredient13 = Ingredient(ingredient_name="牛肉")
        ingredient14 = Ingredient(ingredient_name="じゃがいも")
        ingredient15 = Ingredient(ingredient_name="玉ねぎ")
        ingredient16 = Ingredient(ingredient_name="水")
        ingredient17 = Ingredient(ingredient_name="砂糖")
        ingredient18 = Ingredient(ingredient_name="だし汁")
        ingredient19 = Ingredient(ingredient_name="乾燥ひじき")
        ingredient20 = Ingredient(ingredient_name="油揚げ")
        ingredient21 = Ingredient(ingredient_name="切り干し大根")

        db.session.add_all([
          ingredient1, ingredient2, ingredient3, ingredient4, ingredient5, ingredient6, ingredient7, ingredient8,
          ingredient9, ingredient10, ingredient11, ingredient12, ingredient13, ingredient14, ingredient15, ingredient16,
          ingredient17, ingredient18, ingredient19, ingredient20, ingredient21
        ])
        db.session.flush()

        # ingredient_quantities
        iq1 = IngredientQuantity(recipe_id=recipe1.recipe_id, ingredient_id=ingredient1.ingredient_id, quantity="200g")
        iq2 = IngredientQuantity(recipe_id=recipe1.recipe_id, ingredient_id=ingredient2.ingredient_id, quantity="2 つまみ")
        iq3 = IngredientQuantity(recipe_id=recipe1.recipe_id, ingredient_id=ingredient3.ingredient_id, quantity="2 つまみ")
        iq4 = IngredientQuantity(recipe_id=recipe1.recipe_id, ingredient_id=ingredient4.ingredient_id, quantity="1 つまみ")
        iq5 = IngredientQuantity(recipe_id=recipe1.recipe_id, ingredient_id=ingredient5.ingredient_id, quantity="1 clove")
        iq6 = IngredientQuantity(recipe_id=recipe1.recipe_id, ingredient_id=ingredient6.ingredient_id, quantity="1 tsp")
        iq7 = IngredientQuantity(recipe_id=recipe1.recipe_id, ingredient_id=ingredient7.ingredient_id, quantity="1 カップ")
        iq8 = IngredientQuantity(recipe_id=recipe1.recipe_id, ingredient_id=ingredient8.ingredient_id, quantity="少量")
        iq9 = IngredientQuantity(recipe_id=recipe2.recipe_id, ingredient_id=ingredient9.ingredient_id, quantity="2 パック")
        iq10 = IngredientQuantity(recipe_id=recipe2.recipe_id, ingredient_id=ingredient10.ingredient_id, quantity="1/4 head")
        iq11 = IngredientQuantity(recipe_id=recipe2.recipe_id, ingredient_id=ingredient11.ingredient_id, quantity="1")
        iq12 = IngredientQuantity(recipe_id=recipe2.recipe_id, ingredient_id=ingredient12.ingredient_id, quantity="100g")
        iq13 = IngredientQuantity(recipe_id=recipe2.recipe_id, ingredient_id=ingredient8.ingredient_id, quantity="少量")
        iq14 = IngredientQuantity(recipe_id=recipe3.recipe_id, ingredient_id=ingredient13.ingredient_id, quantity="200g")
        iq15 = IngredientQuantity(recipe_id=recipe3.recipe_id, ingredient_id=ingredient14.ingredient_id, quantity="2")
        iq16 = IngredientQuantity(recipe_id=recipe3.recipe_id, ingredient_id=ingredient11.ingredient_id, quantity="1")
        iq17 = IngredientQuantity(recipe_id=recipe3.recipe_id, ingredient_id=ingredient15.ingredient_id, quantity="1")
        iq18 = IngredientQuantity(recipe_id=recipe3.recipe_id, ingredient_id=ingredient16.ingredient_id, quantity="2 カップ")
        iq19 = IngredientQuantity(recipe_id=recipe3.recipe_id, ingredient_id=ingredient2.ingredient_id, quantity="3 つまみ")
        iq20 = IngredientQuantity(recipe_id=recipe3.recipe_id, ingredient_id=ingredient17.ingredient_id, quantity="2 つまみ")
        iq21 = IngredientQuantity(recipe_id=recipe3.recipe_id, ingredient_id=ingredient4.ingredient_id, quantity="2 つまみ")
        iq22 = IngredientQuantity(recipe_id=recipe3.recipe_id, ingredient_id=ingredient3.ingredient_id, quantity="2 つまみ")
        iq23 = IngredientQuantity(recipe_id=recipe4.recipe_id, ingredient_id=ingredient19.ingredient_id, quantity="20g")
        iq24 = IngredientQuantity(recipe_id=recipe4.recipe_id, ingredient_id=ingredient11.ingredient_id, quantity="1")
        iq25 = IngredientQuantity(recipe_id=recipe4.recipe_id, ingredient_id=ingredient20.ingredient_id, quantity="1")
        iq26 = IngredientQuantity(recipe_id=recipe4.recipe_id, ingredient_id=ingredient8.ingredient_id, quantity="少量")
        iq27 = IngredientQuantity(recipe_id=recipe4.recipe_id, ingredient_id=ingredient18.ingredient_id, quantity="1 カップ")
        iq28 = IngredientQuantity(recipe_id=recipe4.recipe_id, ingredient_id=ingredient2.ingredient_id, quantity="2 つまみ")
        iq29 = IngredientQuantity(recipe_id=recipe4.recipe_id, ingredient_id=ingredient4.ingredient_id, quantity="1 つまみ")
        iq30 = IngredientQuantity(recipe_id=recipe4.recipe_id, ingredient_id=ingredient17.ingredient_id, quantity="1 つまみ")
        iq31 = IngredientQuantity(recipe_id=recipe5.recipe_id, ingredient_id=ingredient21.ingredient_id, quantity="20g")
        iq32 = IngredientQuantity(recipe_id=recipe5.recipe_id, ingredient_id=ingredient11.ingredient_id, quantity="1")
        iq33 = IngredientQuantity(recipe_id=recipe5.recipe_id, ingredient_id=ingredient20.ingredient_id, quantity="1")
        iq34 = IngredientQuantity(recipe_id=recipe5.recipe_id, ingredient_id=ingredient8.ingredient_id, quantity="少量")
        iq35 = IngredientQuantity(recipe_id=recipe5.recipe_id, ingredient_id=ingredient18.ingredient_id, quantity="1 カップ")
        iq36 = IngredientQuantity(recipe_id=recipe5.recipe_id, ingredient_id=ingredient2.ingredient_id, quantity="2 つまみ")
        iq37 = IngredientQuantity(recipe_id=recipe5.recipe_id, ingredient_id=ingredient4.ingredient_id, quantity="1 つまみ")
        iq38 = IngredientQuantity(recipe_id=recipe5.recipe_id, ingredient_id=ingredient17.ingredient_id, quantity="1 つまみ")

        db.session.add_all([
            iq1, iq2, iq3, iq4, iq5, iq6, iq7, iq8, iq9, iq10, iq11, iq12, iq13, iq14, iq15, iq16, iq17, iq18, iq19, iq20,
            iq21, iq22, iq23, iq24, iq25, iq26, iq27, iq28, iq29, iq30, iq31, iq32, iq33, iq34, iq35, iq36, iq37, iq38
        ])

        countries = ["Japan", "USA", "Canada", "UK", "Australia"]
        likes = []

        for recipe in [recipe1, recipe2, recipe3, recipe4, recipe5]:
          for country in countries:
            like_count = random.randint(0, 100)
            created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            likes.append(
              Like(
                recipe_id=recipe.recipe_id,
                country=country,
                like_count=like_count,
                created_at=created_at
              )
            )

        db.session.add_all(likes)

        # コミット
        db.session.commit()
        print("データの挿入が完了しました。")

    seed_data()
