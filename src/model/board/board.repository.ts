import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Board } from "./schemas/board.schema";
import { Model } from "mongoose";
import { CreateBoardDto } from "./dto/create-board.dto";
import { UpdateBoardDto } from "./dto/update-board.dto";

@Injectable()
export class BoardRepository {
  constructor(
    @InjectModel("Board") private readonly boardModel: Model<Board>,
  ) {}

  public async findBoardWithId(id: string): Promise<Board> {
    return await this.boardModel.findById(id);
  }

  public async findBoards(): Promise<Board[]> {
    return await this.boardModel.find({});
  }

  public async existBoardId(id: string): Promise<boolean> {
    return await this.boardModel.exists({ id });
  }

  public async existBoardTitle(title: string): Promise<boolean> {
    return await this.boardModel.exists({ title });
  }

  public async create(board: CreateBoardDto): Promise<Board> {
    return await this.boardModel.create(board);
  }

  public async update(id: string, board: UpdateBoardDto): Promise<void> {
    await this.boardModel.updateOne({ _id: id }, board);
  }

  public async delete(id: string): Promise<void> {
    await this.boardModel.deleteOne({ _id: id });
  }
}
