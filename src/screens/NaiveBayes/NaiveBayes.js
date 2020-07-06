import React, { useState, useEffect } from "react";
import { GaussianNB } from "ml-naivebayes";
import { Select } from "element-react";

const NaiveBayes = ({ data }) => {
  const [passengerClass, setPassengerClass] = useState("");
  const [age, setAge] = useState("");
  const [fare, setFare] = useState("");
  const [gender, setGender] = useState("");
  const [inputMatrix, setInputMatrix] = useState([]);
  const [outputMatrix, setOutputMatrix] = useState([]);
  const [naiveBayesResult, setNaiveBayesResult] = useState("");
  const [options, setOptions] = useState([
    {
      value: "male",
      label: "male",
    },
    {
      value: "female",
      label: "female",
    },
  ]);

  useEffect(() => {
    if (inputMatrix.length > 0 && outputMatrix.length > 0) {
      const model = new GaussianNB();
      model.train(inputMatrix, outputMatrix);

      const genderArray = gender === "male" ? [1, 0] : [0, 1];
      const predictions = model.predict([
        [passengerClass, age, fare, genderArray[0], genderArray[1]],
      ]);
      setNaiveBayesResult(predictions[0].toString());
    }
  }, [inputMatrix, outputMatrix]);

  const processData = () => {
    const inputMatrixTemp = [];
    const outputMatrixTemp = [];
    data.forEach((patientRecord) => {
      const record = Object.values(patientRecord);
      inputMatrixTemp.push(record.slice(1, record.length));
      outputMatrixTemp.push([record[0]]);
    });
    setInputMatrix(inputMatrixTemp);
    setOutputMatrix(outputMatrixTemp);
  };

  const trainData = (e) => {
    e.preventDefault();
    processData();
  };

  return (
    <div className="main">
      <h2>Titatic Naive Bayes Survival Rate Predictor</h2>
      <form onSubmit={trainData} className="main__form">
        <div className="main__input-container">
          <label className="main__form-label">Passenger Class</label>
          <input
            className="main__form-input"
            placeholder="ex. 1-3"
            type="text"
            value={passengerClass}
            onChange={(e) => setPassengerClass(e.target.value)}
          />
        </div>
        <div className="main__input-container">
          <label>Age</label>
          <input
            className="main__form-input"
            placeholder="ex. 1-100"
            type="text"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <div className="main__input-container">
          <label>Fare</label>

          <input
            className="main__form-input"
            placeholder="ex. 1-100"
            type="text"
            value={fare}
            onChange={(e) => setFare(e.target.value)}
          />
        </div>
        <div className="main__input-container">
          <label>Gender</label>

          <Select onChange={(e) => setGender(e)} placeholder="gender">
            {options.map((el) => {
              return (
                <Select.Option
                  key={el.value}
                  label={el.label}
                  value={el.value}
                />
              );
            })}
          </Select>
        </div>
        <input
          type="submit"
          value="Predict Survival"
          name="Predict Survival"
          className="main__form-button"
        />
        {!!naiveBayesResult && (
          <div className="main__result">
            Prediction Accuracy:{" "}
            {naiveBayesResult ? "Survived" : "Did not Survive"}
          </div>
        )}
      </form>
    </div>
  );
};

export default NaiveBayes;
