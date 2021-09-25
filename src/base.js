import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom'

import Home                     from './views/home'
// import Info                     from './views/info'
// import LogIn                    from './views/auth/login'
// import SignUp                   from './views/auth/signup'
// import MobileApp                from './views/home/mobile_view'
import {Error404}               from './views/errors'

// import MiniImgDnevnik    from './images/mobile_app/icons/dnevnik.png'

// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faInfo, faMobileAlt } from '@fortawesome/free-solid-svg-icons'

import './base.scss';

// Шапка для всех страниц кроме ЛК
// class PublicHeader extends Component {
//   render() {    
//     return(
//       <div className="header">
//         <Link to="/" onClick={this.changePath}><label>{ window.screen.width > 600 ? "Главная" : <FontAwesomeIcon icon={faHome} />}</label></Link>
//         {/* <Link to="/info"><label>{ window.screen.width > 600 ? "Информация" : <FontAwesomeIcon icon={faInfo} />}</label></Link> */}
//         <Link to="/app"><label>{ window.screen.width > 600 ? "Приложение" :<FontAwesomeIcon icon={faMobileAlt} />}</label></Link>
//       </div>
//     )
//   }
// }

// Контент для всех страниц кроме ЛК
class PublicContent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return(
      <div className="content">
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route component={Error404} />
        </Switch>
      </div>
    )
  }
}

export { PublicContent };