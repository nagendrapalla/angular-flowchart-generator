"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var app_routing_module_1 = require("./app-routing.module");
var app_component_1 = require("./app.component");
var button_1 = require("primeng/button");
var sidebar_1 = require("primeng/sidebar");
var inputtext_1 = require("primeng/inputtext");
var dropdown_1 = require("primeng/dropdown");
var inputtextarea_1 = require("primeng/inputtextarea");
var table_1 = require("primeng/table");
var gojs_angular_1 = require("gojs-angular");
var animations_1 = require("@angular/platform-browser/animations");
var api_1 = require("primeng/api");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent
            ],
            imports: [
                platform_browser_1.BrowserModule,
                app_routing_module_1.AppRoutingModule,
                animations_1.BrowserAnimationsModule,
                button_1.ButtonModule,
                sidebar_1.SidebarModule,
                inputtext_1.InputTextModule,
                dropdown_1.DropdownModule,
                inputtextarea_1.InputTextareaModule,
                table_1.TableModule,
                gojs_angular_1.GojsAngularModule
            ],
            providers: [api_1.ConfirmationService],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
