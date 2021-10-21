import _ from 'lodash';
export default function printMe() {
    console.log('I get called from print.js111');
    console.log(_.chunk(['a', 'b', 'c', 'd'], 2));
}