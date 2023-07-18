sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
], function (Controller, JSONModel, MessageToast, MessageBox) {
	"use strict";

	return Controller.extend("sap.ui.core.tutorial.odatav4.controller.App", {

		/**
		 *  Hook for initializing the controller
		 */
		onInit : function () {
			var oJSONData = {
					busy : false
				},
				oModel = new JSONModel(oJSONData);

			this.getView().setModel(oModel, "appView");
		},
		onRefresh: function() {
			const resourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

			const binding = this.byId("peopleList").getBinding("items");
			if(binding.hasPendingChanges()) {
				MessageBox.error(resourceBundle.getText("refreshNotPossibleMessage"));
				return;
			}

			binding.refresh();
			MessageToast.show(resourceBundle.getText("refreshSuccessMessage"));
		}
	});
});
