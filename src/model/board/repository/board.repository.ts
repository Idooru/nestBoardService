import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Board } from "../schemas/board.schema";
import { Model } from "mongoose";
import { BoardCreateDto } from "../dto/board-create.dto";
import { BoardUpdateDto } from "../dto/board-update-dto";
import { Types } from "mongoose";
import { CommentSchema } from "src/model/comment/schemas/comment.schema";

import * as mongoose from "mongoose";

@Injectable()
export class BoardRepository {
  constructor(
    @InjectModel("Board") readonly boardModel: Model<Board>,
    @InjectModel("Comment") readonly commentModel: Model<Comment>,
  ) {}

  async findBoardWithId(id: string | Types.ObjectId): Promise<Board> {
    return await this.boardModel.findById(id);
  }

  async findBoardsWithName(name: string): Promise<Board[]> {
    return await this.boardModel.find().where("author").equals(name);
  }

  async findBoards(): Promise<Board[]> {
    const CommentModel = mongoose.model("comments", CommentSchema);
    return await this.boardModel.find({}).populate("CommentList", CommentModel);
  }

  async existBoardId(id: string | Types.ObjectId): Promise<boolean> {
    return await this.boardModel.exists({ _id: id });
  }

  async existBoardTitle(title: string): Promise<boolean> {
    return await this.boardModel.exists({ title });
  }

  async create(board: BoardCreateDto): Promise<Board> {
    return await this.boardModel.create(board);
  }

  async update(
    id: string | Types.ObjectId,
    board: BoardUpdateDto,
  ): Promise<void> {
    await this.boardModel.updateOne({ _id: id }, board);
  }

  async delete(id: string | Types.ObjectId): Promise<void> {
    await this.boardModel.deleteOne({ _id: id });
  }

  async deleteBoards(name: string): Promise<void> {
    await this.boardModel.deleteMany().where("author").equals(name);
  }
}
