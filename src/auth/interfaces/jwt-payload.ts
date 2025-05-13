import { UserRole } from 'src/user/domain/user-role';
export interface JWTPayload {
  userId: string;
  role: UserRole;
}
