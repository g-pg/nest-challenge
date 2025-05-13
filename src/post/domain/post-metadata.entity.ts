type PostMetadataProps = {
  id: string | null;
  views: number;
  wordCount: number;
};

export class PostMetadata {
  get id() {
    return this.props.id;
  }
  get views() {
    return this.props.views;
  }
  get wordCount() {
    return this.props.wordCount;
  }

  private constructor(private props: PostMetadataProps) {}

  static create(props: Omit<PostMetadataProps, 'id'>) {
    return new PostMetadata({
      ...props,
      id: null,
    });
  }

  static restore(props: PostMetadataProps) {
    return new PostMetadata(props);
  }

  increaseViews(count: number) {
    this.props.views += count;
  }

  calculateAndSetWordCount(postContent: string) {
    const wordCount = postContent.split(/\s+/).length;
    this.props.wordCount = wordCount;
  }
}
