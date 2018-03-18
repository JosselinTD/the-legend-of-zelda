var A = new Event('joyA');
var B = new Event('joyB');
var Y = new Event('joyY');
var X = new Event('joyX');
var PLUS = new Event('joyPLUS');
var HOME = new Event('joyHOME');
var RSR = new Event('joyRSR');
var RSL = new Event('joyRSL');
var R = new Event('joyR');
var ZR = new Event('joyZR');
var R0 = new Event('joyR0');
var LEFT = new Event('joyLEFT');
var TOP = new Event('joyTOP');
var RIGHT = new Event('joyRIGHT');
var BOTTOM = new Event('joyBOTTOM');
var MINUS = new Event('joyMINUS');
var SELECT = new Event('joySELECT');
var LSR = new Event('joyLSR');
var LSL = new Event('joyLSL');
var L = new Event('joyL');
var ZL = new Event('joyZL');
var L0 = new Event('joyL0');

AFRAME.registerComponent('joycon-controls', {
  schema: {
    rotationSpeed: {default: 100},
    translationSpeed: {default: 5}
  },
  init: function() {
    this.setJoycons();
  },
  tick: function(d, dt) {
    if (!this.joyLeft || !this.joyRight) {
      this.setJoycons();
      return;
    }
    var rotation = this.el.getAttribute('rotation');
    if (this.joyRight.axes[5]) {
      rotation.y -= this.joyRight.axes[5] * this.data.rotationSpeed * dt / 1000;
    }
    if (this.joyRight.axes[4]) {
      rotation.x += this.joyRight.axes[4] * this.data.rotationSpeed * dt / 1000
    }

    this.el.setAttribute('rotation', rotation);

    if (this.joyLeft.axes[4]) {
      this.el.object3D.translateZ(this.joyLeft.axes[4] * this.data.translationSpeed * dt / 1000);
    }
    if (this.joyLeft.axes[5]) {
      this.el.object3D.translateX(-this.joyLeft.axes[5] * this.data.translationSpeed * dt / 1000);
    }

    this.el.object3D.position.y = 1.5;

    this.joyRight.buttons.forEach(function(b, index) {
      if (b.pressed) {
        switch(index) {
          case 0:
            window.dispatchEvent(A);
            break;
          case 2:
            window.dispatchEvent(B);
            break;
          case 3:
            window.dispatchEvent(Y);
            break;
          case 1:
            window.dispatchEvent(X);
            break;
          case 9:
            window.dispatchEvent(PLUS);
            break
          case 12:
            window.dispatchEvent(HOME);
            break;
          case 5:
            window.dispatchEvent(RSR);
            break;
          case 4:
            window.dispatchEvent(RSL);
            break;
          case 14:
            window.dispatchEvent(R);
            break;
          case 15:
            window.dispatchEvent(ZR);
            break;
          case 11:
            window.dispatchEvent(R0);
            break;
        }
      }
    });
    this.joyLeft.buttons.forEach(function(b, index) {
      if (b.pressed) {
        console.log(index);
        switch(index) {
          case 0:
            window.dispatchEvent(RIGHT);
            break;
          case 2:
            window.dispatchEvent(TOP);
            break;
          case 3:
            window.dispatchEvent(LEFT);
            break;
          case 1:
            window.dispatchEvent(BOTTOM);
            break;
          case 8:
            window.dispatchEvent(MINUS);
            break
          case 13:
            window.dispatchEvent(SELECT);
            break;
          case 5:
            window.dispatchEvent(LSR);
            break;
          case 4:
            window.dispatchEvent(LSL);
            break;
          case 14:
            window.dispatchEvent(L);
            break;
          case 15:
            window.dispatchEvent(ZL);
            break;
          case 10:
            window.dispatchEvent(L0);
            break;
        }
      }
    });
  },
  setJoycons: function() {
    var gamepads = navigator.getGamepads();
    if (!Array.isArray(gamepads)) {
      gamepads = Object.keys(gamepads).map(index => gamepads[index]);
    }
    this.joyLeft = gamepads.find(pad => pad && pad.id && pad.id.indexOf('Joy-Con (L)') === 0);
    this.joyRight = gamepads.find(pad => pad && pad.id && pad.id.indexOf('Joy-Con (R)') === 0);
  }
});
