import waterpot from "./images/waterpot.png";
import background from "./images/background.png";
import foreground from "./images/foreground.png";
import midground from "./images/midground.png";
import supermanBored from "./images/supermanBored.gif";
import supermanMagic from "./images/supermanMagic.gif";
import supermanCelebrate from "./images/supermanCelebrate.gif";
import water from "./images/water.gif";
import gift from "./images/gift.gif";
import giftUnwrapping from "./images/giftUnwrapping.gif";
import couponBg from "./images/coupon.png";
import boxLid from "./images/boxLid.svg";
import boxBody from "./images/boxBody.svg";
import open from "./images/open.png";

const trees = Array(9)
  .fill(0)
  .reduce((result, _, idx) => {
    const key = `tree${idx}`;
    result[key] = require(`./images/tree${idx}.gif`);
    return result;
  }, {});

export default {
  waterpot,
  background,
  foreground,
  midground,
  supermanBored,
  supermanMagic,
  supermanCelebrate,
  water,
  gift,
  giftUnwrapping,
  couponBg,
  boxLid,
  boxBody,
  open,
  ...trees
};
