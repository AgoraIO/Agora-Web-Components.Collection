import {
  ICameraVideoTrack, IMicrophoneAudioTrack, IAgoraRTC, IBufferSourceAudioTrack,
} from 'agora-rtc-sdk-ng';

import { urltoFile, getOS } from './helper';
import { sinWave } from './audioWave';
import { BrowserOS } from '../types/types';

export class TrackManager {
  private cameraTrack?: ICameraVideoTrack;

  private microphoneTrack?: IMicrophoneAudioTrack;

  private speakerTrack?: IBufferSourceAudioTrack;

  private agoraSDK?: IAgoraRTC;

  private createState: 'CREATING' | 'IDLE' = 'IDLE';

  private createSpeakerState: 'CREATING' | 'IDLE' = 'IDLE';

  async createTracks() {
    if (!this.agoraSDK) return;
    this.createState = 'CREATING';
    this.createSpeakerState = 'CREATING';
    try {
      [
        this.microphoneTrack,
        this.cameraTrack,
      ] = await this.agoraSDK.createMicrophoneAndCameraTracks();
    } finally {
      this.createState = 'IDLE';
    }
    const wave = await urltoFile(sinWave, 'wave.wav', 'audio/wav');
    this.speakerTrack = await this.agoraSDK.createBufferSourceAudioTrack({
      source: wave,
    });
    this.createSpeakerState = 'IDLE';
  }

  destoryTracks() {
    this.cameraTrack && this.cameraTrack.close();
    this.microphoneTrack && this.microphoneTrack.close();
  }

  setAgoraSDK(agoraSDK: IAgoraRTC) {
    this.agoraSDK = agoraSDK;
  }

  async getCameraTrack(): Promise<ICameraVideoTrack | undefined> {
    if (this.createState === 'CREATING') {
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          if (this.createState === 'IDLE') {
            clearInterval(interval);
            resolve(this.cameraTrack);
          }
        }, 100);
      });
    }
    return this.cameraTrack;
  }

  async getMicrophoneTrack(): Promise<IMicrophoneAudioTrack | undefined> {
    if (this.createState === 'CREATING') {
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          if (this.createState === 'IDLE') {
            clearInterval(interval);
            resolve(this.microphoneTrack);
          }
        }, 100);
      });
    }
    return this.microphoneTrack;
  }

  async getSpeakerTrack(): Promise<IBufferSourceAudioTrack | undefined> {
    if (this.createSpeakerState === 'CREATING') {
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          if (this.createSpeakerState === 'IDLE') {
            clearInterval(interval);
            resolve(this.speakerTrack);
          }
        }, 100);
      });
    }
    return this.speakerTrack;
  }

  async checkCameraTrack(track: ICameraVideoTrack): Promise<boolean> {
    if (!this.agoraSDK) return false;
    if (getOS() === BrowserOS.IOS || BrowserOS.MAC_OS_X || BrowserOS.MAC_OS) {
      return true;
    }
    const res = await this.agoraSDK.checkVideoTrackIsActive(track);
    return res;
  }

  async checkMicTrack(track: IMicrophoneAudioTrack): Promise<boolean> {
    if (!this.agoraSDK) return false;
    const res = await this.agoraSDK.checkAudioTrackIsActive(track);
    return res;
  }
}

const trackManager = new TrackManager();
export default trackManager;
