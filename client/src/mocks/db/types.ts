export type RecipeInput = {
  name: string;
  thumbnail: string;
  instructions: string;
  ingredients: { name: string, quantity: string }[];
  likeCountByCountry: Record<string, number>
}
