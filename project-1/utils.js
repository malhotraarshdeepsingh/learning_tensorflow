// Part 1
// -----------

// Function to display the predictions on the webpage
export const showResult = (classes) => {
  const predictionsElement = document.getElementById("predictions");
  const probsContainer = document.createElement("div");
  for (let i = 0; i < classes.length; i++) {
    probsContainer.innerText = `Prediction: ${classes[i].class}, Probability: ${classes[i].score}`;
  }
  predictionsElement.appendChild(probsContainer);
};

export const IMAGE_SIZE = 224;

// Function to handle input images from user 
export const handleFilePicker = (callback) => {
  // Get the file picker element
  const fileElement = document.getElementById("file");
  // Add event listener to handle file selection
  fileElement.addEventListener("change", (evt) => {
    let file = evt.target.files;
    let f = file[0];

    // Check if the file is an image
    if (!f.type.match("image.*")) {
      return;
    }

    // Create a new FileReader instance, to read the image
    let reader = new FileReader();
    // Load the image by setting the dimensions and appending the image in DOM elements
    reader.onload = (e) => {
      let img = document.createElement("img");
      img.src = e.target.result;
      img.width = IMAGE_SIZE;
      img.height = IMAGE_SIZE;
      const loadedImgElement = document.getElementById("loaded-image");
      loadedImgElement.appendChild(img);
      loadedimg = img;

      img.onload = () => callback(img);

      // img.onload = () => predict(img);
    };
    reader.readAsDataURL(f);
  });
};

// Part 2
// -----------

// Function to start the webcam and display the video feed
export const startWebcam = (video) => {
  return navigator.mediaDevices
    .getUserMedia({
      audio: false,
      video: { width: 320, height: 185 },
    })
    // after the requests are granted, handle the video and display the video feed
    .then((stream) => {
      video.srcObject = stream;
      track = stream.getTracks()[0];
      video.onloadedmetadata = () => video.play();
    })
    // catch any errors that occur
    .catch((err) => {
      console.error("Unable to access the camera.", err);
    });
};

// Function to take a picture from the webcam feed
export const takePicture = (video, callback) => {
  // Get the predict button and canvas element
  const predictButton = document.getElementById("predict");
  const canvas = document.getElementById("canvas");
  
  // const width = 320; // We will scale the photo width to this
  // const height = 185;

  // dimensions of the canvas 
  const width = IMAGE_SIZE; // We will scale the photo width to this
  const height = IMAGE_SIZE;

  // Get the canvas context and draw the photo on it
  const context = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;
  context.drawImage(video, 0, 0, width, height);

  // append the canvas to the predictions element
  const outputEl = document.getElementById("predictions");
  // outputEl.appendChild(photo);
  outputEl.appendChild(canvas);

  // Enable the predict button
  predictButton.disabled = false;

  // When the predict button is clicked, predict the image and display the results
  predictButton.onclick = async () => {
    await callback(canvas);
  };
};

// Part 3
// -----------

export const drawFaceBox = (photo, faces) => {
  // Draw box around the face detected ⬇️
  // ------------------------------------
  const faceCanvas = document.createElement("canvas");
  faceCanvas.width = IMAGE_SIZE;
  faceCanvas.height = IMAGE_SIZE;
  faceCanvas.style.position = "absolute";
  faceCanvas.style.left = photo.offsetLeft;
  faceCanvas.style.top = photo.offsetTop;
  const ctx = faceCanvas.getContext("2d");
  ctx.beginPath();
  ctx.strokeStyle = "red";
  ctx.strokeRect(
    faces[0].box.xMin,
    faces[0].box.yMin,
    faces[0].box.width,
    faces[0].box.height
  );

  const webcamSection = document.getElementById("webcam-section");
  webcamSection.appendChild(faceCanvas);
};
