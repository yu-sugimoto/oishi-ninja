import { v4 as uuidv4 } from "uuid";
import { getOpenAi } from "./openai.js";
import { countries } from "../constants.js";

/**
 * レシピ名を生成する関数
 * @param {number} count - 生成するレシピ名の数
 * @returns {Promise<string[]>}
 */
export async function createRecipeNames(count) {
  const openai = getOpenAi();
  const prompt = `
    日本のスーパーで買える食材を使った料理のレシピ名を${count}個生成してください。
    必ず例に提示したJSON形式で返してください。
    例:
    [
      "鶏の唐揚げ",
      "肉じゃが",
      "カレーライス"
    ]
  `;
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });
  const data = JSON.parse(response.choices[0].message.content);
  return data;
}

/**
 * 食材名を生成する関数
 * @param {number} count - 生成する食材名の数
 * @returns {Promise<string[]>}
 */
export async function createIngredientNames(count) {
  const openai = getOpenAi();
  const prompt = `
    - 日本のスーパーで買える食材の名前を${count}個生成してください。
    - 必ず例に提示したJSON形式で返してください。
    例:
    [
      "鶏肉",
      "じゃがいも",
      "玉ねぎ"
    ]
  `;
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });
  const data = JSON.parse(response.choices[0].message.content);
  return data;
}

/**
 * レシピに必要な食材を選ぶ関数
 * @param {string} recipeName - レシピ名
 * @param {string[]} ingredients - 食材の一覧
 * @returns {Promise<string[]>}
 */
export async function selectIngredientsByRecipeNameAndIngredients(recipeName, ingredients) {
  const openai = getOpenAi();
  const prompt = `
    - 以下のレシピ名と食材リストから、そのレシピに必要な食材を選んでください。
    - 必要ない場合は空のリストを返してください。
    - レシピ名: ${recipeName}
    - 食材リスト: ${ingredients.join(", ")}
    - 必ず例に提示したJSON形式で返してください。
    [
      "醤油",
      "砂糖",
      "卵"
    ]
  `;
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });
  const data = JSON.parse(response.choices[0].message.content);
  return data;
}

/**
 * レシピデータを作成する関数
 * @param {string} recipeName - レシピ名
 * @param {string[]} ingredientNames - 食材名リスト
 * @returns {Promise<Object>}
 */
export async function createRecipeDataByRecipeNameAndIngredients(recipeName, ingredientNames) {
  const openai = getOpenAi();
  const prompt = `
    以下のレシピ名と食材リストから各食材に対する分量を生成してください。
    レシピ名: ${recipeName}
    食材リスト: ${ingredientNames.join(", ")}
    必ず例に提示したJSON形式で返してください。
    例:
    [{
      "ingredientName": "醤油",
      "quantity": "大さじ1"
    }, {
      "ingredientName": "砂糖",
      "quantity": "大さじ2"
    }, {
      "ingredientName": "卵",
      "quantity": "2個"
    }]
  `;
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });
  const ingredientNameAndQuantitySetsJson = response.choices[0].message.content;
  const ingredientNameAndQuantitySets = JSON.parse(ingredientNameAndQuantitySetsJson);
  console.info(`Generated ingredientNameAndQuantitySets:`);
  console.log(ingredientNameAndQuantitySets);

  // OpenAIに食材の分量を生成させる
  const instructionsPrompt = `
    次のレシピと食材リストに対してレシピの手順を生成してください。
    Markdown形式で返してください。

    レシピ名: ${recipeName}
    食材リスト: ${ingredientNameAndQuantitySets.map(i => `${i.ingredientName} (${i.quantity})`).join(", ")}

    例:

    # 1. 材料を切る
    じゃがいもの皮を剥いて4等分に切る。
    にんじんの皮を剥いて4等分に切る

    # 2. 炒める
    フライパンに油を熱し、じゃがいもとにんじんを炒める。
  `;
  const instructionsResponse = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: instructionsPrompt }],
  });
  const instructions = instructionsResponse.choices[0].message.content ?? '';

  return {
    id: uuidv4(),
    recipe_name: recipeName,
    instructions,
    ingredients: ingredientNameAndQuantitySets,
  };
}

/**
 * レシピデータから画像を生成する関数
 * @param {Object} recipeData - レシピデータ
 * @returns {Promise<ArrayBuffer>}
 */
export async function createRecipeImageByRecipeData(recipeData) {
  const openai = getOpenAi();
  const prompt = `
    以下のレシピデータを元にした料理の画像を生成してください。
    写真のような雰囲気にしてください。
    レシピ名: ${recipeData.recipe_name}
    食材: ${recipeData.ingredients.map(i => `${i.ingredientName} (${i.quantity})`).join(", ")}
  `;
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    n: 1,
    size: "1024x1024",
    response_format: "b64_json",
  });
  return Buffer.from(response.data[0].b64_json, "base64");
}


export async function createLikesDataByRecipeData (recipeData) {
  const prompt = `
    次のレシピに対して各国の国民がどれくらいいいねをするか予測してください。
    最大300いいねです。一覧の国の相対的な評価としてください。
    例に従って各国のいいねすうをJSONにしてください。
    レシピ名: ${recipeData.recipe_name}
    食材: ${recipeData.ingredients.map(i => `${i.ingredientName}`).join(", ")}

    国の説明
    ${countries.map(country => `${country.code}: ${country.name}, ${country.description}`).join("\n")}

    JSON形式だけを返してください。
    例:
    {
      ${countries.map(country => `"${country.code}": 0`).join(",\n")}
    }
  `;
  const openai = getOpenAi();
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });
  const data = JSON.parse(response.choices[0].message.content);
  return data;
}
