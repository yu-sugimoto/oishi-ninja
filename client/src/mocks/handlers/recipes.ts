import { http, HttpResponse } from 'msw'
import { paths, components } from '../../schema'
import { endpoint } from '../../services/api'
import { db } from '../db'
import { COUNTRY_CODE } from '../../constants/country'

type Recipe = components['schemas']['Recipe']
type Pagination = components['schemas']['Pagination']

type RecipeRow = ReturnType<typeof db.recipe.findFirst>

function getIngredientQuantitiesByRecipeId (recipeId: string): Recipe['ingredientQuantities'] {
  const recipeIngredientQuantityRows = db.recipeIngredientQuantity.findMany({
    where: {
      recipeId: {
        equals: recipeId,
      },
    },
  })

  const ingredientQuantities: Recipe['ingredientQuantities'] = []
  for (const row of recipeIngredientQuantityRows) {
    const ingredientRow = db.ingredient.findFirst({
      where: {
        id: {
          equals: row.ingredientId,
        },
      },
    })

    if (!ingredientRow) continue

    ingredientQuantities.push({
      ingredient: {
        id: ingredientRow.id.toString(),
        name: ingredientRow.name,
      },
      quantity: row.quantity,
    })
  }

  return ingredientQuantities
}

function getLikesByRecipeIdAndCountry (recipeId: string, country: string): Recipe['likes'] {
  const like = db.like.findFirst({
    where: {
      recipeId: {
        equals: recipeId,
      },
      country: {
        equals: country,
      },
    },
  })
  return like?.count ?? 0
}

const createRecipe = (recipeRow: RecipeRow, country: string): Recipe => {
  if (!recipeRow) throw new Error('No Record')
  const id = recipeRow.id.toString()
  const ingredientQuantities = getIngredientQuantitiesByRecipeId(id)
  const likes = getLikesByRecipeIdAndCountry(id, country)

  return {
    id,
    name: recipeRow.name,
    thumbnail: recipeRow.thumbnail,
    instructions: recipeRow.instructions,
    ingredientQuantities,
    likes,
  }
}

export const handlers = [
  // レシピランキング取得
  http.get(endpoint('/recipes/ranking'), (req) => {
    const recipeRows = db.recipe.getAll()
    const country = req.request.headers.get('X-Country')
    if (!country) {
      const body: components['responses']['GetRecipeRankingBadRequestResponse']['content']['application/json'] = {
        message: 'Country code is required',
      }
      return HttpResponse.json(body, { status: 400 })
    }

    const recipes = []
    for (const row of recipeRows) recipes.push(createRecipe(row, country))

    const pagination: Pagination = {
      total: 999,
      offset: 0,
      limit: 10,
    }

    const body: paths['/recipes/ranking']['get']['responses']['200']['content']['application/json'] = {
      recipes,
      pagination,
    }

    return HttpResponse.json(body, { status: 200 })
  }),
  http.get(endpoint('/recipes/:recipeId'), (context) => {
    const country = context.request.headers.get('X-Country') ?? COUNTRY_CODE.PHL
    if (!country) {
      const body: components['responses']['GetRecipeBadRequestResponse']['content']['application/json'] = {
        message: 'Country code is required',
      }
      return HttpResponse.json(body, { status: 400 })
    }

    const recipeId = context.params.recipeId.toString()
    if (!recipeId) {
      const body: components['responses']['GetRecipeBadRequestResponse']['content']['application/json'] = {
        message: 'Recipe ID is required',
      }
      return HttpResponse.json(body, { status: 400 })
    }

    const recipeRow = db.recipe.findFirst({
      where: { id: { equals: recipeId } },
    })

    if (!recipeRow) {
      const body: components['responses']['GetRecipeNotFoundResponse']['content']['application/json'] = {
        message: 'Recipe not found',
      }
      return HttpResponse.json(body, { status: 404 })
    }

    const recipe = createRecipe(recipeRow, country)

    const body: components['responses']['GetRecipeOkResponse']['content']['application/json'] = recipe

    return HttpResponse.json(body, { status: 200 })
  }),
  http.post(endpoint('/recipes/:recipeId/likes'), (context) => {
    const country = context.request.headers.get('X-Country') ?? COUNTRY_CODE.PHL
    if (!country) {
      const body: components['responses']['LikeRecipeBadRequestResponse']['content']['application/json'] = {
        message: 'Country code is required',
      }
      return HttpResponse.json(body, { status: 400 })
    }
    const recipeId = context.params.recipeId.toString()
    if (!recipeId) {
      const body: components['responses']['LikeRecipeBadRequestResponse']['content']['application/json'] = {
        message: 'Recipe ID is required',
      }
      return HttpResponse.json(body, { status: 400 })
    }
    const recipeRow = db.recipe.findFirst({
      where: { id: { equals: recipeId } },
    })
    if (!recipeRow) {
      const body: components['responses']['LikeRecipeNotFoundResponse']['content']['application/json'] = {
        message: 'Recipe not found',
      }
      return HttpResponse.json(body, { status: 404 })
    }
    const like = db.like.findFirst({
      where: {
        recipeId: { equals: recipeId },
        country: { equals: country },
      },
    })
    let count = 0
    if (like) {
      const likeId = like.id.toString()
      count =like.count + 1
      db.like.update({
        where: { id: { equals: likeId } },
        data: { count },
      })
    } else {
      count = 1
      db.like.create({ recipeId, country, count })
    }

    const body: components['responses']['LikeRecipeOkResponse']['content']['application/json'] = {
      message: 'Successfully liked',
      likes: count
    }
    return HttpResponse.json(body, { status: 200 })
  }),
  http.delete(endpoint('/recipes/:recipeId/likes'), (context) => {
    const country = context.request.headers.get('X-Country')
    if (!country) {
      const body: components['responses']['UnlikeRecipeBadRequestResponse']['content']['application/json'] = {
        message: 'Country code is required',
      }
      return HttpResponse.json(body, { status: 400 })
    }
    const recipeId = context.params.recipeId.toString()
    if (!recipeId) {
      const body: components['responses']['UnlikeRecipeBadRequestResponse']['content']['application/json'] = {
        message: 'Recipe ID is required',
      }
      return HttpResponse.json(body, { status: 400 })
    }
    const recipeRow = db.recipe.findFirst({
      where: { id: { equals: recipeId } },
    })
    if (!recipeRow) {
      const body: components['responses']['UnlikeRecipeNotFoundResponse']['content']['application/json'] = {
        message: 'Recipe not found',
      }
      return HttpResponse.json(body, { status: 404 })
    }
    const like = db.like.findFirst({
      where: {
        recipeId: { equals: recipeId },
        country: { equals: country },
      },
    })
    let count = 0
    if (like) {
      const likeId = like.id.toString()
      count = Math.max(like.count - 1, 0)
      db.like.update({
        where: { id: { equals: likeId } },
        data: { count },
      })
    }
    const body: components['responses']['UnlikeRecipeOkResponse']['content']['application/json'] = {
      message: 'Successfully unliked',
      likes:count
    }
    return HttpResponse.json(body, { status: 200 })
  })
]
