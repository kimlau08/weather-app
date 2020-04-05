import React, { Component } from 'react'
import './App.css';

import {Route, Link, Switch, BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';

import Sunday from './components/Sunday';
import Saturday from './components/Saturday';
import Monday from './components/Monday';
import Tuesday from './components/Tuesday';
import Wednesday from './components/Wednesday';
import Thursday from './components/Thursday';
import Friday from './components/Friday';

import config from './config/config';

import sampleForecast from './components/sampleForecast'

let test=true;


export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {

      fiveDayForecastData: [],

      axiosItems: []
    }

    this.axiosGet=this.axiosGet.bind(this);
    this.axiosGetWeather=this.axiosGetWeather.bind(this);
  }

  
  axiosGetWeather () {

    let apiKey=config.OPEN_WEATHER_MAP_KEY;
    axios.get("http://api.openweathermap.org/data/2.5/forecast?q=Dallas,us&APPID="+apiKey)
    .then (response=> {
      const responseData=response.data.results;
      console.log('Weather data: ', responseData);

      this.setState({dataforToday: responseData})
    })
    .catch(error=>{
      console.log('Error occurred', error)
    })
  }

  axiosGet() {
    axios.get("https://api.spoonacular.com/recipes/search?query=cheese&number=4&apiKey=27a02bbb5b48401f96bfda6a7d3e2545")
    .then (response=> {
      const responseData=response.data;
      console.log('Weather data: ', responseData);

      this.setState({axiosItems: responseData})
    })
    .catch(error=>{
      console.log('Error occurred', error)
    })
  }

  componentDidMount() {


    /***********************Update this before submitting**********************/
    if (test) {
      this.setState({ fiveDayForecastData: sampleForecast });

    } else {
      
      this.axiosGetWeather();
      // this.axiosGet();

    }

  }

  render() {
    return (
      <div className="App">

        <Router>
            <nav>
              <ul>
                <li>  <Link to="/Sunday">Sunday</Link>    </li>
                <li>  <Link to="/Monday">Monday</Link>    </li>
                <li>  <Link to="/Tuesday">Tuesday</Link>  </li>
                <li>  <Link to="/Wednesday">Wednesday</Link> </li>
                <li>  <Link to="/Thursday">Thursday</Link>   </li>
                <li>  <Link to="/Friday">Friday</Link>    </li>
                <li>  <Link to="/Saturday">Saturday</Link> </li>
              </ul>
            </nav>
            <Switch>
              <Route exact path="/Sunday" component={Sunday} />
              <Route exact path="/Monday" component={Monday} />
              <Route exact path="/Tuesday" component={Tuesday} />
              <Route exact path="/Wednesday" component={Wednesday} />
              <Route exact path="/Thursday" component={Thursday} />
              <Route exact path="/Friday" component={Friday} />
              <Route exact path="/Saturday" component={Saturday} />
            </Switch>
        </Router>

        <p>
          Weather Forecast Today:

        </p>

        <ul>
            { this.state.axiosItems.map( (data, id)=><li key={id}> {data.title} </li> )}
        </ul>

      </div>
    )
  }
}

