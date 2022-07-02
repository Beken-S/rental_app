export interface User {
  username: string;
  avatarUrl: string;
}

export function isUser(object: unknown): object is User {
  if (object != null && typeof object === 'object') {
    return 'username' in object && 'avatarUrl' in object;
  }
  return false;
}
