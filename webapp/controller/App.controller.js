sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType",
	"sap/ui/model/Sorter",
], function (Controller, JSONModel, MessageToast, MessageBox, Filter, FilterOperator, FilterType, Sorter) {
	"use strict";

	return Controller.extend("sap.ui.core.tutorial.odatav4.controller.App", {

		/**
		 *  Hook for initializing the controller
		 */
		onInit : function () {
			var oJSONData = {
					busy : false,
					order: 0
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
		},
		onSearch: function(event) {
			const userQuery = event.getParameters().query;
			const filter = new Filter("LastName", FilterOperator.Contains, userQuery);

			this.getView().byId("peopleList").getBinding("items").filter(filter, FilterType.Application);
		},
		onSort: function(event) {
			const view = this.getView();
			const sortStates = [undefined, "asc", "desc"];
			const sortStateMessageIds = ["sortNone", "sortAscending", "sortDescending"];

			let order = view.getModel("appView").getProperty("/order");
			order = (order + 1) % sortStates.length;
			view.getModel("appView").setProperty("/order", order);

			const currentSortState = sortStates[order];

			view.byId("peopleList").getBinding("items").sort(
				currentSortState && 
				new Sorter("LastName", currentSortState === "desc")
			);

			const resourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			MessageToast.show(resourceBundle.getText(sortStateMessageIds[order]));

		}
	});
});
