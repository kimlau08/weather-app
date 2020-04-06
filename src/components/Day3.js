import React from 'react';

export default function Day3 (props) {
    
    if (props.location.weekday == undefined) {
        return <div></div>
    }
    let weekday=props.location.weekday;
    let hourlyForecast=props.location.hourlyForecast;

    //get the list of hourly forecast for the records
    let forecastList=[];
    for (let i=0; i<hourlyForecast.length; i++) {
        let hr=hourlyForecast[i].dt_txt.split(' ')[1];
        let hiTemp=hourlyForecast[i].main.temp_max;
        let loTemp=hourlyForecast[i].main.temp_min;
        let forecast={
            hr: hr,
            hiTemp: hiTemp,
            loTemp: loTemp
        }
        forecastList.push(forecast);
    }

    return (
        <div className="hourlyDataBox"> 
            <p>Hourly forcast for {weekday} </p>
            <ul>
                { forecastList.map( (forecast, id)=><li key={id}> Time: {forecast.hr} Hi: {forecast.hiTemp} Lo: {forecast.loTemp} <br /></li>  )}
            </ul>
        </div>
    )
}
