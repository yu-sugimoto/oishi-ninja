import { v4 as uuid } from "uuid"
import { primaryKey } from "@mswjs/data"

export const recipeIngredientQuantity = {
  id: primaryKey(uuid),
  recipeId: String,
  ingredientId: String,
  quantity: String
}
