import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Comments } from "./schemas/comments.schema";
import { Model } from "mongoose";
import { CommentsCreateDto } from "./dto/comments-create.dto";

@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel("comments") readonly commentsModel: Model<Comments>,
  ) {}

  async findComments(): Promise<Comments[]> {
    return await this.commentsModel.find({});
  }

  async create(commentPayload: CommentsCreateDto): Promise<Comments> {
    return await this.commentsModel.create(commentPayload);
  }
}
