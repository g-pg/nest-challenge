import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PostSchema } from './post.schema';

@Entity('post_metadata')
export class PostMetadataSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => PostSchema, (post) => post.metadata)
  post: PostSchema;

  @Column()
  views: number;

  @Column()
  wordCount: number;
}
