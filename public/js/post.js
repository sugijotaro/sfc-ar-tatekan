import { storage, Tatekan, postTatekan } from "./app.js";

document.getElementById("postForm").addEventListener("submit", submitPost);

function submitPost(e) {
  e.preventDefault();

  const imageURL = document.getElementById("imageURLInput").value;
  if (!imageURL) {
    console.log("No image URL provided.");
    return;
  }
  const latitude = document.getElementById("latitudeInput").value;
  const longitude = document.getElementById("longitudeInput").value;
  const handleName = document.getElementById("handleNameInput").value;
  const comment = document.getElementById("commentInput").value;
  const timestamp = new Date();

  console.log("Form data collected", {
    imageURL,
    latitude,
    longitude,
    handleName,
    comment,
  });

  const newTatekan = new Tatekan(
    imageURL,
    parseFloat(latitude),
    parseFloat(longitude),
    handleName,
    comment,
    timestamp
  );

  console.log("Tatekan object created", newTatekan);
  postTatekan(newTatekan);
}
