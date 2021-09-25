import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import './dialog.scss'

class Dialog extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.renderPopup = this.renderPopup.bind(this);
  } 

  render(){ return (<noscript></noscript>); }

  componentDidMount(){
    // console.log('Dialog mount', this.props)
    
    this.renderPopup();
  }
  componentDidUpdate() {
    // console.log('Dialog update', this.props)
    this.renderPopup();
  }
  componentWillUnmount() {
    ReactDOM.unmountComponentAtNode(this.popup);
    document.body.removeChild(this.popup);
  }

  renderPopup() {
    if (!this.popup) {
        this.popup = document.createElement("div");
        this.popup.setAttribute('class','dialog')
        document.body.appendChild(this.popup);
    }

    ReactDOM.render(
       <div className="dialog-wrapper">
          <div className="dialog-closeBtn" onClick={()=>this.props.handleHide()}><FontAwesomeIcon icon={faTimes} /></div>
          {this.props.isActive ? <div className="dialog-shadow" onClick={()=>this.props.handleHide()}/> : null}
          {this.props.isActive ? 
            <div className="dialog-overlay" style={{maxWidth: window.innerWidth < 900 ? "80vw" : 900}}>
              {this.props.content}
            </div> : null }
      </div>,
      this.popup
    );
  }
}

export default Dialog;