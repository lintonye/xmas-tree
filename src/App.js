import React, { Component } from 'react';
import Images from './Images';
import styled from 'styled-components';
import _ from 'lodash';

const TREE_MAX_AGE = 4;

const SceneDiv = styled.div`
  cursor: none;
`;

const Img = styled.img`
  position: absolute;
`;

const WaterpotImg = Img.extend`
  /* left: ${ props => props.x}px;
  top: ${ props => props.y}px; */
  transform: translate(${ props => props.x}px, ${props => props.y}px) rotate(${({ rotate }) => rotate ? 45 : 0}deg);
`

const WaterImg = Img.extend`
  transform: translate(${ props => props.x + 80}px, ${props => props.y + 20}px);
`

const SupermanImg = Img.extend`
  left: 150px;
  top: 500px;
`

const TreeImg = Img.extend`
  left: 300px;
  top: 150px;
`

const Background = () => <Img src={Images.background} />

const Waterpot = (props) => {
  const img = Images.waterpot;
  return <WaterpotImg src={img} {...props} />;
};

const Tree = ({ age }) => {
  const img = Images.tree(age);
  return <TreeImg src={img} />;
}

const Superman = ({ status }) => {
  let img = Images.supermanBored;
  switch (status) {
    case 'bored': img = Images.supermanBored; break;
    case 'magic': img = Images.supermanMagic; break;
  }
  return <SupermanImg src={img} />;
}

const Water = props => <WaterImg src={Images.water} {...props} />

class Scene extends Component {
  state = {
    mouseX: 0, mouseY: 0, treeAge: 0,
  }
  onMouseMove = (e) => {
    const { nativeEvent } = e;
    if (nativeEvent) {
      const mouseX = nativeEvent.offsetX;
      const mouseY = nativeEvent.offsetY;
      this.setState({ mouseX, mouseY });
    }
  }
  componentDidMount() {
    this._checkWateringInterval = setInterval(() => {
      const now = new Date().getTime();
      const increaseTreeAge = this._isWateringTree() && (now - this._lastTimeStamp) > 2000 && this.state.treeAge < TREE_MAX_AGE;
      if (!this._isWateringTree()) this._lastTimeStamp = now;
      if (increaseTreeAge) {
        this.setState(prevState => ({ treeAge: prevState.treeAge + 1 }));
        this._lastTimeStamp = now;
      }
    }, 500);
  }
  componentWillUnmount() {
    clearInterval(this._checkWateringInterval);
  }
  _in = (x1, y1, x2, y2) => {
    const x = this.state.mouseX;
    const y = this.state.mouseY;
    return x >= x1 && x <= x2 && y >= y1 && y <= y2;
  }
  _shouldWaterComeOut = () => this._in(200, 400, 800, 600);
  _isWateringTree = () => this._in(300, 400, 350, 600);
  render() {
    const treeAge = this.state.treeAge;
    const supermanStatus = this._isWateringTree() ? 'magic' : 'bored';
    return (
      <SceneDiv onMouseMove={_.throttle(this.onMouseMove, 500)}>
        <Background />
        {this._shouldWaterComeOut() && <Water x={this.state.mouseX} y={this.state.mouseY} />}
        <Tree age={treeAge} />
        <Superman status={supermanStatus} />
        <Waterpot x={this.state.mouseX} y={this.state.mouseY} rotate={this._shouldWaterComeOut()} />
      </SceneDiv>
    );
  }
}

class App extends Component {
  render() {
    return (
      <Scene />
    );
  }
}

export default App;
