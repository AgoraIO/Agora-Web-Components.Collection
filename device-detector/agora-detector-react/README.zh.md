# agora-detector-react

> react 版本的 Agora 设备检测组件

[![NPM](https://img.shields.io/npm/v/agora-detector-react.svg)](https://www.npmjs.com/package/agora-detector-react) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

*简体中文 | [English](README.md)*

## 简介

这个组件可以检测使用者的麦克风、摄像头和扬声器，最终通过回调给出检测结果报告。

每个采集设备检测将分为主观检测（用户反馈）和客观检测（javascript 脚本）。

只要主观检测和客观检测之一失败，组件的最终检测结果中会将该设备标记为检测失败。

**该组件依赖于Agora Web SDK NG，确保您的 SDK 版本高于 4.0.0。**

## 演示

![Demo.gif](./gif/demo.gif)

## 安装

```bash
npm install --save agora-detector-react
```

## 使用

```tsx
import React, { Component } from 'react';

import AgoraRTC from 'agora-rtc-sdk-ng';
import { AgoraDetector, DetectResults } from 'agora-detector-react';
import 'agora-detector-react/dist/index.css';

class Example extends Component {
  onComplete(report: DetectResults) {
    console.log(`Camera device: ${report.cameraResult.deviceLabel}, 
    result: ${report.cameraResult.result}`);
    console.log(`Microphone device: ${report.micResult.deviceLabel}, 
    result: ${report.micResult.result}`);
    console.log(`Speaker device: ${report.speakerResult.deviceLabel}, 
    result: ${report.speakerResult.result}`);
  }

  render() {
    return <AgoraDetector AgoraSDK={AgoraRTC} onComplete={onComplete}/>;
  }
}
```


## 参数

### `AgoraSDK`

完整的 Agora Web SDK NG 对象（4.0.0版本以上）。

### `width` (`string`)

检测组件的宽度（css接受的值）。

### `height` (`string`)

检测组件的高度（css接受的值）。

## 注意

Safari 上的摄像头自动检测总会返回成功。

## 代码许可

MIT © [](https://github.com/)
