export function cn(...inputs) {
  return inputs
    .flat(Infinity)
    .filter(Boolean)
    .join(" ");
}

export const isIframe = typeof window !== "undefined" && window.self !== window.top;