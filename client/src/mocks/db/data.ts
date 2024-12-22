import { RecipeInput } from "./types";

export const recipes: RecipeInput[] = [
  {
    id: 'c2a32cda-2608-4f2b-9d6d-bd9c2c3ccb21',
    name: '肉じゃが',
    thumbnail: 'https://dummyimage.com/300x200/000/fff?text=肉じゃが',
    instructions: `
      1. 牛肉を一口大に切ります。
      2. じゃがいも、玉ねぎ、にんじんを食べやすい大きさに切ります。
      3. 鍋にサラダ油を熱し、牛肉を炒めます。
      4. 牛肉の色が変わったら、じゃがいも、玉ねぎ、にんじんを加えて炒めます。
      5. 全体に油が回ったら、だし汁、砂糖、醤油、みりんを加えます。
      6. 煮立ったらアクを取り、しらたきを加えます。
      7. 弱火にして、材料が柔らかくなるまで煮ます。
      8. 最後に溶き卵を回し入れ、火を止めます。
      9. 器に盛り付けて完成です。
    `,
    ingredients: [
      { name: '牛肉', quantity: '200g' },
      { name: 'じゃがいも', quantity: '3個' },
      { name: '玉ねぎ', quantity: '2個' },
      { name: 'にんじん', quantity: '1本' },
      { name: 'しらたき', quantity: '100g' },
      { name: 'だし汁', quantity: '400ml' },
      { name: '砂糖', quantity: '大さじ2' },
      { name: '醤油', quantity: '大さじ3' },
      { name: 'みりん', quantity: '大さじ2' },
      { name: 'サラダ油', quantity: '大さじ1' },
      { name: '卵', quantity: '2個' },
    ],
    likeCountByCountry: {
      'JPN': 328,
      'PHL': 120,
      'NPL': 98,
      'CHN': 76,
      'TWN': 54,
      'FRA': 32,
      'ITA': 12,
      'DEU': 4,
      'USA': 0,
    }
  },
  {
    id: '38d9cbe5-ea53-43cf-944e-f31da5078637',
    name: 'カレー',
    thumbnail: 'https://dummyimage.com/300x200/000/fff?text=カレー',
    instructions: `
      1. 玉ねぎをみじん切りにし、じゃがいもとにんじんを一口大に切ります。
      2. 鍋にサラダ油を熱し、玉ねぎを飴色になるまで炒めます。
      3. 玉ねぎに牛肉を加え、色が変わるまで炒めます。
      4. じゃがいもとにんじんを加え、さらに炒めます。
      5. 全体に油が回ったら、水を加えて煮立たせます。
      6. アクを取り除き、中火で具材が柔らかくなるまで煮込みます。
      7. 火を弱めてカレールーを加え、ルーが溶けるまで混ぜます。
      8. 再び弱火で10分ほど煮込み、味を調えます。
      9. 器に盛り付けてご飯と一緒にいただきます。
    `,
    ingredients: [
      { name: '牛肉', quantity: '200g' },
      { name: '玉ねぎ', quantity: '2個' },
      { name: 'じゃがいも', quantity: '3個' },
      { name: 'にんじん', quantity: '1本' },
      { name: 'カレールー', quantity: '1箱' },
      { name: '水', quantity: '800ml' },
      { name: 'サラダ油', quantity: '大さじ1' },
    ],
    likeCountByCountry: {
      'JPN': 965,
      'PHL': 96,
      'NPL': 839,
      'CHN': 152,
      'TWN': 251,
      'FRA': 674,
      'ITA': 362,
      'DEU': 875,
      'USA': 756,
    }
  },
  {
    id: 'c45ee28a-45a2-4189-a118-cd4821e1b57b',
    name: '焼きそば',
    thumbnail: 'https://dummyimage.com/300x200/000/fff?text=焼きそば',
    instructions: `
      1. キャベツをざく切りにし、もやしは水洗いして水気を切ります。
      2. 豚肉を一口大に切ります。
      3. フライパンにサラダ油を熱し、豚肉を炒めます。
      4. キャベツともやしを加えて炒め、全体がしんなりするまで火を通します。
      5. 焼きそば麺を加え、ほぐしながら炒めます。
      6. 焼きそばソースを回しかけ、全体をよく混ぜます。
      7. 器に盛り付け、お好みで青のりや紅しょうがを添えて完成です。
    `,
    ingredients: [
      { name: '焼きそば麺', quantity: '3玉' },
      { name: '豚肉', quantity: '200g' },
      { name: 'キャベツ', quantity: '1/4個' },
      { name: 'もやし', quantity: '100g' },
      { name: '焼きそばソース', quantity: '大さじ4' },
      { name: 'サラダ油', quantity: '大さじ1' },
    ],
    likeCountByCountry: {
      'JPN': 81,
      'PHL': 78,
      'NPL': 152,
      'CHN': 138,
      'TWN': 183,
      'FRA': 88,
      'ITA': 101,
      'DEU': 147,
      'USA': 89,
    }
  },
  {
    id: '3888cad0-5447-4ce5-9835-f07a6eaba17e',
    name: 'コロッケ',
    thumbnail: 'https://dummyimage.com/300x200/000/fff?text=コロッケ',
    instructions: `
      1. じゃがいもを茹でて柔らかくし、マッシュします。
      2. フライパンでひき肉とみじん切りにした玉ねぎを炒めます。
      3. マッシュしたじゃがいもと炒めた具材を混ぜ、塩胡椒で味を調えます。
      4. 冷ましてから好みの形に成形します。
      5. 小麦粉、溶き卵、パン粉の順で衣を付けます。
      6. 中温の油で揚げ、きつね色になったら完成です。
    `,
    ingredients: [
      { name: 'じゃがいも', quantity: '4個' },
      { name: 'ひき肉', quantity: '150g' },
      { name: '玉ねぎ', quantity: '1個' },
      { name: '塩胡椒', quantity: '少々' },
      { name: '小麦粉', quantity: '適量' },
      { name: '溶き卵', quantity: '2個分' },
      { name: 'パン粉', quantity: '適量' },
      { name: '揚げ油', quantity: '適量' },
    ],
    likeCountByCountry: {
      'JPN': 93,
      'PHL': 82,
      'NPL': 80,
      'CHN': 22,
      'TWN': 8,
      'FRA': 66,
      'ITA': 45,
      'DEU': 5,
      'USA': 14,
    }
  },
  {
    id: '08bab1e8-a619-46af-a816-e654196192d7',
    name: '唐揚げ',
    thumbnail: 'https://dummyimage.com/300x200/000/fff?text=唐揚げ',
    instructions: `
      1. 鶏もも肉を一口大に切ります。
      2. ボウルに醤油、酒、おろし生姜、おろしニンニクを混ぜてタレを作ります。
      3. 鶏肉をタレに漬け込み、30分ほど置きます。
      4. 漬け込んだ鶏肉に片栗粉をまぶします。
      5. 中温の油で鶏肉を揚げ、表面がカリッとなったら完成です。
    `,
    ingredients: [
      { name: '鶏もも肉', quantity: '500g' },
      { name: '醤油', quantity: '大さじ3' },
      { name: '酒', quantity: '大さじ2' },
      { name: 'おろし生姜', quantity: '小さじ1' },
      { name: 'おろしニンニク', quantity: '小さじ1' },
      { name: '片栗粉', quantity: '適量' },
      { name: '揚げ油', quantity: '適量' },
    ],
    likeCountByCountry: {
      'JPN': 185,
      'PHL': 73,
      'NPL': 64,
      'CHN': 347,
      'TWN': 211,
      'FRA': 244,
      'ITA': 151,
      'DEU': 107,
      'USA': 354,
    }
  },
  {
    id: '6b7d0c20-2c63-4e5d-95cb-d92490982e08',
    name: '刺し身丼',
    thumbnail: 'https://dummyimage.com/300x200/000/fff?text=刺し身丼',
    instructions: `
      1. 好みの刺し身を食べやすい大きさに切ります。
      2. ご飯を器によそい、刺し身を盛り付けます。
      3. 刻み海苔や大葉を添え、お好みで醤油やわさびを添えて完成です。
    `,
    ingredients: [
      { name: '刺し身盛り合わせ', quantity: '適量' },
      { name: 'ご飯', quantity: '2膳分' },
      { name: '刻み海苔', quantity: '少々' },
      { name: '大葉', quantity: '少々' },
      { name: '醤油', quantity: '適量' },
      { name: 'わさび', quantity: '適量' },
    ],
    likeCountByCountry: {
      'JPN': 44,
      'PHL': 44,
      'NPL': 27,
      'CHN': 2,
      'TWN': 41,
      'FRA': 47,
      'ITA': 5,
      'DEU': 23,
      'USA': 20,
    }
  },
  {
    id: 'ff2e6856-2e66-4e9a-92a7-7914e30d98c4',
    name: '切り干し大根',
    thumbnail: 'https://dummyimage.com/300x200/000/fff?text=切り干し大根',
    instructions: `
      1. 切り干し大根を水で戻し、軽く絞ります。
      2. 鍋にサラダ油を熱し、切り干し大根と千切りにしたにんじんを炒めます。
      3. だし汁、醤油、みりん、砂糖を加え、煮汁がなくなるまで煮詰めます。
      4. 器に盛り付けて完成です。
    `,
    ingredients: [
      { name: '切り干し大根', quantity: '50g' },
      { name: 'にんじん', quantity: '1/2本' },
      { name: 'だし汁', quantity: '300ml' },
      { name: '醤油', quantity: '大さじ2' },
      { name: 'みりん', quantity: '大さじ1' },
      { name: '砂糖', quantity: '小さじ2' },
      { name: 'サラダ油', quantity: '大さじ1' },
    ],
    likeCountByCountry: {
      'JPN': 654,
      'PHL': 604,
      'NPL': 462,
      'CHN': 73,
      'TWN': 864,
      'FRA': 264,
      'ITA': 25,
      'DEU': 422,
      'USA': 212,
    }
  },
];
