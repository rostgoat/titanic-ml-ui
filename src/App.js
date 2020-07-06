import React, { useEffect, useState } from "react";
import "./App.css";
import { passengers } from "./api/passengers";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import NeuralNet from "./screens/NeuralNet/NeuralNet";
import NaiveBayes from "./screens/NaiveBayes/NaiveBayes";

const App = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [data, setData] = useState([]);

  useEffect(() => {
    const getPatientsData = async () => {
      const data = await passengers();
      setData(data);
    };

    getPatientsData();
  }, []);
  return (
    <div className="App">
      <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
        <TabList>
          <Tab>Neural Net</Tab>
          <Tab>Naive Bayes</Tab>
        </TabList>

        <TabPanel>
          <NeuralNet data={data} />
        </TabPanel>
        <TabPanel>
          <NaiveBayes data={data} />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default App;
