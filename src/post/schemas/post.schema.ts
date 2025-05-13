import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  IsNull,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostMetadataSchema } from './post-metadata.schema';
import { UserSchema } from 'src/user/schemas/user.schema';
import { PostTagSchema } from 'src/post-tag/schemas/post-tag.schema';

@Entity('posts')
export class PostSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => UserSchema, (user) => user.posts)
  author: UserSchema;

  @OneToOne(() => PostMetadataSchema, (meta) => meta.post, { cascade: true })
  @JoinColumn()
  metadata: PostMetadataSchema;

  @ManyToMany(() => PostTagSchema, (postTag) => postTag.posts)
  @JoinTable()
  tags: PostTagSchema[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
