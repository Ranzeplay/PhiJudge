export type AuthenticationStatus = {
  isLoggedIn: boolean | undefined;
  userName: string | undefined;
  isAdmin: boolean;
};

const AUTH_STATUS_KEY = 'authStatus';
const AUTH_STATUS_LAST_UPDATE_KEY = 'authStatusLastUpdate';

export async function getUserAuthStatus(): Promise<AuthenticationStatus> {
  const authStatus = sessionStorage.getItem(AUTH_STATUS_KEY);
  const authStatusLastUpdate = sessionStorage.getItem(AUTH_STATUS_LAST_UPDATE_KEY);

  if (authStatus && authStatusLastUpdate) {
    const lastUpdate = new Date(authStatusLastUpdate).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - lastUpdate;
    
    // If the last update was less than 6 hours ago, return the cached status, otherwise fetch the new status
    if (timeDifference < 1000 * 60 * 60 * 6) {
      const status = JSON.parse(authStatus) as AuthenticationStatus;
      return status;
    }
  }

  const response = await fetch('/api/v0/auth/status');
  const status = (await response.json()) as AuthenticationStatus;
  sessionStorage.setItem(AUTH_STATUS_KEY, JSON.stringify(status));
  sessionStorage.setItem(AUTH_STATUS_LAST_UPDATE_KEY, new Date().toISOString());
  return status;
}

export async function clearUserAuthStatus(): Promise<void> {
  sessionStorage.removeItem(AUTH_STATUS_KEY);
  sessionStorage.removeItem(AUTH_STATUS_LAST_UPDATE_KEY);
}
