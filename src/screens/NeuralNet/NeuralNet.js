import React, { useEffect, useState } from "react";
import brain from "brain.js";

const NeuralNet = ({ data }) => {
  const [patientsData, setPatientsData] = useState([]);
  const [hiddenLayers, setHiddenLayers] = useState("");
  const [iterations, setIterations] = useState("");
  const [learningRate, setLearningRate] = useState("");
  const [neuralNetworkResult, setNeuralNetworkResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (patientsData.length > 0) {
      setLoading(true);
      setError("")
      const SPLIT = 800;
      let hits = 0;
      const trainData = patientsData.slice(0, SPLIT);
      const testData = patientsData.slice(SPLIT + 1);

      if (hiddenLayers === "" && iterations === "" && learningRate === "") {
        setError("Please fill out all fields!");
        setLoading(false);
      } else {
        // create network
        const network = new brain.NeuralNetwork({
          activation: "sigmoid",
          hiddenLayers: [parseInt(hiddenLayers, 10)],
          iterations: parseInt(iterations, 10),
          learningRate: parseFloat(learningRate),
        });
        // train network
        network.train(trainData);
        // test data against training data
        testData.forEach((datapoint) => {
          const output = network.run(datapoint.input);
          const outputArray = [Math.round(output[0])];
          if (outputArray[0] === datapoint.output[0]) {
            hits += 1;
          }
        });
        // show results
        setNeuralNetworkResult((hits / testData.length).toString());
        setLoading(false);
      }
    }
  }, [patientsData, loading]);

  const processData = () => {
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
    setLoading(true);
  };

  const trainData = (e) => {
    e.preventDefault();
    processData();
  };

  return (
    <div className="main">
      <h2 className="main__title">
        Titatic Neural Network Survival Rate Predictor
      </h2>
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
        {!!error && <span className="error">{error}</span>}
        {!!neuralNetworkResult && (
          <div className="main__result">
            Prediction Accuracy: {parseFloat(neuralNetworkResult).toFixed(4)}
          </div>
        )}
      </form>
    </div>
  );
};

export default NeuralNet;
