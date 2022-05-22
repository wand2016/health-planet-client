const KEY = "token";

export const tokenRegistry = {
  get(): string | null {
    return localStorage.getItem(KEY) ?? null;
  },
  set(token: string): void {
    localStorage.setItem(KEY, token);
  },
};
