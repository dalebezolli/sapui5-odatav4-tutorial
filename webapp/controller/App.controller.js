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
		onInit: function() {
			const messageManager = sap.ui.getCore().getMessageManager();
			const messageModel = messageManager.getMessageModel();
			const messageModelBinding = messageModel.bindList("/", undefined, [], new Filter("technical", FilterOperator.EQ, true));

			const model = new JSONModel({
				busy : false,
				hasUIChanges: false,
				usernameEmpty: true,
				order: 0
			});

			this.getView().setModel(model, "appView");
			this.getView().setModel(messageModel, "message");

			messageModelBinding.attachChange(this.onMessageBindingChange, this);
			this._technicalErrors = false;
		},
		onCreate: function() {
			const list = this.byId("peopleList");
			const binding = list.getBinding("items");
			const context = binding.create({
				"UserName": "",
				"FirstName": "",
				"LastName": "",
				"Age": "18"
			});

			this._setUIChanges();
			this.getView().getModel("appView").setProperty("/usernameEmpty", true);

			list.getItems().some(item => {
				if(item.getBindingContext() === context) {
					item.focus();
					item.setSelected(true);
					return true;
				}
			})
		},
		onDelete: function() {
			const selected = this.byId("peopleList").getSelectedItem();
		
			if(!selected) return;

			const resourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			const context = selected.getBindingContext();
			const deletedUsername = context.getProperty("UserName");

			console.log(context);

			context.delete().then(successCallback, errorCallback);
			// this._setUIChanges(true);

			const successCallback = function() {
				MessageToast.show(resourceBundle.getText("deletionSuccessMessage", [deletedUsername]));
			}.bind(this);

			const errorCallback = function(error) {
				this._setUIChanges();
				
				if(error.canceled) {
					MessageToast.show(resourceBundle.getText("deletionRestoreMessage", [deletedUsername]));
					return;
				}

				MessageBox.error(error.message + ": " + deletedUsername);
			}.bind(this);

		},
		onInputChange: function(event) {
			if(event.getParameter("escPressed")) {
				this._setUIChanges();
			} else {
				this._setUIChanges(true);
				if(event.getSource().getParent().getBindingContext().getProperty("UserName")) {
					this.getView().getModel("appView").setProperty("/usernameEmpty", false);
				}
			}
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
		onResetChanges: function() {
			this.byId("peopleList").getBinding("items").resetChanges();
			this._technicalErrors = false;
			this._setUIChanges();
		},
		onSave: function() {
			const resourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

			const successCallback = function() {
				this._setBusy(false);
				this._setUIChanges(false);
				MessageToast.show(resourceBundle.getText("changesSentMessage"));
			}.bind(this);

			const errorCallback = function(error) {
				this._setBusy(false);
				this._setUIChanges(false);
				MessageBox.error(error.message);
			}.bind(this);

			this._setBusy(true);
			this._technicalErrors = false;
			this.getView().getModel().submitBatch("peopleGroup").then(successCallback, errorCallback);
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

		},
		onMessageBindingChange: function(event) {
			const contexts = event.getSource().getContexts();
			const messageOpen = false;

			if(messageOpen || !contexts.length) return;

			const messages = contexts.map(context => {
				return context.getObject();
			});

			sap.ui.getCore().getMessageManager().removeMessages(messages);

			this._setUIChanges(true);
			this._technicalErrors = true;
			MessageBox.error(messages[0].message, {
				id: "serviceErrorMessageBox",
				onClose: function() {
					messageOpen = false;
				}
			});

			messageOpen = true;
		},
		_setUIChanges: function(hasUIChanges) {
			if(this._technicalErrors) {
				hasUIChanges = true;
			} else if(hasUIChanges === undefined) {
				hasUIChanges = this.getView().getModel().hasPendingChanges();
			}

			const model = this.getView().getModel("appView");
			model.setProperty("/hasUIChanges", hasUIChanges);
		},
		_setBusy: function(isBusy) {
			const model = this.getView().getModel("appView");
			model.setProperty("/busy", isBusy);
		}
	});
});
