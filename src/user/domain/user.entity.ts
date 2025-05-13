import { UserPassword } from './user-password';
import { UserRole } from './user-role';

export type UserProps = {
  id: string | null;
  username: string;
  password: UserPassword;
  role: UserRole;
};

export class User {
  get id() {
    return this.props.id;
  }

  get username() {
    return this.props.username;
  }

  get password() {
    return this.props.password;
  }

  get role() {
    return this.props.role;
  }

  private constructor(private props: UserProps) {}

  static create(props: Omit<UserProps, 'id'>) {
    return new User({
      id: null,
      ...props,
    });
  }

  static restore(props: UserProps) {
    return new User(props);
  }

  updateRole(role: UserRole) {
    this.props.role = role;
  }
}
