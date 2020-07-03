import React, { useEffect, useState } from "react";
import "./App.css";
import bayes from "node-bayes";
import { patients } from "./api/patients";
import {Select} from 'element-react'

const App = () => {
  const [patientsData, setPatientsData] = useState([]);


  useEffect(() => {
    const getPatientsData = async () => {
      const data = await patients();
      const outer = [];
      data.forEach((patientRecord) => {
        outer.push(Object.values(patientRecord));
      });
      console.log("outer", outer);
      setPatientsData(outer);
      return data;
    };

    getPatientsData();
  }, []);

  let TRAINING_COLUMNS_COVID = [
    "age",
    "province",
    "gender",
    "infection_case",
    "infection_type",
    "patient_state?",
  ];

  const trainData = (e) => {
    e.preventDefault();
    if (patientsData.length > 0) {
      let cls_covid = new bayes.NaiveBayes({
        columns: TRAINING_COLUMNS_COVID,
        data: patientsData,
        verbose: true,
      });
      cls_covid.train();
      let answer_covid = cls_covid.predict([
        "50s",
        "male",
        "contact with patient",
        "hospital",
        "Seoul",
      ]);
      console.log("answer_covid: ", answer_covid);
    }
  };
  const options = [
    {
      value: '0s',
      label: '0s'
    },
    {
      value: '10s',
      label: '10s'
    },
    {
      value: '20s',
      label: '20s'
    },
    {
      value: '30s',
      label: '30s'
    },
    {
      value: '40s',
      label: '40s'
    },
    {
      value: '50s',
      label: '50s'
    },
    {
      value: '60s',
      label: '60s'
    },
    {
      value: '70s',
      label: '70s'
    },
    {
      value: '80s',
      label: '90s'
    },
    {
      value: '90s',
      label: '90s'
    },
    {
      value: '100s',
      label: '100s'
    },
  ]
  return (
    <div className="App">
      {/* <Select value={''}>
      {
        options.map(el => {
          return <Select.Option key={el.value} label={el.label} value={el.value} />
        })
      }
    </Select> */}
    <button onClick={trainData}>click me</button>
    </div>
  );
};

export default App;
