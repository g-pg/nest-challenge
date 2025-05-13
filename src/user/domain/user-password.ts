import * as bcrypt from 'bcrypt';

export class UserPassword {
  get value() {
    return this.hash;
  }

  private constructor(private hash: string) {}

  static async create(plain: string): Promise<UserPassword> {
    const hashed = await bcrypt.hash(plain, 10);
    return new UserPassword(hashed);
  }

  static fromHash(hash: string) {
    return new UserPassword(hash);
  }

  async compare(plain: string): Promise<boolean> {
    try {
      return await bcrypt.compare(plain, this.hash);
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
