import React from 'react';

let audioContext = null;

try {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  audioContext = new AudioContext();
} catch (e) {
  console.log('Web Audio API is not supported in this browser', e);
}

function load(url) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = () => {
      audioContext.decodeAudioData(
        request.response,
        (buffer) => {
          resolve(buffer);
        },
        () => { reject(`Load error: ${url}`); }
      )
    };
    request.send();
  });
}

class Sound extends React.Component {
  _playEmptySound = () => {
    // create empty buffer
    var buffer = audioContext.createBuffer(1, 1, 22050);
    var source = audioContext.createBufferSource();
    source.buffer = buffer;
    console.log('source', source);
    // connect to output (your speakers)
    source.connect(audioContext.destination);
    // play the file
    source.start(0);
  }
  _unlockIOSSound() {
    if (audioContext) {
      window.addEventListener('touchend', this._playEmptySound, false);
    }
  }
  async componentDidMount() {
    this._unlockIOSSound();
    await this._loadAndPlay(this.props);
  }
  _loadAndPlay = async (props) => {
    if (audioContext) {
      const buffer = await load(props.url);
      this.soundSource = audioContext.createBufferSource();
      this.soundSource.buffer = buffer;
      this.soundSource.connect(audioContext.destination);
      this.soundSource.loop = props.loop || false;
      this.soundSource.start(0);
    }
  }
  _stopSound = () => {
    if (this.soundSource) {
      this.soundSource.stop();
    }
  };
  async componentWillReceiveProps(nextProps) {
    if (this.props.url !== nextProps.url) {
      this._stopSound();
      await this._loadAndPlay(nextProps);
    }
  }
  componentWillUnmount() {
    this._stopSound();
    if (audioContext) {
      window.removeEventListener('touchend', this._playEmptySound);
    }
  }
  render() {
    return null;
  }
}

export default Sound;