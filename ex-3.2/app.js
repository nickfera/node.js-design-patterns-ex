import { EventEmitter } from "events";

/**
 * @param {number} ms
 * @param {(ticks: number) => void} callback
 * @returns
 */
function ticker(ms, callback) {
  const eventEmitter = new EventEmitter();
  let ticks = 0;

  function tick() {
    if ((ticks + 1) * 50 > ms) {
      return callback(ticks);
    }

    ticks++;
    eventEmitter.emit("tick", ticks, ticks * 50);
    setTimeout(() => tick(), 50);
  }

  setTimeout(() => tick(), 50);

  return eventEmitter;
}

(() => {
  ticker(1000, (error, ticks) => {
    if (error) {
      return console.error(`callback error:`, error);
    }
    console.debug(`callback: total ticks: ${ticks}`);
  }).on("tick", (ticks, ms) =>
    console.debug(`'tick' event: tick ${ticks} ${ms}ms`)
  );
})();
