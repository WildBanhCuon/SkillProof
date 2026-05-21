export type UserRole = 'hr' | 'candidate';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  companyId?: string;
  fullName: string;
}
