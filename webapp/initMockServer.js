sap.ui.define([
    "sap/d/sapui5odatav4tutorial/localService/mockserver",
    "sap/m/MessageBox",
], function(mockserver) {
    "use strict";

    mockserver.init().catch(function(error) {
        MessageBox.error(error.message);
    }).finally(function() {
        sap.ui.require(["sap/ui/core/ComponentSupport"]);
    });
});