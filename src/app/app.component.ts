import { Component, ViewEncapsulation } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import * as go from 'gojs';
import { DataSyncService, DiagramComponent, PaletteComponent } from 'gojs-angular';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'GoJS App in Angular';

  model = new go.GraphLinksModel(
    [
      /*{ key: 1, text: "Alpha", color: "lightblue" },
      { key: 2, text: "Beta", color: "orange" },
      { key: 3, text: "Gamma", color: "lightgreen" },
      { key: 4, text: "Delta", color: "pink" }*/
    ],
    [
      /*{ from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 2 },
      { from: 3, to: 4 },
      { from: 4, to: 1 }*/
    ]);

  @ViewChild('text')
  private textField: ElementRef;

  data: any;
  node: go.Node;

  showDetails(node: go.Node | null) {
    this.node = node;
    if (node) {
      // copy the editable properties into a separate Object
      this.data = {
        text: node.data.text,
        color: node.data.color
      };
    } else {
      this.data = null;
    }
  }

  onCommitDetails() {
    if (this.node) {
      const model = this.node.diagram.model;
      // copy the edited properties back into the node's model data,
      // all within a transaction
      model.startTransaction();
      model.setDataProperty(this.node.data, "text", this.data.text);
      /*model.setDataProperty(this.node.data, "name", this.data.name);*/
      model.setDataProperty(this.node.data, "color", this.data.color);
      model.commitTransaction("modified properties");
    }
  }

  onCancelChanges() {
    // wipe out anything the user may have entered
    this.showDetails(this.node);
  }

  onModelChanged(c: go.ChangedEvent) {
    // who knows what might have changed in the selected node and data?
    this.showDetails(this.node);
  }

  // title = 'angular-flowchart-generator';
  // display = false;
  // public diagramDivClassName: string = 'myDiagramDiv';
  // public diagramModelData = { prop: 'value' };
  // public skipsDiagramUpdate = false;

  // constructor(private confirmService: ConfirmationService) { }

  // inputVariables: any[] = [
  //   { name: 'Age', source: 'Context' }
  // ]

  // cities = [
  //   { name: 'None', code: '' },
  //   { name: 'New York', code: 'NY' },
  //   { name: 'Rome', code: 'RM' },
  //   { name: 'London', code: 'LDN' },
  //   { name: 'Istanbul', code: 'IST' },
  //   { name: 'Paris', code: 'PRS' }
  // ];

  // add() {
  //   this.display = true;
  // }

  // public initDiagram(): go.Diagram {

  //   const $ = go.GraphObject.make;
  //   const dia = $(go.Diagram, {
  //     'undoManager.isEnabled': true,
  //     allowZoom: false,
  //     layout: $(go.LayeredDigraphLayout, {
  //       direction: 90,
  //       columnSpacing: 30,
  //       layeringOption: go.LayeredDigraphLayout.LayerLongestPathSource,
  //       packOption: go.LayeredDigraphLayout.PackMedian,
  //       setsPortSpots: true,
  //       maxColumn: 2,
  //       maxIndexLayer: 2
  //     }),
  //     model: $(go.GraphLinksModel,
  //       {
  //         linkKeyProperty: 'key'
  //       }
  //     )
  //   });

  //   dia.nodeTemplate =
  //     $(go.Node, "Auto",
  //       $(go.TextBlock,
  //         { font: "bold 12pt sans-serif", margin: new go.Margin(5, 0, 0, 0), stroke: 'darkblue', textAlign: 'center' },
  //         new go.Binding("text", "body"))
  //     );

  //   dia.linkTemplate = $(go.Link,
  //     $(go.Shape),
  //     $(go.Shape, { toArrow: "Standard" })
  //   );

  //   return dia;
  // }

  // public diagramNodeData = [
  //   { key: 1, body: "ALS.Account_Master #1" },
  //   { key: 2, body: "CFMart.Trans_History #2" },
  //   { key: 3, body: "Filter #3" },
  //   { key: 4, body: 'Aggregate #4' },
  //   { key: 5, body: 'Join #5' },
  //   { key: 6, body: 'Derive #6' },
  //   { key: 7, body: 'Auto.Accounts #7' },
  //   { key: 0, body: "" }
  // ];

  // public diagramLinkData = [
  //   { from: 1, to: 5 },
  //   { from: 2, to: 3 },
  //   { from: 3, to: 4 },
  //   { from: 4, to: 5 },
  //   { from: 5, to: 6 },
  //   { from: 6, to: 7 }
  // ];

  // public diagramModelChange = function (changes: go.IncrementalData) {
  //   this.skipsDiagramUpdate = true;
  //   this.diagramNodeData = DataSyncService.syncNodeData(changes, this.diagramNodeData);
  //   this.diagramLinkData = DataSyncService.syncLinkData(changes, this.diagramLinkData);
  //   this.diagramModelData = DataSyncService.syncModelData(changes, this.diagramModelData);
  // };

}
