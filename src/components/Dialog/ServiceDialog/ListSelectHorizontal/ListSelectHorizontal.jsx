import React, { Component } from 'react';

import './listSelectHorizontal.scss'

class ListSelectHorizontal extends Component {
    constructor(props) {
      super(props);
      this.state = {};
    } 
  
    select(index){
      this.props.selectAgg(index)
    }
  
    getModes = () => {
      let modes = this.props.modes
      let display_items = []
      
      for(let i in modes) {
        let mode_item = <label 
          key={i}
          onClick={() => this.props.selectAgg(i)}
          className={this.props.cur_mode == i ? "active" : ""}
        >{modes[i]}</label>
  
        display_items.push(mode_item)
      }
  
      return display_items 
    }
  
    render(){
      return( 
        <div className="dialog-content-aggregateList">
          <h4>{this.props.title}</h4>
          <div className="dialog-aggregateList">
            {this.getModes()}
          </div>
        </div>
      )
    }
}

export default ListSelectHorizontal;