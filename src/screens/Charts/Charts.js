import React, { useEffect, useState } from "react";
import CanvasJSReact from "../../assets/canvasjs.react";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Charts = ({data}) => {
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
      if (survived && passenger_class === 1 && female) femaleSurvivedClassOne++;
      if (survived && passenger_class === 2 && female) femaleSurvivedClassTwo++;
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
    });

    setMaleSurvivorCount(maleSurvival);
    setFemaleSurvivorCount(femaleSurvival);
    setTotalPassengers(data.length);

  }, []);

  return (
    <div>
      <div className="chart">
        <CanvasJSChart options={maleFemaleSurvivalOptions} />
      </div>
      <div className="chart">
        <CanvasJSChart options={maleFemaleSurvivalByClassOptions} />
      </div>
      <div className="chart">
        <CanvasJSChart options={maleFemaleSurvivalByAgeOptions} />
      </div>
    </div>
  );
};

export default Charts;
