import "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import { handleFilePicker, showResult } from "./utils";

let model;

const init = async () => {
  model = await cocoSsd.load();
  // Calls the handleFilePicker function and passes the predict function as a callback
  handleFilePicker(predict);
};

const predict = async (img) => {
    const prediction = await model.detect(img);
    showResult(prediction);
}

init();