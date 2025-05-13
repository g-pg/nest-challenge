import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO } from 'src/auth/dto/sign-in.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: 'Sign in to the application',
  })
  @ApiResponse({
    status: 200,
    example: {
      token: 'jwt-token',
    },
  })
  @Post('login')
  signIn(@Body() dto: SignInDTO) {
    return this.authService.signIn(dto);
  }
}
