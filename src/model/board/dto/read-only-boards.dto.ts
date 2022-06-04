export class ReadOnlyBoardsDto {
  id: string;
  title: string;
  author: string;
  description: string;
  isPublic: boolean;
  imgUrls?: Array<string>;
}
