export type UserType = 'regular' | 'pro';

export type User = {
  name: string;
  email: string;
  avatarUrl?: string;
  password: string;
  type: UserType;
};
