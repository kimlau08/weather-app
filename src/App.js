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

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      axiosItems: []
    }

    this.axiosGet=this.axiosGet.bind(this);
  }

  axiosGet() {
    axios.get("https://api.spoonacular.com/recipes/search?query=cheese&number=4&apiKey=27a02bbb5b48401f96bfda6a7d3e2545")
    .then (response=> {
      const responseData=response.data.results;
      console.log('Weather data: ', responseData);

      this.setState({axiosItems: responseData})
    })
    .catch(error=>{
      console.log('Error occurred', error)
    })
  }

  componentDidMount() {
    this.axiosGet();
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


        <ul>
            { this.state.axiosItems.map( (data, id)=><li key={id}> {data.title} </li> )}
        </ul>

      </div>
    )
  }
}

