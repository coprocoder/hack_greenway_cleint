import React, { Component } from 'react';

import Dialog from '../../Dialog';
import PromptDialog from '../PromptDialog'

import './listSelectVertical.scss'

class ListSelectVertical extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleShow = this.handleShow.bind(this);
    this.handleHide = this.handleHide.bind(this);
    this.handleSelects = this.handleSelects.bind(this);
    this.handleSave = this.handleSave.bind(this);
  } 

  componentDidUpdate(){
    console.log('ListSelectVertical update', this.props)
  }

  getList(){
    // alert(JSON.stringify(this.props.variables))
    return this.props.variables.map((item, index) => (
      <button key={index} onClick={() => this.handleSelects(item)}>
          <label>{item}</label>
      </button>
    ))
  }

  handleSelects(_var){
    this.props.handleSelect(_var)
    this.props.handleHide()
  }
  handleSave(_var){
    this.props.handleSave(_var)
    this.handleHide()
  }

  handleShow() { this.setState({ isActviePrompt: true  }) }
  handleHide() { this.setState({ isActviePrompt: false }) }

  getContent = () => {
    return (
      <div className='dialog-view listSelectVertical'>
        <div className="dialog-content">
            {this.getList()}
            {this.props.handleSave ? 
              <button className="dialog-select-addBtn" key='addBtn' onClick={() => this.handleShow()}>
                <label>{this.props.subBtnTitle}</label>
              </button> : null
            }

            {this.state.isActviePrompt ? 
              <PromptDialog 
                isActive={true}
                title="Добавление параметра"
                handleHide={this.handleHide}
                handleSave={this.props.handleSave}

              /> : null }
        </div>
      </div>
    )
  }

  render(){
    return[
      <Dialog 
        key={'ListSelectVertical'}
        isActive={this.props.isActive}
        content={this.getContent()}
        handleHide={() => this.props.handleHide()}
      />
    ]
  }
}


export default ListSelectVertical;