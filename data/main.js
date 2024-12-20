import fs from "fs";
import {
  createRecipeNames,
  createIngredientNames,
  selectIngredientsByRecipeNameAndIngredients,
  createRecipeDataByRecipeNameAndIngredients,
  createRecipeImageByRecipeData,
  createLikesDataByRecipeData
} from './libs/creator.js';

async function main() {
  const recipeCount = 40;
  const ingredientCount = 100;

  const recipeNamesFilePath = "out/recipeNames.json";
  const ingredientNamesFilePath = "out/ingredientNames.json";

  try {
    fs.mkdirSync("out", { recursive: true });
    console.log("[INFO] 出力ディレクトリ 'out' を作成しました。");
  } catch (error) {
    console.error("[ERROR] 'out' ディレクトリの作成に失敗しました: ", error);
  }

  const recipeNames = [];
  try {
    if (fs.existsSync(recipeNamesFilePath)) {
      console.log("[INFO] レシピ名のファイルが存在します。");
      const recipeNamesJson = fs.readFileSync(recipeNamesFilePath, "utf-8");
      const currentRecipeNames = JSON.parse(recipeNamesJson);
      recipeNames.push(...currentRecipeNames);
    }
  } catch (error) {
    console.error("[ERROR] レシピ名の読み込みに失敗しました: ", error);
  }

  const missingRecipeCount = recipeCount - recipeNames.length;
  if (missingRecipeCount > 0) {
    try {
      console.log(`[INFO] ${missingRecipeCount} 個の新しいレシピ名を作成します。`);
      const newRecipeNames = await createRecipeNames(missingRecipeCount);
      recipeNames.push(...newRecipeNames);
      fs.writeFileSync(recipeNamesFilePath, JSON.stringify(recipeNames, null, 2));
      console.log("[INFO] レシピ名を保存しました。");
    } catch (error) {
      console.error("[ERROR] レシピ名の作成または保存に失敗しました: ", error);
    }
  }

  const ingredientNames = [];
  try {
    if (fs.existsSync(ingredientNamesFilePath)) {
      console.log("[INFO] 材料名のファイルが存在します。");
      const ingredientNamesJson = fs.readFileSync(ingredientNamesFilePath, "utf-8");
      const currentIngredientNames = JSON.parse(ingredientNamesJson);
      ingredientNames.push(...currentIngredientNames);
    }
  } catch (error) {
    console.error("[ERROR] 材料名の読み込みに失敗しました: ", error);
  }

  const missingIngredientCount = ingredientCount - ingredientNames.length;
  if (missingIngredientCount > 0) {
    try {
      console.log(`[INFO] ${missingIngredientCount} 個の新しい材料名を作成します。`);
      const newIngredientNames = await createIngredientNames(missingIngredientCount);
      ingredientNames.push(...newIngredientNames);
      fs.writeFileSync(ingredientNamesFilePath, JSON.stringify(ingredientNames, null, 2));
      console.log("[INFO] 材料名を保存しました。");
    } catch (error) {
      console.error("[ERROR] 材料名の作成または保存に失敗しました: ", error);
    }
  }

  try {
    fs.mkdirSync("out/recipes", { recursive: true });
    fs.mkdirSync("out/images", { recursive: true });
    fs.mkdirSync("out/likes", { recursive: true });
    console.log("[INFO] 必要なディレクトリを作成しました。");
  } catch (error) {
    console.error("[ERROR] ディレクトリの作成に失敗しました: ", error);
  }

  const recipeDataByName = {};
  try {
    const recipeFiles = fs.readdirSync("out/recipes");
    for (const recipeFile of recipeFiles) {
      const recipeFilePath = `out/recipes/${recipeFile}`;
      const recipeDataJson = fs.readFileSync(recipeFilePath, "utf-8");
      const recipeData = JSON.parse(recipeDataJson);
      recipeDataByName[recipeData.recipe_name] = recipeData;
    }
    console.log("[INFO] 既存のレシピデータを読み込みました。");
  } catch (error) {
    console.error("[ERROR] レシピデータの読み込みに失敗しました: ", error);
  }

  const recipeImageExistsById = {};
  try {
    const imageFiles = fs.readdirSync("out/images");
    for (const imageFile of imageFiles) {
      const id = imageFile.replace(".png", "");
      recipeImageExistsById[id] = true;
    }
    console.log("[INFO] 既存の画像データを読み込みました。");
  } catch (error) {
    console.error("[ERROR] 画像データの読み込みに失敗しました: ", error);
  }

  const likesDataExistsById = {};
  try {
    const likesFiles = fs.readdirSync("out/likes");
    for (const likesFile of likesFiles) {
      const id = likesFile.replace(".json", "");
      likesDataExistsById[id] = true;
    }
    console.log("[INFO] 既存のいいねデータを読み込みました。");
  } catch (error) {
    console.error("[ERROR] いいねデータの読み込みに失敗しました: ", error);
  }

  for (const recipeName of recipeNames) {
    try {
      const recipeDataExists = recipeDataByName[recipeName];
      if (!recipeDataExists) {
        console.log(`[INFO] レシピデータを作成中: ${recipeName}`);
        const selectedIngredients = await selectIngredientsByRecipeNameAndIngredients(recipeName, ingredientNames);
        const recipeData = await createRecipeDataByRecipeNameAndIngredients(recipeName, selectedIngredients);
        const recipeFilePath = `out/recipes/${recipeData.id}.json`;
        fs.writeFileSync(recipeFilePath, JSON.stringify(recipeData, null, 2));
        console.log(`[INFO] レシピデータを作成しました: ${recipeName}`);
        recipeDataByName[recipeName] = recipeData;
      } else {
        console.log(`[INFO] レシピデータは既に存在します: ${recipeName}`);
      }
    } catch (error) {
      console.error(`[ERROR] レシピデータの作成に失敗しました: ${recipeName}`, error);
    }

    try {
      const recipeData = recipeDataByName[recipeName];
      const recipeImageExists = recipeImageExistsById[recipeData.id];
      if (!recipeImageExists) {
        console.log(`[INFO] 画像を作成中: ${recipeName}`);
        const recipeImage = await createRecipeImageByRecipeData(recipeData);
        const imageFilePath = `out/images/${recipeData.id}.png`;
        fs.writeFileSync(imageFilePath, recipeImage);
        console.log(`[INFO] 画像を作成しました: ${recipeName}`);
      } else {
        console.log(`[INFO] 画像は既に存在します: ${recipeName}`);
      }
    } catch (error) {
      console.error(`[ERROR] 画像の作成に失敗しました: ${recipeName}`, error);
    }

    try {
      const recipeData = recipeDataByName[recipeName];
      const likesDataExists = likesDataExistsById[recipeData.id];
      if (!likesDataExists) {
        console.log(`[INFO] いいねデータを作成中: ${recipeName}`);
        const likesData = await createLikesDataByRecipeData(recipeData);
        const likesFilePath = `out/likes/${recipeData.id}.json`;
        fs.writeFileSync(likesFilePath, JSON.stringify(likesData, null, 2));
        console.log(`[INFO] いいねデータを作成しました: ${recipeName}`);
      } else {
        console.log(`[INFO] いいねデータは既に存在します: ${recipeName}`);
      }
    } catch (error) {
      console.error(`[ERROR] いいねデータの作成に失敗しました: ${recipeName}`, error);
    }

    try {
      const recipeData = recipeDataByName[recipeName];
      const recipeFilePath = `out/recipes/${recipeData.id}.json`;
      const likesFilePath = `out/likes/${recipeData.id}.json`;
      const recipe = JSON.parse(fs.readFileSync(recipeFilePath, "utf-8"));
      const likes = JSON.parse(fs.readFileSync(likesFilePath, "utf-8"));
      recipe.likes = likes;
      fs.writeFileSync(recipeFilePath, JSON.stringify(recipe, null, 2));
    } catch (error) {
      console.error(`[ERROR] いいねデータの作成に失敗しました: ${recipeName}`, error);
    }
  }
}

main();
