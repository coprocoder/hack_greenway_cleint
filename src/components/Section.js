import React, { Component } from 'react';

import "./components.scss"

class Section extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
  
    render() {
      let title, text, content
      if(this.props.title) {  title = <div className="section__title"><h4>{this.props.title}</h4></div> }
      if(this.props.text) { text = <p className="section__text">{this.props.text}</p> }
      if(this.props.content) { content = <div className="section__content">{this.props.content}</div> }
  
      return (
      <div className="section" id={this.props.id}>
        {title}
        {text}
        {content}
      </div>
      )
    }
  }


  export { Section }