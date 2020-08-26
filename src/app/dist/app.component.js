"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppComponent = void 0;
var core_1 = require("@angular/core");
var go = require("gojs");
var gojs_angular_1 = require("gojs-angular");
var AppComponent = /** @class */ (function () {
    function AppComponent(confirmService) {
        this.confirmService = confirmService;
        this.title = 'angular-flowchart-generator';
        this.display = false;
        this.diagramDivClassName = 'myDiagramDiv';
        this.diagramModelData = { prop: 'value' };
        this.skipsDiagramUpdate = false;
        this.inputVariables = [
            { name: 'Age', source: 'Context' }
        ];
        this.cities = [
            { name: 'None', code: '' },
            { name: 'New York', code: 'NY' },
            { name: 'Rome', code: 'RM' },
            { name: 'London', code: 'LDN' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Paris', code: 'PRS' }
        ];
        this.diagramNodeData = [
            { key: 1, head: "Is Rich", body: "Age > 21 AND Income > 1M" },
            { key: 2, head: "Is Bankrupt", body: "B" },
            { key: 3, head: "Has Good Credit", body: "FICO > 700" },
            { key: 4, head: 'IsApproved', body: 'True' },
            { key: 5, head: 'IsApproved', body: 'False' },
            { key: 6, head: 'IsApproved', body: 'True' },
            { key: 7, head: 'IsApproved', body: 'False' }
        ];
        this.diagramLinkData = [
            { from: 1, to: 2, text: 'True' },
            { from: 1, to: 3, text: 'False' },
            { from: 2, to: 4, text: 'True' },
            { from: 2, to: 5, text: 'False' },
            { from: 3, to: 6, text: 'True' },
            { from: 3, to: 7, text: 'False' }
        ];
        this.diagramModelChange = function (changes) {
            this.skipsDiagramUpdate = true;
            this.diagramNodeData = gojs_angular_1.DataSyncService.syncNodeData(changes, this.diagramNodeData);
            this.diagramLinkData = gojs_angular_1.DataSyncService.syncLinkData(changes, this.diagramLinkData);
            this.diagramModelData = gojs_angular_1.DataSyncService.syncModelData(changes, this.diagramModelData);
        };
    }
    AppComponent.prototype.add = function () {
        this.display = true;
    };
    AppComponent.prototype.initDiagram = function () {
        var $ = go.GraphObject.make;
        var dia = $(go.Diagram, {
            'undoManager.isEnabled': true,
            allowZoom: false,
            layout: $(go.TreeLayout, { angle: 90, nodeSpacing: 50, layerSpacing: 100 }),
            model: $(go.GraphLinksModel, {
                linkKeyProperty: 'key'
            })
        });
        dia.nodeTemplate =
            $(go.Node, "Auto", $(go.Shape, "RoundedRectangle", {
                fill: 'white',
                stroke: '#aaa',
                strokeWidth: 1,
                shadowVisible: true,
                minSize: new go.Size(150, 50)
            }), $(go.Panel, "Table", { defaultAlignment: go.Spot.Center, margin: new go.Margin(5, 10, 5, 10) }, $(go.RowColumnDefinition, { column: 1, width: 4 }), $(go.TextBlock, { row: 0, column: 0, columnSpan: 3, alignment: go.Spot.Center }, { font: "8pt sans-serif", margin: 2 }, new go.Binding("text", "head")), $(go.TextBlock, { row: 1, column: 2 }, { font: "bold 12pt sans-serif", margin: new go.Margin(5, 0, 0, 0), stroke: 'darkblue', textAlign: 'center' }, new go.Binding("text", "body"))));
        dia.linkTemplate = $(go.Link, $(go.Shape), 
        // $(go.Shape, { toArrow: "Standard" }),
        $(go.TextBlock, { background: 'whitesmoke', stroke: "#333", font: '8pt sans-serif' }, new go.Binding("text", "text")));
        return dia;
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app-root',
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
