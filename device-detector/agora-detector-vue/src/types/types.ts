export interface DetectResults {
  micResult: DeviceResult;
  cameraResult: DeviceResult;
  speakerResult: DeviceResult;
}

interface DeviceResult {
  result: boolean;
  deviceLabel: string;
  deviceId: string;
}

export interface SelectItem {
  label: string;
  value: any;
}

export type DetectState = 'IDLE' | 'DETECTING' | 'FINISH';
export type DeviceState = 'CAMERA' | 'MICROPHONE' | 'SPEAKER';
export type DeviceStepState = 'DETECTING' | 'ASK' | 'RETRY' | 'SWITCH';

export enum BrowserOS {
  WIN_10 = 'Windows 10',
  WIN_81 = 'Windows 8.1',
  WIN_8 = 'Windows 8',
  WIN_7 = 'Windows 7',
  WIN_VISTA = 'Windows Vista',
  WIN_SERVER_2003 = 'Windows Server 2003',
  WIN_XP = 'Windows XP',
  WIN_2000 = 'Windows 2000',
  ANDROID = 'Android',
  OPEN_BSD = 'Open BSD',
  SUN_OS = 'Sun OS',
  LINUX = 'Linux',
  IOS = 'iOS',
  MAC_OS_X = 'Mac OS X',
  MAC_OS = 'Mac OS',
  QNX = 'QNX',
  UNIX = 'UNIX',
  BEOS = 'BeOS',
  OS_2 = 'OS/2',
  SEARCH_BOT = 'Search Bot',
}
