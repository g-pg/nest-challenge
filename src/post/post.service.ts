import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { CreatePostDTO } from './dto/create-post.dto';
import { UpdatePostDto as UpdatePostDTO } from './dto/update-post.dto';
import { PostRepository } from './infra/post.repository';
import { SearchPostDTO } from './dto/search-post.dto';
import { PostDTO } from './dto/post.dto';
import { PostTagRepository } from 'src/post-tag/infra/post-tag.repository';
import { Post } from './domain/post.entity';
import { PostMapper } from './mappers/post-mapper';
import { PostTag } from 'src/post-tag/entities/post-tag.entity';

@Injectable()
export class PostService {
  constructor(
    private postRepository: PostRepository,
    private tagsRepository: PostTagRepository,
  ) {}

  async create(dto: CreatePostDTO, userId: string): Promise<string> {
    let tags: PostTag[] = [];
    if (dto.tagIds) {
      tags = await this._checkAndMapExistingTags(dto.tagIds);
    }

    const post = Post.create({ ...dto, authorId: userId, tags });
    return await this.postRepository.create(post);
  }

  async getAll(dto: SearchPostDTO): Promise<PostDTO[]> {
    const posts = await this.postRepository.findAll(dto);
    return posts.map((p) => PostMapper.toDTO(p));
  }

  async findOneById(id: string): Promise<PostDTO> {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return PostMapper.toDTO(post);
  }

  async update(id: string, dto: UpdatePostDTO): Promise<void> {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    let tags: PostTag[] = post.tags;

    if (dto.tagIds) {
      tags = await this._checkAndMapExistingTags(dto.tagIds);
    }

    post.update({ ...dto, tags });
    await this.postRepository.update(post);
  }

  async remove(id: string): Promise<void> {
    return await this.postRepository.delete(id);
  }

  private async _checkAndMapExistingTags(tagIds: string[]): Promise<PostTag[]> {
    if (tagIds.length === 0) {
      return [];
    }

    const mappedTags = await this.tagsRepository.findManyByIds(tagIds);

    // TODO: Create an algorithm to return the non-existing tags on the error
    if (mappedTags.length !== tagIds.length) {
      throw new BadRequestException('One or more tags were not found');
    }

    return mappedTags;
  }
}
