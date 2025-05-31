/*  script.js – loads Pyodide, wires stdin / stdout, runs the game  */
async function main() {
  /* ---------- 1. Boot Pyodide ---------- */
  const pyodide = await loadPyodide({
    stdin: () => "",          // we’ll override input() ourselves
    stdout: s => writeOut(s),
    stderr: s => writeOut(s)
  });

  /* ---------- 2. Expose a JS async “line reader” ---------- */
  // Returns a Promise that resolves with the next line the player types
  globalThis.getLine = function (promptText = "") {
    return new Promise(resolve => {
      const out = document.getElementById("output");
      if (promptText) out.textContent += promptText;

      const inputBox = document.getElementById("userInput");
      inputBox.disabled = false;
      inputBox.focus();

      function handler(ev) {
        if (ev.key === "Enter") {
          ev.preventDefault();
          const val = inputBox.value;
          inputBox.value = "";
          out.textContent += val + "\n";
          inputBox.removeEventListener("keydown", handler);
          resolve(val);
        }
      }
      inputBox.addEventListener("keydown", handler);
    });
  };

  /* ---------- 3. Python pre-amble: stdout, input(), patches ---------- */
  const pyPreamble = `
import sys, builtins, asyncio, os, time, js
from js import document, getLine

_out = document.getElementById("output")

def _write(data):
    _out.textContent += str(data)
    # auto-scroll
    document.documentElement.scrollTop = document.documentElement.scrollHeight

sys.stdout.write = _write
sys.stderr.write = _write

def input(prompt=''):
    "blocking input() that waits for JS promise"
    return asyncio.get_event_loop().run_until_complete(getLine(prompt))

builtins.input = input

# desktop-only calls turned into no-ops
os.system = lambda *_, **__: 0
time.sleep = lambda *_: None
`;
  await pyodide.runPythonAsync(pyPreamble);

  /* ---------- 4. Load & run the original game ---------- */
  const gameCode = await (await fetch("insultFightingNew.py")).text();
  await pyodide.runPythonAsync(gameCode);
  await pyodide.runPythonAsync("import insultFightingNew as game; game.load()");
}

/* tiny helper for stdout / stderr */
function writeOut(chunk) {
  const out = document.getElementById("output");
  out.textContent += chunk;
  document.documentElement.scrollTop = document.documentElement.scrollHeight;
}

main();