import React, { useEffect, useState } from "react";
import "./App.css";
import bayes from "node-bayes";
import { passengers } from "./api/passengers";
import { Select, Input } from "element-react";
import brain from "brain.js";

const App = () => {
  const [patientsData, setPatientsData] = useState([]);
  const [hiddenLayers, setHiddenLayers] = useState(0);
  const SPLIT = 800;
  const network = new brain.NeuralNetwork({
    activation: "sigmoid",
    hiddenLayers: [5],
    iterations: 20000,
    learningRate: 0.5,
  });
  useEffect(() => {
    const getPatientsData = async () => {
      const data = await passengers();
      const outer = [];
      data.forEach((patientRecord) => {
        const record = Object.values(patientRecord);

        const modifiedRecord = {
          input: record.slice(1, record.length),
          output: [record[0]],
        };
        outer.push(modifiedRecord);
      });
      setPatientsData(outer);
      return data;
    };

    getPatientsData();
  }, []);

  const trainData = (e) => {
    e.preventDefault();
    if (patientsData.length > 0) {
      const trainData = patientsData.slice(0, SPLIT);
      const testData = patientsData.slice(SPLIT + 1);
      network.train(trainData);
      let hits = 0;
      testData.forEach((datapoint) => {
        const output = network.run(datapoint.input);
        const outputArray = [
          Math.round(output[0]),
        ];
        if (
          outputArray[0] === datapoint.output[0] 
        ) {
          hits += 1;
        }
      });
      console.log('hits / testData.length', hits / testData.length)
      return hits / testData.length;

    }
  };
  return (
    <div className="App">
      <div className="main">
        <h2>Titatic Data</h2>
        <Input placeholder="Hidden Layers" autoFocus value={hiddenLayers}/>
        <Input placeholder="Iterations" />
        <Input placeholder="Learning Rate" />
        <button onClick={trainData}>Predict Accuracy</button>
      </div>
    </div>
  );
};

export default App;
