const STORAGE_KEY = "estatery_user";

export function loadUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveUser(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function clearUser() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getUserInitial(name) {
  return name?.trim()?.charAt(0)?.toUpperCase() || "?";
}

export function getUserFirstName(name) {
  return name?.trim()?.split(/\s+/)[0] || "User";
}
