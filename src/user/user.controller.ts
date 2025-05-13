import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from './domain/user-role';
import { UpdateUserRoleDTO } from './dto/update-user-role.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({
    summary: 'Create a new user',
  })
  @Post()
  async create(@Body() dto: CreateUserDTO) {
    await this.userService.create(dto);
    return HttpStatus.CREATED;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Update user role (admin only)',
  })
  @Post('/:id/update-role')
  async getAll(@Param('id') id: string, @Body() dto: UpdateUserRoleDTO) {
    return await this.userService.updateUserRole(id, dto);
  }
}
