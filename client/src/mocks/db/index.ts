import { factory } from "@mswjs/data";
import { like } from "./models/like";
import { recipe } from "./models/recipe";
import { ingredient } from "./models/ingredient";
import { recipeIngredientQuantity } from "./models/recipeIngredientQuantity";
import { RecipeInput } from "./types";
import { recipes } from "./data";

const db = factory({
  like,
  recipe,
  ingredient,
  recipeIngredientQuantity,
});

function getOrCreateIngredientId (name: string) {
  let ingredient = db.ingredient.findFirst({
    where: {
      name: {
        equals: name,
      }
    }
  });
  if (!ingredient) {
    ingredient = db.ingredient.create({ name });
  }
  return ingredient.id;
};

function createRecipeWithIngredients (recipe: RecipeInput) {
  const createdRecipe = db.recipe.create({
    name: recipe.name,
    thumbnail: recipe.thumbnail,
    instructions: recipe.instructions.trim(),
  });
  const recipeId = createdRecipe.id.toString();

  for (const ingredient of recipe.ingredients) {
    const { name, quantity } = ingredient
    const ingredientId = getOrCreateIngredientId(name).toString();
    db.recipeIngredientQuantity.create({
      recipeId,
      ingredientId,
      quantity,
    });
  }

  for (const [country, count] of Object.entries(recipe.likeCountByCountry)) {
    db.like.create({
      recipeId,
      country,
      count,
    });
  }
};

for (const recipe of recipes) {
  createRecipeWithIngredients(recipe);
}

console.log(`Successfully seeded ${db.recipe.count()} recipes`);
console.log(`Successfully seeded ${db.recipeIngredientQuantity.count()} recipe ingredient quantities`);
console.log(`Successfully seeded ${db.ingredient.count()} ingredients`);
console.log(`Successfully seeded ${db.like.count()} likes`);

export { db };
