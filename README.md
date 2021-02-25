# reactive.fiori

> A lightweight react library wrapping [SAP UI5](https://github.com/SAP/openui5) controls

## Getting started

1. install reactive.fiori package
```
$ npm install reactive.fiori
```

2. add UI5 library
```
    <!-- load the stylesheets eagerly, this can improve the page rendering -->
    <link rel="stylesheet" id="sap-ui-theme-sap.ui.core"
      href="https://sapui5.hana.ondemand.com/resources/sap/ui/core/themes/sap_belize/library.css">
    <link rel="stylesheet" id="sap-ui-theme-sap.m"
      href="https://sapui5.hana.ondemand.com/resources/sap/m/themes/sap_belize/library.css">
    <link rel="stylesheet" id="sap-ui-theme-sap.ui.layout"
      href="https://sapui5.hana.ondemand.com/resources/sap/ui/layout/themes/sap_belize/library.css">

    <!-- load SAP UI5 with configs -->
    <script
		  id="sap-ui-bootstrap"
		  src="https://sapui5.hana.ondemand.com/resources/sap-ui-core.js"
		  data-sap-ui-theme="sap_belize"
		  data-sap-ui-libs="sap.m"
		  data-sap-ui-async="false"
    >
```

3. bootstrap UI5 and then render the react ```<App />```

```
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import bootUI5 'reactive.fiori/src/ui5/bootstrap';

bootUI5(() => {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
});
```

4. render react views with reactive.fiori

```

import React from "react";

import Button from 'reactive.fiori/src/button';
import Breadcrumbs from 'reactive.fiori/src/breadcrumbs';
import Link from 'reactive.fiori/src/link';
import DynamicPage from 'reactive.fiori/src/dynamic-page';
import DynamicPageTitle from 'reactive.fiori/src/dynamic-page-title';
import DynamicPageHeader from 'reactive.fiori/src/dynamic-page-header';
import Title from 'reactive.fiori/src/title';
import OverflowToolbar from 'reactive.fiori/src/overflow-toolbar';
import Text from 'reactive.fiori/src/text';
import FlexBox from 'reactive.fiori/src/flex-box';
import Panel from 'reactive.fiori/src/panel';
import VerticalLayout from 'reactive.fiori/src/vertical-layout';
import ToolbarSpacer from 'reactive.fiori/src/toolbar-spacer';

import { createIDStore } from 'reactive.fiori/src/ui5/utils';

class ExamplePage extends React.Component {

  constructor (props) {
    super(props);

    this.state = {};

    // this will create a local idStore for reusing unique IDs
    this.idStore = createIDStore();
  }

  render() {

    // use uniqueId to generate unique and persistent IDs for the major elements
    // this can improve rendering and performance
    const { uniqueId } = this.idStore;

    return (
      <DynamicPage
        containerProps={{
          style: { height: "100%" }
        }}

        title={(
          <DynamicPageTitle
            ctrlId={uniqueId('pageTitle')}
            heading={(
              <Title text="Request for Bodhi" />
            )}
            breadcrumbs={(
              <Breadcrumbs>
                <Link text="Home Page" />
                <Link text="My Workflow Requests" />
                <Link text="Workflow Details" />
              </Breadcrumbs>
            )}
          />
        )}

        header={(
          <DynamicPageHeader ctrlId={uniqueId('pageHeader')} pinnable={false} >
            <FlexBox justifyContent="SpaceBetween" >
              <Text text="General info" />
              <Text text="Subject user" />
            </FlexBox>
          </DynamicPageHeader>
        )}
        toggleHeaderOnTitleClick={false}

        content={(
          <VerticalLayout ctrlId={uniqueId('pageContent')} >
            <Panel
              headerText="" expandable={false} width={`${window.innerWidth * 0.9}px`} class="sapUiResponsiveMargin"
            >
              <Text text={`Name: Bodhi`} />
            </Panel>
            <Panel
              headerText="This is Panel" expandable={true} width={`${window.innerWidth * 0.9}px`} class="sapUiResponsiveMargin"
            >
              <Text text={`panel content`} />
            </Panel>
          </VerticalLayout>
        )}

        showFooter={true}
        footer={(
          <OverflowToolbar ctrlId={uniqueId('pageFooter')} >
            <Button type="Accept" text="Update" />
            <ToolbarSpacer />
            <Button type="Accept" text="Approve" />
            <Button type="Reject" text="Decline" />
            <Button type="Reject" text="Sendback" />
          </OverflowToolbar>
        )}
      >
      </DynamicPage>
    );
  }
}

export default ExamplePage;

```

## Missing UI5 Components ?

Just add it to ```./scripts/create-reactive-ui5-components.js```, for example:

```
  {
    dir: 'dynamic-page',
    name: 'DynamicPage',
    ctrl: 'sap.f.DynamicPage'
  },
```

And run:

```
node ./scripts/create-reactive-ui5-components.js
```

This will create a new class(```ReactiveUI5Component```) for the given UI5 Control

## Roadmaps

[ ] integrate Github CICD pipeline;
[ ] add webpack/babeljs building systems;
[ ] supports on-demand-loading of UI5 controls;
