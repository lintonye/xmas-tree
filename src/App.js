import React, { Component } from 'react';
import Images from './Images';
import styled, { keyframes } from 'styled-components';
import _ from 'lodash';
import Sound from 'react-sound';
import Sounds from './Sounds';

const TREE_MAX_AGE = 4;
const SCENE_WIDTH = 1024;
const SCENE_HEIGHT = 768;

const AppDiv = styled.div`
  width: 100vw;
  height: 100vh;
  background: #e2f8f8;
  display: flex;
  justify-content: center;
  align-items: center;
`

const SceneDiv = styled.div`
  /* cursor: ${ ({ hideCursor }) => hideCursor ? 'none' : 'default'}; */
  position: relative; /* Need this to make its children's locations relative to it */
  width: ${SCENE_WIDTH}px;
  height: ${SCENE_HEIGHT}px;
  overflow: hidden;
`;

const Img = styled.img`
  position: absolute;
`;

const WaterpotImg = Img.extend`
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
const wanderSlowly = keyframes`
  0% {
    transform: translateX(0px);
  }
  25% {
    transform: translateX(-10px);
  }
  50% {
    transform: translateX(0px);
  }
  75% {
    transform: translateX(10px);
  }
  100% {
    transform: translateX(0px);
  }
`;

const BackSceneImg = Img.extend`
  transform: translateX(${props => props.offsetX}px);
  top: 250px;
`;

const ForegroundImg = BackSceneImg.extend`
  /* animation: ${wanderSlowly} 8s ease-in infinite; */
  top: 650px;
 `;

const MainSceneDiv = styled.div`
  transform: translateX(${props => props.offsetX}px);
`;

const GiftDiv = styled.div`
  cursor: pointer;
`;

const GiftImg = Img.extend.attrs({
  rotate: props => props.opened ? 360 : 0,
  scale: props => props.opened ? 10 : 1,
}) `
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  transform: rotate(${props => props.rotate}deg) scale(${props => props.scale});
  transition: transform 1s;
`;

const GiftText = styled.h2`
  position: absolute;
  left: ${props => props.x - 100}px;
  top: ${props => props.y}px;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 1s ease-in-out;
`;

const Background = props => <Img src={Images.background} {...props} />

const BackScene = props => <BackSceneImg src={Images.backscene} {...props} />

const Foreground = props => <ForegroundImg src={Images.foreground} {...props} />

const Waterpot = (props) => {
  const img = Images.waterpot;
  return <WaterpotImg src={img} {...props} />;
};

const Tree = ({ age }) => {
  const img = Images.tree(age);
  return (
    <div>
      <TreeImg src={img} />
      {age > 0 && <Sound url={Sounds.magicGrowth} playStatus={Sound.status.PLAYING} loop={false} />}
    </div>
  );
}

const Superman = ({ status }) => {
  let img = Images.supermanBored;
  switch (status) {
    case 'bored': img = Images.supermanBored; break;
    case 'magic': img = Images.supermanMagic; break;
    case 'celebrate': img = Images.supermanCelebrate; break;
    default: img = Images.supermanBored;
  }
  return <SupermanImg src={img} />;
}

const Water = props => (
  <div>
    <WaterImg src={Images.water} {...props} />
    <Sound url={Sounds.flowerWatering} playStatus={Sound.status.PLAYING} loop={true} />
  </div>
)

class Gift extends Component {
  state = { opened: false }
  _onClick = () => this.setState(prevState => ({ opened: !prevState.opened }));
  render() {
    return (
      <GiftDiv onClick={this._onClick} >
        <GiftImg {...this.props} src={Images.gift(this.props.index)} opened={this.state.opened} />
        <GiftText {...this.props} visible={this.state.opened}>{this.props.content}</GiftText>
      </GiftDiv>
    );
  }
}

const Gifts = () => {
  const gifts = [
    { x: 350, y: 450, content: '$10 Coupon (react101-xmas-10)' },
  ]
  return (
    <div>
      {
        gifts.map((g, idx) => <Gift index={idx} key={idx} x={g.x} y={g.y} content={g.content} />)
      }
    </div>
  );
}

class Scene extends Component {
  state = {
    mouseX: 0, mouseY: 0, treeAge: 0,
  }
  _updateXY = (e) => {
    const bounds = e.target.getBoundingClientRect()
    // mouseX and Y are relative to the SceneDiv
    const mouseX = e.clientX - bounds.left;
    const mouseY = e.clientY - bounds.top;
    this.setState({ mouseX, mouseY });
  }
  onMouseMove = (e) => {
    e.persist();
    this._updateXY(e);
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
    const { treeAge } = this.state;
    const showXmasTree = treeAge === TREE_MAX_AGE;
    const supermanStatus = showXmasTree ? 'celebrate' : (this._isWateringTree() ? 'magic' : 'bored');
    const parallax = (SCENE_WIDTH/2 - this.state.mouseX) / 8;
    return (
      <SceneDiv onMouseMove={_.throttle(this.onMouseMove, 500)} onClick={this._updateXY} hideCursor={!showXmasTree} >
        <Background />
        <BackScene offsetX={parallax / 4}/>
        <MainSceneDiv offsetX={parallax}>
          {this._shouldWaterComeOut() && !showXmasTree && <Water x={this.state.mouseX} y={this.state.mouseY} />}
          <Tree age={treeAge} />
          <Superman status={supermanStatus} />
          {!showXmasTree && <Waterpot x={this.state.mouseX} y={this.state.mouseY} rotate={this._shouldWaterComeOut()} />}
          {showXmasTree && <Gifts />}
        </MainSceneDiv>
        <Foreground offsetX={parallax * 2}/>
        <Sound url={showXmasTree ? Sounds.xmas : Sounds.background} playStatus={Sound.status.PLAYING} loop={true} />
      </SceneDiv>
    );
  }
}

class App extends Component {
  render() {
    return (
      <AppDiv>
        <Scene />
      </AppDiv>
    );
  }
}

export default App;
