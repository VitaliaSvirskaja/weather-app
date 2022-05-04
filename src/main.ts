import { apiKey } from "./giphy-api-key";

const img = document.querySelector("img");
fetch(`https://api.giphy.com/v1/gifs/translate?api_key=${apiKey}&s=cats`, {
  mode: "cors",
})
  .then((response) => {
    console.log(response.json());
  })
  .then((response) => {
    console.log(response);
  });
