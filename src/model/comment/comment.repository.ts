import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Comment } from "./schemas/comment.schema";
import { Model } from "mongoose";
import { CommentCreateDto } from "./dto/comment-create.dto";

@Injectable()
export class CommentRepository {
  constructor(@InjectModel("Comment") readonly commentModel: Model<Comment>) {}

  async findComments(): Promise<Comment[]> {
    return await this.commentModel.find({});
  }

  async create(commentPayload: CommentCreateDto): Promise<Comment> {
    return await this.commentModel.create(commentPayload);
  }
}
