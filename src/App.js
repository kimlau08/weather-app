import React, { Component } from 'react'
import './App.css';

import axios from 'axios';
import { Switch, Route, Link, BrowserRouter as Router } from "react-router-dom";


import Day0 from './components/Day0';
import Day1 from './components/Day1';
import Day2 from './components/Day2';
import Day3 from './components/Day3';
import Day4 from './components/Day4';
import Day5 from './components/Day5';

import cloudyImg from './assets/cloudy.PNG';
import rainyImg from './assets/rainy.PNG';
import sunnyImg from './assets/sunny.PNG';
import snowyImg from './assets/snowy.PNG';
import clearImg from './assets/sunny.PNG';

import config from './config/config';

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

      day0Img: "",
      day1Img: "",
      day2Img: "",
      day3Img: "",
      day4Img: "",
      day5Img: ""
    }

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
    } else if (mf.match("clear")) {
      return clearImg;
    }
  }

  sortForecastByDate() {    

    //Get ISO date for next 7 days
    
    //Add hourly data to each forecast day
    let forecastData=this.state.fiveDayForecastData.list; //only get the array of forecast data
    let currentDay="";
    let currentDayIdx=0;
    let forecastByDays=[];
    let dailyForecast=[]; //array of objects containing day name, main forecast, temp min and temp max
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
      let tempMax=0;
      let tempMin=1000;  

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


    if (dailyForecast[0] != undefined) {
      this.setState({day0Img: dailyForecast[0].weatherImg});
    }
    if (dailyForecast[1] != undefined) {
      this.setState({day1Img: dailyForecast[1].weatherImg});
    }
    if (dailyForecast[2] != undefined) {
      this.setState({day2Img: dailyForecast[2].weatherImg});
    }
    if (dailyForecast[3] != undefined) {
      this.setState({day3Img: dailyForecast[3].weatherImg});
    }
    if (dailyForecast[4] != undefined) {
      this.setState({day4Img: dailyForecast[4].weatherImg});
    }
    if (dailyForecast[5] != undefined) {
      this.setState({day5Img: dailyForecast[5].weatherImg});
    }


    if (dailyForecast[0] != undefined) {
      this.setState({day0Forecast: dailyForecast[0]});
    }
    if (dailyForecast[1] != undefined) {
      this.setState({day1Forecast: dailyForecast[1]});
    }
    if (dailyForecast[2] != undefined) {
      this.setState({day2Forecast: dailyForecast[2]});
    }
    if (dailyForecast[3] != undefined) {
      this.setState({day3Forecast: dailyForecast[3]});
    }
    if (dailyForecast[4] != undefined) {
      this.setState({day4Forecast: dailyForecast[4]});
    }
    if (dailyForecast[5] != undefined) {
      this.setState({day5Forecast: dailyForecast[5]});
    }

    this.setState( {city: this.state.fiveDayForecastData.city.name }) ;
    this.setState( { hourlyDataByDays: forecastByDays });
  }


  axiosGetWeatherData () {
    let apiKey=config.OPEN_WEATHER_MAP_KEY;
    axios.get("http://api.openweathermap.org/data/2.5/forecast?q=Dallas,us&units=imperial&APPID="+apiKey)
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

  componentDidMount() {

    this.axiosGetWeatherData();

  }

  render() {

    return (
      <div className="App">
        <p className="cityNameTxt"> City: {this.state.city} </p>
        <Router>
            <nav>
              <ul className="ForecastList">
                <li> 
                    <div className="DailyCard">
                      <Link to={{
                            pathname: "/Day0",
                            weekday: this.state.day0Forecast.weekday,
                            hourlyForecast: this.state.day0Forecast.hourlyForecast }}>
                        <img className="forecastImg" src={this.state.day0Img} />
                      </Link>
                      <div className="ForecastBox">
                          <p className="dailyInfoTxt">{this.state.day0Forecast.weekday}: {this.state.day0Forecast.forecast} </p>
                          <p className="dailyInfoTxt"> Hi: {this.state.day0Forecast.hiTemp} </p>
                          <p className="dailyInfoTxt"> Lo: {this.state.day0Forecast.loTemp} </p>
                      </div>
                    </div>
                </li>
                <li>  
                    <div className="DailyCard">
                      <Link to={{
                            pathname: "/Day1",
                            weekday: this.state.day1Forecast.weekday,
                            hourlyForecast: this.state.day1Forecast.hourlyForecast }}>
                        <img className="forecastImg" src={this.state.day1Img} />
                      </Link>
                      
                      <div className="ForecastBox">
                          <p className="dailyInfoTxt">{this.state.day1Forecast.weekday}: {this.state.day1Forecast.forecast} </p>
                          <p className="dailyInfoTxt"> Hi: {this.state.day1Forecast.hiTemp} </p>
                          <p className="dailyInfoTxt"> Lo: {this.state.day1Forecast.loTemp} </p>
                      </div>
                    </div>
                </li>
                <li>  
                    <div className="DailyCard">
                      <Link to={{
                            pathname: "/Day2",
                            weekday: this.state.day2Forecast.weekday,
                            hourlyForecast: this.state.day2Forecast.hourlyForecast }}>
                        <img className="forecastImg" src={this.state.day2Img} />
                      </Link>
                      
                      <div className="ForecastBox">
                          <p className="dailyInfoTxt">{this.state.day2Forecast.weekday}: {this.state.day2Forecast.forecast} </p>
                          <p className="dailyInfoTxt"> Hi: {this.state.day2Forecast.hiTemp} </p>
                          <p className="dailyInfoTxt"> Lo: {this.state.day2Forecast.loTemp} </p>
                      </div>
                    </div>
                </li>
                <li>  
                    <div className="DailyCard">
                      <Link to={{
                            pathname: "/Day3",
                            weekday: this.state.day3Forecast.weekday,
                            hourlyForecast: this.state.day3Forecast.hourlyForecast }}>
                        <img className="forecastImg" src={this.state.day3Img} />
                      </Link>
                      
                      <div className="ForecastBox">
                          <p className="dailyInfoTxt">{this.state.day3Forecast.weekday}: {this.state.day3Forecast.forecast} </p>
                          <p className="dailyInfoTxt"> Hi: {this.state.day3Forecast.hiTemp} </p>
                          <p className="dailyInfoTxt"> Lo: {this.state.day3Forecast.loTemp} </p>
                      </div>
                    </div>
                </li>
                <li>  
                    <div className="DailyCard">
                      <Link to={{
                            pathname: "/Day4",
                            weekday: this.state.day4Forecast.weekday,
                            hourlyForecast: this.state.day4Forecast.hourlyForecast }}>
                        <img className="forecastImg" src={this.state.day4Img} />
                      </Link>
                      
                      <div className="ForecastBox">
                          <p className="dailyInfoTxt">{this.state.day4Forecast.weekday}: {this.state.day4Forecast.forecast} </p>
                          <p className="dailyInfoTxt"> Hi: {this.state.day4Forecast.hiTemp} </p>
                          <p className="dailyInfoTxt"> Lo: {this.state.day4Forecast.loTemp} </p>
                      </div>
                    </div>
                </li>
                <li> { (this.state.day5Forecast.weekday == undefined) ?
                       (  <div className="DailyCard"></div> ) :
                       (
                          <div className="DailyCard">
                            <Link to={{
                                  pathname: "/Day5",
                                  weekday: this.state.day5Forecast.weekday,
                                  hourlyForecast: this.state.day5Forecast.hourlyForecast }}>
                              <img className="forecastImg" src={this.state.day5Img} />
                            </Link>
                            
                            <div className="ForecastBox">
                                <p className="dailyInfoTxt">{this.state.day5Forecast.weekday}: {this.state.day5Forecast.forecast} </p>
                                <p className="dailyInfoTxt"> Hi: {this.state.day5Forecast.hiTemp} </p>
                                <p className="dailyInfoTxt"> Lo: {this.state.day5Forecast.loTemp} </p>
                            </div>
                          </div>
                       )
                      } 
                </li>
              </ul>
            </nav>
            <Switch>
              <Route exact path="/Day0" component={Day0} />
              <Route exact path="/Day1" component={Day1} />
              <Route exact path="/Day2" component={Day2} />
              <Route exact path="/Day3" component={Day3} />
              <Route exact path="/Day4" component={Day4} />
              <Route exact path="/Day5" component={Day5} />
            </Switch>
        </Router>
      </div>
    )
  }
}

