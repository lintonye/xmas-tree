import React from 'react';
import Pizzicato from 'pizzicato';

class Sound extends React.Component {
  componentDidMount() {
    this._loadAndPlay(this.props);
  }
  _loadAndPlay = (props) => {
    this.sound = new Pizzicato.Sound({
      source: 'file',
      options: {
        path: props.url,
        loop: props.loop || false,
      }
    }, () => this.sound.play());     
  }
  _stopSound = () => {
    if (this.sound) {
      this.sound.pause();
      this.sound.stop();
    }
  };
  componentWillReceiveProps(nextProps) {
    if (this.props.url !== nextProps.url) {
      this._stopSound();
      this._loadAndPlay(nextProps);
    }
  }
  componentWillUnmount() {
    this._stopSound();
  }
  render() {
    return null;
  }
}

export default Sound;