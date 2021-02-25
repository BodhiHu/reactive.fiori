
export default function bootUI5 (onBooted) {

  sap.ui.define([
    "sap/ui/core/Control"
  ], function (
    Control
  ) {

    "use strict";

    console.info("UI5 is ready");

    sap.ui.getCore().attachInit(function () {
      console.info("UI5 is inited/booted");
      onBooted && onBooted();
    });

  });

}
