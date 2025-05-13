import { In, Repository } from 'typeorm';
import { PostTagSchema } from '../schemas/post-tag.schema';
import { InjectRepository } from '@nestjs/typeorm';
import { PostTag } from '../entities/post-tag.entity';
import { NotFoundException } from '@nestjs/common';

export class PostTagRepository {
  constructor(
    @InjectRepository(PostTagSchema)
    private ormTagRepo: Repository<PostTagSchema>,
  ) {}

  async save(tag: PostTag): Promise<string> {
    const ormEntity = this._toOrmEntity(tag);
    const savedTag = await this.ormTagRepo.save(ormEntity);
    return savedTag.id;
  }

  async existsByName(name: string): Promise<boolean> {
    const tag = await this.ormTagRepo.findOne({
      where: { name },
    });

    return !!tag;
  }

  async findAll(): Promise<PostTag[]> {
    const tags = await this.ormTagRepo.find();
    return tags.map((t) => PostTag.restore(t));
  }

  async findManyByIds(ids: string[]): Promise<PostTag[]> {
    const tags = await this.ormTagRepo.find({
      where: {
        id: In(ids),
      },
    });

    return tags.map((t) => PostTag.restore(t));
  }

  async delete(id: string): Promise<void> {
    const tag = await this.ormTagRepo.findOne({
      where: { id },
      relations: ['posts'],
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    tag.posts = [];

    await this.ormTagRepo.save(tag);
    await this.ormTagRepo.remove(tag);
  }

  private _toOrmEntity(tag: PostTag): PostTagSchema {
    const ormEntity = this.ormTagRepo.create({ name: tag.name });
    return ormEntity;
  }
}
