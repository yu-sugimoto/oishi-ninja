import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// 環境変数の読み込み
dotenv.config();

// OpenAIクライアントの初期化
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * レシピ名を生成する関数
 * @param {number} count - 生成するレシピ名の数
 * @returns {Promise<string[]>}
 */
export async function createRecipeNames(count) {
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
  return response.choices[0].message.content;
}

/**
 * 食材名を生成する関数
 * @param {number} count - 生成する食材名の数
 * @returns {Promise<string[]>}
 */
export async function createIngredientNames(count) {
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
  return response.choices[0].message.content;
}

/**
 * レシピに必要な食材を選ぶ関数
 * @param {string} recipeName - レシピ名
 * @param {string[]} ingredients - 食材の一覧
 * @returns {Promise<string[]>}
 */
export async function selectIngredientsByRecipeNameAndIngredients(recipeName, ingredients) {
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
  return response.choices[0].message.content;
}

/**
 * レシピデータを作成する関数
 * @param {string} recipeName - レシピ名
 * @param {string[]} ingredientNames - 食材名リスト
 * @returns {Promise<Object>}
 */
export async function createRecipeDataByRecipeNameAndIngredients(recipeName, ingredientNames) {
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

// メイン関数

async function main() {
  const recipeCount = 40;
  const ingredientCount = 100;

  const recipeNamesFilePath = "out/recipeNames.json";
  const ingredientNamesFilePath = "out/ingredientNames.json";

  fs.mkdirSync("out", { recursive: true });

  const recipeNames = []
  if (fs.existsSync(recipeNamesFilePath)) {
    const recipeNamesJson = fs.readFileSync(recipeNamesFilePath, "utf-8");
    const currentRecipeNames = JSON.parse(recipeNamesJson);
    recipeNames.push(...currentRecipeNames);
  }
  // 不足した数量
  const missingRecipeCount = recipeCount - recipeNames.length;
  if (missingRecipeCount > 0) {
    const newRecipeNamesJson = await createRecipeNames(missingRecipeCount);
    const newRecipeNames = JSON.parse(newRecipeNamesJson);
    recipeNames.push(...newRecipeNames);
    fs.writeFileSync(recipeNamesFilePath, JSON.stringify(recipeNames, null, 2));
  }

  const ingredientNames = []
  if (fs.existsSync(ingredientNamesFilePath)) {
    const ingredientNamesJson = fs.readFileSync(ingredientNamesFilePath, "utf-8");
    const currentIngredientNames = JSON.parse(ingredientNamesJson);
    ingredientNames.push(...currentIngredientNames);
  }
  // 不足した数量
  const missingIngredientCount = ingredientCount - ingredientNames.length;
  if (missingIngredientCount > 0) {
    const newIngredientNamesJson = await createIngredientNames(missingIngredientCount);
    const newIngredientNames = JSON.parse(newIngredientNamesJson);
    ingredientNames.push(...newIngredientNames);
    fs.writeFileSync(ingredientNamesFilePath, JSON.stringify(ingredientNames, null, 2));
  }

  // すでに作られているレシピのファイルを取得
  const recipeFiles = fs.readdirSync("out/recipes");
  const recipeIds = recipeFiles.map(f => f.replace(".json", ""));
  const alreadyCreatedRecipeNames = []
  for (const recipeId of recipeIds) {
    const recipeFilePath = `out/recipes/${recipeId}.json`;
    const recipeJson = fs.readFileSync(recipeFilePath, "utf-8");
    const recipeData = JSON.parse(recipeJson);
    alreadyCreatedRecipeNames.push(recipeData.recipe_name);
  }

  // まだ作られていないレシピ名を取得
  const newRecipeNames = recipeNames.filter(name => !alreadyCreatedRecipeNames.includes(name));

  console.log(`recipeNames: ${recipeNames.length}`);
  console.log(`newRecipeNames: ${newRecipeNames.length}`);
  console.log(`ingredientNames: ${ingredientNames.length}`);

  fs.mkdirSync("out/recipes", { recursive: true });
  fs.mkdirSync("out/images", { recursive: true });
  for (const recipeName of newRecipeNames) {
    console.info(`Creating recipe: ${recipeName}`);
    console.info(`Selecting ingredients for ${recipeName}`);
    const selectedIngredientsJson = await selectIngredientsByRecipeNameAndIngredients(recipeName, ingredientNames);
    const selectedIngredients = JSON.parse(selectedIngredientsJson);
    console.info(`Selected ingredients: ${selectedIngredients.join(", ")}`);

    const recipeData = await createRecipeDataByRecipeNameAndIngredients(recipeName, selectedIngredients);
    const recipeFilePath = `out/recipes/${recipeData.id}.json`;
    const imageFilePath = `out/images/${recipeData.id}.png`;
    fs.writeFileSync(recipeFilePath, JSON.stringify(recipeData, null, 2));
    console.info(`Saving recipe to ${recipeFilePath}`);

    console.info(`Creating image: ${imageFilePath}`);
    const recipeImage = await createRecipeImageByRecipeData(recipeData);
    fs.writeFileSync(imageFilePath, recipeImage);
    console.info(`Saved image to ${imageFilePath}`);
  }
}

main();
