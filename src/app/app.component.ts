import { Component, ViewEncapsulation } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import * as go from 'gojs';
import { DataSyncService, DiagramComponent, PaletteComponent } from 'gojs-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'angular-flowchart-generator';
  display = false;
  public diagramDivClassName: string = 'myDiagramDiv';
  public diagramModelData = { prop: 'value' };
  public skipsDiagramUpdate = false;

  constructor(private confirmService: ConfirmationService) { }

  inputVariables: any[] = [
    { name: 'Age', source: 'Context' }
  ]

  cities = [
    { name: 'None', code: '' },
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
  ];

  add() {
    this.display = true;
  }

  public initDiagram(): go.Diagram {

    const $ = go.GraphObject.make;
    const dia = $(go.Diagram, {
      'undoManager.isEnabled': true,
      allowZoom: false,
      layout: $(go.TreeLayout,
        { angle: 90, nodeSpacing: 50, layerSpacing: 100 }),
      model: $(go.GraphLinksModel,
        {
          linkKeyProperty: 'key'
        }
      )
    });

    dia.nodeTemplate =
      $(go.Node, "Auto",
        $(go.Shape,
          "RoundedRectangle",
          {
            fill: 'white',
            stroke: '#aaa',
            strokeWidth: 1,
            shadowVisible: true,
            minSize: new go.Size(150, 50)
          }),
        $(go.Panel, "Table",
          { defaultAlignment: go.Spot.Center, margin: new go.Margin(5, 10, 5, 10) },
          $(go.RowColumnDefinition, { column: 1, width: 4 }),
          $(go.TextBlock,
            { row: 0, column: 0, columnSpan: 3, alignment: go.Spot.Center },
            { font: "8pt sans-serif", margin: 2 }, new go.Binding("text", "head")),
          $(go.TextBlock,
            { row: 1, column: 2 },
            { font: "bold 12pt sans-serif", margin: new go.Margin(5, 0, 0, 0), stroke: 'darkblue', textAlign: 'center' },
            new go.Binding("text", "body"))
        )
      );

    dia.linkTemplate = $(go.Link,
      $(go.Shape),
      // $(go.Shape, { toArrow: "Standard" }),
      $(go.TextBlock, { background: 'whitesmoke', stroke: "#333", font: '8pt sans-serif' },
        new go.Binding("text", "text"))
    );

    return dia;
  }

  public diagramNodeData = [
    { key: 1, head: "Is Rich", body: "Age > 21 AND Income > 1M" },
    { key: 2, head: "Is Bankrupt", body: "B" },
    { key: 3, head: "Has Good Credit", body: "FICO > 700" },
    { key: 4, head: 'IsApproved', body: 'True' },
    { key: 5, head: 'IsApproved', body: 'False' },
    { key: 6, head: 'IsApproved', body: 'True' },
    { key: 7, head: 'IsApproved', body: 'False' }
  ];

  public diagramLinkData = [
    { from: 1, to: 2, text: 'True' },
    { from: 1, to: 3, text: 'False' },
    { from: 2, to: 4, text: 'True' },
    { from: 2, to: 5, text: 'False' },
    { from: 3, to: 6, text: 'True' },
    { from: 3, to: 7, text: 'False' }
  ];

  public diagramModelChange = function (changes: go.IncrementalData) {
    this.skipsDiagramUpdate = true;
    this.diagramNodeData = DataSyncService.syncNodeData(changes, this.diagramNodeData);
    this.diagramLinkData = DataSyncService.syncLinkData(changes, this.diagramLinkData);
    this.diagramModelData = DataSyncService.syncModelData(changes, this.diagramModelData);
  };

}
