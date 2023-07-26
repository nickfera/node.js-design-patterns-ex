import { EventEmitter } from "events";
import { readFile } from "fs";

/**
 *
 * @param {string} path
 * @param {string} encoding
 * @param {(err: any, data: string) => void} callback
 */

function mockReadFile(path, encoding, callback) {
  setImmediate(() => callback(undefined, `contents of ${path}`));
}

class FindRegex extends EventEmitter {
  constructor(regex, readFileFn = readFile) {
    super();
    this.regex = regex;
    this.files = [];
    this.readFile = readFileFn;

    this;
  }

  addFile(file) {
    this.files.push(file);

    this.emit("fileadd", file);

    return this;
  }

  find() {
    this.emit("start");

    let processed = 0;

    while (processed < this.files.length) {
      for (const file of this.files) {
        this.readFile(file, "utf8", (err, content) => {
          if (err) {
            return this.emit("error", err);
          }
          this.emit("fileread", file);
          const match = content.match(this.regex);
          if (match) {
            match.forEach((elem) => this.emit("found", file, elem));
          }
        });
        processed++;
      }
    }

    setImmediate(() => this.emit("end", this));

    return this;
  }
}

(async () => {
  new FindRegex(/contents/gi, mockReadFile)
    .addFile("file1.txt")
    .addFile("file2.txt")
    .once("start", () => console.debug("FindRegex 'start'"))
    .on("found", (file, elem) => console.debug("FindRegex 'found'", file, elem))
    .once("end", (context) => {
      context.removeAllListeners();

      console.debug("FindRegex 'end'");
    })
    .find();
})();
