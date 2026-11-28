// script.js - the wiring that connects your website to v8.
// You do not need to change anything in this file.

// 1. Where v8 lives on the internet
const MODEL_HOME = "https://kkmayank1983.github.io/ai-tutor-v8/";

// 2. Find the parts of your page by their ids
const statusLine = document.getElementById("status");
const questionBox = document.getElementById("question");
const askButton = document.getElementById("ask-button");
const answerBox = document.getElementById("answer");

askButton.disabled = true;   // no asking until v8 has arrived

// 3. Download v8 into this browser (slow only the first time)
V8.load({
  base: MODEL_HOME,
  onProgress: function (fraction, words) {
    statusLine.textContent = words;
  }
}).then(function (tutor) {
  statusLine.textContent = "v8 is ready. Ask a science question.";
  askButton.disabled = false;

  // 4. Ask v8 and show its answer, word by word
  async function askV8(event) {
    event.preventDefault();               // stop the page from reloading
    const question = questionBox.value.trim();
    if (question === "") return;
    askButton.disabled = true;
    answerBox.textContent = "Thinking...";
    try {
      answerBox.textContent = await tutor.ask(question, {
        onToken: function (soFar) { answerBox.textContent = soFar; }
      });
    } catch (error) {
      answerBox.textContent = "Sorry: " + error.message;
    }
    askButton.disabled = false;
  }

  askButton.addEventListener("click", askV8);
  questionBox.addEventListener("keydown", function (event) {
    if (event.key === "Enter") askV8(event);
  });
}).catch(function (error) {
  statusLine.textContent = "Could not load v8: " + error.message;
});
