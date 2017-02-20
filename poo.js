const Rx = require("rxjs");
const Five = require("johnny-five");
const Raspi = require("raspi-io");

const board = new Five.Board({
	io: new Raspi()
});

board.on("ready", function() {
  button = new Five.Button("GPIO17");

  const red = new Five.Led("GPIO27");  
  const green = new Five.Led("GPIO24");
  const blue = new Five.Led("GPIO16"); 

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
  const bufferedDowns$ = buttonDown$.buffer(debouncedDown$);
  const delayedBufferedDowns$ = bufferedDowns$.delayWhen(downs => {
	return Rx.Observable.interval(downs.length * 2 * strobePhase);
  });

  bufferedDowns$.subscribe(() => {
	blue.strobe(strobePhase);
  });
 
  delayedBufferedDowns$.subscribe(() => {
	blue.stop().off();
  });
});
