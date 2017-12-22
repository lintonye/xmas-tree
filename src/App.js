import React, { Component } from 'react';
import Images from './Images';
import styled, { keyframes } from 'styled-components';
import _ from 'lodash';
import Sounds from './Sounds';
import Sound from './Sound';

const TREE_MAX_AGE = 8;
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
  cursor: ${ ({ hideCursor }) => hideCursor ? 'none' : 'default'};
  position: relative; /* Need this to make its children's locations relative to it */
  width: ${SCENE_WIDTH}px;
  height: ${SCENE_HEIGHT}px;
  background: white;
  overflow: hidden;
  transform: scale(${props => props.scale});
  flex-shrink: 0; /* Prevent the parent flexbox from cutting off the scene when scaled */
  -webkit-tap-highlight-color: rgba(0,0,0,0); /* Remove Gray Highlight When Tapping Links in Mobile Safari */
`;

const Img = styled.img`
  /* Needed to prevent images from hijacking mouse events from its parent div */
  pointer-events: none; 
  position: absolute;
`;

const WaterpotImg = Img.extend`
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  transform: rotate(${({ rotate }) => rotate ? 45 : 0}deg);
  transition: transform 0.3s;
`

const WaterImg = Img.extend`
  transform: translate(${ props => props.x + 100}px, ${props => props.y + 55}px);
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

const BackgroundImg = Img.extend`
  left: -40px;
  transform: translateX(${props => props.offsetX}px);
  transition: transform 500ms ease-in-out;
`;

const ForegroundImg = BackgroundImg.extend`
  left: -250px;
  top: 550px;
 `;

const MidgroundImg = Img.extend`
  left: -30px;
  top: 500px;
`;

const MidSceneDiv = styled.div`
  transform: translateX(${props => props.offsetX}px);
  transition: transform 500ms ease-in-out;
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

const Background = props => <BackgroundImg src={Images.background} {...props} />

const Foreground = props => <ForegroundImg src={Images.foreground} {...props} />

const Waterpot = (props) => {
  const img = Images.waterpot;
  return <WaterpotImg src={img} {...props} />;
};

class Tree extends Component {
  state = { growing: false }
  componentWillReceiveProps(nextProps) {
    const growing = this.props.age < nextProps.age;
    this.setState({ growing });
  }
  render() {
    const img = Images.tree(this.props.age);
    return (
      <div>
        <TreeImg src={img} />
        {this.state.growing && <Sound url={Sounds.magicGrowth} loop={false} />}
      </div>
    );
  }
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
    <Sound url={Sounds.flowerWatering} loop={true} />
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
    const mouseX = (e.clientX - bounds.left) / this.props.scale;
    const mouseY = (e.clientY - bounds.top) / this.props.scale;
    // console.log('mx', mouseX, 'my', mouseY, 'cx', e.clientX, 'cy', e.clientY, 'bounds', bounds)
    this.setState({ mouseX, mouseY });
  }
  onMouseMove = (e) => {
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
    const x = this.state.mouseX - this._parallax().mid;
    const y = this.state.mouseY;
    return x >= x1 && x <= x2 && y >= y1 && y <= y2;
  }
  _shouldWaterComeOut = () => this._in(200, 500, 800, 700);
  _isWateringTree = () => this._in(320, 500, 380, 600);
  _parallax = () => {
    const p = (SCENE_WIDTH / 2 - this.state.mouseX) / 16;
    return {
      far: p / 4,
      mid: p,
      near: p * 4,
    }
  }
  render() {
    const { treeAge } = this.state;
    const showXmasTree = treeAge === TREE_MAX_AGE;
    const supermanStatus = showXmasTree ? 'celebrate' : (this._isWateringTree() ? 'magic' : 'bored');
    const parallax = this._parallax();
    return (
      <SceneDiv scale={this.props.scale} onMouseMove={_.throttle(this.onMouseMove, 200)} onClick={this._updateXY} hideCursor={!showXmasTree} >
        <Background offsetX={parallax.far} />
        <MidSceneDiv offsetX={parallax.mid}>
          <MidgroundImg src={Images.midground} />
          <Tree age={treeAge} />
          <Superman status={supermanStatus} />
          {showXmasTree && <Gifts />}
        </MidSceneDiv>
        {this._shouldWaterComeOut() && !showXmasTree && <Water x={this.state.mouseX} y={this.state.mouseY} />}
        {!showXmasTree && <Waterpot x={this.state.mouseX} y={this.state.mouseY} rotate={this._shouldWaterComeOut()} />}
        <Foreground offsetX={parallax.near} />
        <Sound url={showXmasTree ? Sounds.xmas : Sounds.background} loop={true} />
      </SceneDiv>
    );
  }
}

class App extends Component {
  _update = () => this.forceUpdate();
  componentDidMount() {
    window.addEventListener("resize", this._update);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this._update);
  }
  render() {
    const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    const scale = Math.min(1, viewportWidth / SCENE_WIDTH, viewportHeight / SCENE_HEIGHT);
    return (
      <AppDiv>
        <Scene scale={scale} />
      </AppDiv>
    );
  }
}

export default App;
