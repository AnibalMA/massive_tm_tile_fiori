sap.ui.define([
    "sap/ui/core/UIComponent",
    "anibal/ma/fdesigner/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("anibal.ma.fdesigner.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            sap.ui.getCore().setModel(this.getModel());
            sap.ui.getCore().setModel(this.getModel("transport"), "transport");

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();
        }
    });
});