import { InferenceClient } from "@huggingface/inference";

// Add loading screen
// Add model selection
// Maybe add cache system
/// if the same msg is asked rather that fetching from ai serve form the cache (also tell the user it is being serverd from cache and weather if they want it from the ai)
// render the response for any md or meramid 
/// present it beautifully

let modelName = "mistralai/Mistral-7B-Instruct-v0.2:featherless-ai";
// let providerName = "featherless-ai"
let systemContent = "You are a helpful assistant.";
let userContent = "How may color are there in a rainbow?";

const enterMessage = document.querySelector("#enter-message");
const sendMessageBtn = document.querySelector("#send-msg");
const displayResponse = document.querySelector("#response");

sendMessageBtn.addEventListener("click", getResponse);

async function getResponse() {
  // Fail on empty input
  if (enterMessage.value === "") {
    alert("Input is blank");
    return console.log("Input is blank");
  }

  // Get & apply input
  userContent = enterMessage.value;

  const client = new InferenceClient(import.meta.env.VITE_HF_TOKEN);
  const chatCompletion = await client.chatCompletion({
    model: `${modelName}`,
    // provider: `${providerName}`,
    messages: [
      { role: "system", content: `${systemContent}` },
      {
        role: "user",
        content: `${userContent}`,
      },
    ],
    max_tokens: 256,
    temperature: 0.9,
  });

  renderResponse(chatCompletion);
}

async function renderResponse(resp) {
  displayResponse.textContent = `${resp.choices[0].message.content}`;
  console.log(resp);
  console.log(resp.choices[0].message);
}
