import { Logger } from "@nestjs/common";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

import * as fs from "fs";
import * as path from "path";
import * as multer from "multer";

export class MulterOperation {
  constructor(private readonly folder: string) {}

  private readonly logger = new Logger("Multer");

  createFolder(folder: string) {
    try {
      this.logger.log("uploads 폴더를 생성합니다.");
      fs.mkdirSync(path.join(__dirname, "../../../uploads"));
    } catch (err) {
      this.logger.log("uploads 폴더가 이미 존재합니다.");
    }

    try {
      this.logger.log(`uploads 폴더안에 ${folder}폴더 를 생성합니다.`);
      fs.mkdirSync(path.join(__dirname, `../../../uploads/${folder}`));
    } catch (err) {
      this.logger.log(`${folder} 폴더가 이미 존재합니다.`);
    }
  }

  storage(folder: string): multer.StorageEngine {
    this.createFolder(folder);

    return multer.diskStorage({
      destination(req, file, cb) {
        const folderName = path.join(__dirname, `../../../uploads/${folder}`);

        cb(null, folderName);
      },
      filename(req, file, cb) {
        const ext: string = path.extname(file.originalname);

        const fileName = `${path.basename(
          file.originalname,
          ext,
        )}-${Date.now()}${ext}`;

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
