import { v4 as uuid } from "uuid"
import { primaryKey } from "@mswjs/data"

export const like = {
  id: primaryKey(uuid),
  recipeId: String,
  country: String,
  count: Number,
}
