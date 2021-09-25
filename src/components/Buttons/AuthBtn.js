import React, { Component } from 'react';

// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

import "./buttons.scss"

class AuthBtn extends Component {
  constructor(props) {
      super(props);
      this.state = {};
  }

  handleClick(){
    window.location.href = "/profile"
  }

  render(){
    return(
      <div className="authBtn">
        <button onClick={this.handleClick}><FontAwesomeIcon icon={faUser} /></button>
      </div>
    )
  }
}

export default AuthBtn