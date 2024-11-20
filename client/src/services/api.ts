import { paths } from "../schema"

export function endpoint (path: keyof paths) {
  return `${import.meta.env.VITE_API_URL}${path}`
}

export async function getRecipeRankingByCountryCode (country: string, pagination?: { offset?: number, limit?: number }) {
  const url = new URL(endpoint('/recipes/ranking'))

  if (pagination?.offset) url.searchParams.append('offset', pagination.offset.toString())
  if (pagination?.limit) url.searchParams.append('limit', pagination.limit.toString())

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-Country': country
    }
  })
  const data = await response.json()
  return data
}

export async function getRecipeByCountryAndId (country: string, recipeId: string) {
  const url = new URL(endpoint(`/recipes/{recipeId}`).replace('{recipeId}', recipeId))

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-Country': country
    }
  })
  const data = await response.json()
  return data
}

export async function likeRecipeByCountryAndId (country: string, recipeId: string) {
  const url = new URL(endpoint(`/recipes/{recipeId}/likes`).replace('{recipeId}', recipeId))
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'X-Country': country
    }
  })
  const data = await response.json()
  return data
}

export async function unlikeRecipeByCountryAndId (country: string, recipeId: string) {
  const url = new URL(endpoint(`/recipes/{recipeId}/likes`).replace('{recipeId}', recipeId))
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'X-Country': country
    }
  })
  const data = await response.json()
  return data
}
