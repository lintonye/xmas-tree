import React, { Component } from 'react';
import Images from './Images';
import styled, { keyframes } from 'styled-components';
import _ from 'lodash';
import Sound from 'react-sound';
import Sounds from './Sounds';

const TREE_MAX_AGE = 4;
const SCENE_WIDTH = 1024;
const SCENE_HEIGHT = 768;
const VIEWPORT_WIDTH = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
const VIEWPORT_HEIGHT = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
const SCALE = Math.min(1, VIEWPORT_WIDTH / SCENE_WIDTH, VIEWPORT_HEIGHT / SCENE_HEIGHT);

const scaled = p => p * SCALE;

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
  width: ${SCENE_WIDTH * SCALE}px;
  height: ${SCENE_HEIGHT * SCALE}px;
  background: white;
  overflow: hidden;
`;

const Img = styled.img`
  /* Needed to prevent images from hijacking mouse events from its parent div */
  pointer-events: none; 
  position: absolute;
  transform: scale(${SCALE});
  transform-origin: top left;
`;

const WaterpotImg = Img.extend`
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  transform: rotate(${({ rotate }) => rotate ? 45 : 0}deg) scale(${SCALE});
  transition: transform 0.3s;
`

const WaterImg = Img.extend`
  transform: translate(${ props => props.x + scaled(60)}px, ${props => props.y + scaled(40)}px) scale(${SCALE});
`

const SupermanImg = Img.extend`
  left: ${scaled(150)}px;
  top: ${scaled(500)}px;
`

const TreeImg = Img.extend`
  left: ${scaled(300)}px;
  top: ${scaled(150)}px;
`

const BackgroundImg = Img.extend`
  transform: translateX(${props => props.offsetX}px) scale(${SCALE});
  transition: transform 500ms ease-in-out;
`;

const ForegroundImg = BackgroundImg.extend`
  top: ${scaled(650)}px;
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
  left: ${props => scaled(props.x)}px;
  top: ${props => scaled(props.y)}px;
  transform: rotate(${props => props.rotate}deg) scale(${props => scaled(props.scale)});
  transition: transform 1s;
`;

const GiftText = styled.h2`
  position: absolute;
  left: ${props => scaled(props.x - 100)}px;
  top: ${props => scaled(props.y)}px;
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
        {this.state.growing && <Sound url={Sounds.magicGrowth} playStatus={Sound.status.PLAYING} loop={false} />}
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
    return x >= scaled(x1) && x <= scaled(x2) && y >= scaled(y1) && y <= scaled(y2);
  }
  _shouldWaterComeOut = () => this._in(200, 400, 800, 600);
  _isWateringTree = () => this._in(330, 400, 370, 600);
  _parallax = () => {
    const p = (SCENE_WIDTH * SCALE / 2 - this.state.mouseX) / 16;
    return {
      far: p / 4,
      mid: p,
      near: p * 8,
    }
  }
  render() {
    const { treeAge } = this.state;
    const showXmasTree = treeAge === TREE_MAX_AGE;
    const supermanStatus = showXmasTree ? 'celebrate' : (this._isWateringTree() ? 'magic' : 'bored');
    const parallax = this._parallax();
    return (
      <SceneDiv onMouseMove={_.throttle(this.onMouseMove, 500)} onClick={this._updateXY} hideCursor={!showXmasTree} >
        <Background offsetX={parallax.far} />
        <MidSceneDiv offsetX={parallax.mid}>
          <Tree age={treeAge} />
          <Superman status={supermanStatus} />
          {showXmasTree && <Gifts />}
        </MidSceneDiv>
        {this._shouldWaterComeOut() && !showXmasTree && <Water x={this.state.mouseX} y={this.state.mouseY} />}
        {!showXmasTree && <Waterpot x={this.state.mouseX} y={this.state.mouseY} rotate={this._shouldWaterComeOut()} />}
        <Foreground offsetX={parallax.near} />
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
