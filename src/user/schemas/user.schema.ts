import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRole } from '../domain/user-role';
import { PostSchema } from 'src/post/schemas/post.schema';

@Entity('users')
export class UserSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  role: UserRole;

  @OneToMany(() => PostSchema, (post) => post.author)
  posts: PostSchema[];
}
