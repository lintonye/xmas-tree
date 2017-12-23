import waterpot from './images/waterpot.png';
import background from './images/background.png';
import foreground from './images/foreground.png';
import midground from './images/midground.png';
import supermanBored from './images/supermanBored.gif';
import supermanMagic from './images/supermanMagic.gif';
import supermanCelebrate from './images/supermanCelebrate.gif';
import water from './images/water.gif';
import gift from "./images/gift.gif";
import giftUnwrapping from "./images/giftUnwrapping.gif";
import couponBg from './images/coupon.svg';

export default {
  waterpot,
  background,
  foreground,
  midground,
  supermanBored,
  supermanMagic,
  supermanCelebrate,
  water,
  tree: age => require(`./images/tree${age}.gif`),
  gift,
  giftUnwrapping,
  couponBg,
}