const path = "./my_model/";
const startButton = document.getElementById("start");

startButton.onclick = () => init();

let model;

const init = async () => {
    const modelPath = path + "model.json";
    const metadataPath = path + "metadata.json";

    model = await tmImage.load(modelPath, metadataPath);

    let maxPredictions = model.getTotalClasses();

    webcam = new tmImage.Webcam(200, 200, true);

    await webcam.setup();
    await webcam.play();

    // begins a continuous loop for real-time predictions
    window.requestAnimationFrame(loop);

    document.getElementById("webcam-container").appendChild(webcam.canvas);
}

const loop = async () => {
    Webcam.update();
    await predict();
    // ensures loop continues
    window.requestAnimationFrame(loop);
}

const predict = async () => {
    const predictions = await model.predict(webcam.canvas);

    /*
        [
            {
                class: "right",
                probability: 0.5
            },
            {
                class: "left",
                probability: 0.3
            },
        ]
    */

    const topPrediction = Math.max(...predictions.map((p) => p.probability));

    const topPredictionIndex = predictions.findIndex(
        (p) => p.probability === topPrediction
    );

    console.log(predictions[topPredictionIndex].className);
}