import fs from 'fs-extra'
import { Command } from 'commander'
import imagemin from 'imagemin'
import imageminPngquant from 'imagemin-pngquant'
import path from 'path'

const program = new Command();

program
  .option('-i, --input <inputDir>', 'Input directory')
  .option('-o, --output <outputDir>', 'Output directory')
  .parse(process.argv);

const options = program.opts();

if (!options.input || !options.output) {
  console.error('Input and output directories are required.');
  process.exit(1);
}

const compressPngImages = async (inputDir, outputDir) => {
  try {
    // 入力ディレクトリが存在するか確認
    if (!fs.existsSync(inputDir)) {
      console.error(`Input directory "${inputDir}" does not exist.`);
      process.exit(1);
    }

    // 出力ディレクトリを作成
    fs.ensureDirSync(outputDir);

    // ディレクトリ内のファイルを取得
    const files = fs.readdirSync(inputDir).filter(file => file.endsWith('.png'));

    if (files.length === 0) {
      console.log('No PNG images found in the input directory.');
      return;
    }

    console.log(`Compressing ${files.length} PNG images...`);

    for (const file of files) {
      const inputFilePath = path.join(inputDir, file);
      const outputFilePath = path.join(outputDir, file);

      // 圧縮処理
      const compressedImages = await imagemin([inputFilePath], {
        destination: outputDir,
        plugins: [
          imageminPngquant({
            quality: [0.6, 0.8], // 圧縮品質の範囲を指定
          }),
        ],
      });

      console.log(`Compressed: ${inputFilePath} -> ${outputFilePath}`);
    }

    console.log('Compression complete.');
  } catch (error) {
    console.error('Error during compression:', error);
  }
};

// 実行
compressPngImages(options.input, options.output);
