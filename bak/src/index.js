import _ from 'lodash';
import './style.css';
import printMe from './print';
import Icon from '@/images/jtfw-c-connect-phone.png';
//src文件夹index.js
import("@/async.js").then((_)=>{
  console.log(_.data);
})
function component() {
    let element = document.createElement('div');
    let btn = document.createElement('button');
  
    // lodash（目前通过一个 script 引入）对于执行这一行是必需的
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.classList.add('hello');

    const newImage = new Image();
    newImage.src = Icon;
    element.appendChild(newImage);
    btn.innerHTML = 'test btn1';
    btn.onclick = printMe;
    element.appendChild(btn);
  
    return element;
  }
  
  document.body.appendChild(component());