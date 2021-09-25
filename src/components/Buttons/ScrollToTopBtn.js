import React, { Component } from 'react';
import { animateScroll as scroll } from "react-scroll";

// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'

import "./buttons.scss"

class ScrollToTopBtn extends Component {
  constructor(props) {
      super(props);
      this.state = {};
  }

  handleClick(){
    scroll.scrollToTop(); 
  }

  render(){
    return(
      <div className="scrollToTopButton">
        <button onClick={this.handleClick}><FontAwesomeIcon icon={faArrowUp} /></button>
      </div>
    )
  }
}

export default ScrollToTopBtn