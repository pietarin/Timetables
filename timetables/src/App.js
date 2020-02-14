import React, { useState } from 'react';
import './App.css';
import '../node_modules/uikit/'

function Timetables() {
  document.title = 'Timetables';
  const [count, setCount] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  const handleClick = (e) => {
    e.preventDefault();
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
        <RouteBars handleSubmit={handleSubmit} />
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
          <label htmlFor="routeTo">Syötä toinen päätepiste alle:</label>
          <br></br>
          <input id="routeTo" type="text" required name="routeTo"
            size="25" placeholder="Osoite" />
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
