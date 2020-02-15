import React, { useState } from 'react';
import './App.css';
import '../node_modules/uikit/'
import { Query } from 'react-apollo'
import ApolloClient, { gql } from 'apollo-boost';
import { ApolloProvider } from 'react-apollo'
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
const fromEficodeToAddress = "Pohjoinen Rautatienkatu 25";

function Timetables() {

  const { loading, error, data } = useQuery(nearestStops)

  console.log(data);



  document.title = 'Timetables';
  const [search, setSearch] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(search)
    axios.get(`http://api.digitransit.fi/geocoding/v1/search?text=${search}`)
      .then(res => {
        console.log(res);

      })
  }

  const handleClick = (e) => {
    e.preventDefault();
  }

  const handleSearchChange = (e) => {
    console.log(e);

    setSearch(e.target.value);
  }

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
