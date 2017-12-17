import waterpot from './images/waterpot.png';
import background from './images/background.png';
import supermanBored from './images/supermanBored.gif';
import supermanMagic from './images/supermanMagic.gif';
import water from './images/water.gif';


export default {
  waterpot,
  background,
  supermanBored,
  supermanMagic,
  water,
  tree: age => require(`./images/tree${age}.png`),
}