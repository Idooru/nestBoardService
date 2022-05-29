export interface JwtPayload {
  email: string;
  who: { id: string; name: string };
}
