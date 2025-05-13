import { PostTagMapper } from 'src/post-tag/mappers/post-tag-mapper';
import { Post } from '../domain/post.entity';
import { PostDTO } from '../dto/post.dto';

export class PostMapper {
  static toDTO(post: Post): PostDTO {
    return {
      id: post.id as string,
      title: post.title,
      content: post.content,
      authorId: post.authorId,
      tags: post.tags.map((t) => PostTagMapper.toDTO(t)),
      createdAt: post.createdAt as Date,
      updatedAt: post.updatedAt as Date,
      wordCount: post.metadata.wordCount,
    };
  }
}
