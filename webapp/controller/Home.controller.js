sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "../model/map",
    "../services/s4hana.service"
], (Controller, Map, S4HService) => {
    "use strict";
    let oModel;
    let oModelTransport;
    const oHTTPCodes = {
        OK: 200,
        CREATED: 201,
        ACCEPTED: 202,
        NO_CONTENT: 204,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        INTERNAL_SERVER_ERROR: 500
    };
    return Controller.extend("anibal.ma.fdesigner.controller.Home", {
        onInit() {
            oModel = this.getOwnerComponent().getModel();
            oModelTransport = this.getOwnerComponent().getModel("transport");
            this.fnListOTs();
            this.fnGetDefaultPackage();
        },
        onLeerExcel: function () {
            let oFileUploader = this.byId("fileUploader");
            let oFile = oFileUploader.oFileUpload.files?.[0] || false;

            if (!oFile) {
                sap.m.MessageBox.error("Por favor seleccione un archivo Excel");
                return;
            }

            let fileName = oFile.name;
            let fileExtension = fileName.split('.').pop().toLowerCase();

            if (fileExtension !== "xlsx" && fileExtension !== "xls") {
                sap.m.MessageBox.error("Por favor seleccione un archivo Excel válido (.xlsx o .xls)");
                return;
            }

            return new Promise((resolve, reject) => {

                let reader = new FileReader();

                reader.onload = function (e) {
                    let data = new Uint8Array(e.target.result);
                    let workbook = XLSX.read(data, {
                        type: 'array'
                    });

                    let firstSheet = workbook.SheetNames[0];
                    let worksheet = workbook.Sheets[firstSheet];

                    let result = XLSX.utils.sheet_to_json(worksheet, {
                        raw: true,
                        defval: ""
                    });

                    let processedData = result.map(function (row) {
                        if (!row.ID_CATALOG) {
                            sap.m.MessageBox.error("El archivo no contiene la columna ID_CATALOG");
                            resolve([]);
                        }
                        return ({
                            oBodyTile: Map.fnGetTileJson(row),
                            oBodyTM: Map.fnGetTMJson(row)
                        });
                    });

                    console.log(processedData);
                    resolve(processedData);
                }.bind(this);

                reader.onerror = function (ex) {
                    console.log(ex);
                    sap.m.MessageBox.error("Error al procesar el archivo: " + ex.message);
                };

                reader.readAsArrayBuffer(oFile);
            });
        },
        onPressProcesar: async function () {
            let oKeyWB = this.getView().getModel("OTWorkbenchs").getProperty("/selectedOT").toString().trim();
            let oKeyPackage = this.getView().getModel("Package").getProperty("/id")?.toString().trim();

            if (!oKeyWB) {
                sap.m.MessageBox.error("Por favor seleccione una OT Workbench");
                return;
            }

            if (!oKeyPackage) {
                sap.m.MessageBox.error("Por favor ingrese un Paquete");
                return;
            }

            let oDefaultWB = await S4HService.fnGetOT(true);
            let oDefaultPackage = await S4HService.fnGetPackage(true);

            if (oDefaultWB.id != oKeyWB) {
                await S4HService.fnPutOT({
                    id: oDefaultWB.id,
                    isDefaultRequest: true
                });
            }

            if (oDefaultPackage.id != oKeyPackage) {
                await S4HService.fnPutPackage({
                    id: oDefaultPackage.id,
                    isDefaultPackage: true
                });
            }

            let oData = await this.onLeerExcel();
            let aPromises = [];

            if (!oData) {
                return;
            }

            oData.forEach((item) => {
                aPromises.push(S4HService.fnPostTileTM(item.oBodyTile, item.oBodyTM));
            });

            Promise.all(aPromises).then((oResult) => {
                console.log(oResult);
                
                let aFinalResult = [];

                oResult.forEach((oRow, iRowIndex) => {
                    aFinalResult.push({
                        id: iRowIndex + 1,
                        name: JSON.parse(JSON.parse(oData[iRowIndex].oBodyTile.configuration).tileConfiguration).display_title_text + " / " + JSON.parse(JSON.parse(oData[iRowIndex].oBodyTM.configuration).tileConfiguration).transaction?.code,
                        statusTitle: oRow.oResTitle.oResponse.statusCode === oHTTPCodes.CREATED ? `OK (${oRow.oResTitle.oResponse.statusCode} - ${oRow.oResTitle.oResponse.statusText})` : `Error (${oRow.oResTitle.oResponse.statusCode} - ${oRow.oResTitle.oResponse.statusText})`,
                        statusTM: oRow.oResTM.oResponse.statusCode == oHTTPCodes.CREATED ? `OK (${oRow.oResTM.oResponse.statusCode} - ${oRow.oResTM.oResponse.statusText})` : `Error (${oRow.oResTM.oResponse.statusCode} - ${oRow.oResTM.oResponse.statusText})`
                    });
                });

                this.getView().setModel(new sap.ui.model.json.JSONModel(aFinalResult), "oProcessResult");
                sap.m.MessageToast.show("Proceso terminado");
            }, this);
        },
        fnListOTs: async function () {
            let aData = await S4HService.fnGetOTs();
            let oDataSet = {
                selectedOT: aData.filter((item) => item.isDefaultRequest === true)?.[0]?.id,
                items: aData
            };
            this.getView().setModel(new sap.ui.model.json.JSONModel(oDataSet), "OTWorkbenchs");
        },
        fnGetDefaultPackage: function () {
            let oData = S4HService.fnGetPackage(true);
            this.getView().setModel(new sap.ui.model.json.JSONModel(oData?.results?.[0] || {}), "Package");
        }
    });
});