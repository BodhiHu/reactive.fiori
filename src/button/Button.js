/**
 * Author: Bodhi Hu (bodhi.hu@sap.com)
 */

import ReactiveUI5ComponentClass from "../ui5/ReactiveUI5ComponentClass";
import styles from './styles.module.scss';

const Button = ReactiveUI5ComponentClass({
  UI5Control: sap.m.Button,
  containerClass: styles.UI5Button
});

export default Button;
