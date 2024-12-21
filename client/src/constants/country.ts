type CountryCode = (
  'ISL' |
  'IRL' |
  'AZE' |
  'AFG' |
  'USA' |
  'VIR' |
  'ASM' |
  'ARE' |
  'DZA' |
  'ARG' |
  'ABW' |
  'ALB' |
  'ARM' |
  'AIA' |
  'AGO' |
  'ATG' |
  'AND' |
  'YEM' |
  'GBR' |
  'IOT' |
  'VGB' |
  'ISR' |
  'ITA' |
  'IRQ' |
  'IRN' |
  'IND' |
  'IDN' |
  'WLF' |
  'UGA' |
  'UKR' |
  'UZB' |
  'URY' |
  'ECU' |
  'EGY' |
  'EST' |
  'SWZ' |
  'ETH' |
  'ERI' |
  'SLV' |
  'AUS' |
  'AUT' |
  'ALA' |
  'OMN' |
  'NLD' |
  'GHA' |
  'CPV' |
  'GGY' |
  'GUY' |
  'KAZ' |
  'QAT' |
  'UMI' |
  'CAN' |
  'GAB' |
  'CMR' |
  'GMB' |
  'KHM' |
  'MKD' |
  'MNP' |
  'GIN' |
  'GNB' |
  'CYP' |
  'CUB' |
  'CUW' |
  'GRC' |
  'KIR' |
  'KGZ' |
  'GTM' |
  'GLP' |
  'GUM' |
  'KWT' |
  'COK' |
  'GRL' |
  'CXR' |
  'GRD' |
  'HRV' |
  'CYM' |
  'KEN' |
  'CIV' |
  'CCK' |
  'CRI' |
  'COM' |
  'COL' |
  'COG' |
  'COD' |
  'SAU' |
  'SGS' |
  'WSM' |
  'STP' |
  'BLM' |
  'ZMB' |
  'SPM' |
  'SMR' |
  'MAF' |
  'SLE' |
  'DJI' |
  'GIB' |
  'JEY' |
  'JAM' |
  'GEO' |
  'SYR' |
  'SGP' |
  'SXM' |
  'ZWE' |
  'CHE' |
  'SWE' |
  'SDN' |
  'SJM' |
  'ESP' |
  'SUR' |
  'LKA' |
  'SVK' |
  'SVN' |
  'SYC' |
  'GNQ' |
  'SEN' |
  'SRB' |
  'KNA' |
  'VCT' |
  'SHN' |
  'LCA' |
  'SOM' |
  'SLB' |
  'TCA' |
  'THA' |
  'KOR' |
  'TWN' |
  'TJK' |
  'TZA' |
  'CZE' |
  'TCD' |
  'CAF' |
  'CHN' |
  'TUN' |
  'PRK' |
  'CHL' |
  'TUV' |
  'DNK' |
  'DEU' |
  'TGO' |
  'TKL' |
  'DOM' |
  'DMA' |
  'TTO' |
  'TKM' |
  'TUR' |
  'TON' |
  'NGA' |
  'NRU' |
  'NAM' |
  'ATA' |
  'NIU' |
  'NIC' |
  'NER' |
  'JPN' |
  'ESH' |
  'NCL' |
  'NZL' |
  'NPL' |
  'NFK' |
  'NOR' |
  'HMD' |
  'BHR' |
  'HTI' |
  'PAK' |
  'VAT' |
  'PAN' |
  'VUT' |
  'BHS' |
  'PNG' |
  'BMU' |
  'PLW' |
  'PRY' |
  'BRB' |
  'PSE' |
  'HUN' |
  'BGD' |
  'TLS' |
  'PCN' |
  'FJI' |
  'PHL' |
  'FIN' |
  'BTN' |
  'BVT' |
  'PRI' |
  'FRO' |
  'FLK' |
  'BRA' |
  'FRA' |
  'GUF' |
  'PYF' |
  'ATF' |
  'BGR' |
  'BFA' |
  'BRN' |
  'BDI' |
  'VNM' |
  'BEN' |
  'VEN' |
  'BLR' |
  'BLZ' |
  'PER' |
  'BEL' |
  'POL' |
  'BIH' |
  'BWA' |
  'BES' |
  'BOL' |
  'PRT' |
  'HKG' |
  'HND' |
  'MHL' |
  'MAC' |
  'MDG' |
  'MYT' |
  'MWI' |
  'MLI' |
  'MLT' |
  'MTQ' |
  'MYS' |
  'IMN' |
  'FSM' |
  'ZAF' |
  'SSD' |
  'MMR' |
  'MEX' |
  'MUS' |
  'MRT' |
  'MOZ' |
  'MCO' |
  'MDV' |
  'MDA' |
  'MAR' |
  'MNG' |
  'MNE' |
  'MSR' |
  'JOR' |
  'LAO' |
  'LVA' |
  'LTU' |
  'LBY' |
  'LIE' |
  'LBR' |
  'ROU' |
  'LUX' |
  'RWA' |
  'LSO' |
  'LBN' |
  'REU' |
  'RUS'
)

export const COUNTRY_CODE: Record<CountryCode, string> = Object.freeze({
  ISL: "ISL", // アイスランド
  IRL: "IRL", // アイルランド
  AZE: "AZE", // アゼルバイジャン
  AFG: "AFG", // アフガニスタン
  USA: "USA", // アメリカ合衆国
  VIR: "VIR", // アメリカ領ヴァージン諸島
  ASM: "ASM", // アメリカ領サモア
  ARE: "ARE", // アラブ首長国連邦
  DZA: "DZA", // アルジェリア
  ARG: "ARG", // アルゼンチン
  ABW: "ABW", // アルバ
  ALB: "ALB", // アルバニア
  ARM: "ARM", // アルメニア
  AIA: "AIA", // アンギラ
  AGO: "AGO", // アンゴラ
  ATG: "ATG", // アンティグア・バーブーダ
  AND: "AND", // アンドラ
  YEM: "YEM", // イエメン
  GBR: "GBR", // イギリス
  IOT: "IOT", // イギリス領インド洋地域
  VGB: "VGB", // イギリス領ヴァージン諸島
  ISR: "ISR", // イスラエル
  ITA: "ITA", // イタリア
  IRQ: "IRQ", // イラク
  IRN: "IRN", // イラン・イスラム共和国
  IND: "IND", // インド
  IDN: "IDN", // インドネシア
  WLF: "WLF", // ウォリス・フツナ
  UGA: "UGA", // ウガンダ
  UKR: "UKR", // ウクライナ
  UZB: "UZB", // ウズベキスタン
  URY: "URY", // ウルグアイ
  ECU: "ECU", // エクアドル
  EGY: "EGY", // エジプト
  EST: "EST", // エストニア
  SWZ: "SWZ", // エスワティニ
  ETH: "ETH", // エチオピア
  ERI: "ERI", // エリトリア
  SLV: "SLV", // エルサルバドル
  AUS: "AUS", // オーストラリア
  AUT: "AUT", // オーストリア
  ALA: "ALA", // オーランド諸島
  OMN: "OMN", // オマーン
  NLD: "NLD", // オランダ
  GHA: "GHA", // ガーナ
  CPV: "CPV", // カーボベルデ
  GGY: "GGY", // ガーンジー
  GUY: "GUY", // ガイアナ
  KAZ: "KAZ", // カザフスタン
  QAT: "QAT", // カタール
  UMI: "UMI", // 合衆国領有小離島
  CAN: "CAN", // カナダ
  GAB: "GAB", // ガボン
  CMR: "CMR", // カメルーン
  GMB: "GMB", // ガンビア
  KHM: "KHM", // カンボジア
  MKD: "MKD", // 北マケドニア
  MNP: "MNP", // 北マリアナ諸島
  GIN: "GIN", // ギニア
  GNB: "GNB", // ギニアビサウ
  CYP: "CYP", // キプロス
  CUB: "CUB", // キューバ
  CUW: "CUW", // キュラソー
  GRC: "GRC", // ギリシャ
  KIR: "KIR", // キリバス
  KGZ: "KGZ", // キルギス
  GTM: "GTM", // グアテマラ
  GLP: "GLP", // グアドループ
  GUM: "GUM", // グアム
  KWT: "KWT", // クウェート
  COK: "COK", // クック諸島
  GRL: "GRL", // グリーンランド
  CXR: "CXR", // クリスマス島
  GRD: "GRD", // グレナダ
  HRV: "HRV", // クロアチア
  CYM: "CYM", // ケイマン諸島
  KEN: "KEN", // ケニア
  CIV: "CIV", // コートジボワール
  CCK: "CCK", // ココス（キーリング）諸島
  CRI: "CRI", // コスタリカ
  COM: "COM", // コモロ
  COL: "COL", // コロンビア
  COG: "COG", // コンゴ共和国
  COD: "COD", // コンゴ民主共和国
  SAU: "SAU", // サウジアラビア
  SGS: "SGS", // サウスジョージア・サウスサンドウィッチ諸島
  WSM: "WSM", // サモア
  STP: "STP", // サントメ・プリンシペ
  BLM: "BLM", // サン・バルテルミー
  ZMB: "ZMB", // ザンビア
  SPM: "SPM", // サンピエール島・ミクロン島
  SMR: "SMR", // サンマリノ
  MAF: "MAF", // サン・マルタン（フランス領）
  SLE: "SLE", // シエラレオネ
  DJI: "DJI", // ジブチ
  GIB: "GIB", // ジブラルタル
  JEY: "JEY", // ジャージー
  JAM: "JAM", // ジャマイカ
  GEO: "GEO", // ジョージア
  SYR: "SYR", // シリア・アラブ共和国
  SGP: "SGP", // シンガポール
  SXM: "SXM", // シント・マールテン（オランダ領）
  ZWE: "ZWE", // ジンバブエ
  CHE: "CHE", // スイス
  SWE: "SWE", // スウェーデン
  SDN: "SDN", // スーダン
  SJM: "SJM", // スヴァールバル諸島およびヤンマイエン島
  ESP: "ESP", // スペイン
  SUR: "SUR", // スリナム
  LKA: "LKA", // スリランカ
  SVK: "SVK", // スロバキア
  SVN: "SVN", // スロベニア
  SYC: "SYC", // セーシェル
  GNQ: "GNQ", // 赤道ギニア
  SEN: "SEN", // セネガル
  SRB: "SRB", // セルビア
  KNA: "KNA", // セントクリストファー・ネイビス
  VCT: "VCT", // セントビンセント・グレナディーン
  SHN: "SHN", // セントヘレナ・アセンションおよびトリスタンダクーニャ
  LCA: "LCA", // セントルシア
  SOM: "SOM", // ソマリア
  SLB: "SLB", // ソロモン諸島
  TCA: "TCA", // タークス・カイコス諸島
  THA: "THA", // タイ
  KOR: "KOR", // 大韓民国
  TWN: "TWN", // 台湾（中華民国）
  TJK: "TJK", // タジキスタン
  TZA: "TZA", // タンザニア
  CZE: "CZE", // チェコ
  TCD: "TCD", // チャド
  CAF: "CAF", // 中央アフリカ共和国
  CHN: "CHN", // 中華人民共和国
  TUN: "TUN", // チュニジア
  PRK: "PRK", // 朝鮮民主主義人民共和国
  CHL: "CHL", // チリ
  TUV: "TUV", // ツバル
  DNK: "DNK", // デンマーク
  DEU: "DEU", // ドイツ
  TGO: "TGO", // トーゴ
  TKL: "TKL", // トケラウ
  DOM: "DOM", // ドミニカ共和国
  DMA: "DMA", // ドミニカ国
  TTO: "TTO", // トリニダード・トバゴ
  TKM: "TKM", // トルクメニスタン
  TUR: "TUR", // トルコ
  TON: "TON", // トンガ
  NGA: "NGA", // ナイジェリア
  NRU: "NRU", // ナウル
  NAM: "NAM", // ナミビア
  ATA: "ATA", // 南極
  NIU: "NIU", // ニウエ
  NIC: "NIC", // ニカラグア
  NER: "NER", // ニジェール
  JPN: "JPN", // 日本
  ESH: "ESH", // 西サハラ
  NCL: "NCL", // ニューカレドニア
  NZL: "NZL", // ニュージーランド
  NPL: "NPL", // ネパール
  NFK: "NFK", // ノーフォーク島
  NOR: "NOR", // ノルウェー
  HMD: "HMD", // ハード島とマクドナルド諸島
  BHR: "BHR", // バーレーン
  HTI: "HTI", // ハイチ
  PAK: "PAK", // パキスタン
  VAT: "VAT", // バチカン市国
  PAN: "PAN", // パナマ
  VUT: "VUT", // バヌアツ
  BHS: "BHS", // バハマ
  PNG: "PNG", // パプアニューギニア
  BMU: "BMU", // バミューダ
  PLW: "PLW", // パラオ
  PRY: "PRY", // パラグアイ
  BRB: "BRB", // バルバドス
  PSE: "PSE", // パレスチナ
  HUN: "HUN", // ハンガリー
  BGD: "BGD", // バングラデシュ
  TLS: "TLS", // 東ティモール
  PCN: "PCN", // ピトケアン
  FJI: "FJI", // フィジー
  PHL: "PHL", // フィリピン
  FIN: "FIN", // フィンランド
  BTN: "BTN", // ブータン
  BVT: "BVT", // ブーベ島
  PRI: "PRI", // プエルトリコ
  FRO: "FRO", // フェロー諸島
  FLK: "FLK", // フォークランド（マルビナス）諸島
  BRA: "BRA", // ブラジル
  FRA: "FRA", // フランス
  GUF: "GUF", // フランス領ギアナ
  PYF: "PYF", // フランス領ポリネシア
  ATF: "ATF", // フランス領南方・南極地域
  BGR: "BGR", // ブルガリア
  BFA: "BFA", // ブルキナファソ
  BRN: "BRN", // ブルネイ・ダルサラーム
  BDI: "BDI", // ブルンジ
  VNM: "VNM", // ベトナム
  BEN: "BEN", // ベナン
  VEN: "VEN", // ベネズエラ・ボリバル共和国
  BLR: "BLR", // ベラルーシ
  BLZ: "BLZ", // ベリーズ
  PER: "PER", // ペルー
  BEL: "BEL", // ベルギー
  POL: "POL", // ポーランド
  BIH: "BIH", // ボスニア・ヘルツェゴビナ
  BWA: "BWA", // ボツワナ
  BES: "BES", // ボネール、シント・ユースタティウスおよびサバ
  BOL: "BOL", // ボリビア多民族国
  PRT: "PRT", // ポルトガル
  HKG: "HKG", // 香港
  HND: "HND", // ホンジュラス
  MHL: "MHL", // マーシャル諸島
  MAC: "MAC", // マカオ
  MDG: "MDG", // マダガスカル
  MYT: "MYT", // マヨット
  MWI: "MWI", // マラウイ
  MLI: "MLI", // マリ
  MLT: "MLT", // マルタ
  MTQ: "MTQ", // マルティニーク
  MYS: "MYS", // マレーシア
  IMN: "IMN", // マン島
  FSM: "FSM", // ミクロネシア連邦
  ZAF: "ZAF", // 南アフリカ
  SSD: "SSD", // 南スーダン
  MMR: "MMR", // ミャンマー
  MEX: "MEX", // メキシコ
  MUS: "MUS", // モーリシャス
  MRT: "MRT", // モーリタニア
  MOZ: "MOZ", // モザンビーク
  MCO: "MCO", // モナコ
  MDV: "MDV", // モルディブ
  MDA: "MDA", // モルドバ共和国
  MAR: "MAR", // モロッコ
  MNG: "MNG", // モンゴル
  MNE: "MNE", // モンテネグロ
  MSR: "MSR", // モントセラト
  JOR: "JOR", // ヨルダン
  LAO: "LAO", // ラオス人民民主共和国
  LVA: "LVA", // ラトビア
  LTU: "LTU", // リトアニア
  LBY: "LBY", // リビア
  LIE: "LIE", // リヒテンシュタイン
  LBR: "LBR", // リベリア
  ROU: "ROU", // ルーマニア
  LUX: "LUX", // ルクセンブルク
  RWA: "RWA", // ルワンダ
  LSO: "LSO", // レソト
  LBN: "LBN", // レバノン
  REU: "REU", // レユニオン
  RUS: "RUS", // ロシア連邦
})

export const COUNTRY_NAME_BY_CODE = Object.freeze({
  "ISL": "アイスランド",
  "IRL": "アイルランド",
  "AZE": "アゼルバイジャン",
  "AFG": "アフガニスタン",
  "USA": "アメリカ合衆国",
  "VIR": "アメリカ領ヴァージン諸島",
  "ASM": "アメリカ領サモア",
  "ARE": "アラブ首長国連邦",
  "DZA": "アルジェリア",
  "ARG": "アルゼンチン",
  "ABW": "アルバ",
  "ALB": "アルバニア",
  "ARM": "アルメニア",
  "AIA": "アンギラ",
  "AGO": "アンゴラ",
  "ATG": "アンティグア・バーブーダ",
  "AND": "アンドラ",
  "YEM": "イエメン",
  "GBR": "イギリス",
  "IOT": "イギリス領インド洋地域",
  "VGB": "イギリス領ヴァージン諸島",
  "ISR": "イスラエル",
  "ITA": "イタリア",
  "IRQ": "イラク",
  "IRN": "イラン・イスラム共和国",
  "IND": "インド",
  "IDN": "インドネシア",
  "WLF": "ウォリス・フツナ",
  "UGA": "ウガンダ",
  "UKR": "ウクライナ",
  "UZB": "ウズベキスタン",
  "URY": "ウルグアイ",
  "ECU": "エクアドル",
  "EGY": "エジプト",
  "EST": "エストニア",
  "SWZ": "エスワティニ",
  "ETH": "エチオピア",
  "ERI": "エリトリア",
  "SLV": "エルサルバドル",
  "AUS": "オーストラリア",
  "AUT": "オーストリア",
  "ALA": "オーランド諸島",
  "OMN": "オマーン",
  "NLD": "オランダ",
  "GHA": "ガーナ",
  "CPV": "カーボベルデ",
  "GGY": "ガーンジー",
  "GUY": "ガイアナ",
  "KAZ": "カザフスタン",
  "QAT": "カタール",
  "UMI": "合衆国領有小離島",
  "CAN": "カナダ",
  "GAB": "ガボン",
  "CMR": "カメルーン",
  "GMB": "ガンビア",
  "KHM": "カンボジア",
  "MKD": "北マケドニア",
  "MNP": "北マリアナ諸島",
  "GIN": "ギニア",
  "GNB": "ギニアビサウ",
  "CYP": "キプロス",
  "CUB": "キューバ",
  "CUW": "キュラソー",
  "GRC": "ギリシャ",
  "KIR": "キリバス",
  "KGZ": "キルギス",
  "GTM": "グアテマラ",
  "GLP": "グアドループ",
  "GUM": "グアム",
  "KWT": "クウェート",
  "COK": "クック諸島",
  "GRL": "グリーンランド",
  "CXR": "クリスマス島",
  "GRD": "グレナダ",
  "HRV": "クロアチア",
  "CYM": "ケイマン諸島",
  "KEN": "ケニア",
  "CIV": "コートジボワール",
  "CCK": "ココス（キーリング）諸島",
  "CRI": "コスタリカ",
  "COM": "コモロ",
  "COL": "コロンビア",
  "COG": "コンゴ共和国",
  "COD": "コンゴ民主共和国",
  "SAU": "サウジアラビア",
  "SGS": "サウスジョージア・サウスサンドウィッチ諸島",
  "WSM": "サモア",
  "STP": "サントメ・プリンシペ",
  "BLM": "サン・バルテルミー",
  "ZMB": "ザンビア",
  "SPM": "サンピエール島・ミクロン島",
  "SMR": "サンマリノ",
  "MAF": "サン・マルタン（フランス領）",
  "SLE": "シエラレオネ",
  "DJI": "ジブチ",
  "GIB": "ジブラルタル",
  "JEY": "ジャージー",
  "JAM": "ジャマイカ",
  "GEO": "ジョージア",
  "SYR": "シリア・アラブ共和国",
  "SGP": "シンガポール",
  "SXM": "シント・マールテン（オランダ領）",
  "ZWE": "ジンバブエ",
  "CHE": "スイス",
  "SWE": "スウェーデン",
  "SDN": "スーダン",
  "SJM": "スヴァールバル諸島およびヤンマイエン島",
  "ESP": "スペイン",
  "SUR": "スリナム",
  "LKA": "スリランカ",
  "SVK": "スロバキア",
  "SVN": "スロベニア",
  "SYC": "セーシェル",
  "GNQ": "赤道ギニア",
  "SEN": "セネガル",
  "SRB": "セルビア",
  "KNA": "セントクリストファー・ネイビス",
  "VCT": "セントビンセント・グレナディーン",
  "SHN": "セントヘレナ・アセンションおよびトリスタンダクーニャ",
  "LCA": "セントルシア",
  "SOM": "ソマリア",
  "SLB": "ソロモン諸島",
  "TCA": "タークス・カイコス諸島",
  "THA": "タイ",
  "KOR": "大韓民国",
  "TWN": "台湾（中華民国）",
  "TJK": "タジキスタン",
  "TZA": "タンザニア",
  "CZE": "チェコ",
  "TCD": "チャド",
  "CAF": "中央アフリカ共和国",
  "CHN": "中華人民共和国",
  "TUN": "チュニジア",
  "PRK": "朝鮮民主主義人民共和国",
  "CHL": "チリ",
  "TUV": "ツバル",
  "DNK": "デンマーク",
  "DEU": "ドイツ",
  "TGO": "トーゴ",
  "TKL": "トケラウ",
  "DOM": "ドミニカ共和国",
  "DMA": "ドミニカ国",
  "TTO": "トリニダード・トバゴ",
  "TKM": "トルクメニスタン",
  "TUR": "トルコ",
  "TON": "トンガ",
  "NGA": "ナイジェリア",
  "NRU": "ナウル",
  "NAM": "ナミビア",
  "ATA": "南極",
  "NIU": "ニウエ",
  "NIC": "ニカラグア",
  "NER": "ニジェール",
  "JPN": "日本",
  "ESH": "西サハラ",
  "NCL": "ニューカレドニア",
  "NZL": "ニュージーランド",
  "NPL": "ネパール",
  "NFK": "ノーフォーク島",
  "NOR": "ノルウェー",
  "HMD": "ハード島とマクドナルド諸島",
  "BHR": "バーレーン",
  "HTI": "ハイチ",
  "PAK": "パキスタン",
  "VAT": "バチカン市国",
  "PAN": "パナマ",
  "VUT": "バヌアツ",
  "BHS": "バハマ",
  "PNG": "パプアニューギニア",
  "BMU": "バミューダ",
  "PLW": "パラオ",
  "PRY": "パラグアイ",
  "BRB": "バルバドス",
  "PSE": "パレスチナ",
  "HUN": "ハンガリー",
  "BGD": "バングラデシュ",
  "TLS": "東ティモール",
  "PCN": "ピトケアン",
  "FJI": "フィジー",
  "PHL": "フィリピン",
  "FIN": "フィンランド",
  "BTN": "ブータン",
  "BVT": "ブーベ島",
  "PRI": "プエルトリコ",
  "FRO": "フェロー諸島",
  "FLK": "フォークランド（マルビナス）諸島",
  "BRA": "ブラジル",
  "FRA": "フランス",
  "GUF": "フランス領ギアナ",
  "PYF": "フランス領ポリネシア",
  "ATF": "フランス領南方・南極地域",
  "BGR": "ブルガリア",
  "BFA": "ブルキナファソ",
  "BRN": "ブルネイ・ダルサラーム",
  "BDI": "ブルンジ",
  "VNM": "ベトナム",
  "BEN": "ベナン",
  "VEN": "ベネズエラ・ボリバル共和国",
  "BLR": "ベラルーシ",
  "BLZ": "ベリーズ",
  "PER": "ペルー",
  "BEL": "ベルギー",
  "POL": "ポーランド",
  "BIH": "ボスニア・ヘルツェゴビナ",
  "BWA": "ボツワナ",
  "BES": "ボネール、シント・ユースタティウスおよびサバ",
  "BOL": "ボリビア多民族国",
  "PRT": "ポルトガル",
  "HKG": "香港",
  "HND": "ホンジュラス",
  "MHL": "マーシャル諸島",
  "MAC": "マカオ",
  "MDG": "マダガスカル",
  "MYT": "マヨット",
  "MWI": "マラウイ",
  "MLI": "マリ",
  "MLT": "マルタ",
  "MTQ": "マルティニーク",
  "MYS": "マレーシア",
  "IMN": "マン島",
  "FSM": "ミクロネシア連邦",
  "ZAF": "南アフリカ",
  "SSD": "南スーダン",
  "MMR": "ミャンマー",
  "MEX": "メキシコ",
  "MUS": "モーリシャス",
  "MRT": "モーリタニア",
  "MOZ": "モザンビーク",
  "MCO": "モナコ",
  "MDV": "モルディブ",
  "MDA": "モルドバ共和国",
  "MAR": "モロッコ",
  "MNG": "モンゴル",
  "MNE": "モンテネグロ",
  "MSR": "モントセラト",
  "JOR": "ヨルダン",
  "LAO": "ラオス人民民主共和国",
  "LVA": "ラトビア",
  "LTU": "リトアニア",
  "LBY": "リビア",
  "LIE": "リヒテンシュタイン",
  "LBR": "リベリア",
  "ROU": "ルーマニア",
  "LUX": "ルクセンブルク",
  "RWA": "ルワンダ",
  "LSO": "レソト",
  "LBN": "レバノン",
  "REU": "レユニオン",
  "RUS": "ロシア連邦",
})

export const AVALIABLE_COUNTRY_CODES: readonly CountryCode[] = Object.freeze([
  "JPN",
  "CHN",
  "VNM",
  "NPL",
  "KOR",
  "IDN",
  "TWN",
  "LKA",
  "MMR",
  "BGD",
  "MNG",
])

export const imgFlagByAvailableCountryCodes = Object.freeze({
		"JPN": "/src/assets/flags/jp.svg",
		"CHN": "/src/assets/flags/cn.svg",
		"VNM": "/src/assets/flags/vn.png",
		"NPL": "/src/assets/flags/np.svg",
		"KOR": "/src/assets/flags/kr.svg",
		"IDN": "/src/assets/flags/id.svg",
		"TWN": "/src/assets/flags/taiwan.png",
		"LKA": "/src/assets/flags/lk.svg",
		"MMR": "/src/assets/flags/mm.svg",
		"BGD": "/src/assets/flags/bd.svg",
		"MNG": "/src/assets/flags/mn.svg",
	}
)

export type AvailableCountryCode = keyof typeof imgFlagByAvailableCountryCodes;

export const getFlagImageByAvailableCountryCodes = (countryCode: AvailableCountryCode): string => {
  return imgFlagByAvailableCountryCodes[countryCode];
};

