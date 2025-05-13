import { InjectRepository } from '@nestjs/typeorm';
import { PostSchema } from '../schemas/post.schema';
import { DeepPartial, In, IsNull, Repository } from 'typeorm';
import { CreatePostDTO } from '../dto/create-post.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserSchema } from 'src/user/schemas/user.schema';
import { PostMetadataSchema } from '../schemas/post-metadata.schema';
import { PostDTO } from '../dto/post.dto';
import { SearchPostDTO } from '../dto/search-post.dto';
import { PostTagSchema } from 'src/post-tag/schemas/post-tag.schema';
import { Post } from '../domain/post.entity';
import { PostTag } from 'src/post-tag/entities/post-tag.entity';
import { PostMapper } from '../mappers/post-mapper';
import { PostMetadata } from '../domain/post-metadata.entity';

export class PostRepository {
  constructor(
    @InjectRepository(PostSchema)
    private ormPostRepo: Repository<PostSchema>,

    @InjectRepository(PostMetadataSchema)
    private ormMetadataRepo: Repository<PostMetadataSchema>,
  ) {}

  async create(post: Post): Promise<string> {
    const ormPost = this._toORM(post);
    const saved = await this.ormPostRepo.save(ormPost);
    return saved.id;
  }

  async update(post: Post): Promise<void> {
    const ormPost = this._toORM(post);
    await this.ormPostRepo.save(ormPost);
  }

  async findAll(dto: SearchPostDTO): Promise<PostDTO[]> {
    const query = this.ormPostRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.metadata', 'metadata')
      .leftJoinAndSelect('post.tags', 'tags');

    if (dto.search) {
      query.andWhere('post.title ILIKE :search OR post.content ILIKE :search', {
        search: `%${dto.search}%`,
      });
    }

    if (dto.authorId) {
      query.andWhere('author.id = :authorId', { authorId: dto.authorId });
    }

    if (dto.tags?.length) {
      query.andWhere('tags.name IN (:...tags)', { tags: dto.tags });
    }

    const posts = await query.getMany();

    if (posts.length === 0) {
      return [];
    }

    return posts.map((p) => PostMapper.toDTO(this._toDomain(p) as Post));
  }

  async findById(id: string): Promise<Post | null> {
    const ormPost = await this.ormPostRepo.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['author', 'metadata', 'tags'],
    });

    if (!ormPost) {
      return null;
    }

    return this._toDomain(ormPost);
  }

  async findPostAuthorId(postId: string): Promise<string | null> {
    const post = await this.ormPostRepo.findOne({
      where: { id: postId, deletedAt: IsNull() },
      relations: ['author'],
    });

    if (!post) {
      return null;
    }

    return post.author.id;
  }

  async delete(id: string): Promise<void> {
    await this.ormPostRepo.update(id, {
      deletedAt: new Date(),
    });
  }

  private _toORM(post: Post): PostSchema {
    return this.ormPostRepo.create({
      id: post.id ?? undefined,
      author: { id: post.authorId },
      title: post.title,
      content: post.content,
      tags: post.tags.map((t) => ({ id: t.id as string })),
      metadata: this.ormMetadataRepo.create({
        id: post.metadata.id ?? undefined,
        views: post.metadata.views,
        wordCount: post.metadata.wordCount,
      }),
      createdAt: post.createdAt ?? undefined,
      updatedAt: post.updatedAt ?? undefined,
    } as DeepPartial<PostSchema>);
  }

  private _toDomain(ormEntity: PostSchema): Post | null {
    return Post.restore({
      id: ormEntity.id,
      title: ormEntity.title,
      content: ormEntity.content,
      authorId: ormEntity.author.id,
      tags: ormEntity.tags.map((t) => PostTag.restore(t)),
      createdAt: ormEntity.createdAt,
      updatedAt: ormEntity.updatedAt,
      metadata: PostMetadata.restore({
        id: ormEntity.metadata.id,
        views: ormEntity.metadata.views,
        wordCount: ormEntity.metadata.wordCount,
      }),
    });
  }
}
