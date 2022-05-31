// import * as multer from "multer";
// import * as path from "path";
// import * as fs from "fs";
// import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

// // const createFolder = (folder: string) => {
// //   try {
// //     fs.readdirSync("uploads");
// //   } catch (err) {
// //     console.error("uploads파일이 없으므로 파일을 만듭니다.");
// //     fs.mkdirSync("uploads");
// //   }
// // };

// const createFolder = (folder: string) => {
//   try {
//     console.log("💾 Create a root uploads folder...");

//     fs.mkdirSync(path.join(__dirname, "..", `uploads`));
//   } catch (error) {
//     console.log("The upload folder already exists...");
//   }

//   try {
//     console.log(`💾 Create a ${folder} uploads folder...`);

//     fs.mkdirSync(path.join(__dirname, "..", `uploads/${folder}`));
//   } catch (error) {
//     console.log(`The ${folder} folder already exists...`);
//   }
// };

// const storage = (folder: string): multer.StorageEngine => {
//   createFolder(folder);

//   return multer.diskStorage({
//     destination(req, file, cb) {
//       //* 어디에 저장할 지

//       const folderName = path.join(__dirname, "..", `uploads/${folder}`);

//       cb(null, folderName);
//     },

//     filename(req, file, cb) {
//       //* 어떤 이름으로 올릴 지

//       const ext: string = path.extname(file.originalname);

//       const fileName = `${path.basename(
//         file.originalname,
//         ext,
//       )}${Date.now()}${ext}`;

//       cb(null, fileName);
//     },
//   });
// };

// export const multerOptions = (folder: string) => {
//   const result: MulterOptions = {
//     storage: storage(folder),
//   };

//   return result;
// };

// console.log(multerOptions("image"));

import { Logger } from "@nestjs/common";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

import * as fs from "fs";
import * as path from "path";
import * as multer from "multer";

export class MulterOption {
  constructor(private readonly folder: string) {}

  private readonly logger = new Logger();

  createFolder(folder: string) {
    try {
      this.logger.log("uploads 폴더를 생성합니다.");
      fs.mkdirSync(path.join(__dirname, "..", "uploads"));
    } catch (err) {
      this.logger.log("uploads 폴더가 이미 존재합니다.");
    }

    try {
      this.logger.log(`uploads 폴더안에 ${folder}폴더 를 생성합니다.`);
      fs.mkdirSync(path.join(__dirname, "..", `uploads/${folder}`));
    } catch (err) {
      this.logger.log(`${folder} 폴더가 이미 존재합니다.`);
    }
  }

  storage(folder: string): multer.StorageEngine {
    this.createFolder(folder);

    return multer.diskStorage({
      destination(req, file, cb) {
        const folderName = path.join(__dirname, "..", `/uploads/${folder}`);

        cb(null, folderName);
      },
      filename(req, file, cb) {
        const ext: string = path.extname(file.originalname);

        const fileName = `${path.basename(
          file.originalname,
          ext,
        )}${Date.now()}${ext}`;

        cb(null, fileName);
      },
    });
  }

  apply() {
    const result: MulterOptions = {
      storage: this.storage(this.folder),
    };
    return result;
  }
}

const test = new MulterOption("image");
console.log(test.apply());
