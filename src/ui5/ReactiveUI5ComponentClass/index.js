/**
 * Author: Bodhi Hu (bodhi.hu@sap.com)
 */

import React from "react";
import PropTypes from 'prop-types';
import {
  setControlProp,
  mapToControlProps,
  getAggregationsFromProps
} from './helpers';

export default function ReactiveUI5ComponentClass ({ UI5Control, ContainerElement = "div", containerClass }) {

  class ReactiveUI5Component extends React.Component {
    constructor (props) {
      super(props);

      const { ctrlId, containerProps, children, getUI5Ctrl, ...restProps } = this.props;

      this.ui5Ctrl = getUI5Ctrl(ctrlId, this.props);
      this.containerId = containerClass + "_" + this.ui5Ctrl.getId();
    }

    render () {

      const { ctrlId, containerProps } = this.props;

      const ui5RenderManager = sap.ui.getCore().getRenderManager()
      const ui5CtrlHtml = ui5RenderManager.getHTML(this.ui5Ctrl);

      return (
        <ContainerElement
          {...containerProps}
          id={this.containerId}
          className={containerClass}
          dangerouslySetInnerHTML={{ __html: ui5CtrlHtml }}
        />
      );
    }

    componentDidMount () {
      this.ui5Ctrl.placeAt(this.containerId);
    }

    shouldComponentUpdate (nextProps, nextState) {
      if (nextProps != this.props) {
        const ui5CtrlProps = mapToControlProps(nextProps);
        Object.keys(ui5CtrlProps || {}).forEach((propKey) => {
          setControlProp(this.ui5Ctrl, propKey, ui5CtrlProps[propKey]);
        });
      }

      return true;
    }

    componentDidUpdate (prevProps, prevState, snapshot) {
    }

    componentWillUnmount () {
      this.ui5Ctrl.destroy();
    }

    componentDidCatch (error, info) {
      console.error(error);
      console.error(info.componentStack);
    }
  }

  const UI5ControlName = UI5Control.getMetadata().getName();
  ReactiveUI5Component.displayName = `ReactiveUI5Component(${UI5ControlName})`;

  ReactiveUI5Component.propTypes = {
    /**
     * ctrlId that will associate the react component and underlying UI5 control
     *    should pass a valid UI5 Control ID if you hope to reuse the created Control,
     *    otherwise the underlying Control will be re-created upon re-rendering, just as React elements
     */
    ctrlId: PropTypes.string,
    containerProps: PropTypes.object,
    getUI5Ctrl: PropTypes.func.isRequired
  };
  ReactiveUI5Component.defaultProps = {
    /**
     * NOTE: do not set ctrlId to null, otherwise it won't render
     */
    ctrlId: undefined,
    getUI5Ctrl: function (ctrlId, props) {
      const {
        containerProps,
        getUI5Ctrl,
        ...restProps
      } = props;
      const ui5CtrlProps = mapToControlProps(UI5Control.getMetadata(), restProps);
      let ui5Ctrl = sap.ui.getCore().byId(ctrlId);
      if (!ui5Ctrl) {
        ui5Ctrl = new UI5Control(ctrlId, ui5CtrlProps);
      }
      return ui5Ctrl;
    }
  };

  return ReactiveUI5Component;

};
