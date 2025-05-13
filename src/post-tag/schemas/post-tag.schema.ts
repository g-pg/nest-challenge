import { PostSchema } from 'src/post/schemas/post.schema';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('post_tags')
export class PostTagSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => PostSchema, (post) => post.tags)
  posts: PostSchema[];
}
