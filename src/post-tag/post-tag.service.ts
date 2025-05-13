import { ConflictException, Injectable } from '@nestjs/common';
import { CreatePostTagDTO } from './dto/create-post-tag.dto';
import { PostTag } from './entities/post-tag.entity';
import { PostTagRepository } from './infra/post-tag.repository';
import { PostTagMapper } from './mappers/post-tag-mapper';
import { PostTagDTO } from './dto/post-tag.dto';

@Injectable()
export class PostTagService {
  constructor(private postTagRepository: PostTagRepository) {}

  async create(dto: CreatePostTagDTO) {
    const existingTag = await this.postTagRepository.existsByName(dto.name);
    if (existingTag) {
      throw new ConflictException(`Tag ${dto.name} already exists`);
    }
    const tag = PostTag.create({ name: dto.name });
    return await this.postTagRepository.save(tag);
  }

  async findAll(): Promise<PostTagDTO[]> {
    const tags = await this.postTagRepository.findAll();
    return tags.map((t) => PostTagMapper.toDTO(t));
  }

  async delete(id: string): Promise<void> {
    return await this.postTagRepository.delete(id);
  }
}
