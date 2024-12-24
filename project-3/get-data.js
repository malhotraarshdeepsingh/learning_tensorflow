const tf = require("@tensorflow/tfjs-node-gpu");
const fs = require("fs");
const path = require("path");

const trainImagesDir = "./data/train";
const testImagesDir = "./data/test";

let trainData, testData;

const loadImages = (dataDir) => {
  const images = [];
  const labels = [];

  // read files
  let files = fs.readdirSync(dataDir);
  
  // read each file and create a tensor object
  for (let i = 0; i < files.length; i++) {
    let filePath = path.join(dataDir, files[i]);

    let buffer = fs.readFileSync(filePath);

    // decode image using TensorFlow.js, resize to 28x28, and expand dimensions to add batch dimension
    let imageTensor = tf.node
      .decodeImage(buffer)
      .resizeNearestNeighbor([28, 28])
      .expandDims();

    // add the tensor to the list of images and labels
    images.push(imageTensor);

    // check if the image is a circle or a triangle
    const circle = files[i].toLocaleLowerCase().endsWith("circle.png");
    const triangle = files[i].toLocaleLowerCase().endsWith("triangle.png");

    // labels 0 for circle, 1 for triangle
    if (circle === true) {
      labels.push(0);
    } else if (triangle === true) {
      labels.push(1);
    }
  }

  // return the list of images and labels 
  return [images, labels];
};

// load and prepare data for training and testing the model
const loadData = () => {
  console.log("Loading images...");
  trainData = loadImages(trainImagesDir);
  testData = loadImages(testImagesDir);
  console.log("Images loaded successfully");
};

// get training data
const getTrainData = () => {
  return {
    images: tf.concat(trainData[0]),
    labels: tf.oneHot(tf.tensor1d(trainData[1], "int32"), 2),
  };
};

// get test data
const getTestData = () => {
  return {
    images: tf.concat(testData[0]),
    labels: tf.oneHot(tf.tensor1d(testData[1], "int32"), 2),
  };
};

module.exports = { loadData, getTestData, getTrainData };
