sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("JRNCM.excel.controller.App", {
            onInit: function () {
                let oModel = new sap.ui.model.json.JSONModel([]);
                this.getView().setModel(oModel, "excelModel");
            },

            uploadExcel: function (oEvent) {
                this._importExcel(oEvent.getParameter("files"), 0);
            },

            _importExcel: function (files, index) {
                let file = files[index];
                if (file && window.FileReader) {
                    let excelData = [];
                    let reader = new FileReader();
                    reader.onload = function (oEvent) {
                        let data = oEvent.target.result; 
                        let workbook = XLSX.read(data, {
                            type: 'binary'
                        });

                        let excelModel = this.getView().getModel("excelModel");
                        let json = excelModel.getData();

                        let lastId = 1;
                        if (json.length > 0) {
                            lastId = json[json.length - 1].id + 1;
                        }

                        workbook.SheetNames.forEach(sheetName => {
                            excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);

                            for (var i in excelData) {
                                excelData[i].id = lastId;
                                lastId = ++lastId;
                                excelData[i].name = excelData[i]["Name"];
                                excelData[i].department = excelData[i]["Department"];
                                excelData[i].departmentDescrip = excelData[i]["Description"];
                                excelData[i].jobCode = excelData[i]["Job Code"];
                                excelData[i].jobTitle = excelData[i]["Title"];
                                excelData[i].monthlyRate = excelData[i]["Rate"];
                                excelData[i].currency = excelData[i]["Currency"];
                                excelData[i].startDate = excelData[i]["Start Date"];
                                excelData[i].endDate = excelData[i]["End Date"];
                                json.push(excelData[i]);
                            }
                        });
                        excelModel.refresh();
                        this._importExcel(files, ++index);
                    }.bind(this);
                    reader.onerror = function (ex) {
                        console.log(ex);
                    }.bind(this);

                    reader.readAsBinaryString(file);
                }
            }
        });
    });
