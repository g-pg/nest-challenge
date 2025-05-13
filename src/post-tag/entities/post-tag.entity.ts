import { BadRequestException } from '@nestjs/common';

export type PostTagProps = {
  id: string | null;
  name: string;
};

export class PostTag {
  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  private constructor(private props: PostTagProps) {}

  static create(props: Omit<PostTagProps, 'id'>) {
    const parsedName = this._parseAndValidateName(props.name);
    return new PostTag({ ...props, id: null, name: parsedName });
  }

  static restore(props: PostTagProps) {
    return new PostTag({ ...props });
  }

  private static _parseAndValidateName(name: string) {
    if (!name) {
      throw new Error('Tag is required');
    }

    if (name.length > 30) {
      throw new Error('Tag is too long');
    }

    return name.toLowerCase().trim();
  }
}
