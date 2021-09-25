import React, { Component } from 'react';

import Dialog from '../../Dialog';

import './promptDialog.scss'

class PromptDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
    this.getContent = this.getContent.bind(this);
  } 

  handleChange(e) {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value.replace('\\n', '\n')  });
  }

  handleSubmit(){ 
    console.log('WidgetAddValDialog handleSaveData', this.state)  
    for(let variable in this.state) {
      this.props.handleSave(this.state[variable])
    }
    this.props.handleHide()
  }

  getContent = () => {
    return (
      <div className='dialog-view listSelectVertical'>
        <div className="dialog-content">
            <h4>{this.props.title}</h4>
            <input 
              className="dialog-content-input"
              name="value"
              placeholder="Введите значение"
              onChange={(e) => this.handleChange(e)}
            />
              <button className="dialog-content-submitBtn" key='addBtn' onClick={() => this.handleSubmit()}>
                <label>Save</label>
              </button>

        </div>
      </div>
    )
  }

  render(){
    return( 
      <Dialog 
        key={'PromptDialog'}
        isActive={this.props.isActive}
        content={this.getContent()}
        handleHide={() => this.props.handleHide()}
      />
    )
  }
}


export default PromptDialog;