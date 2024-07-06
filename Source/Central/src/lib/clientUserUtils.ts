export type AuthenticationStatus = {
  isLoggedIn: boolean | undefined;
  userName: string | undefined;
  isAdmin: boolean;
};

export async function fetchUserAuthStatus() {
  const response = await fetch('/api/v0/auth/status');
  return (await response.json()) as AuthenticationStatus;
}
