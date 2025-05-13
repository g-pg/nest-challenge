import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostSchema } from './schemas/post.schema';
import { PostMetadataSchema } from './schemas/post-metadata.schema';
import { UserSchema } from 'src/user/schemas/user.schema';
import { UserModule } from 'src/user/user.module';
import { PostRepository } from './infra/post.repository';
import { PostTagSchema } from 'src/post-tag/schemas/post-tag.schema';
import { PostTagModule } from 'src/post-tag/post-tag.module';
import { CepModule } from 'src/external/cep/cep.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostSchema,
      PostMetadataSchema,
      PostTagSchema,
      UserSchema,
    ]),
    UserModule,
    AuthModule,
    PostTagModule,
    CepModule,
  ],
  controllers: [PostController],
  providers: [PostService, PostRepository],
  exports: [PostService, PostRepository],
})
export class PostModule {}
