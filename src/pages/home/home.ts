import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as Hammer from 'hammerjs';


const MIN_SCALE = 1; // 1=scaling when first loaded
const MAX_SCALE = 64;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {



  // HammerJS fires "pinch" and "pan" events that are cumulative in nature and not
  // deltas. Therefore, we need to store the "last" values of scale, x and y so that we can
  // adjust the UI accordingly. It isn't until the "pinchend" and "panend" events are received
  // that we can set the "last" values.

  // Our "raw" coordinates are not scaled. This allows us to only have to modify our stored
  // coordinates when the UI is updated. It also simplifies our calculations as these
  // coordinates are without respect to the current scale.

  imgWidth        = null;
  imgHeight       = null;
  viewportWidth   = null;
  viewportHeight  = null;
  scale           = null;
  lastScale       = null;
  container       = null;
  img             = null;
  x               = 0;
  lastX           = 0;
  y               = 0;
  lastY           = 0;
  pinchCenter     = null;
  curWidth        = 0;
  curHeight       = 0;
  pinchCenterOffset = null;

  constructor(public navCtrl: NavController) {

    
  }

  ionViewDidLoad(){
    this.img = document.getElementById('pinch-zoom-image-id');
    console.log(JSON.stringify(this.img));
  }


  onImageLoad(){
      
      this.container = this.img.parentElement;
      //this.disableImiogEventHandlers();
      this.imgWidth = this.img.width;
      this.imgHeight = this.img.height;
      this.viewportWidth = this.img.offsetWidth;
      this.scale = this.viewportWidth/this.imgWidth;
      this.lastScale = this.scale;
      this.viewportHeight = this.img.parentElement.offsetHeight;
      this.curWidth = this.imgWidth* this.scale;
      this.curHeight = this.imgHeight*this.scale;

/*       var that = this;

      var hammer = new Hammer(that.container, {
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

        if(that.pinchCenter === null) {
          that.pinchCenter = that.rawCenter(e);
          var offsetX = that.pinchCenter.x*that.scale - (-that.x*that.scale + Math.min(that.viewportWidth, that.curWidth)/2);
          var offsetY = that.pinchCenter.y*that.scale - (-that.y*that.scale + Math.min(that.viewportHeight, that.curHeight)/2);
          that.pinchCenterOffset = { x: offsetX, y: offsetY };
        }
        var newScale = that.restrictScale(that.scale*e.scale);
        var zoomX = that.pinchCenter.x*newScale - that.pinchCenterOffset.x;
        var zoomY = that.pinchCenter.y*newScale - that.pinchCenterOffset.y;
        var zoomCenter = { x: zoomX/newScale, y: zoomY/newScale };

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
        that.zoomAround(2, c.x, c.y,true);
      }); */
  }

  handlerPan(e){
    console.log('handlerPan');
    this.translate(e.deltaX, e.deltaY);
  }

  handlerPinch(e){
    console.log('handlerPinch');
    if(this.pinchCenter === null) {
      this.pinchCenter = this.rawCenter(e);
      var offsetX = this.pinchCenter.x* this.scale - (-this.x*this.scale + Math.min(this.viewportWidth, this.curWidth)/2);
      var offsetY = this.pinchCenter.y*this.scale - (-this.y*this.scale + Math.min(this.viewportHeight, this.curHeight)/2);
      this.pinchCenterOffset = { x: offsetX, y: offsetY };
    }
    var newScale = this.restrictScale(this.scale*e.scale);
    var zoomX = this.pinchCenter.x*newScale - this.pinchCenterOffset.x;
    var zoomY = this.pinchCenter.y*newScale - this.pinchCenterOffset.y;
    var zoomCenter = { x: zoomX/newScale, y: zoomY/newScale };

    this.zoomAround(e.scale, zoomCenter.x, zoomCenter.y, true);
  }

  handlerPanend(e){
    console.log('handlerPanend');
    this.updateLastPos();
  }

  handlerPinched(e){
    console.log('handlerPinched');
    this.updateLastScale();
    this.updateLastPos();
    this.pinchCenter = null;
  }

  handlerDoubleTap(e){
    console.log('handlerDoubleTap');
    var c = this.rawCenter(e);
    this.zoomAround(2, c.x, c.y,true);
  }



  disableImgEventHandlers() {
    var events = ['onclick', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover','onmouseup', 'ondblclick', 'onfocus', 'onblur'];
    events.forEach(function (event) {
      this.img[event] = function () {
        return false;
      };
    });
  }



  absolutePosition(el){
    var x = 0,y = 0;

    while (el !== null) {
      x += el.offsetLeft;
      y += el.offsetTop;
      el = el.offsetParent;
    }

    return { x: x, y: y };
  }

  restrictScale(scale) {
    if (scale < MIN_SCALE) {
      scale = MIN_SCALE;
    } else if (scale > MAX_SCALE) {
      scale = MAX_SCALE;
    }
    return scale;
  }

  restrictRawPos(pos, viewportDim, imgDim) {
    if (pos < viewportDim/this.scale - imgDim) { // too far left/up?
      pos = viewportDim/this.scale - imgDim;
    } else if (pos > 0) { // too far right/down?
      pos = 0;
    }
    return pos;
  }

  updateLastPos(deltaX?, deltaY?) {
    this.lastX = this.x;
    this.lastY = this.y;
  }

  translate(deltaX, deltaY) {
    var newX = this.restrictRawPos(this.lastX + deltaX/this.scale,Math.min(this.viewportWidth, this.curWidth), this.imgWidth);
    this.x = newX;
    this.img.style.marginLeft = Math.ceil(newX*this.scale) + 'px';

    var newY = this.restrictRawPos(this.lastY + deltaY/this.scale,Math.min(this.viewportHeight, this.curHeight), this.imgHeight);
    this.y = newY;
    this.img.style.marginTop = Math.ceil(newY*this.scale) + 'px';
  }

  zoom(scaleBy) {
    this.scale = this.restrictScale(this.lastScale*scaleBy);

    this.curWidth = this.imgWidth*this.scale;
    this.curHeight = this.imgHeight*this.scale;

    this.img.style.width = Math.ceil(this.curWidth) + 'px';
    this.img.style.height = Math.ceil(this.curHeight) + 'px';

    // Adjust margins to make sure that we aren't out of bounds
    this.translate(0, 0);
  }

  rawCenter(e) {
    var pos = this.absolutePosition(this.container);

    // We need to account for the scroll position
    var scrollLeft = window.pageXOffset ? window.pageXOffset : document.body.scrollLeft;
    var scrollTop = window.pageYOffset ? window.pageYOffset : document.body.scrollTop;

    var zoomX = -this.x + (e.center.x - pos.x + scrollLeft)/this.scale;
    var zoomY = -this.y + (e.center.y - pos.y + scrollTop)/this.scale;

    return { x: zoomX, y: zoomY };
  }

  updateLastScale() {
    this.lastScale = this.scale;
  }

  zoomAround(scaleBy, rawZoomX, rawZoomY, doNotUpdateLast) {
    this.zoom(scaleBy);
    var rawCenterX = -this.x + Math.min(this.viewportWidth, this.curWidth)/2/this.scale;
    var rawCenterY = -this.y + Math.min(this.viewportHeight, this.curHeight)/2/this.scale;

    var deltaX = (rawCenterX - rawZoomX)*this.scale;
    var deltaY = (rawCenterY - rawZoomY)*this.scale;
    this.translate(deltaX, deltaY);

    if (!doNotUpdateLast) {
      this.updateLastScale();
      this.updateLastPos();
    }
  }

  zoomCenter(scaleBy) {
    // Center of viewport
    var zoomX = -this.x + Math.min(this.viewportWidth, this.curWidth)/2/this.scale;
    var zoomY = -this.y + Math.min(this.viewportHeight, this.curHeight)/2/this.scale;

    this.zoomAround(scaleBy, zoomX, zoomY, false);
  }

  zoomIn() {
    this.zoomCenter(1/2);
  }

  zoomOut() {
    this.zoomCenter(1/2);
  }

/*   handlerPinch(e){
    console.log("************************ handlerPinch ********************************");
    console.log(JSON.stringify(e));

    if( this.pinchCenter === null) {
      this.pinchCenter = this.rawCenter(e);
      var offsetX = this.pinchCenter.x*this.scale - (-this.x*this.scale + Math.min(this.viewportWidth, this.curWidth)/2);
      var offsetY = this.pinchCenter.y*this.scale - (-this.y*this.scale + Math.min(this.viewportHeight, this.curHeight)/2);
      this.pinchCenterOffset = { x: offsetX, y: offsetY };
    }

    var newScale = this.restrictScale(this.scale*e.scale);
    var zoomX = this.pinchCenter.x*newScale - this.pinchCenterOffset.x;
    var zoomY = this.pinchCenter.y*newScale - this.pinchCenterOffset.y;
    var zoomCenter = { x: zoomX/newScale, y: zoomY/newScale };

    this.zoomAround(e.scale, zoomCenter.x, zoomCenter.y, true);
  }

  handlerPan(e){
    console.log("************************ handlerPan ********************************");
    console.log(`events : ${e.deltaX} <==> ${e.deltaY}`);
    this.translate(e.deltaX, e.deltaY);
  } */




}
