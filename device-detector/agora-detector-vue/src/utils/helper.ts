import { BrowserOS } from '../types/types';

export function wait(timeout: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, timeout);
  });
}

export function getOS() {
  let os: BrowserOS | null = null;
  const ua = navigator.userAgent;
  const clientStrings: { s: BrowserOS; r: RegExp }[] = [
    { s: BrowserOS.WIN_10, r: /(Windows 10.0|Windows NT 10.0)/ },
    { s: BrowserOS.WIN_81, r: /(Windows 8.1|Windows NT 6.3)/ },
    { s: BrowserOS.WIN_8, r: /(Windows 8|Windows NT 6.2)/ },
    { s: BrowserOS.WIN_7, r: /(Windows 7|Windows NT 6.1)/ },
    { s: BrowserOS.WIN_VISTA, r: /Windows NT 6.0/ },
    { s: BrowserOS.WIN_SERVER_2003, r: /Windows NT 5.2/ },
    { s: BrowserOS.WIN_XP, r: /(Windows NT 5.1|Windows XP)/ },
    { s: BrowserOS.WIN_2000, r: /(Windows NT 5.0|Windows 2000)/ },
    { s: BrowserOS.ANDROID, r: /Android/ },
    { s: BrowserOS.OPEN_BSD, r: /OpenBSD/ },
    { s: BrowserOS.SUN_OS, r: /SunOS/ },
    { s: BrowserOS.LINUX, r: /(Linux|X11)/ },
    { s: BrowserOS.IOS, r: /(iPhone|iPad|iPod)/ },
    { s: BrowserOS.MAC_OS_X, r: /Mac OS X/ },
    { s: BrowserOS.MAC_OS, r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/ },
    { s: BrowserOS.QNX, r: /QNX/ },
    { s: BrowserOS.UNIX, r: /UNIX/ },
    { s: BrowserOS.BEOS, r: /BeOS/ },
    { s: BrowserOS.OS_2, r: /OS\/2/ },
    { s: BrowserOS.SEARCH_BOT, r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/ },
  ];
  // eslint-disable-next-line
  for (const id in clientStrings) {
    const cs = clientStrings[id];
    if (cs.r.test(ua)) {
      os = cs.s;
      break;
    }
  }
  return os;
}

export function isMobile(): boolean {
  const os = getOS();
  return os === BrowserOS.ANDROID || os === BrowserOS.IOS;
}

export function urltoFile(url: string, filename: string, mimeType: string): Promise<File> {
  return (
    fetch(url)
      .then((res) => res.arrayBuffer())
      .then((buf) => new File([buf], filename, { type: mimeType }))
  );
}
