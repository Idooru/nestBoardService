import { Logger, CanActivate, Injectable } from "@nestjs/common";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

export class Test {
  constructor(private readonly folderName: string) {}

  print() {
    const result: MulterOptions = {};
    return result;
  }
}
