export type RecipeInput = {
  id: string;
  name: string;
  thumbnail: string;
  instructions: string;
  ingredients: { name: string, quantity: string }[];
  likeCountByCountry: Record<string, number>
}
