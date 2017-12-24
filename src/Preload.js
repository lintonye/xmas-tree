import React from 'react';
import createjs from 'preload-js';
import Images from './Images';
import Sounds from './Sounds';
import { saveSound } from './Sound';

function preload() {
  return new Promise((resolve, reject) => {
    const queue = new createjs.LoadQueue();

    queue.on('complete', () => {
      console.log('all loaded!');
      resolve();
    });

    //TODO error processing

    queue.on("fileload", (event) => {
      const item = event.item;
      if (item.type === 'binary') {
        const url = item.src;
        const content = event.rawResult;
        // console.log('url', url, 'content', content, event);
        saveSound(url, content);
      }
    });
    // Object.values(Images).forEach(url => queue.loadFile(url));
    Object.values(Images).forEach(url => (new Image()).src = url);
    Object.values(Sounds).forEach(url => queue.loadFile({ src: url, type: 'binary' }));;
  });
}


export default class Preload extends React.Component {
  state = { complete: false };
  async componentDidMount() {
    try {
      await preload();
      this.setState({ complete: true })
    } catch (e) {
      console.log('Failed to preload', e);
    }
  }
  render() {
    return this.state.complete ? this.props.children : this.props.indicator ;
  }
}