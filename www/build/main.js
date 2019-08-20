webpackJsonp([0],{

/***/ 109:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 109;

/***/ }),

/***/ 150:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 150;

/***/ }),

/***/ 194:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_hammerjs__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_hammerjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_hammerjs__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var MIN_SCALE = 1; // 1=scaling when first loaded
var MAX_SCALE = 64;
var HomePage = /** @class */ (function () {
    function HomePage(navCtrl) {
        this.navCtrl = navCtrl;
        // HammerJS fires "pinch" and "pan" events that are cumulative in nature and not
        // deltas. Therefore, we need to store the "last" values of scale, x and y so that we can
        // adjust the UI accordingly. It isn't until the "pinchend" and "panend" events are received
        // that we can set the "last" values.
        // Our "raw" coordinates are not scaled. This allows us to only have to modify our stored
        // coordinates when the UI is updated. It also simplifies our calculations as these
        // coordinates are without respect to the current scale.
        this.imgWidth = null;
        this.imgHeight = null;
        this.viewportWidth = null;
        this.viewportHeight = null;
        this.scale = null;
        this.lastScale = null;
        this.container = null;
        this.img = null;
        this.x = 0;
        this.lastX = 0;
        this.y = 0;
        this.lastY = 0;
        this.pinchCenter = null;
        this.curWidth = 0;
        this.curHeight = 0;
        this.pinchCenterOffset = null;
    }
    HomePage.prototype.ionViewDidEnter = function () {
        this.img = document.getElementById('pinch-zoom-image-id');
        this.container = this.img.parentElement;
        //this.disableImgEventHandlers();
        this.imgWidth = this.img.width;
        this.imgHeight = this.img.height;
        this.viewportWidth = this.img.offsetWidth;
        this.scale = this.viewportWidth / this.imgWidth;
        this.lastScale = this.scale;
        this.viewportHeight = this.img.parentElement.offsetHeight;
        this.curWidth = this.imgWidth * this.scale;
        this.curHeight = this.imgHeight * this.scale;
        var that = this;
        var hammer = new __WEBPACK_IMPORTED_MODULE_2_hammerjs__(that.container, {
            domEvents: true
        });
        hammer.get('pinch').set({
            enable: true
        });
        hammer.on('pan', function (e) {
            console.log('pan');
            that.translate(e.deltaX, e.deltaY);
        });
        hammer.on('panend', function (e) {
            console.log('panend');
            that.updateLastPos();
        });
        hammer.on('pinch', function (e) {
            console.log('pinch');
            if (that.pinchCenter === null) {
                that.pinchCenter = that.rawCenter(e);
                var offsetX = that.pinchCenter.x * that.scale - (-that.x * that.scale + Math.min(that.viewportWidth, that.curWidth) / 2);
                var offsetY = that.pinchCenter.y * that.scale - (-that.y * that.scale + Math.min(that.viewportHeight, that.curHeight) / 2);
                that.pinchCenterOffset = { x: offsetX, y: offsetY };
            }
            var newScale = that.restrictScale(that.scale * e.scale);
            var zoomX = that.pinchCenter.x * newScale - that.pinchCenterOffset.x;
            var zoomY = that.pinchCenter.y * newScale - that.pinchCenterOffset.y;
            var zoomCenter = { x: zoomX / newScale, y: zoomY / newScale };
            that.zoomAround(e.scale, zoomCenter.x, zoomCenter.y, true);
        });
        hammer.on('pinchend', function (e) {
            console.log('pinchend');
            that.updateLastScale();
            that.updateLastPos();
            that.pinchCenter = null;
        });
        hammer.on('doubletap', function (e) {
            console.log('doubletap');
            var c = that.rawCenter(e);
            that.zoomAround(2, c.x, c.y, true);
        });
    };
    HomePage.prototype.disableImgEventHandlers = function () {
        var events = ['onclick', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'ondblclick', 'onfocus', 'onblur'];
        events.forEach(function (event) {
            this.img[event] = function () {
                return false;
            };
        });
    };
    HomePage.prototype.absolutePosition = function (el) {
        var x = 0, y = 0;
        while (el !== null) {
            x += el.offsetLeft;
            y += el.offsetTop;
            el = el.offsetParent;
        }
        return { x: x, y: y };
    };
    HomePage.prototype.restrictScale = function (scale) {
        if (scale < MIN_SCALE) {
            scale = MIN_SCALE;
        }
        else if (scale > MAX_SCALE) {
            scale = MAX_SCALE;
        }
        return scale;
    };
    HomePage.prototype.restrictRawPos = function (pos, viewportDim, imgDim) {
        if (pos < viewportDim / this.scale - imgDim) {
            pos = viewportDim / this.scale - imgDim;
        }
        else if (pos > 0) {
            pos = 0;
        }
        return pos;
    };
    HomePage.prototype.updateLastPos = function (deltaX, deltaY) {
        this.lastX = this.x;
        this.lastY = this.y;
    };
    HomePage.prototype.translate = function (deltaX, deltaY) {
        var newX = this.restrictRawPos(this.lastX + deltaX / this.scale, Math.min(this.viewportWidth, this.curWidth), this.imgWidth);
        this.x = newX;
        this.img.style.marginLeft = Math.ceil(newX * this.scale) + 'px';
        var newY = this.restrictRawPos(this.lastY + deltaY / this.scale, Math.min(this.viewportHeight, this.curHeight), this.imgHeight);
        this.y = newY;
        this.img.style.marginTop = Math.ceil(newY * this.scale) + 'px';
    };
    HomePage.prototype.zoom = function (scaleBy) {
        this.scale = this.restrictScale(this.lastScale * scaleBy);
        this.curWidth = this.imgWidth * this.scale;
        this.curHeight = this.imgHeight * this.scale;
        this.img.style.width = Math.ceil(this.curWidth) + 'px';
        this.img.style.height = Math.ceil(this.curHeight) + 'px';
        // Adjust margins to make sure that we aren't out of bounds
        this.translate(0, 0);
    };
    HomePage.prototype.rawCenter = function (e) {
        var pos = this.absolutePosition(this.container);
        // We need to account for the scroll position
        var scrollLeft = window.pageXOffset ? window.pageXOffset : document.body.scrollLeft;
        var scrollTop = window.pageYOffset ? window.pageYOffset : document.body.scrollTop;
        var zoomX = -this.x + (e.center.x - pos.x + scrollLeft) / this.scale;
        var zoomY = -this.y + (e.center.y - pos.y + scrollTop) / this.scale;
        return { x: zoomX, y: zoomY };
    };
    HomePage.prototype.updateLastScale = function () {
        this.lastScale = this.scale;
    };
    HomePage.prototype.zoomAround = function (scaleBy, rawZoomX, rawZoomY, doNotUpdateLast) {
        this.zoom(scaleBy);
        var rawCenterX = -this.x + Math.min(this.viewportWidth, this.curWidth) / 2 / this.scale;
        var rawCenterY = -this.y + Math.min(this.viewportHeight, this.curHeight) / 2 / this.scale;
        var deltaX = (rawCenterX - rawZoomX) * this.scale;
        var deltaY = (rawCenterY - rawZoomY) * this.scale;
        this.translate(deltaX, deltaY);
        if (!doNotUpdateLast) {
            this.updateLastScale();
            this.updateLastPos();
        }
    };
    HomePage.prototype.zoomCenter = function (scaleBy) {
        // Center of viewport
        var zoomX = -this.x + Math.min(this.viewportWidth, this.curWidth) / 2 / this.scale;
        var zoomY = -this.y + Math.min(this.viewportHeight, this.curHeight) / 2 / this.scale;
        this.zoomAround(scaleBy, zoomX, zoomY, false);
    };
    HomePage.prototype.zoomIn = function () {
        this.zoomCenter(2);
    };
    HomePage.prototype.zoomOut = function () {
        this.zoomCenter(1 / 2);
    };
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-home',template:/*ion-inline-start:"/Users/nico/Dropbox/Workspace/Ionic/TestZoomBtn/src/pages/home/home.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>\n      ZoomIn & zoomOut\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n  <button ion-button color="dark" outline (click)="zoomIn()">Zoom In</button>\n  <button ion-button color="dark" outline (click)="zoomOut()">Zoom Out</button>\n\n  <div class="pinch-zoom-container">\n<!--     <img\n      id="pinch-zoom-image-id"\n      class="pinch-zoom-image"\n      src="https://demo.ccloud.cl/biblioteca/secure/uploads/555?api_token=1ba201a75469df1bdbfa66b2399694a1fe01ce2a7fbac8fafaed7c982a04e229bbd91cb1f846113ef8b5fadd4543632a0083&_dc=1562715843000" >\n\n     <div class="box">\n        <img\n        id      = "pinch-zoom-image-id"\n        class   = "pinch-zoom-image"\n        src     = "assets/imgs/planoTest.jpeg"\n        (pinch) = "handlerPinch($event)"\n        (pan)   = "handlerPan($event)"\n      >\n    </div>\n\n    <img\n      id      = "pinch-zoom-image-id"\n      class   = "pinch-zoom-image"\n      src     = "assets/imgs/planoTest.jpeg" >\n\n -->\n\n    <img\n    id      = "pinch-zoom-image-id"\n    class   = "pinch-zoom-image"\n    src     = "assets/imgs/planoWebp.webp" >\n\n  </div>\n</ion-content>\n'/*ion-inline-end:"/Users/nico/Dropbox/Workspace/Ionic/TestZoomBtn/src/pages/home/home.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["d" /* NavController */]])
    ], HomePage);
    return HomePage;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 195:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(196);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(218);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_hammerjs__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_hammerjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_hammerjs__);



Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 218:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export CustomHammerConfig */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(190);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__ = __webpack_require__(193);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_component__ = __webpack_require__(268);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_home_home__ = __webpack_require__(194);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_hammerjs__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_hammerjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_hammerjs__);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};









var CustomHammerConfig = /** @class */ (function (_super) {
    __extends(CustomHammerConfig, _super);
    function CustomHammerConfig() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.overrides = {
            'pinch': {
                direction: __WEBPACK_IMPORTED_MODULE_7_hammerjs__["DIRECTION_ALL"]
            },
            'pan': {
                direction: __WEBPACK_IMPORTED_MODULE_7_hammerjs__["DIRECTION_ALL"]
            }
        };
        return _this;
    }
    return CustomHammerConfig;
}(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["d" /* HammerGestureConfig */]));

var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_6__pages_home_home__["a" /* HomePage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* MyApp */], {}, {
                    links: []
                })
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["a" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_6__pages_home_home__["a" /* HomePage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */],
                { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["u" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* IonicErrorHandler */] },
                { provide: __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["c" /* HAMMER_GESTURE_CONFIG */], useClass: CustomHammerConfig }
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 268:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(193);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(190);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_home_home__ = __webpack_require__(194);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var MyApp = /** @class */ (function () {
    function MyApp(platform, statusBar, splashScreen) {
        this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */];
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
        });
    }
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/Users/nico/Dropbox/Workspace/Ionic/TestZoomBtn/src/app/app.html"*/'<ion-nav [root]="rootPage"></ion-nav>\n'/*ion-inline-end:"/Users/nico/Dropbox/Workspace/Ionic/TestZoomBtn/src/app/app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ })

},[195]);
//# sourceMappingURL=main.js.map