import React, { useState } from 'react';
import './App.css';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks'
import { Query } from 'react-apollo'
import axios from 'axios';


const ADDRESS_TO_EFICODE = gql`
query RouteToEficode($latitude: number!, $longitude: number!){
  plan(
    from: {lat: $latitude, lon: $longitude}
    to: {lat: 60.169390, lon: 24.925750}
    numItineraries: 1
  ) {
    itineraries {
      legs {
        startTime
        endTime
        mode
        duration
        distance
        transitLeg
      } fares {
        type
        cents
        currency
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
        distance
        transitLeg
      } fares {
        type
        cents
        currency
      }
    }
  }
}
`

function Timetables() {
  const [addresses, setAddresses] = useState([]);
  const [addressCoordinates, setAddressCoordinates] = useState([]);
  const [toFromEficode, setToFromEficode] = useState(true);
  const [search, setSearch] = useState("");

  document.title = 'Timetables';
  

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.get(`http://api.digitransit.fi/geocoding/v1/search?text=${search}&boundary.circle.lat=60.169390&boundary.circle.lon=24.925750&boundary.circle.radius=100`)
      .then(res => {
        setAddressCoordinates(res.data.features.map((feature) => ({lat: feature.geometry.coordinates[1], lon: feature.geometry.coordinates[0]})));
        setAddresses(res.data.features);
      })
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  }

  console.log(addressCoordinates);

  return (
    <div className="App">
      <h1 className="App-header">
        Tarkasta julkisen liikenteen aikataulut toimistolle
        <br></br>
        tai toimstolta valitseemasi osoitteeseen!
      </h1>
      <div>
        <RouteBars handleSubmit={handleSubmit} handleSearchChange={handleSearchChange} />
        <h5>
        Valitse, haluatko mennä Eficoden toimistolle, vai lähteä sieltä.
        </h5>
        <button onClick={() => setToFromEficode(!toFromEficode)}> 
        {toFromEficode ? 'Valitsemasi kohde -> Eficode' : 'Eficode -> valitsemasi kohde'} 
        </button>
      </div>
      <AddressDisplay addresses={addresses} />
      <RouteDisplay addressCoordinates={addressCoordinates[0]} />
    </div>
  );
}

function AddressDisplay(props) {
  return (
    <div>
      {props.addresses.map((address) => <div key={address.properties.label}>
      <a
          className="App-link"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          {address.properties.label}
        </a>
      </div>
      )}
    </div>
  )
}

function RouteDisplay(props) {
  const { loading, error, data } = useQuery(ADDRESS_TO_EFICODE, {
    variables: props.addressCoordinates ,
  });
  console.log(props.addressCoordinates)
  if (loading) return <p>Loading ...</p>;
  if (error) return (
    <div>
    {console.log(error)}
    </div>
    );
  return (
  <div>
    {data}
  </div>
  )
}

function RouteBars(props) {
  return (
    <div>
      <form onSubmit={props.handleSubmit}>
        <div>
          <label>Eficoden toimisto:</label>
          <br></br>
          <h3>
          Pohjoinen Rautatienkatu 25
          </h3>
          <label htmlFor="routeToFrom">Hae aikatauluja:</label>
          <br></br>
          <input id="routeToFrom" type="text" required name="routeToFrom"
            size="25" placeholder="Osoite" onChange={props.handleSearchChange} />
          <input type="submit" value="Hae aikatauluja" />
        </div>
      </form>
    </div>
  );
}

export default Timetables;
