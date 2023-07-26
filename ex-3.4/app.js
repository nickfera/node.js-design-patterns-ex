import { EventEmitter } from "events";

/**
 * @param {number} ms
 * @param {(error: Error, ticks: number) => void} callback
 * @returns
 */
function ticker(ms, callback) {
  const eventEmitter = new EventEmitter();
  let ticks = 0;

  eventEmitter.emit("tick", ticks, ticks * 50);

  function tick() {
    const timestamp = Date.now();

    if ((ticks + 1) * 50 > ms) {
      return callback(undefined, ticks);
    } else if (timestamp % 5 === 0) {
      eventEmitter.emit(
        "error",
        ticks,
        `Timestamp ${timestamp} is divisible by 5!`
      );

      return callback(
        new Error(`Timestamp ${timestamp} is divisible by 5! Ticks: ${ticks}`)
      );
    }

    ticks++;
    eventEmitter.emit("tick", ticks, ticks * 50);
    setTimeout(() => tick(), 50);
  }

  eventEmitter.start = tick;

  return eventEmitter;
}

(() => {
  ticker(1000, (error, ticks) => {
    if (error) {
      return console.error(`callback error:`, error);
    }
    console.debug(`callback: total ticks: ${ticks}`);
  })
    .on("tick", (ticks, ms) =>
      console.debug(`'tick' event: tick ${ticks} ${ms}ms`)
    )
    .on("error", (ticks, message) =>
      console.error(`'error' event: tick ${ticks} '${message}'`)
    )
    .start();
})();
