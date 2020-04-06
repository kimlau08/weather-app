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
  }

  getDateFromISODate(ISODateTime) {
    let dateTimeArray=ISODateTime.split('T');
    return dateTimeArray[0];
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

      }
    }

    this.setState( { hourlyDataByDays: forecastByDays });
  }


  axiosGetWeatherData () {

    /***********************Update this before submitting**********************/
    if (test) {
      
      this.setState({ fiveDayForecastData: sample5DayForecast });
      this.sortForecastByDate();

    } else {
  
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



let sample5DayForecast={"cod":"200","message":0,"cnt":40,"list":[{"dt":1586131200,"main":{"temp":291.05,"feels_like":290.92,"temp_min":290.91,"temp_max":291.05,"pressure":1016,"sea_level":1016,"grnd_level":1000,"humidity":78,"temp_kf":0.14},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04d"}],"clouds":{"all":100},"wind":{"speed":2,"deg":155},"sys":{"pod":"d"},"dt_txt":"2020-04-06 00:00:00"},{"dt":1586142000,"main":{"temp":289.23,"feels_like":288.67,"temp_min":289.13,"temp_max":289.23,"pressure":1018,"sea_level":1018,"grnd_level":1002,"humidity":85,"temp_kf":0.1},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"clouds":{"all":90},"wind":{"speed":2.39,"deg":139},"sys":{"pod":"n"},"dt_txt":"2020-04-06 03:00:00"},{"dt":1586152800,"main":{"temp":288.82,"feels_like":288.38,"temp_min":288.75,"temp_max":288.82,"pressure":1017,"sea_level":1017,"grnd_level":1001,"humidity":88,"temp_kf":0.07},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"clouds":{"all":95},"wind":{"speed":2.28,"deg":160},"sys":{"pod":"n"},"dt_txt":"2020-04-06 06:00:00"},{"dt":1586163600,"main":{"temp":288.41,"feels_like":287.45,"temp_min":288.38,"temp_max":288.41,"pressure":1016,"sea_level":1016,"grnd_level":1000,"humidity":89,"temp_kf":0.03},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"clouds":{"all":100},"wind":{"speed":2.92,"deg":149},"sys":{"pod":"n"},"dt_txt":"2020-04-06 09:00:00"},{"dt":1586174400,"main":{"temp":287.89,"feels_like":286.85,"temp_min":287.89,"temp_max":287.89,"pressure":1016,"sea_level":1016,"grnd_level":1000,"humidity":90,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"clouds":{"all":98},"wind":{"speed":2.87,"deg":162},"sys":{"pod":"n"},"dt_txt":"2020-04-06 12:00:00"},{"dt":1586185200,"main":{"temp":291.35,"feels_like":290.12,"temp_min":291.35,"temp_max":291.35,"pressure":1017,"sea_level":1017,"grnd_level":1001,"humidity":82,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04d"}],"clouds":{"all":100},"wind":{"speed":4.1,"deg":162},"sys":{"pod":"d"},"dt_txt":"2020-04-06 15:00:00"},{"dt":1586196000,"main":{"temp":294.9,"feels_like":293.25,"temp_min":294.9,"temp_max":294.9,"pressure":1016,"sea_level":1016,"grnd_level":1000,"humidity":73,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04d"}],"clouds":{"all":100},"wind":{"speed":5.58,"deg":182},"sys":{"pod":"d"},"dt_txt":"2020-04-06 18:00:00"},{"dt":1586206800,"main":{"temp":293.99,"feels_like":293.24,"temp_min":293.99,"temp_max":293.99,"pressure":1014,"sea_level":1014,"grnd_level":999,"humidity":78,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":100},"wind":{"speed":4.39,"deg":182},"rain":{"3h":0.14},"sys":{"pod":"d"},"dt_txt":"2020-04-06 21:00:00"},{"dt":1586217600,"main":{"temp":293.66,"feels_like":293.91,"temp_min":293.66,"temp_max":293.66,"pressure":1013,"sea_level":1013,"grnd_level":997,"humidity":81,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04d"}],"clouds":{"all":100},"wind":{"speed":3.12,"deg":172},"sys":{"pod":"d"},"dt_txt":"2020-04-07 00:00:00"},{"dt":1586228400,"main":{"temp":292.43,"feels_like":292.68,"temp_min":292.43,"temp_max":292.43,"pressure":1015,"sea_level":1015,"grnd_level":999,"humidity":87,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"clouds":{"all":98},"wind":{"speed":3.08,"deg":181},"sys":{"pod":"n"},"dt_txt":"2020-04-07 03:00:00"},{"dt":1586239200,"main":{"temp":292.45,"feels_like":291.88,"temp_min":292.45,"temp_max":292.45,"pressure":1013,"sea_level":1013,"grnd_level":998,"humidity":88,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"clouds":{"all":99},"wind":{"speed":4.36,"deg":186},"sys":{"pod":"n"},"dt_txt":"2020-04-07 06:00:00"},{"dt":1586250000,"main":{"temp":292.85,"feels_like":291.42,"temp_min":292.85,"temp_max":292.85,"pressure":1012,"sea_level":1012,"grnd_level":997,"humidity":89,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"clouds":{"all":100},"wind":{"speed":5.93,"deg":202},"sys":{"pod":"n"},"dt_txt":"2020-04-07 09:00:00"},{"dt":1586260800,"main":{"temp":292.92,"feels_like":291.65,"temp_min":292.92,"temp_max":292.92,"pressure":1012,"sea_level":1012,"grnd_level":997,"humidity":87,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"clouds":{"all":99},"wind":{"speed":5.53,"deg":205},"sys":{"pod":"n"},"dt_txt":"2020-04-07 12:00:00"},{"dt":1586271600,"main":{"temp":296.06,"feels_like":295.13,"temp_min":296.06,"temp_max":296.06,"pressure":1013,"sea_level":1013,"grnd_level":997,"humidity":73,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04d"}],"clouds":{"all":96},"wind":{"speed":5.21,"deg":218},"sys":{"pod":"d"},"dt_txt":"2020-04-07 15:00:00"},{"dt":1586282400,"main":{"temp":300.35,"feels_like":298.52,"temp_min":300.35,"temp_max":300.35,"pressure":1012,"sea_level":1012,"grnd_level":997,"humidity":57,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04d"}],"clouds":{"all":89},"wind":{"speed":6.57,"deg":223},"sys":{"pod":"d"},"dt_txt":"2020-04-07 18:00:00"},{"dt":1586293200,"main":{"temp":302.51,"feels_like":300.86,"temp_min":302.51,"temp_max":302.51,"pressure":1009,"sea_level":1009,"grnd_level":994,"humidity":47,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04d"}],"clouds":{"all":98},"wind":{"speed":5.67,"deg":235},"sys":{"pod":"d"},"dt_txt":"2020-04-07 21:00:00"},{"dt":1586304000,"main":{"temp":299.58,"feels_like":298.79,"temp_min":299.58,"temp_max":299.58,"pressure":1009,"sea_level":1009,"grnd_level":993,"humidity":52,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04d"}],"clouds":{"all":94},"wind":{"speed":3.84,"deg":225},"sys":{"pod":"d"},"dt_txt":"2020-04-08 00:00:00"},{"dt":1586314800,"main":{"temp":295.65,"feels_like":294.03,"temp_min":295.65,"temp_max":295.65,"pressure":1010,"sea_level":1010,"grnd_level":995,"humidity":59,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"clouds":{"all":76},"wind":{"speed":4.16,"deg":209},"sys":{"pod":"n"},"dt_txt":"2020-04-08 03:00:00"},{"dt":1586325600,"main":{"temp":294.06,"feels_like":291.77,"temp_min":294.06,"temp_max":294.06,"pressure":1010,"sea_level":1010,"grnd_level":994,"humidity":58,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"clouds":{"all":71},"wind":{"speed":4.3,"deg":218},"sys":{"pod":"n"},"dt_txt":"2020-04-08 06:00:00"},{"dt":1586336400,"main":{"temp":292.91,"feels_like":290.59,"temp_min":292.91,"temp_max":292.91,"pressure":1009,"sea_level":1009,"grnd_level":993,"humidity":56,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"clouds":{"all":53},"wind":{"speed":3.66,"deg":233},"sys":{"pod":"n"},"dt_txt":"2020-04-08 09:00:00"},{"dt":1586347200,"main":{"temp":291.76,"feels_like":288.41,"temp_min":291.76,"temp_max":291.76,"pressure":1010,"sea_level":1010,"grnd_level":994,"humidity":49,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"clouds":{"all":56},"wind":{"speed":4.01,"deg":243},"sys":{"pod":"n"},"dt_txt":"2020-04-08 12:00:00"},{"dt":1586358000,"main":{"temp":296.72,"feels_like":293.74,"temp_min":296.72,"temp_max":296.72,"pressure":1011,"sea_level":1011,"grnd_level":996,"humidity":48,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}],"clouds":{"all":63},"wind":{"speed":5.11,"deg":262},"sys":{"pod":"d"},"dt_txt":"2020-04-08 15:00:00"},{"dt":1586368800,"main":{"temp":302.26,"feels_like":299.27,"temp_min":302.26,"temp_max":302.26,"pressure":1011,"sea_level":1011,"grnd_level":996,"humidity":37,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}],"clouds":{"all":55},"wind":{"speed":5.56,"deg":271},"sys":{"pod":"d"},"dt_txt":"2020-04-08 18:00:00"},{"dt":1586379600,"main":{"temp":304.68,"feels_like":302.59,"temp_min":304.68,"temp_max":304.68,"pressure":1008,"sea_level":1008,"grnd_level":993,"humidity":35,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03d"}],"clouds":{"all":28},"wind":{"speed":4.88,"deg":273},"sys":{"pod":"d"},"dt_txt":"2020-04-08 21:00:00"},{"dt":1586390400,"main":{"temp":300.97,"feels_like":301.05,"temp_min":300.97,"temp_max":300.97,"pressure":1008,"sea_level":1008,"grnd_level":993,"humidity":48,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03d"}],"clouds":{"all":31},"wind":{"speed":2.61,"deg":263},"sys":{"pod":"d"},"dt_txt":"2020-04-09 00:00:00"},{"dt":1586401200,"main":{"temp":294.36,"feels_like":294.12,"temp_min":294.36,"temp_max":294.36,"pressure":1011,"sea_level":1011,"grnd_level":995,"humidity":70,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":86},"wind":{"speed":2.92,"deg":204},"rain":{"3h":0.27},"sys":{"pod":"n"},"dt_txt":"2020-04-09 03:00:00"},{"dt":1586412000,"main":{"temp":293.71,"feels_like":294.23,"temp_min":293.71,"temp_max":293.71,"pressure":1012,"sea_level":1012,"grnd_level":996,"humidity":71,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"clouds":{"all":76},"wind":{"speed":1.62,"deg":347},"sys":{"pod":"n"},"dt_txt":"2020-04-09 06:00:00"},{"dt":1586422800,"main":{"temp":292.26,"feels_like":290.84,"temp_min":292.26,"temp_max":292.26,"pressure":1010,"sea_level":1010,"grnd_level":995,"humidity":72,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":77},"wind":{"speed":3.8,"deg":31},"rain":{"3h":0.4},"sys":{"pod":"n"},"dt_txt":"2020-04-09 09:00:00"},{"dt":1586433600,"main":{"temp":290.48,"feels_like":287.45,"temp_min":290.48,"temp_max":290.48,"pressure":1012,"sea_level":1012,"grnd_level":996,"humidity":75,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":89},"wind":{"speed":5.6,"deg":60},"rain":{"3h":0.93},"sys":{"pod":"n"},"dt_txt":"2020-04-09 12:00:00"},{"dt":1586444400,"main":{"temp":289.86,"feels_like":286.94,"temp_min":289.86,"temp_max":289.86,"pressure":1013,"sea_level":1013,"grnd_level":997,"humidity":83,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":100},"wind":{"speed":5.88,"deg":63},"rain":{"3h":2.92},"sys":{"pod":"d"},"dt_txt":"2020-04-09 15:00:00"},{"dt":1586455200,"main":{"temp":289.66,"feels_like":288.03,"temp_min":289.66,"temp_max":289.66,"pressure":1013,"sea_level":1013,"grnd_level":997,"humidity":86,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":100},"wind":{"speed":4.21,"deg":98},"rain":{"3h":2.44},"sys":{"pod":"d"},"dt_txt":"2020-04-09 18:00:00"},{"dt":1586466000,"main":{"temp":290.77,"feels_like":287.66,"temp_min":290.77,"temp_max":290.77,"pressure":1010,"sea_level":1010,"grnd_level":994,"humidity":83,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":100},"wind":{"speed":6.59,"deg":109},"rain":{"3h":2.37},"sys":{"pod":"d"},"dt_txt":"2020-04-09 21:00:00"},{"dt":1586476800,"main":{"temp":290.18,"feels_like":287.72,"temp_min":290.18,"temp_max":290.18,"pressure":1009,"sea_level":1009,"grnd_level":994,"humidity":86,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":100},"wind":{"speed":5.65,"deg":110},"rain":{"3h":0.54},"sys":{"pod":"d"},"dt_txt":"2020-04-10 00:00:00"},{"dt":1586487600,"main":{"temp":289.24,"feels_like":287.55,"temp_min":289.24,"temp_max":289.24,"pressure":1011,"sea_level":1011,"grnd_level":995,"humidity":87,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":100},"wind":{"speed":4.18,"deg":81},"rain":{"3h":0.2},"sys":{"pod":"n"},"dt_txt":"2020-04-10 03:00:00"},{"dt":1586498400,"main":{"temp":287.67,"feels_like":284.98,"temp_min":287.67,"temp_max":287.67,"pressure":1013,"sea_level":1013,"grnd_level":997,"humidity":88,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":100},"wind":{"speed":4.97,"deg":67},"rain":{"3h":0.23},"sys":{"pod":"n"},"dt_txt":"2020-04-10 06:00:00"},{"dt":1586509200,"main":{"temp":285.78,"feels_like":282.18,"temp_min":285.78,"temp_max":285.78,"pressure":1013,"sea_level":1013,"grnd_level":997,"humidity":87,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":100},"wind":{"speed":5.41,"deg":67},"rain":{"3h":0.28},"sys":{"pod":"n"},"dt_txt":"2020-04-10 09:00:00"},{"dt":1586520000,"main":{"temp":284.74,"feels_like":279.95,"temp_min":284.74,"temp_max":284.74,"pressure":1014,"sea_level":1014,"grnd_level":998,"humidity":84,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":100},"wind":{"speed":6.52,"deg":59},"rain":{"3h":0.16},"sys":{"pod":"n"},"dt_txt":"2020-04-10 12:00:00"},{"dt":1586530800,"main":{"temp":284.52,"feels_like":279.35,"temp_min":284.52,"temp_max":284.52,"pressure":1016,"sea_level":1016,"grnd_level":1000,"humidity":79,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":100},"wind":{"speed":6.68,"deg":83},"rain":{"3h":0.11},"sys":{"pod":"d"},"dt_txt":"2020-04-10 15:00:00"},{"dt":1586541600,"main":{"temp":288.15,"feels_like":284.7,"temp_min":288.15,"temp_max":288.15,"pressure":1017,"sea_level":1017,"grnd_level":1000,"humidity":71,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04d"}],"clouds":{"all":99},"wind":{"speed":4.91,"deg":72},"sys":{"pod":"d"},"dt_txt":"2020-04-10 18:00:00"},{"dt":1586552400,"main":{"temp":289.76,"feels_like":288.28,"temp_min":289.76,"temp_max":289.76,"pressure":1015,"sea_level":1015,"grnd_level":999,"humidity":68,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}],"clouds":{"all":83},"wind":{"speed":2.45,"deg":37},"sys":{"pod":"d"},"dt_txt":"2020-04-10 21:00:00"}],"city":{"id":4684904,"name":"Dallas","coord":{"lat":32.7668,"lon":-96.7836},"country":"US","population":2368139,"timezone":-18000,"sunrise":1586088542,"sunset":1586134192}
 } ;
