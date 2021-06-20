const escomplex = require('escomplex');
const keypress = require('keypress');
keypress(process.stdin);
const fs = require('fs');
const path = require('path');

const pathToSource = path.join(__dirname, "source.js");
const pathToResult = path.join(__dirname, "result.json");
const intervalMiliSec = 1000;
let resultJson = {};
let elapsedSec = 0;

const timer = setInterval(() => {
  fs.readFile(pathToSource, "utf8", (err, data) => {
    if (err) throw err;
    console.log("source path: ", pathToSource);
    console.log("successfully file loaded.");

    try {
      const result = analyseSource(data);
      resultJson[elapsedSec] = result;
      console.log("escomplex executed.");
    } catch (e) {
      console.log(e);
    }
  });

  elapsedSec++;
}, intervalMiliSec);


function analyseSource(sourceCode) {
  const esResult = escomplex.analyse(sourceCode);
  const sloc = esResult.aggregate.sloc.logical;
  const cyclomatic = esResult.aggregate.cyclomatic;
  const maintainability = esResult.maintainability;
  const currentResult = { sloc, cyclomatic, maintainability };
  return currentResult;
}

process.stdin.on('keypress', (_ch, key) => {
  console.log('keypressed: ', key);
  if (key && key.ctrl && key.name == 'c') {
    console.log('process terminated');
    fs.writeFileSync(pathToResult, JSON.stringify(resultJson));
    clearInterval(timer);
    process.exit(0);
  }
});

process.stdin.setRawMode(true);
process.stdin.resume();
