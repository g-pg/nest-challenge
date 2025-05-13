import { Injectable, Post, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDTO } from 'src/auth/dto/sign-in.dto';
import { UserService } from 'src/user/user.service';
import { JWTPayload } from './interfaces/jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(dto: SignInDTO): Promise<{ token: string }> {
    const user = await this.userService.getByUsername(dto.username);

    if (!user) {
      throw new UnauthorizedException('Incorrect username or password');
    }

    const isValidPassword = await user.password.compare(dto.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Incorrect username or password');
    }

    const payload: JWTPayload = {
      userId: user.id as string,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
    };
  }
}
