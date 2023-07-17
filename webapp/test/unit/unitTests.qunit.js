/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"sapd/sapui5-odatav4-tutorial/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
