/**
 * Author: Bodhi Hu (bodhi.hu@sap.com)
 * 
 * Generates React components from UI5 controls
 */

const fs = require('fs');
const { dirname } = require('path');
const path = require('path');

const ui5Components = [

  // sap.m
  {
    dir: 'breadcrumbs',
    name: 'Breadcrumbs',
    ctrl: 'sap.m.Breadcrumbs'
  },
  {
    dir: 'column',
    name: 'Column',
    ctrl: 'sap.m.Column'
  },
  {
    dir: 'column-list-item',
    name: 'ColumnListItem',
    ctrl: 'sap.m.ColumnListItem'
  },
  {
    dir: 'generic-tag',
    name: 'GenericTag',
    ctrl: 'sap.m.GenericTag'
  },
  {
    dir: 'overflow-toolbar',
    name: 'OverflowToolbar',
    ctrl: 'sap.m.OverflowToolbar'
  },
  {
    dir: 'object-number',
    name: 'ObjectNumber',
    ctrl: 'sap.m.ObjectNumber'
  },
  {
    dir: 'link',
    name: 'Link',
    ctrl: 'sap.m.Link'
  },
  {
    dir: 'label',
    name: 'Label',
    ctrl: 'sap.m.Label'
  },
  {
    dir: 'title',
    name: 'Title',
    ctrl: 'sap.m.Title'
  },
  {
    dir: 'table',
    name: 'Table',
    ctrl: 'sap.m.Table'
  },
  {
    dir: 'text',
    name: 'Text',
    ctrl: 'sap.m.Text'
  },
  {
    dir: 'toolbar-spacer',
    name: 'ToolbarSpacer',
    ctrl: 'sap.m.ToolbarSpacer'
  },
  {
    dir: 'panel',
    name: 'Panel',
    ctrl: 'sap.m.Panel'
  },

  // sap.ui.layout
  {
    dir: 'horizontal-layout',
    name: 'HorizontalLayout',
    ctrl: 'sap.ui.layout.HorizontalLayout'
  },
  {
    dir: 'vertical-layout',
    name: 'VerticalLayout',
    ctrl: 'sap.ui.layout.VerticalLayout'
  },

  // sap.f
  {
    dir: 'dynamic-page',
    name: 'DynamicPage',
    ctrl: 'sap.f.DynamicPage'
  },
  {
    dir: 'dynamic-page-title',
    name: 'DynamicPageTitle',
    ctrl: 'sap.f.DynamicPageTitle'
  },
  {
    dir: 'dynamic-page-header',
    name: 'DynamicPageHeader',
    ctrl: 'sap.f.DynamicPageHeader'
  },

];

const COMPONENT_TEMPLATE = `
/**
 * Author: Bodhi Hu (bodhi.hu@sap.com)
 */

import ReactiveUI5ControlClass from "../ui5/ReactiveUI5ControlClass";

const [_NAME_] = ReactiveUI5ControlClass({
  UI5Control: [_CTRL_],
  containerClass: "UI5[_NAME_]"
});

export default [_NAME_];

`;

const INDEX_TEMPLATE = `
/**
 * Author: Bodhi Hu (bodhi.hu@sap.com)
 */

import [_NAME_] from './[_NAME_]';
export default [_NAME_];

`;

ui5Components.forEach((comp) => {
  const compPath = path.resolve(__dirname, `../src/${comp.dir}`);
  if (fs.existsSync(compPath)) {
    console.warn(
      `  // ignoring: ${comp.name}:\n` +
      `               => already exists: ${compPath}`
    );
    return;
  }

  console.info(
    `  creating ${comp.name}\n` +
    `                 => under: ${compPath}`
  );

  fs.mkdirSync(compPath);
  fs.writeFileSync(`${compPath}/${comp.name}.js`,
    COMPONENT_TEMPLATE
      .replace(/\[_NAME_\]/g, comp.name)
      .replace(/\[_CTRL_\]/g, comp.ctrl)
  );
  fs.writeFileSync(`${compPath}/index.js`,
    INDEX_TEMPLATE
      .replace(/\[_NAME_\]/g, comp.name)
  );
});
