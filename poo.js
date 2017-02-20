const Rx = require("rxjs");
const five = require("johnny-five");
const raspi = require("raspi-io");

const board = new five.Board({
	io: new raspi()
});

board.on("ready", function() {
  button = new five.Button("GPIO17");

  const red = new five.Led("GPIO27");  
  const green = new five.Led("GPIO24");
  const blue = new five.Led("GPIO16"); 

  const buttonDown$ = Rx.Observable.fromEvent(button, 'down');
  const buttonUp$ = Rx.Observable.fromEvent(button, 'up');  

  buttonDown$.subscribe(() => { 
	green.off();    
	red.on();
  });

  buttonUp$.subscribe(() => {
	red.off();
	green.on();
  });

  const strobePhase = 150;
  const twoSeconds = 2 * 1000;

  const debouncedDown$ = buttonDown$.debounceTime(twoSeconds);
  const downCount$ = buttonDown$.buffer(debouncedDown$);
  const delayedDownCount$ = downCount$.delayWhen(downs => {
	Rx.Observable.interval(5 * 2 * strobePhase);
  });

  downCount$.subscribe(() => {
	blue.strobe(strobePhase);
  });
 
  delayedDownCount$.subscribe(() => {
	blue.stop().off();
  });
});
