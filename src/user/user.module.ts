import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserRepository } from './infra/user-repository';
import { PostSchema } from 'src/post/schemas/post.schema';

@Module({
  imports: [TypeOrmModule.forFeature([UserSchema, PostSchema])],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
