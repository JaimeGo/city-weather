import React, { useState, useEffect } from "react";
import CityItem from "../city-item";
import "./styles.css";
import socketIOClient from "socket.io-client";
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

  const socket = socketIOClient("https://wsserver-temperature.herokuapp.com");

  useEffect(() => {
    socket.on("New City Info", responseCities => {
      // console.log("Event data:", event.data);
      // const responseCities = JSON.parse(data);
      console.log("RESPONSE CITIES", responseCities);

      let newCities = cloneDeep(cities);

      responseCities.forEach(responseCity => {
        const { name, hour, temperature } = responseCity;
        if (hour && temperature) {
          newCities[name] = { hour, temperature };
        }
      });
      console.log("NEW CITIES", newCities);

      setCities(newCities, () => {
        console.log("STATE CITIES", cities);
      });

      return () => {
        socket.disconnect();
      };
    });
  }, [cities]);

  console.log("ENTRIES", Object.entries(cities));

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
