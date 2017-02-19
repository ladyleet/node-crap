console.log('hello poop');

var five = require("johnny-five");
var raspi = require("raspi-io");
var board = new five.Board({
	io: new raspi()
});

board.on("ready", function() {
  var yellowled = new five.Led("P1-11");
  yellowled.blink(500);
  var redled = new five.Led("P1-15");
  redled.blink(1000);
});
