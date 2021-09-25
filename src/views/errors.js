import React, { Component } from 'react';

import error_404_img from '../images/error/404_robot.png';

class Error404 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleHome(){
    window.location.href = "/"
  }

  render() {
    return(
      <div className="error">
        <div className="error_info">
          <h4>Sorry, this page does not exist</h4>
          <button onClick={this.handleHome}>Вернуться на главную</button>
        </div>
        <div className="error_img">
          <img src={error_404_img} alt="error_img"/>
        </div>
      </div>
    )
  }
}


class Error301 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return(
      <div className="error">
        <h4>Sorry, this page is redirected</h4>
      </div>
    )
  }
}

export {Error404, Error301};