import React, { useEffect, useState } from "react";
import "./App.css";
import bayes from "node-bayes";
import { passengers } from "./api/passengers";
import brain from "brain.js";
import CanvasJSReact from "./assets/canvasjs.react";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const App = () => {
  const [patientsData, setPatientsData] = useState([]);
  const [hiddenLayers, setHiddenLayers] = useState("");
  const [iterations, setIterations] = useState("");
  const [learningRate, setLearningRate] = useState("");
  const [loading, setLoading] = useState(false);
  const [neuralNetworkResult, setNeuralNetworkResult] = useState("");
  const [maleSurvivorCount, setMaleSurvivorCount] = useState(0);
  const [femaleSurvivorCount, setFemaleSurvivorCount] = useState(0);

  const maleFemaleSurvivalOptions = {
    width: 450,
    height: 300,
    title: {
      text: "Male/Female Survivor Count",
    },
    data: [
      {
        type: "column",
        dataPoints: [
          { label: "Male Survivors", y: maleSurvivorCount },
          { label: "Female Survivors", y: femaleSurvivorCount },
        ],
      },
    ],
  };

  useEffect(() => {
    const getPatientsData = async () => {
      const data = await passengers();
      const outer = [];
      console.log("data", data);
      const reducer = (accumulator, currentValue) => accumulator + currentValue;

      let maleSurvival = 0;
      let femaleSurvival = 0;

      data.forEach((patientRecord) => {
        const { survived, male, female } = patientRecord;
        if (survived && male) maleSurvival++;
        if (survived && female) femaleSurvival++;

        const record = Object.values(patientRecord);

        const modifiedRecord = {
          input: record.slice(1, record.length),
          output: [record[0]],
        };
        outer.push(modifiedRecord);
      });
      console.log("maleSurvival", maleSurvival);
      console.log("femaleSurvival", femaleSurvival);
      setMaleSurvivorCount(maleSurvival);
      setFemaleSurvivorCount(femaleSurvival);
      setPatientsData(outer);
      return data;
    };

    getPatientsData();
  }, []);

  const trainData = (e) => {
    console.log("inside");
    e.preventDefault();
    setLoading(true)
    if (patientsData.length > 0) {
      const SPLIT = 800;
      const network = new brain.NeuralNetwork({
        activation: "sigmoid",
        hiddenLayers: [parseInt(hiddenLayers, 10)],
        iterations: parseInt(iterations, 10),
        learningRate: parseFloat(learningRate),
      });
      const trainData = patientsData.slice(0, SPLIT);
      const testData = patientsData.slice(SPLIT + 1);
      network.train(trainData);
      let hits = 0;
      testData.forEach((datapoint) => {
        const output = network.run(datapoint.input);
        const outputArray = [Math.round(output[0])];
        if (outputArray[0] === datapoint.output[0]) {
          hits += 1;
        }
      });
      if (hits)setLoading(false);
      console.log("hits / testData.length", hits / testData.length);
      setNeuralNetworkResult((hits / testData.length).toString());
    }
  };
  return (
    <div className="App">
      <div className="main">
        <h2>Titatic Neural Network Survival Rate Predictor</h2>
        <form onSubmit={trainData} className="main__form">
          <div className="main__input-container">
            <label className="main__form-label">Hidden Layers</label>
            <input
              className="main__form-input"
              placeholder="ex. 5"
              type="text"
              value={hiddenLayers}
              onChange={(e) => setHiddenLayers(e.target.value)}
            />
          </div>
          <div className="main__input-container">
            <label>Iterations</label>
            <input
              className="main__form-input"
              placeholder="ex. 20000"
              type="text"
              value={iterations}
              onChange={(e) => setIterations(e.target.value)}
            />
          </div>
          <div className="main__input-container">
            <label>Learning Rate</label>

            <input
              className="main__form-input"
              placeholder="ex. 0.5"
              type="text"
              value={learningRate}
              onChange={(e) => setLearningRate(e.target.value)}
            />
          </div>
          <input
            type="submit"
            value="Predict Accuracy"
            name="Predict Accuracy"
            className="main__form-button"
          />
          {loading && <div className="lds-dual-ring"></div>}
          {!!neuralNetworkResult && (
            <div className="main__result">Prediction Accuracy: {parseFloat(neuralNetworkResult).toFixed(4)}</div>
          )}
        </form>
        <div className="chart">
          <CanvasJSChart options={maleFemaleSurvivalOptions} />
        </div>
      </div>
    </div>
  );
};

export default App;
