import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-storage.js";
import { storage, Tatekan, postTatekan } from "./app.js";
document.getElementById("postForm").addEventListener("submit", submitPost);

function submitPost(e) {
  console.log("Submit initiated");
  e.preventDefault();

  const imageFile = document.getElementById("imageInput").files[0];
  if (!imageFile) {
    console.log("No image file selected.");
    return;
  }
  const latitude = document.getElementById("latitudeInput").value;
  const longitude = document.getElementById("longitudeInput").value;
  const handleName = document.getElementById("handleNameInput").value;
  const comment = document.getElementById("commentInput").value;
  const timestamp = new Date();

  console.log("Form data collected", {
    latitude,
    longitude,
    handleName,
    comment,
  });

  const timestampStr = timestamp
    .toISOString()
    .replace(/[\-:]/g, "")
    .slice(0, -5);
  const imageName = `${timestampStr}_${imageFile.name}`;
  const storageRef = ref(storage, `images/${imageName}`);

  resizeAndCompressImage(imageFile)
    .then((processedImageBlob) => {
      console.log("Image resized and compressed");

      // Create the file metadata
      /** @type {any} */
      const metadata = {
        contentType: "image/jpeg",
      };

      const uploadTask = uploadBytesResumable(
        storageRef,
        processedImageBlob,
        metadata
      );

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          console.error("Error during the upload", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);

            const newTatekan = new Tatekan(
              downloadURL,
              parseFloat(latitude),
              parseFloat(longitude),
              parseFloat(height),
              direction,
              handleName,
              comment,
              timestamp
            );

            console.log("Tatekan object created", newTatekan);
            postTatekan(newTatekan);
          });
        }
      );
    })
    .catch((error) => {
      console.error("Error resizing and compressing image", error);
    });
}

function resizeAndCompressImage(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const reader = new FileReader();

    reader.onload = function (e) {
      image.onload = function () {
        const canvas = document.createElement("canvas");
        let width = image.width;
        let height = image.height;

        if (width > height && width > 2000) {
          height *= 2000 / width;
          width = 2000;
        } else if (height > width && height > 2000) {
          width *= 2000 / height;
          height = 2000;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          "image/jpeg",
          0.7
        );
      };

      image.onerror = function () {
        reject(new Error("Failed to read image file"));
      };

      image.src = e.target.result;
    };

    reader.onerror = function () {
      reject(new Error("Failed to read image file"));
    };

    reader.readAsDataURL(file);
  });
}
