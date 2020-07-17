import React from 'react'
import AgoraSDK from 'agora-rtc-sdk-ng';

import { AgoraDetector, DetectResults } from 'agora-detector-react'
import 'agora-detector-react/dist/index.css'

const App = () => {
  const style = {
    margin: '20px 20px',
  }

  const onComplete = (report: DetectResults) => {
    console.log('detect completed', report);
  }
  return <div style={style}>
    <div style={ {margin: '20px'} }>React Example</div>
    <AgoraDetector AgoraSDK={AgoraSDK} onComplete={onComplete}/>
  </div>
}

export default App;
