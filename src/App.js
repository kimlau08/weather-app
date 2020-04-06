import React, { Component } from 'react'
import './App.css';

import {Route, Link, Switch, BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';

import Day0 from './components/Day0';
import Day1 from './components/Day1';
import Day2 from './components/Day2';
import Day3 from './components/Day3';
import Day4 from './components/Day4';
import Day5 from './components/Day5';
import Day6 from './components/Day6';

import config from './config/config';

//import sample5DayForecast, {sampleNowCast} from './components/sampleForecast';

let test=false;

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {

      city: "",
      fiveDayForecastData: [],
      hourlyDataByDays: [],
      day0Forecast: {},
      day1Forecast: {},
      day2Forecast: {},
      day3Forecast: {},
      day4Forecast: {},
      day5Forecast: {},
      day6Forecast: {},

      axiosItems: []
    }

    this.axiosGet=this.axiosGet.bind(this);
    this.axiosGetWeatherData=this.axiosGetWeatherData.bind(this);

    this.sortForecastByDate=this.sortForecastByDate.bind(this);
    this.getDateFromISODate=this.getDateFromISODate.bind(this);
    this.getDayOfWeek=this.getDayOfWeek.bind(this);
  }

  getDateFromISODate(ISODateTime) {
    let dateTimeArray=ISODateTime.split('T');
    return dateTimeArray[0];
  }

  getDayOfWeek(date) {
    let wkDayNames=['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    let dayNum=new Date(date).getDay(); 
    let dayOfWk=isNaN(dayNum) ? "" : wkDayNames[dayNum];
    return dayOfWk;
  }

  sortForecastByDate() {    

    //Get ISO date for next 7 days
    let today=this.getDateFromISODate(new Date().toISOString());  //currrent date-time, delimited by 'T'
    
    //Add hourly data to each forecast day
    let forecastData=this.state.fiveDayForecastData.list; //only get the array of forecast data
    let currentDay="";
    let currentDayIdx=0;
    let forecastByDays=[];
    let dailyForecast=[]; //array of objects containing day name, main forecast, temp min and temp max
    for (let i=0; i<forecastData.length; i++) {


      let dt=forecastData[i].dt_txt;
      let day=dt.split(' ')[0];  //get the day portion of day-time

      let dayOfWk=this.getDayOfWeek(dt);
      let mainForecast=forecastData[i].weather.main;
      let tempMax=forecastData[i].main.temp_max;
      let tempMin=forecastData[i].main.temp_min;

      if (currentDay === "") {
        //start the first day
        forecastByDays[0]= [ forecastData[i] ];  //2 dimension array of forecast: [day] [hourly data]
        currentDay=day;
        currentDayIdx=0;

        continue;
      }

      if (currentDay === day) {

        //add data to current day
        forecastByDays[currentDayIdx].push(forecastData[i]);
        currentDay=day;

      } else {

        //a new day
        currentDayIdx++;
        forecastByDays[currentDayIdx]= [ forecastData[i] ];  //start a new day
        currentDay=day;

      };

      
      let currentDayForecast={
        weekday: dayOfWk,
        forecast: mainForecast,
        hiTemp: tempMax,
        loTemp: tempMin,


      }
      dailyForecast.push(currentDayForecast);

    }

    this.setState( { hourlyDataByDays: forecastByDays });
  }


  axiosGetWeatherData () {

 
    let apiKey=config.OPEN_WEATHER_MAP_KEY;
    axios.get("http://api.openweathermap.org/data/2.5/forecast?q=Dallas,us&APPID="+apiKey)
    .then (response=> {
      const responseData=response.data;
      console.log('Weather data: ', responseData);

      this.setState({fiveDayForecastData: responseData});
      this.sortForecastByDate();
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

      this.setState({axiosItems: responseData});
      this.setState({city: responseData.city.name});
    })
    .catch(error=>{
      console.log('Error occurred', error)
    })
  }

  componentDidMount() {

    this.axiosGetWeatherData();
      // this.axiosGet();

  }

  render() {

    let linkName="Today";
    return (
      <div className="App">

        <Router>
            <nav>
              <ul>
                <li>  <Link to="/Day0">{linkName}</Link> </li>
                <li>  <Link to="/Day1">Day1</Link> </li>
                <li>  <Link to="/Day2">Day2</Link> </li>
                <li>  <Link to="/Day3">Day3</Link> </li>
                <li>  <Link to="/Day4">Day4</Link> </li>
                <li>  <Link to="/Day5">Day5</Link> </li>
                <li>  <Link to="/Day6">Day6</Link> </li>
              </ul>
            </nav>
            <Switch>
              <Route exact path="/Day0" component={Day0} />
              <Route exact path="/Day1" component={Day1} />
              <Route exact path="/Day2" component={Day2} />
              <Route exact path="/Day3" component={Day3} />
              <Route exact path="/Day4" component={Day4} />
              <Route exact path="/Day5" component={Day5} />
              <Route exact path="/Day6" component={Day6} />
            </Switch>
        </Router>

        <ul>
            { this.state.axiosItems.map( (data, id)=><li key={id}> {data.title} </li> )}
        </ul>

      </div>
    )
  }
}

