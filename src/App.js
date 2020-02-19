import React, { useState } from 'react';
import './App.css';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks'
import axios from 'axios';


const ADDRESS_TO_EFICODE = gql`
query RouteToEficode( $lat: Float!, $lon: Float!){
  plan(
    from: {lat: $lat, lon: $lon}
    to: {lat: 60.169390, lon: 24.925750}
    numItineraries: 3
  ) {
    itineraries {
      legs {
        from {
          name
        }
        to {
          name
        }
        route {
          longName
        }
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

const EFICODE_TO_ADDRESS = gql`
query RouteToAddress( $lat: Float!, $lon: Float!){
  plan(
    from: {lat:60.169390, lon:24.925750}
    to: {lat: $lat, lon: $lon}
    numItineraries: 3
  ) {
    itineraries {
      legs {
        from {
          name
        }
        to {
          name
        }
        route {
          longName
        }
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
  const [search, setSearch] = useState("");
  const [display, setDisplay] = useState(false);
  const [clickedLink, setClickedLink] = useState(0);

  document.title = 'Timetables';
  

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.get(`https://api.digitransit.fi/geocoding/v1/search?text=${search}&boundary.circle.lat=60.169390&boundary.circle.lon=24.925750&boundary.circle.radius=100`)
      .then(res => {
        setAddressCoordinates(res.data.features.map((feature) => ({lat: feature.geometry.coordinates[1], lon: feature.geometry.coordinates[0]})));
        setAddresses(res.data.features);
      })
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  }

  return (
    <div className="App">
      <h1 className="App-header">
        Tarkasta julkisen liikenteen aikataulut toimistolle
        <br></br>
        tai toimistolta valitsemaasi osoitteeseen!
      </h1>
      <div>
        <RouteBars handleSubmit={handleSubmit} handleSearchChange={handleSearchChange} />
      </div>
      {display ? <RouteDisplay addressCoordinates={addressCoordinates} clickedLink={clickedLink} /> : <AddressDisplay setDisplay={setDisplay} addresses={addresses} setClickedLink={setClickedLink} /> }
    </div>
  );
}

function AddressDisplay(props) {
  function handleClick(index){
    props.setClickedLink(index);
    props.setDisplay(true)
  }
  return (
    <div>
      {props.addresses.map((address, index) => <div key={address.properties.label}>
      <br></br>
      <button id={index} onClick={(() => {
        handleClick(index);
      })}> 
          {address.properties.label}
      </button>
      </div>
      )}
    </div>
  )
}

function RouteDisplay(props) {
  const [toFromEficode, setToFromEficode] = useState(true);
  const { loading, error, data } = useQuery((toFromEficode) ? ADDRESS_TO_EFICODE :  EFICODE_TO_ADDRESS, {
    variables: props.addressCoordinates[props.clickedLink] ,
  });
  console.log(props.addressCoordinates[props.clickedLink])
  if (loading) return <p>Haetaan reittivaihtoehtoja Digitransitin APIsta!</p>;
  if (error) return (
    <div>
      {console.log(error)}
    </div>
    );
  return (
  <div>
    <h5>
      Valitse, haluatko mennä Eficoden toimistolle, vai lähteä sieltä.
    </h5>
    <button onClick={() => setToFromEficode(!toFromEficode)}> 
      {toFromEficode ? 'Valitsemasi kohde -> Eficode' : 'Eficode -> valitsemasi kohde'} 
    </button>
    {data.plan.itineraries.map((itinerary, index) => <div key={itinerary.legs[index].endTime}>
        <h5>Reittivaihtoehdot nopeimmasta hitaimpaan: </h5>{index + 1 + '.'}
        {data.plan.itineraries[index].legs.map((leg) => <div key={leg.endTime}>
          <br></br>
          {'Pätkä alkaa kohteesta: ' + leg.from.name}
          <br></br>
          {(leg.transitLeg) ? 'Linjan nimi: ' + leg.route.longName : 'Tämä pätkä kannattaa kävellä' }
          <br></br>
          {'Pätkä alkaa: ' + new Date(leg.startTime).toLocaleTimeString() + ' '}
          {leg.mode + ' '}
          {(leg.distance/1000).toFixed(2) + 'km '}
          <br></br>
          {'Pätkä päättyy: ' + new Date(leg.endTime).toLocaleTimeString() + ' '}
          {leg.to.name}
        </div>)} 
        <h4>Olet perillä!</h4>
        <br></br>
        <br></br>
      </div>
    )}
  </div>
  )
}

function RouteBars(props) {
  return (
    <div>
      <form onSubmit={props.handleSubmit}>
        <div>
          <h5>Eficoden toimisto: Pohjoinen Rautatienkatu 25</h5>
          <br></br>
          <label htmlFor="routeToFrom">Hae aikatauluja:</label>
          <br></br>
          <input id="routeToFrom" type="text" required name="routeToFrom"
            size="25" placeholder="Kadun nimi" onChange={props.handleSearchChange} />
          <input type="submit" value="Hae aikatauluja" />
        </div>
      </form>
    </div>
  );
}

export default Timetables;
