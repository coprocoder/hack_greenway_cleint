import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'

import { PublicContent } from './base'

import './base.scss';

class App extends Component {
  render() {
    localStorage.setItem("locale", "ru")
    return (
      <div className="App">
        <Switch>
          {/* <Route path='/profile' component={Profile} /> */}
          <Route component={PublicContent} />
        </Switch>
      </div>
    );
  }
}

export default App;