import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Board } from "../schemas/board.schema";
import { Model } from "mongoose";
import { BoardCreateDto } from "../dto/board-create.dto";
import { BoardUpdateDto } from "../dto/board-update-dto";
import { Comment } from "src/model/comment/schemas/comment.schema";

@Injectable()
export class BoardRepository {
  constructor(@InjectModel("Board") readonly boardModel: Model<Board>) {}

  async findBoardWithId(id: string): Promise<Board> {
    return await this.boardModel.findById(id);
  }

  async findBoardsWithName(name: string): Promise<Board[]> {
    return await this.boardModel.find().where("author").equals(name);
  }

  async findBoards(): Promise<Board[]> {
    return await this.boardModel.find({});
  }

  async existBoardId(id: string): Promise<boolean> {
    return await this.boardModel.exists({ _id: id });
  }

  async existBoardTitle(title: string): Promise<boolean> {
    return await this.boardModel.exists({ title });
  }

  async create(board: BoardCreateDto): Promise<Board> {
    return await this.boardModel.create(board);
  }

  async update(id: string, board: BoardUpdateDto): Promise<void> {
    await this.boardModel.updateOne({ _id: id }, board);
  }

  async delete(id: string): Promise<void> {
    await this.boardModel.deleteOne({ _id: id });
  }

  async deleteBoards(name: string): Promise<void> {
    await this.boardModel.deleteMany().where("author").equals(name);
  }

  async updateComment(id: string, comment: Comment): Promise<void> {
    await this.boardModel.updateOne(
      { _id: id },
      { $set: { comments: comment } },
      { new: true },
    );
  }
}
