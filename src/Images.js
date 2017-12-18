import waterpot from './images/waterpot.png';
import background from './images/background.png';
import foreground from './images/foreground.png';
import supermanBored from './images/supermanBored.gif';
import supermanMagic from './images/supermanMagic.gif';
import supermanCelebrate from './images/supermanCelebrate.gif';
import water from './images/water.gif';


export default {
  waterpot,
  background,
  foreground,
  supermanBored,
  supermanMagic,
  supermanCelebrate,
  water,
  tree: age => require(`./images/tree${age}.png`),
  gift: idx => require(`./images/gift${idx}.gif`),
}