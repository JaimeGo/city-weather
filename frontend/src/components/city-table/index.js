import React, { useState, useEffect } from "react";
import CityItem from "../city-item";
import "./styles.css";

import cloneDeep from "lodash.clonedeep";

import backgroundImage from "../../assets/images/background-image.jpg";

import SectionContainer from "../section-container";

const CityTable = () => {
  const [cities, setCities] = useState({
    "Santiago (CL)": { hour: "--:--", temperature: "--" },
    "Zurich (CH)": { hour: "--:--", temperature: "--" },
    "Auckland (NZ)": { hour: "--:--", temperature: "--" },
    "Sydney (AU)": { hour: "--:--", temperature: "--" },
    "London (UK)": { hour: "--:--", temperature: "--" },
    "Georgia (USA)": { hour: "--:--", temperature: "--" }
  });

  const handleWebsocketConnection = () => {
    const ws = new WebSocket("wss://wsserver-temperature.herokuapp.com");
    ws.onmessage = event => {
      const responseCities = JSON.parse(event.data);

      let newCities = cloneDeep(cities);

      responseCities.forEach(responseCity => {
        const { name, hour, temperature } = responseCity;
        if (hour && temperature) {
          newCities[name] = { hour, temperature };
        }
      });

      setCities(newCities);
    };

    ws.onclose = () => {
      ws.close();
    };
  };

  // Runs only once, when the page loads for the first time or reloads
  useEffect(() => {
    handleWebsocketConnection();
    const ws = new WebSocket("wss://wsserver-temperature.herokuapp.com");
    ws.send("Page loaded");
    return () => {
      ws.close();
    };
  }, []);

  // Runs every time cities change
  useEffect(() => {
    handleWebsocketConnection();
    return () => {
      ws.close();
    };
  }, [cities]);

  return (
    <div style={{ backgroundImage: `url(${backgroundImage})` }}>
      <SectionContainer>
        <div className="table-container">
          {Object.entries(cities).map(city => (
            <CityItem city={city} key={city[0]}></CityItem>
          ))}
        </div>
      </SectionContainer>
    </div>
  );
};

export default CityTable;
