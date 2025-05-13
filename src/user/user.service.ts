import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './infra/user-repository';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './domain/user.entity';
import { UserPassword } from './domain/user-password';
import { UserRole } from './domain/user-role';
import { ConfigService } from '@nestjs/config';
import { UpdateUserRoleDTO } from './dto/update-user-role.dto';

@Injectable()
export class UserService {
  constructor(
    private userRepo: UserRepository,
    private configService: ConfigService,
  ) {}

  /**
   * Creates the admin user if it doesn't exist
   */
  async onModuleInit() {
    const existingAdmin = await this.userRepo.findAdmin();

    if (existingAdmin) return;

    console.log('Creating admin user...');

    const password = await UserPassword.create(
      this.configService.get('ADMIN_PASSWORD') as string,
    );

    const admin = User.create({
      username: this.configService.get('ADMIN_USERNAME') as string,
      password,
      role: UserRole.ADMIN,
    });

    await this.userRepo.save(admin);
  }

  async create(dto: CreateUserDTO) {
    const existingUser = await this.userRepo.findByUsername(dto.username);

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const password = await UserPassword.create(dto.password);

    const user = User.create({
      username: dto.username,
      password,
      role: UserRole.READER,
    });

    await this.userRepo.save(user);
  }

  async getByUsername(username: string) {
    return await this.userRepo.findByUsername(username);
  }

  async updateUserRole(id: string, dto: UpdateUserRoleDTO) {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.updateRole(dto.role);
    await this.userRepo.save(user);
  }
}
