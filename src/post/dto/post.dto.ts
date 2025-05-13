export class PostDTO {
  id: string;
  title: string;
  content: string;
  authorId: string;
  tags: {
    id: string;
    name: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
  wordCount: number;
}
