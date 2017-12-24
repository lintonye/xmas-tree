import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Images from './Images';
import styled, { keyframes } from 'styled-components';
import _ from 'lodash';
import Sounds from './Sounds';
import Sound from './Sound';
import { TimelineLite, Power3, Bounce } from "gsap";
import Preload from './Preload';
import Spinner from './Spinner';

const TREE_MAX_AGE = 8;
const SCENE_WIDTH = 1024;
const SCENE_HEIGHT = 768;

const AppDiv = styled.div`
  width: 100vw;
  height: 100vh;
  background: #dddddd;
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

const GiftImg = Img.extend`
  left: 350px;
  top: 490px;
  cursor: pointer;
  pointer-events: auto;
`

const OpenGiftImg = Img.extend`
  left: 230px;
  top: 420px;
`

const BoxLidImg = Img.extend`
  opacity: 0;
  left: 425px;
  top: 570px;
`

const BoxBodyImg = BoxLidImg.extend`
  left: 429px;
  top: 610px;
`

const CouponDiv = styled.div`
  background: rgba(0, 0, 0, 0);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: absolute;
  div#coupon {
    transform: scale(0.6);
    background-image: url("${Images.couponBg}");
    background-repeat: no-repeat;
    padding: 20px;
    width: 460px;
    height: 260px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: #283593;
    #title-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      line-height: 0.4em;
      h2 {
        margin-top: 30px;
      }
      span {
        font-size: 1.2em;
      }
    }
    #discount {
      text-align: center;
      font-size: 3em;
      color: red;
    }
    #code-container {
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: right;
      #labels {
        margin-right: 10px;
        h1 {
          line-height: 0;
          font-size: 2em;
          font-weight: 100;
        }
        span {
          line-height: 0;
          color: #a0a0a0;
        }
      }
      #code {
        border-style: dotted;
        border-width: 2px;
        border-radius: 8px;
        padding: 5px;
        line-height: 0;
      }
    }
    #links {
      display: flex;
      justify-content: space-between;
      align-items: center;
      a {
        margin: 10px;
        color: #0097A7;
      }
      i {
        font-size: 1.5em;
      }
    }
  }
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
    const img = Images[`tree${this.props.age}`];
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

const SocialIcon = ({ name, link }) => (
  <a href={link}>
    <i className={`fa fa-${name}`} aria-hidden="true"></i>
  </a>
)

const Coupon = (props) => (
  <CouponDiv id='coupon-container' {...props}>
    <div id="coupon">
      <div id="title-container">
        <h2>React 101 For Designers</h2>
        <span>Enroll January 2018!</span>
      </div>
      <div id="discount">$20</div>
      <div id="code-container">
        <div id="labels">
          <h1>Coupon Code</h1>
          <span>Valid until January 31, 2018</span>
        </div>
        <div id="code">
          <h2>R4D2018</h2>
        </div>
      </div>
      <div id="links">
        <a href="http://learnreact.design">learnreact.design</a>
        <div>
          <SocialIcon name='twitter' link="https://twitter.com/home?status=Happy%20holidays!%20Let's%20grow%20a%20Xmas%20tree%3A%20https%3A//lintonye.github.io/xmas-tree/%20" />
          <SocialIcon name='facebook' link='https://www.facebook.com/sharer/sharer.php?u=https%3A//lintonye.github.io/xmas-tree/' />
          <SocialIcon name='google-plus' link='https://plus.google.com/share?url=https%3A//lintonye.github.io/xmas-tree/' />
        </div>
      </div>
    </div>
  </CouponDiv>
)

class AnimatedCoupon extends Component {
  animate = () => {
    const animation = new TimelineLite();
    animation
      .delay(0.7)
      .to(this.boxLid, 0.1, { opacity: 1 })
      .to(this.boxBody, 0.1, { opacity: 1 })
      .to(this.couponContainer, 0.5, { background: 'rgba(0, 0, 0, 0.6)' })
      .to(this.boxLid, 1, { x: 20, y: -100, scale: 4, ease: Power3.easeInOut }, '-=0.5')
      .to(this.boxBody, 1, { x: 20, y: 50, scale: 4, ease: Power3.easeInOut }, '-=1')
      .to(this.boxLid, 0.5, { y: -700, ease: Power3.easeIn }, '-=0.5')
      .from(this.coupon, 0.4, { y: 200, opacity: 0, ease: Power3.easeInOut })
      .to(this.coupon, 1, { scale: 1, ease: Bounce.easeOut })
  }
  componentDidMount() {
    const root = ReactDOM.findDOMNode(this);
    this.couponContainer = root.querySelector('#coupon-container');
    this.coupon = root.querySelector('#coupon');
    this.boxLid = root.querySelector('#box-lid');
    this.boxBody = root.querySelector('#box-body');
    this.animate();
  }
  render() {
    return (
      <div>
        <Coupon />
        <BoxBodyImg id='box-body' src={Images.boxBody} />
        <BoxLidImg id='box-lid' src={Images.boxLid} />
      </div>
    );
  }
}

const Gift = ({ onClick, isOpen }) => <GiftImg onClick={onClick} src={isOpen ? Images.giftUnwrapping : Images.gift} />

class Scene extends Component {
  state = {
    mouseX: 0, mouseY: 0, treeAge: 0, giftOpen: false
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
  _handleGiftClick = () => this.setState({ giftOpen: true });
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
          {showXmasTree && <Gift onClick={this._handleGiftClick} isOpen={this.state.giftOpen} />}
          {showXmasTree && !this.state.giftOpen && <OpenGiftImg src={Images.open} />}
        </MidSceneDiv>
        {this._shouldWaterComeOut() && !showXmasTree && <Water x={this.state.mouseX} y={this.state.mouseY} />}
        {!showXmasTree && <Waterpot x={this.state.mouseX} y={this.state.mouseY} rotate={this._shouldWaterComeOut()} />}
        <Foreground offsetX={parallax.near} />
        <Sound url={showXmasTree ? Sounds.xmas : Sounds.background} loop={true} />
        {this.state.giftOpen && <AnimatedCoupon />}
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
        <Preload indicator={<div><Spinner /><span>Loading...</span></div>}>
          <Scene scale={scale} />
        </Preload>
      </AppDiv>
    );
  }
}

export default App;
