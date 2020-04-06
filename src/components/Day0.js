import React from 'react';
import '../App.css';

export default function Day0(props) {
    let mainForecast=props.forecast;
    return (
        <div>
            <p className="dayOfWeekTxt">Monday: {mainForecast} </p>
        </div>
    )
}
