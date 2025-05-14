import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSchema } from '../schemas/user.schema';
import { Repository } from 'typeorm';
import { UserRole } from '../domain/user-role';
import { User } from '../domain/user.entity';
import { UserPassword } from '../domain/user-password';
@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private ormRepo: Repository<UserSchema>,
  ) {}

  async save(user: User) {
    const ormUser = this._toORM(user);
    return await this.ormRepo.save(ormUser);
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.ormRepo.findOneBy({ username });
    return user ? this._toDomain(user) : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.ormRepo.findOneBy({ id });
    return user ? this._toDomain(user) : null;
  }

  async findAdmin(): Promise<User | null> {
    const user = await this.ormRepo.findOneBy({ role: UserRole.ADMIN });
    return user ? this._toDomain(user) : null;
  }

  private _toORM(user: User) {
    return this.ormRepo.create({
      id: user.id ?? undefined,
      username: user.username,
      password: user.password.value,
      role: user.role,
    });
  }

  private _toDomain(ormUser: UserSchema) {
    return User.restore({
      id: ormUser.id,
      username: ormUser.username,
      password: UserPassword.fromHash(ormUser.password),
      role: ormUser.role,
    });
  }
}
