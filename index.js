import { InferenceClient } from "@huggingface/inference";
import { marked } from "marked"; //https://marked.js.org/

/*
  TODO: 
  All messages and responses will be stored in local or session storage.
  If the same message is requested then it will be served from that storage rather than fetching from AI.
  A small info message will be also beshown notifing the user that the response they are seeing is being served from cache.
  Also with an option to get fresh response rather than cached response.
*/

let modelName; // example: mistralai/Mistral-7B-Instruct-v0.2:featherless-ai
let providerName; // example: "featherless-ai"
let systemContent = "You are a helpful assistant!";
let userContent;
let maxToken = 256; // 256
let aiTemperature; // 0.9

const enterMessage = document.querySelector("#enter-message");
const sendMessageBtn = document.querySelector("#send-msg");
const displayResponse = document.querySelector("#response");

sendMessageBtn.addEventListener("click", getResponse);

async function getResponse() {
  modelName = document.querySelector("#select-model").value;
  if (!modelName) {
    alert("Select a model");
    return console.log("Select a model");
  }

  if (enterMessage.value === "") {
    alert("Message input is empty!");
    return console.log("Message input is empty!");
  }

  userContent = enterMessage.value;

  const client = new InferenceClient(
    document.querySelector("#api-key").value
      ? document.querySelector("#api-key").value
      : import.meta.env.VITE_HF_TOKEN
  );

  try {
    document.querySelector(".loader").style = "display: block";
    const chatCompletion = await client.chatCompletion({
      model: `${modelName}`,
      ...(providerName ? { provider: providerName } : {}),
      messages: [
        { role: "system", content: systemContent },
        {
          role: "user",
          content: userContent,
        },
      ],
      ...(maxToken ? { max_tokens: maxToken } : {}),
      ...(aiTemperature ? { temperature: aiTemperature } : {}),
    });
    renderResponse(chatCompletion);
  } catch (error) {
    console.error(error);
    document.querySelector(".loader").style = "display: none";
  }
}

async function renderResponse(resp) {
  document.querySelector(".loader").style = "display: none";
  displayResponse.style = "display: block";
  displayResponse.innerHTML = marked.parse(resp.choices[0].message.content);
}
