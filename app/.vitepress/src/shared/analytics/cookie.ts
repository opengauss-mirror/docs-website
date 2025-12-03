export let isCookieAgreed = () => document.cookie.match(/\bagreed-cookiepolicy=(.+?);?/)?.[1] === '1';

export function setIsCookieAgreed(fn: () => boolean) {
  isCookieAgreed = fn;
}

// 监听cookie set
export default function startListenCookieSet(callback: () => void) {
  const origDesc = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie')!;
  Object.defineProperty(Document.prototype, 'cookie', {
    ...origDesc,
    set(val: string) {
      origDesc.set?.call(this, val);
      callback();
    },
  });
}
