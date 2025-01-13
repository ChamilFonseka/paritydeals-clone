import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const formatter = new Intl.NumberFormat(undefined, { notation: "compact" });
export function formatCompactNumber(number: number) {
  return formatter.format(number);
}

export function removeTrailingSlash(url: string) {
  return url.replace(/\/$/, "");
}
