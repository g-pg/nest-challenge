import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PostTagService } from './post-tag.service';
import { CreatePostTagDTO } from './dto/create-post-tag.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/user/domain/user-role';

@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, RolesGuard)
@Controller('post-tag')
export class PostTagController {
  constructor(private readonly postTagService: PostTagService) {}

  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Create a new post tag',
    description: 'Creates a new post tag with the provided name',
  })
  @Post()
  create(@Body() dto: CreatePostTagDTO) {
    return this.postTagService.create(dto);
  }

  @Roles(UserRole.ADMIN, UserRole.WRITER, UserRole.READER)
  @ApiOperation({
    summary: 'Get all post tags',
    description: 'Retrieves a list of all post tags',
  })
  @ApiResponse({
    status: 200,
    description: 'List of post tags',
    example: [
      {
        id: '1',
        name: 'tag',
      },
    ],
  })
  @Get()
  findAll() {
    return this.postTagService.findAll();
  }

  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Deletes a post tag by ID, erasing the relation with posts',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postTagService.delete(id);
  }
}
