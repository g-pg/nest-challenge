import { IsEnum, IsString } from 'class-validator';
import { UserRole } from '../domain/user-role';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRoleDTO {
  @ApiProperty({
    description: 'The role of the user',
    example: 'reader',
  })
  @IsString()
  @IsEnum(UserRole)
  role: UserRole;
}
