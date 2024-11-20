import { v4 as uuid } from "uuid"
import { primaryKey } from "@mswjs/data"

export const ingredient = {
  id: primaryKey(uuid),
  name: String,
}
