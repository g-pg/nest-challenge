import { Module } from '@nestjs/common';
import { PostTagService } from './post-tag.service';
import { PostTagController } from './post-tag.controller';
import { PostTagRepository } from './infra/post-tag.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostTagSchema } from './schemas/post-tag.schema';

@Module({
  imports: [TypeOrmModule.forFeature([PostTagSchema])],
  controllers: [PostTagController],
  providers: [PostTagService, PostTagRepository],
  exports: [PostTagService, PostTagRepository],
})
export class PostTagModule {}
