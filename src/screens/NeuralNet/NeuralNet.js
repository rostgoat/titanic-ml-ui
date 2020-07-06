import React, { useEffect, useState } from "react";
import "./NeuralNet.css";
import { passengers } from "../../api/passengers";
import brain from "brain.js";
import CanvasJSReact from "../../assets/canvasjs.react";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const NeuralNet = () => {
  const [patientsData, setPatientsData] = useState([]);
  const [hiddenLayers, setHiddenLayers] = useState("");
  const [iterations, setIterations] = useState("");
  const [learningRate, setLearningRate] = useState("");
  const [neuralNetworkResult, setNeuralNetworkResult] = useState("");
  const [maleSurvivorCount, setMaleSurvivorCount] = useState(0);
  const [femaleSurvivorCount, setFemaleSurvivorCount] = useState(0);
  const [totalPassengers, setTotalPassengers] = useState(0);
  const [
    survivalCountByClassAndGender,
    setSurvivalCountByClassAndGender,
  ] = useState([]);
  const [
    survivalCountByAgeAndGender,
    setSurvivalCountByAgeAndGender,
  ] = useState([]);

  const maleFemaleSurvivalOptions = {
    width: 450,
    height: 300,
    title: {
      text: "Survivors By Gender",
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

  const maleFemaleSurvivalByClassOptions = {
    width: 450,
    height: 300,
    title: {
      text: "Survivors By Gender and Passenger Class",
    },
    data: [
      {
        type: "column",
        dataPoints: [
          { label: "Male Class 1", y: survivalCountByClassAndGender[0] },
          { label: "Male Class 2", y: survivalCountByClassAndGender[1] },
          { label: "Male Class 3", y: survivalCountByClassAndGender[2] },
          { label: "Female Class 1", y: survivalCountByClassAndGender[3] },
          { label: "Female Class 2", y: survivalCountByClassAndGender[4] },
          { label: "Female Class 3", y: survivalCountByClassAndGender[5] },
        ],
      },
    ],
  };

  const maleFemaleSurvivalByAgeOptions = {
    width: 450,
    height: 300,
    title: {
      text: "Survivors By Gender and Age",
    },
    data: [
      {
        type: "column",
        dataPoints: [
          { label: "Male Teen", y: survivalCountByAgeAndGender[0] },
          { label: "Male Adult", y: survivalCountByAgeAndGender[1] },
          { label: "Male Senior", y: survivalCountByAgeAndGender[2] },
          { label: "Female Teen", y: survivalCountByAgeAndGender[3] },
          { label: "Female Adult", y: survivalCountByAgeAndGender[4] },
          { label: "Female Senior", y: survivalCountByAgeAndGender[5] },
        ],
      },
    ],
  };

  useEffect(() => {
    const getPatientsData = async () => {
      const data = await passengers();
      const outer = [];
      console.log("data", data);
      setTotalPassengers(data.length);

      let maleSurvival = 0;
      let femaleSurvival = 0;
      let maleSurvivedClassOne = 0;
      let maleSurvivedClassTwo = 0;
      let maleSurvivedClassThree = 0;
      let femaleSurvivedClassOne = 0;
      let femaleSurvivedClassTwo = 0;
      let femaleSurvivedClassThree = 0;
      let maleSurvivedTeen = 0;
      let maleSurvivedAdult = 0;
      let maleSurvivedSenior = 0;
      let femaleSurvivedTeen = 0;
      let femaleSurvivedAdult = 0;
      let femaleSurvivedSenior = 0;

      data.forEach((patientRecord) => {
        const { survived, male, female, passenger_class, age } = patientRecord;
        // general survival by gender
        if (survived && male) maleSurvival++;
        if (survived && female) femaleSurvival++;
        // survival by passenger class
        if (survived && passenger_class === 1 && male) maleSurvivedClassOne++;
        if (survived && passenger_class === 2 && male) maleSurvivedClassTwo++;
        if (survived && passenger_class === 3 && male) maleSurvivedClassThree++;
        if (survived && passenger_class === 1 && female)
          femaleSurvivedClassOne++;
        if (survived && passenger_class === 2 && female)
          femaleSurvivedClassTwo++;
        if (survived && passenger_class === 3 && female)
          femaleSurvivedClassThree++;
        // surival by age
        if (survived && age < 18 && male) maleSurvivedTeen++;
        if (survived && age >= 18 && age < 50 && male) maleSurvivedAdult++;
        if (survived && age > 50 && male) maleSurvivedSenior++;
        if (survived && age < 18 && female) femaleSurvivedTeen++;
        if (survived && age >= 18 && age < 50 && female) femaleSurvivedAdult++;
        if (survived && age > 50 && female) femaleSurvivedSenior++;

        setSurvivalCountByClassAndGender([
          maleSurvivedClassOne,
          maleSurvivedClassTwo,
          maleSurvivedClassThree,
          femaleSurvivedClassOne,
          femaleSurvivedClassTwo,
          femaleSurvivedClassThree,
        ]);

        setSurvivalCountByAgeAndGender([
          maleSurvivedTeen,
          maleSurvivedAdult,
          maleSurvivedSenior,
          femaleSurvivedTeen,
          femaleSurvivedAdult,
          femaleSurvivedSenior,
        ]);
        const record = Object.values(patientRecord);

        const modifiedRecord = {
          input: record.slice(1, record.length),
          output: [record[0]],
        };
        outer.push(modifiedRecord);
      });

      setMaleSurvivorCount(maleSurvival);
      setFemaleSurvivorCount(femaleSurvival);
      setPatientsData(outer);
      return data;
    };

    getPatientsData();
  }, []);

  const trainData = (e) => {
    e.preventDefault();
    if (patientsData.length > 0) {
      const SPLIT = 800;
      let hits = 0;
      const trainData = patientsData.slice(0, SPLIT);
      const testData = patientsData.slice(SPLIT + 1);

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
    }
  };
  return (
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
          {!!neuralNetworkResult && <span>This will take a few seconds..</span>}

          {!!neuralNetworkResult && (
            <div className="main__result">
              Prediction Accuracy: {parseFloat(neuralNetworkResult).toFixed(4)}
            </div>
          )}
        </form>
        {/* <div className="chart">
          <CanvasJSChart options={maleFemaleSurvivalOptions} />
        </div>
        <div className="chart">
          <CanvasJSChart options={maleFemaleSurvivalByClassOptions} />
        </div> */}
        {/* <div className="chart">
          <CanvasJSChart options={maleFemaleSurvivalByAgeOptions} />
        </div> */}
      </div>
  );
};

export default NeuralNet;
