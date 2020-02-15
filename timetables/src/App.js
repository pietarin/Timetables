import React, { useState } from 'react';
import './App.css';
import '../node_modules/uikit/'
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks'
import axios from 'axios';

const nearestStops = gql`
{
    stopsByRadius(lat:60.169390, lon:24.925750, radius:500) {
      edges {
        node {
          stop {
            gtfsId
            name
          }
          distance
        }
      }
    }
  }  
`
const fromAddressToEficode = gql`
query RouteToEficode($addressForRoute: String!){
  plan(
    from: $addressForRoute,
    to: "lat:60.169390, lon:24.925750",
    numItineraries: 1,
  ) {
    itineraries {
      legs {
        startTime
        endTime
        mode
        duration
        realTime
        distance
        transitLeg
      }
    }
  }
}
`

const fromEficodeToAddress = gql`
query RouteToAddress($addressForRoute: String!){
  plan(
    from: "lat:60.169390, lon:24.925750",
    to: $addressForRoute,
    numItineraries: 1,
  ) {
    itineraries {
      legs {
        startTime
        endTime
        mode
        duration
        realTime
        distance
        transitLeg
      }
    }
  }
}
`

function Timetables() {
  const [addresses, setAddresses] = useState([]);
  const [addressCoordinates, setAddressCoordinates] = useState([]);
  const { loading, error, data } = useQuery(nearestStops) 

  document.title = 'Timetables';
  const [search, setSearch] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.get(`http://api.digitransit.fi/geocoding/v1/search?text=${search}&boundary.circle.lat=60.169390&boundary.circle.lon=24.925750&boundary.circle.radius=100`)
      .then(res => {
        setAddressCoordinates(res.data.features.map((feature) => `{lat:${feature.geometry.coordinates[1]}, lon:${feature.geometry.coordinates[0]}}`))
        setAddresses(res.data.features);
      })
  }

  const handleClick = (e) => {
    e.preventDefault();
  }

  const handleSearchChange = (e) => {
    console.log(e);

    setSearch(e.target.value);
  }

  console.log(addressCoordinates);


  return (
    <div>
      <h1>
        Tarkasta julkisen liikenteen aikataulut toimistolle
        <br></br>
        tai toimstolta valitseemasi osoitteeseen!
      </h1>
      <h5>
        Valitse, haluatko mennä Eficoden toimistolle, vai lähteä sieltä.
      </h5>
      <div>
        <RouteBars handleSubmit={handleSubmit} handleSearchChange={handleSearchChange} />
        <ToFromButtons handleClick={handleClick} />
        <TimeSettings />
      </div>
      {addresses.map((address) => <div key={address.properties.label}>{address.properties.label}</div>
      )}
    </div>
  );
}

function RouteBars(props) {
  return (
    <div>
      <form onSubmit={props.handleSubmit}>
        <div>
          <label htmlFor="routeFrom">Eficoden toimisto:</label>
          <br></br>
          <input id="routeFrom" type="text" name="routeFrom"
            value="Pohjoinen Rautatienkatu 25" size="25" />
          <input type="submit" value="Hae aikatauluja" disabled />
          <br></br>
          <label htmlFor="routeTo">Hae aikatauluja:</label>
          <br></br>
          <input id="routeTo" type="text" required name="routeTo"
            size="25" placeholder="Osoite" onChange={props.handleSearchChange} />
          <input type="submit" value="Hae aikatauluja" />
        </div>

      </form>
    </div>
  );
}

function ToFromButtons(props) {
  return (
    <div>
      <button handleClick={props.handleClick}>Valitsemasi kohde -> Eficode</button>
      <br></br>
      <button handleClick={props.handleClick}>Eficode -> valitsemasi kohde</button>
    </div>
  )
}

function TimeSettings() {
  return (
    <div>
      <p>
        Syötä lähtöaika alle:
    </p>
      <input type="text" id="time" name="time" required minlength="4" maxlength="4" size="4"
        value={new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
    </div>
  )
}

export default Timetables;
