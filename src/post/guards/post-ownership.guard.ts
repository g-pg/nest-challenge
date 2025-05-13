import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PostRepository } from '../infra/post.repository';
import { UserRole } from 'src/user/domain/user-role';

@Injectable()
export class PostOwnershipGuard implements CanActivate {
  constructor(private readonly postRepository: PostRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const postId = request.params.id;

    const authorId = await this.postRepository.findPostAuthorId(postId);

    if (user.role === UserRole.ADMIN) return true;

    if (authorId !== user.id) {
      throw new ForbiddenException('You can only edit your own posts');
    }

    return true;
  }
}
