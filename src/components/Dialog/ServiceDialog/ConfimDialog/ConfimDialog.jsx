import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import './confim.scss'


class ConfimDialog extends Component {
    /*
        isActive: true/false
        msg: <text>
        onClose: <f>
        onConfim: <f>
    */ 

    constructor(props) {
        super(props);
        this.state = {};
        this.renderPopup = this.renderPopup.bind(this);
      } 

    componentDidMount(){
        // console.log('CONFIM props', this.props)
        this.renderPopup();
    }   
    componentDidUpdate() {
        // console.log('CONFIM updated', this.props, this.state)
        this.renderPopup();
    }
    componentWillUnmount() {
      ReactDOM.unmountComponentAtNode(this.popup);
      document.body.removeChild(this.popup);
    }

    render(){ return (<noscript></noscript>); }

    renderPopup() {
        if (!this.popup) {
            this.popup = document.createElement("div");
            this.popup.setAttribute('class','confim-wrapper')
            document.body.appendChild(this.popup);
        }

        // console.log('== CONFIM RENDER ==', this.props)

        ReactDOM.render(
            <div>
                {this.props.isActive ? <div className="confim-shadow" onClick={() => this.props.onClose()} /> : null }
                {this.props.isActive ?
                    <div className="confim-overlay">
                        
                        {/* Header */}
                        <div className="confim-header">
                            <label className="confim-header-title">Вы уверены?</label>
                        </div>

                        {/* Content */}
                        <div className="confim-view">
                            <div className="confim-content-wrapper">
                                <label>{this.props.msg}</label>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="confim-footer">
                            <button onClick={() => this.props.onClose()}>Отменить</button>
                            <button onClick={() => this.props.onConfim()}>Подтвердить</button>
                        </div>

                    </div> 
                    : null
                }
            </div>,
            this.popup
        );
    }
}

export default ConfimDialog;