/**
 * Author: Bodhi Hu (bodhi.hu@sap.com)
 */

import React from "react";


export function mapToControlProps(META, props) {
  const { children, ctrlId, ...restProps } = props;

  const ui5CtrlProps = { };

  // process children prop and try to set the default UI5 aggregations
  if (React.Children.count(children) > 0) {
    const defaultAggregation = META.getDefaultAggregation();
    if (!defaultAggregation) {
      console.error(
        `ERROR: [${META.getName()}] doesn't have a default aggregation` +
        `, that is you can not set children to its respective react component`
      );
      return;
    }

    if (props[defaultAggregation.name]) {
      console.error(
        `ERROR: [${META.getName()}] both children and the default aggregation (${defaultAggregation.name}) have values, ` +
        `the prop (${defaultAggregation.name}) will be ignored.\n` +
        `Please only set either children or the default aggregation (${defaultAggregation.name}).`
      );
    }

    const childrenControls = processProp(META, defaultAggregation.name, children);
    if (!childrenControls || childrenControls.length <= 0) {
      console.error(`ERROR: [${META.getName()}] can not find the UI5 controls for children prop: `, children);
    }

    ui5CtrlProps[defaultAggregation.name] =
      (childrenControls && childrenControls.length > 0) ? childrenControls : undefined;
  }

  // process the rest props
  Object.keys(restProps || {}).forEach((propKey) => {
    const ui5PropValue = processProp(META, propKey, restProps[propKey]);
    if (ui5PropValue !== undefined) {
      ui5CtrlProps[propKey] = ui5PropValue;
    }
  });

  return ui5CtrlProps;
}

export function getAggregationsFromProps (META, props) {
  const aggreProps = [];
  Object.keys(props || {}).forEach((propKey) => {
    if (META.getAggregations()[propKey]) {
      aggreProps.push(props[propKey]);
    }
  });

  return aggreProps;
}

function processProp (META, propKey, propValue) {

  if (META.getProperties()[propKey]) {
    return propValue;
  }
  if (META.getAggregations()[propKey] || META.getDefaultAggregationName() === propKey) {
    return getUI5CtrlsFromProp(META, propKey, propValue);
  }
  if (META.getEvents()[propKey]) {
    return propValue;
  }

  console.warn(
    `WARNING: ${META.getName()}\n` +
    `  unknow prop for UI5 Control: (${propKey})`
  );
  return undefined;
}

function getUI5CtrlsFromProp (META, propKey, propValue) {

  if (!propValue || propValue.length <= 0) {
    return undefined;
  }

  let elements = propValue.length > 0 ? propValue : [ propValue ];
  let ui5Ctrls = [];
  elements.forEach((ele) => {
    let ctrl;
    if (ele && ele.getMetadata) {
      // UI5 Control
      ctrl = ele;
    }
    if (!ctrl && ele && ele.type) {
      // ReactiveUI5Component
      if (ele.type.name === 'ReactiveUI5Component' && ele.props && ele.props.getUI5Ctrl) {
        // if (!ele.props.ctrlId) {
        //   console.warn(
        //     `WARNING: ${META.getName()}: ctrlId prop not set for aggregations,` +
        //     ` the respective UI5 controls will be re-created, this might lead to memory leak`
        //   );
        // }
        ctrl = ele.props.getUI5Ctrl(ele.props.ctrlId, ele.props);
      }
    }
    if (!ctrl) {
      console.error(`ERROR: ${META.getName()} can not find UI5 control for given element`, ele);
      return;
    }

    ui5Ctrls.push(ctrl);
  });

  return ui5Ctrls;
}

export function setControlProp (ui5Ctrl, propKey, propValue) {
  const META = ui5Ctrl.getMetadata();

  if (META.getProperties()[propKey]) {
    ui5Ctrl.setProperty(propKey, propValue);
    return;
  }
  if (META.getAggregations()[propKey]) {
    const newAggregation = getUI5CtrlsFromProp(META, propKey, propValue);
    const oldAggregation = ui5Ctrl.removeAllAggregation(propKey);
    ui5Ctrl.setAggregation(propKey, newAggregation);
    const newCtrlIds = newAggregation.map((ctrl) => ctrl && ctrl.getId());
    oldAggregation.forEach((ctrl) => {
      if (ctrl && newCtrlIds.indexOf(ctrl.getId) < 0) {
        ctrl.destroy();
      }
    });
    return;
  }
  if (META.getEvents()[propKey]) {
    // TODO: should support attaching multiple event handlers to UI5 controls ???
    // FIXME: should try to avoid accessing UI5 Control private members, maybe open an issue to openui5
    ui5Ctrl.mEventRegistry[propKey] = [];
    if (propValue) {
      ui5Ctrl.attachEvent(propKey, propValue);
    }
    return;
  }

  console.warn(`WARNING: ${META.getName()} does not supported prop (${propKey})`);
}
