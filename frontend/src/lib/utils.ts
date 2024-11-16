import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// type F = (...args: Parameters<typeof fetch>) => ReturnType<typeof fetch>;
// export const f: F = (path, ...args) => {
//   return fetch(`${getBaseUrl()}/${path}`, ...args);
// };
export function getBaseUrl() {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (import.meta.env.DEV) return "http://localhost:3001";
  throw new Error("API URL not defined!");
}

export function getGodAvatar(name: string) {
  return `/${name.toLowerCase()}/ava.webp`;
}
