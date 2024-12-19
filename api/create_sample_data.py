import os
import json
import logging
from datetime import datetime
from api import create_app, db
from api.models import Recipe, Ingredient, IngredientQuantity, Like

# ログの設定
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = create_app()

country_codes = ["ISL","IRL","AZE","AFG","USA","VIR","ASM","ARE","DZA","ARG","ABW","ALB","ARM","AIA","AGO","ATG","AND","YEM","GBR","IOT","VGB","ISR","ITA","IRQ","IRN","IND","IDN","WLF","UGA","UKR","UZB","URY","ECU","EGY","EST","SWZ","ETH","ERI","SLV","AUS","AUT","ALA","OMN","NLD","GHA","CPV","GGY","GUY","KAZ","QAT","UMI","CAN","GAB","CMR","GMB","KHM","MKD","MNP","GIN","GNB","CYP","CUB","CUW","GRC","KIR","KGZ","GTM","GLP","GUM","KWT","COK","GRL","CXR","GRD","HRV","CYM","KEN","CIV","CCK","CRI","COM","COL","COG","COD","SAU","SGS","WSM","STP","BLM","ZMB","SPM","SMR","MAF","SLE","DJI","GIB","JEY","JAM","GEO","SYR","SGP","SXM","ZWE","CHE","SWE","SDN","SJM","ESP","SUR","LKA","SVK","SVN","SYC","GNQ","SEN","SRB","KNA","VCT","SHN","LCA","SOM","SLB","TCA","THA","KOR","TWN","TJK","TZA","CZE","TCD","CAF","CHN","TUN","PRK","CHL","TUV","DNK","DEU","TGO","TKL","DOM","DMA","TTO","TKM","TUR","TON","NGA","NRU","NAM","ATA","NIU","NIC","NER","JPN","ESH","NCL","NZL","NPL","NFK","NOR","HMD","BHR","HTI","PAK","VAT","PAN","VUT","BHS","PNG","BMU","PLW","PRY","BRB","PSE","HUN","BGD","TLS","PCN","FJI","PHL","FIN","BTN","BVT","PRI","FRO","FLK","BRA","FRA","GUF","PYF","ATF","BGR","BFA","BRN","BDI","VNM","BEN","VEN","BLR","BLZ","PER","BEL","POL","BIH","BWA","BES","BOL","PRT","HKG","HND","MHL","MAC","MDG","MYT","MWI","MLI","MLT","MTQ","MYS","IMN","FSM","ZAF","SSD","MMR","MEX","MUS","MRT","MOZ","MCO","MDV","MDA","MAR","MNG","MNE","MSR","JOR","LAO","LVA","LTU","LBY","LIE","LBR","ROU","LUX","RWA","LSO","LBN","REU","RUS"]

with app.app_context():
    def create_sample_data():
        logging.info("Starting sample data creation")

        out_dir = "../data/out"
        recipes_json_dir_path = os.path.join(out_dir, "recipes")

        # レシピファイル一覧を取得
        try:
            recipes_json_files = [
                os.path.join(recipes_json_dir_path, file)
                for file in os.listdir(recipes_json_dir_path)
                if file.endswith(".json")
            ]
            logging.info(f"Found {len(recipes_json_files)} recipe files in {recipes_json_dir_path}")
        except Exception as e:
            logging.error(f"Failed to list recipe files: {e}")
            return

        # データベースのクリーンアップ
        try:
            db.session.query(IngredientQuantity).delete()
            db.session.query(Like).delete()
            db.session.query(Ingredient).delete()
            db.session.query(Recipe).delete()
            logging.info("Cleared existing data from the database")
        except Exception as e:
            logging.error(f"Failed to clear the database: {e}")
            return

        recipes = []
        ingredient_id_by_name = {}
        for recipe_json_file in recipes_json_files:
            with open(recipe_json_file, "r") as f:
                recipe_data = json.load(f)
                recipes.append(recipe_data)

                ingredients = recipe_data["ingredients"]
                for ingredient in ingredients:
                    ingredient_name = ingredient["ingredientName"]
                    logging.info(ingredient_name)
                    ingredient_id_by_name[ingredient_name] = None

        for ingredient_name in ingredient_id_by_name:
            try:
                ingredient = Ingredient(ingredient_name=ingredient_name)
                db.session.add(ingredient)
                db.session.commit()
                ingredient_id_by_name[ingredient_name] = ingredient.ingredient_id
            except Exception as e:
                logging.error(f"Failed to add ingredient {ingredient_name}: {e}")

        logging.info(f"Added {len(ingredient_id_by_name)} ingredients to the database")

        # レシピデータの追加
        for recipe_json_file in recipes_json_files:
            try:
                with open(recipe_json_file, "r") as f:
                    recipe_data = json.load(f)

                recipe_tmp_id = recipe_data["id"]
                thumbnail = f'https://assets.oishi-ninja.com/{recipe_tmp_id}.png'

                recipe = Recipe(
                    recipe_name=recipe_data["recipe_name"],
                    instructions=recipe_data["instructions"],
                    thumbnail=thumbnail
                )
                db.session.add(recipe)
                db.session.commit()

                recipe_id = recipe.recipe_id

                ingredients = recipe_data["ingredients"]
                for ingredient in ingredients:
                    ingredient_name = ingredient["ingredientName"]
                    quantity = ingredient["quantity"]
                    ingredient_id = ingredient_id_by_name.get(ingredient_name)
                    if ingredient_id is None:
                        logging.warning(f"Ingredient {ingredient_name} not found for recipe {recipe_id}")
                        continue

                    ingredient_quantity = IngredientQuantity(
                        recipe_id=recipe_id,
                        ingredient_id=ingredient_id,
                        quantity=quantity,
                    )
                    db.session.add(ingredient_quantity)

                for country in country_codes:
                    like = Like(
                        recipe_id=recipe_id,
                        country=country,
                        like_count=0,
                        created_at=datetime.now(),
                    )
                    db.session.add(like)

                db.session.commit()

                logging.info(f"Added recipe {recipe_id} with {len(ingredients)} ingredients")
            except Exception as e:
                logging.error(f"Failed to process recipe file {recipe_json_file}: {e}")

        try:
            db.session.commit()
            logging.info("Committed all changes to the database")
        except Exception as e:
            logging.error(f"Failed to commit changes to the database: {e}")

    if __name__ == "__main__":
        create_sample_data()
