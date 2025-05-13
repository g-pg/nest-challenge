import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDTO } from './dto/create-post.dto';
import { UpdatePostDto as UpdatePostDTO } from './dto/update-post.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JWTPayload } from 'src/auth/interfaces/jwt-payload';
import { SearchPostDTO } from './dto/search-post.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/user/domain/user-role';
import { RolesGuard } from 'src/auth/roles.guard';
import { PostOwnershipGuard } from './guards/post-ownership.guard';

@ApiTags('Post')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, RolesGuard)
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({
    summary: 'Create a new post',
    description:
      'Creates a new post. \n\n**IMPORTANT**: Tags are optional, but, if included, must be created beforehand and referenced by id.',
  })
  @Roles(UserRole.ADMIN, UserRole.WRITER)
  @HttpCode(201)
  @Post()
  create(@Body() dto: CreatePostDTO, @CurrentUser() user: JWTPayload) {
    return this.postService.create(dto, user.userId);
  }

  @Roles(UserRole.ADMIN, UserRole.WRITER, UserRole.READER)
  @ApiOperation({
    summary: 'Get all posts',
    description: 'Get all posts with optional search parameters',
  })
  @Get()
  getAll(@Query() dto: SearchPostDTO) {
    return this.postService.getAll(dto);
  }

  @Roles(UserRole.ADMIN, UserRole.WRITER)
  @ApiOperation({
    summary: 'Get a post by ID',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOneById(id);
  }

  @Roles(UserRole.ADMIN, UserRole.WRITER)
  @UseGuards(PostOwnershipGuard)
  @ApiOperation({
    summary: 'Update a post by ID',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePostDTO) {
    return this.postService.update(id, dto);
  }

  @Roles(UserRole.ADMIN, UserRole.WRITER)
  @UseGuards(PostOwnershipGuard)
  @ApiOperation({
    summary: 'Soft delete a post by ID',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }
}
