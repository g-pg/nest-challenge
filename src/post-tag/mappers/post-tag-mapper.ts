import { PostTagDTO } from '../dto/post-tag.dto';
import { PostTag } from '../entities/post-tag.entity';

export class PostTagMapper {
  static toDTO(tag: PostTag): PostTagDTO {
    return {
      id: tag.id as string,
      name: tag.name,
    };
  }
}
