sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("sap.d.sapui5odatav4tutorial.controller.MainView", {
        onInit: function () {
            const model = new JSONModel({ busy: false });

			this.getView().setModel(model, "View");
        }
    });
});