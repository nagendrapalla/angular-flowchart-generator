import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import * as go from 'gojs';

@Component({
  selector: 'app-diagram-editor',
  templateUrl: './diagram-editor.component.html',
  styleUrls: ['./diagram-editor.component.css']
})
export class DiagramEditorComponent implements OnInit, AfterViewInit {
  private diagram: go.Diagram = new go.Diagram();
  private palette: go.Palette = new go.Palette();
  _CachedArrays = [];

  @ViewChild('diagramDiv')
  private diagramRef: ElementRef;

  @ViewChild('paletteDiv')
  private paletteRef: ElementRef;

  @Input()
  get model(): go.Model { return this.diagram.model; }
  set model(val: go.Model) { this.diagram.model = val; }

  @Output()
  nodeSelected = new EventEmitter<go.Node | null>();

  @Output()
  modelChanged = new EventEmitter<go.ChangedEvent>();

  tempArray() {
    var temp = this._CachedArrays.pop();
    if (temp === undefined) return [];
    return temp;
  };

  freeArray(a) {
    a.length = 0;  // clear any references to objects
    this._CachedArrays.push(a);
  };

  createPolygon(sides) {
    // Point[] points = new Point[sides + 1];
    var points = this.tempArray();
    var radius = .5;
    var center = .5;
    var offsetAngle = Math.PI * 1.5;
    var angle = 0;

    // Loop through each side of the polygon
    for (var i = 0; i < sides; i++) {
      angle = 2 * Math.PI / sides * i + offsetAngle;
      points[i] = new go.Point((center + radius * Math.cos(angle)), (center + radius * Math.sin(angle)));
    }

    // Add the last line
    // points[points.length - 1] = points[0];
    points.push(points[0]);
    return points;
  };

  constructor() {
    const $ = go.GraphObject.make;

    this.diagram = new go.Diagram();
    this.diagram.initialContentAlignment = go.Spot.Center;
    this.diagram.allowDrop = true;  // necessary for dragging from Palette
    this.diagram.undoManager.isEnabled = true;
    this.diagram.addDiagramListener("ChangedSelection",
      e => {
        const node = e.diagram.selection.first();
        this.nodeSelected.emit(node instanceof go.Node ? node : null);
      });
    this.diagram.addModelChangedListener(e => e.isTransactionFinished && this.modelChanged.emit(e));

    go.Shape.defineFigureGenerator("Hexagon", function (shape, w, h) {
      var points = this.createPolygon(6);
      var geo = new go.Geometry();
      var fig = new go.PathFigure(points[0].x * w, points[0].y * h, true);
      geo.add(fig);

      for (var i = 1; i < 6; i++) {
        fig.add(new go.PathSegment(go.PathSegment.Line, points[i].x * w, points[i].y * h));
      }
      fig.add(new go.PathSegment(go.PathSegment.Line, points[0].x * w, points[0].y * h).close());
      this.freeArray(points);
      geo.spot1 = new go.Spot(.07, .25);
      geo.spot2 = new go.Spot(.93, .75);
      return geo;
    });


    this.diagram.nodeTemplate =
      $(go.Node, "Auto",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape, "hexagon",
          {
            fill: "white", strokeWidth: 0,
            portId: "", cursor: "pointer",
            // allow many kinds of links
            fromLinkable: true, toLinkable: true,
            fromLinkableSelfNode: true, toLinkableSelfNode: true,
            fromLinkableDuplicates: true, toLinkableDuplicates: true
          },
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          { margin: 8, editable: true },
          new go.Binding("text").makeTwoWay())
      );

    this.diagram.linkTemplate =
      $(go.Link,
        // allow relinking
        { relinkableFrom: true, relinkableTo: true },
        $(go.Shape),
        $(go.Shape, { toArrow: "OpenTriangle" })
      );

    this.palette = new go.Palette();
    this.palette.nodeTemplateMap = this.diagram.nodeTemplateMap;

    //noFillCircle with min border
    this.diagram.nodeTemplateMap.add("noFillCircle",
      $(go.Node, "Spot",
        $(go.Panel, "Auto",
          $(go.Shape, "circle",
            {
              minSize: new go.Size(30, 30), fill: "white", stroke: "#42adf4", strokeWidth: 2,
              portId: "", cursor: "pointer", fromLinkable: true, toLinkable: true,
              fromLinkableSelfNode: true, toLinkableSelfNode: true,
              fromLinkableDuplicates: true, toLinkableDuplicates: true
            }),
          $(go.TextBlock, "circle",
            { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: "black", margin: 4 },
            new go.Binding("text"))
        ),
      ));
    //noFillCircle with some border
    this.diagram.nodeTemplateMap.add("borderCircle",
      $(go.Node, "Spot",
        $(go.Panel, "Auto",
          $(go.Shape, "circle",
            {
              minSize: new go.Size(50, 50), fill: "white", strokeWidth: 5, stroke: "#42adf4",
              portId: "", cursor: "pointer", fromLinkable: true, toLinkable: true,
              fromLinkableSelfNode: true, toLinkableSelfNode: true,
              fromLinkableDuplicates: true, toLinkableDuplicates: true
            }),
          $(go.TextBlock, "circle",
            { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: "black", margin: 6 },
            new go.Binding("text"))
        ),
      ));
    //noFillSquare with some border ,shape common for all ivokes
    this.diagram.nodeTemplateMap.add("RoundedRectangle",
      $(go.Node, "Spot",
        $(go.Panel, "Auto",
          $(go.Shape, "RoundedRectangle",
            {
              width: 90, height: 70, fill: "white", strokeWidth: 2, stroke: "#75efd9",
              portId: "", cursor: "pointer", fromLinkable: true, toLinkable: true,
              fromLinkableSelfNode: true, toLinkableSelfNode: true,
              fromLinkableDuplicates: true, toLinkableDuplicates: true
            }),
          $(go.TextBlock, "RoundedRectangle",
            { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: "black", margin: 5, width: 80, wrap: go.TextBlock.WrapDesiredSize },
            new go.Binding("text"))
        ),
      ));

    //split
    this.diagram.nodeTemplateMap.add("split",
      $(go.Node, "Spot",
        $(go.Panel, "Auto",
          $(go.Shape, "circle",
            {
              minSize: new go.Size(40, 40), fill: "white", strokeWidth: 1.5, stroke: "#42adf4",
              portId: "", cursor: "pointer", fromLinkable: true, toLinkable: true,
              fromLinkableSelfNode: true, toLinkableSelfNode: true,
              fromLinkableDuplicates: true, toLinkableDuplicates: true
            }),
          $(go.TextBlock, "split",
            { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: "black" },
            new go.Binding("text"))
          ,
          $(go.Panel, "Auto",
            $(go.Shape, "circle",
              {
                minSize: new go.Size(30, 30), fill: "white", strokeWidth: 1.5, stroke: "#42adf4",
        /* portId: "", cursor: "pointer",fromLinkable: true, toLinkable: true,
        fromLinkableSelfNode: true, toLinkableSelfNode: true,
        fromLinkableDuplicates: true, toLinkableDuplicates: true */ }),
            $(go.TextBlock, "split",
              { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: "black", margin: 4 },
              new go.Binding("text"))
          ),
        ),
      ));

    //join
    this.diagram.nodeTemplateMap.add("join",
      $(go.Node, "Spot",
        $(go.Panel, "Auto",
          $(go.Shape, "circle",
            {
              minSize: new go.Size(40, 40), fill: "white", strokeWidth: 1.5, stroke: "#42adf4",
              portId: "", cursor: "pointer", fromLinkable: true, toLinkable: true,
              fromLinkableSelfNode: true, toLinkableSelfNode: true,
              fromLinkableDuplicates: true, toLinkableDuplicates: true
            }),
          $(go.TextBlock, "",
            { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: "black" },
            new go.Binding("text"))
          ,
          $(go.Panel, "Auto",
            $(go.Shape, "circle",
              {
                minSize: new go.Size(30, 30), fill: "white", strokeWidth: 1.5, stroke: "#42adf4",
        /* portId: "", cursor: "pointer",fromLinkable: true, toLinkable: true,
        fromLinkableSelfNode: true, toLinkableSelfNode: true,
        fromLinkableDuplicates: true, toLinkableDuplicates: true */ }),
            $(go.TextBlock, "join",
              { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: "black", margin: 6 },
              new go.Binding("text"))
          ),
        ),
      ));

    //merge
    this.diagram.nodeTemplateMap.add("merge",
      $(go.Node, "Spot",
        $(go.Panel, "Auto",
          $(go.Shape, "circle",
            {
              minSize: new go.Size(30, 30), fill: "white", strokeWidth: 1.5, stroke: "#42adf4",
              portId: "", cursor: "pointer", fromLinkable: true, toLinkable: true,
              fromLinkableSelfNode: true, toLinkableSelfNode: true,
              fromLinkableDuplicates: true, toLinkableDuplicates: true
            }),
          $(go.TextBlock, "",
            { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: "black" },
            new go.Binding("text"))
          ,
          $(go.Panel, "Auto",
            $(go.Shape, "circle",
              {
                minSize: new go.Size(10, 10), fill: "white", strokeWidth: 1.5, stroke: "#42adf4",
        /* portId: "", cursor: "pointer",fromLinkable: true, toLinkable: true,
        fromLinkableSelfNode: true, toLinkableSelfNode: true,
        fromLinkableDuplicates: true, toLinkableDuplicates: true */ }),
            $(go.TextBlock, "merge",
              { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: "black", margin: -2 },
              new go.Binding("text"))
          ),
        ),
      ));

    //diamond inclusive exclusive
    this.diagram.nodeTemplateMap.add("exclusive",
      $(go.Node, "Spot",
        $(go.Panel, "Auto",
          $(go.Shape, "diamond",
            {
              minSize: new go.Size(50, 120), fill: "white", stroke: "#42adf4", strokeWidth: 2,
              portId: "", cursor: "pointer", fromLinkable: true, toLinkable: true,
              fromLinkableSelfNode: true, toLinkableSelfNode: true,
              fromLinkableDuplicates: true, toLinkableDuplicates: true
            }),
          $(go.TextBlock, "",
            { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: "black", margin: 0 },
            new go.Binding("text"))
        ),
      ));


    this.diagram.nodeTemplateMap.add("inclusive",
      $(go.Node, "Spot",
        $(go.Panel, "Auto",
          $(go.Shape, "diamond",
            {
              minSize: new go.Size(50, 120), fill: "white", stroke: "#42adf4", strokeWidth: 2,
              portId: "", cursor: "pointer", fromLinkable: true, toLinkable: true,
              fromLinkableSelfNode: true, toLinkableSelfNode: true,
              fromLinkableDuplicates: true, toLinkableDuplicates: true
            }),
          $(go.TextBlock, "",
            { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: "black", margin: 0 },
            new go.Binding("text"))
        ),
        $(go.Shape, "circle",
          {
            minSize: new go.Size(0.1, 0.1), fill: "#42adf4", stroke: null, strokeWidth: null, width: 20,
          /*alignment:go.Spot.Top.y*/
            /*portId: "", cursor: "pointer",fromLinkable: true, toLinkable: true,
            fromLinkableSelfNode: true, toLinkableSelfNode: true,
            fromLinkableDuplicates: true, toLinkableDuplicates: true*/ })
      ));


    //square with 4 dots
    this.diagram.nodeTemplateMap.add("squareBox",
      $(go.Node, "Auto",
        $(go.Panel, "Auto",
          $(go.Shape, "square",
            {
              minSize: new go.Size(30, 40), fill: "white", stroke: "#42adf4", strokeWidth: 2,
              portId: "", cursor: "pointer", fromLinkable: true, toLinkable: true,
              fromLinkableSelfNode: true, toLinkableSelfNode: true,
              fromLinkableDuplicates: true, toLinkableDuplicates: true
            }),
          $(go.TextBlock, "square",
            { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: "black", margin: 10 },
            new go.Binding("text"))
        ),
      ));


    // initialize contents of Palette
    this.palette.model.nodeDataArray =
      [
        { text: "Start", category: "noFillCircle" },
        { text: "End", category: "borderCircle" },
        { text: "Invoke BS", category: "RoundedRectangle" },
        { text: "Invoke (Ext.Sync)", category: "RoundedRectangle" },
        { text: "Invoke (Ext.deferred)", category: "RoundedRectangle" },
        { text: "Invoke (Ext.Def.Bypass)", category: "RoundedRectangle" },
        { text: "split", category: "split" },
        { text: "join", category: "join" },
        { text: "merge", category: "merge" },
        { text: "Inclusive", category: "inclusive" },
        { text: "Exclusive", category: "exclusive" },
        { text: "Group", category: "squareBox" },
      ];
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.diagram.div = this.diagramRef.nativeElement;
    this.palette.div = this.paletteRef.nativeElement;
  }

}

