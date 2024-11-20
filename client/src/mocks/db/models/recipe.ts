import { v4 as uuid } from "uuid"
import { primaryKey } from "@mswjs/data"

export const recipe = {
  id: primaryKey(uuid),
  name: String,
  thumbnail: String,
  instructions: String
}
