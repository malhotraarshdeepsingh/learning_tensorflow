const tf = require("@tensorflow/tfjs");

const kernelSize = [3, 3];
const filter = 32;
const numClasses = 2;

// defining model architecture
const model = tf.sequential();

// adding Convolutional Layer
model.add(
  tf.layers.conv2d({
    inputShape: [28, 28, 4],
    filters: filter,
    kernelSize,
    activation: "relu",
  })
);

// adding MaxPooling Layer
model.add(
  tf.layers.maxPooling2d({
    poolSize: [2, 2],
  })
);

// Flatten the Features- Converts the 2D feature maps into a 1D vector to feed into the dense layers.
model.add(tf.layers.flatten());

// adding Dense Layers
model.add(tf.layers.dense({ units: 10, activation: "relu" }));

// output layer
model.add(tf.layers.dense({ units: numClasses, activation: "softmax" }));

// compiling the model
const optimizer = tf.train.adam(0.0001);
model.compile({
  optimizer,
  loss: "categoricalCrossentropy",
  metrics: ["accuracy"],
});

module.exports = model;
