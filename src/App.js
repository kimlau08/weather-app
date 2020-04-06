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
//import Day6 from './components/Day6';

import cloudyImg from './assets/cloudy.PNG';
import rainyImg from './assets/rainy.PNG';
import sunnyImg from './assets/sunny.PNG';
import snowyImg from './assets/snowy.PNG';

import config from './config/config';

//import sample5DayForecast, {sampleNowCast} from './components/sampleForecast';

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
   //   day6Forecast: {},

      day0Img: "",
      day1Img: "",
      day2Img: "",
      day3Img: "",
      day4Img: "",
      day5Img: "",


      axiosItems: []
    }

    this.axiosGet=this.axiosGet.bind(this);
    this.axiosGetWeatherData=this.axiosGetWeatherData.bind(this);

    this.sortForecastByDate=this.sortForecastByDate.bind(this);
    this.getDateFromISODate=this.getDateFromISODate.bind(this);
    this.getDayOfWeek=this.getDayOfWeek.bind(this);
    this.getWeatherImgPath=this.getWeatherImgPath.bind(this);
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
  getWeatherImgPath(mainForecast) {
    let mf=mainForecast.toLowerCase();
    if (mf.match("cloud")) {
      return cloudyImg;
    } else if (mf.match("rain")) {
      return rainyImg;
    } else if (mf.match("sun")) {
      return sunnyImg;
    } else if (mf.match("snow")) {
      return snowyImg;
    }
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
    let tempMax=0;
    let tempMin=1000;
    for (let i=0; i<forecastData.length; i++) {

      let dt=forecastData[i].dt_txt;
      let day=dt.split(' ')[0];  //get the day portion of day-time

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

        //move on to the new day
        currentDayIdx++;
        forecastByDays[currentDayIdx]= [ forecastData[i] ];  //start a new day
        currentDay=day;

      };
    }

    //extract the needed info for each day from forecastByDays 
    //for each forecast day, ...
    for (let i=0; i<forecastByDays.length; i++) {

      let dt=forecastByDays[i][0].dt_txt;
      let day=dt.split(' ')[0];  //get the day portion of day-time

      let mainForecast=forecastByDays[i][0].weather[0].main;
      let img=this.getWeatherImgPath(mainForecast);

      let dayOfWk=this.getDayOfWeek(dt);

      //for each hourly forecast on that day
      for (let j=0; j<forecastByDays[i].length ; j++) {
        tempMax = (tempMax < forecastByDays[i][j].main.temp_max) ? forecastByDays[i][j].main.temp_max : tempMax;
        tempMin = (tempMin > forecastByDays[i][j].main.temp_max) ? forecastByDays[i][j].main.temp_min : tempMin;
      }

      //record the current day forecast before moving on to the next day
      let currentDayForecast={
        weekday: dayOfWk,
        forecast: mainForecast,
        hiTemp: tempMax,
        loTemp: tempMin,

        weatherImg: img,

        hourlyForecast: forecastByDays[i]
      }
      dailyForecast.push(currentDayForecast);

    }

    this.setState({day0Img: dailyForecast[0].weatherImg});
    this.setState({day1Img: dailyForecast[1].weatherImg});
    this.setState({day2Img: dailyForecast[2].weatherImg});
    this.setState({day3Img: dailyForecast[3].weatherImg});
    this.setState({day4Img: dailyForecast[4].weatherImg});
    this.setState({day5Img: dailyForecast[5].weatherImg});

    this.setState({day0Forecast: dailyForecast[0]});
    this.setState({day1Forecast: dailyForecast[1]});
    this.setState({day2Forecast: dailyForecast[2]});
    this.setState({day3Forecast: dailyForecast[3]});
    this.setState({day4Forecast: dailyForecast[4]});
    this.setState({day5Forecast: dailyForecast[5]});
//    this.setState({day6Forecast: dailyForecast[6]});


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
                <li>  <Link to={{
                            pathname: "/Day0",
                            forecast: this.state.day0Forecast
                      }}>{linkName}</Link> </li>
                <li>  <Link to="/Day1">Day1</Link> </li>
                <li>  <Link to="/Day2">Day2</Link> </li>
                <li>  <Link to="/Day3">Day3</Link> </li>
                <li>  <Link to="/Day4">Day4</Link> </li>
                <li>  <Link to="/Day5">Day5</Link> </li>
  {/* <li>  <Link to="/Day6">Day6</Link> </li> */}
              </ul>
            </nav>
            <Switch>
              <Route exact path="/Day0" component={Day0} />
              <Route exact path="/Day1" component={Day1} />
              <Route exact path="/Day2" component={Day2} />
              <Route exact path="/Day3" component={Day3} />
              <Route exact path="/Day4" component={Day4} />
              <Route exact path="/Day5" component={Day5} />
  {/* <Route exact path="/Day6" component={Day6} /> */}
            </Switch>
        </Router>

        <ul>
            { this.state.axiosItems.map( (data, id)=><li key={id}> {data.title} </li> )}
        </ul>

      </div>
    )
  }
}

