import { PostTag } from 'src/post-tag/entities/post-tag.entity';
import { PostMetadata } from './post-metadata.entity';

export type PostProps = {
  id: string | null;
  title: string;
  content: string;
  authorId: string;
  tags: PostTag[];
  createdAt: Date | null;
  updatedAt: Date | null;
  metadata: PostMetadata;
};

export class Post {
  get id() {
    return this.props.id;
  }
  get title() {
    return this.props.title;
  }
  get content() {
    return this.props.content;
  }
  get authorId() {
    return this.props.authorId;
  }
  get tags() {
    return this.props.tags;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  get metadata() {
    return this.props.metadata;
  }

  private constructor(private props: PostProps) {}

  static create(
    props: Omit<
      PostProps,
      'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'metadata'
    >,
  ) {
    const post = new Post({
      ...props,
      content: Post._validateContent(props.content),
      title: Post._validateTitle(props.title),
      tags: Post._validateTags(props.tags),
      id: null,
      createdAt: null,
      updatedAt: null,
      metadata: PostMetadata.create({
        views: 0,
        wordCount: 0,
      }),
    });

    post.metadata.calculateAndSetWordCount(post.content);

    return post;
  }

  static restore(props: PostProps) {
    return new Post(props);
  }

  update(props: Partial<Pick<PostProps, 'title' | 'content' | 'tags'>>) {
    if ('title' in props && props.title) {
      this.props.title = Post._validateTitle(props.title);
    }

    if ('content' in props && props.content) {
      this.props.content = Post._validateContent(props.content);
      this.props.metadata.calculateAndSetWordCount(this.props.content);
    }

    if ('tags' in props && props.tags) {
      this.props.tags = Post._validateTags(props.tags);
    }
  }

  private static _validateTitle(title: string) {
    if (!title || title.length > 50) {
      throw new Error('Title should be less than 50 characters');
    }

    return title;
  }

  private static _validateContent(content: string) {
    if (!content || content.length > 1000) {
      throw new Error('Content should be less than 500 characters');
    }

    return content;
  }

  private static _validateTags(tags: PostTag[]) {
    const uniqueTags = new Set(tags.map((t) => t.id));

    if (tags.length !== uniqueTags.size) {
      throw new Error('Tags cannot be duplicated');
    }

    return tags;
  }
}
