import React, { Component } from 'react';
import { Link, animateScroll as scroll } from "react-scroll";
import jwt from 'jwt-decode'

// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'

// Components
import SctollToTopBtn from '../../components/Buttons/ScrollToTopBtn'
import HelpMap from '../../components/HelpMap'
import ImgSlider from '../../components/Slider/ImgSlider'


import MobileApp from './subviews/mobile_app';
import { 
  download_section,
  helpMap_section,
  mobile_section
} from './texts';

import Map1 from '../../images/home/Map1.png'
// import Map2 from '../../images/home/Map2.png'
// import Map3 from '../../images/home/Map3.png'
// import Map4 from '../../images/home/Map4.png'
import BrowserBorder from '../../images/home/browser_border.png'

import './home.scss';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    document.title = "Главная"
    console.log('Home props', this.props, document.documentElement.scrollHeight)
    window.addEventListener('scroll', this.listenToScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.listenToScroll)
  }

  componentDidUpdate() {
    // console.log('home props', this.props)
  }

  listenToScroll = () => {
    const winScroll = document.documentElement.scrollTop
      // document.body.scrollTop

    this.setState({
      scroll_btn_hidden: winScroll < 100 ? false : true,
    })
  }

  render() {
    return (
      <div className="home-view">
        <HomeHeader />
        <HomeContent />
        {this.state.scroll_btn_hidden ? <SctollToTopBtn /> : null}
      </div>
    )
  }
}

class HomePlatformSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getOtherPlatformBtn() {
    return (
      <div className={this.state.isOtherPlatformShow ? "home-download-otherPatforms active" : "home-download-otherPatforms"}>
        <div className={this.state.isOtherPlatformShow ? "home-download-otherPlatformItem active" : "home-download-otherPlatformItem"}>
          <Link activeClass="active"
            to={ mobile_section.section }
            spy={true}
            smooth={true}
            offset={-70}
            duration={500}
          ><button>IOS</button></Link>
        </div>
        <div className={this.state.isOtherPlatformShow ? "home-download-otherPlatformItem active" : "home-download-otherPlatformItem"}>
          <Link activeClass="active"
            to={ mobile_section.section }
            spy={true}
            smooth={true}
            offset={-70}
            duration={500}
          ><button>Android</button></Link>
        </div>
      </div>
    )
  }

  render() {
    let screen_data = [ 
      Map1, 
      // Map2, 
      // Map3, 
      // Map4 
    ]

    return (
      <div className="home-download">
        <div className='home-download-overlay'>
          <div className="home-download-center">
            <div className="home-download-content">
              <h4>GreenWay</h4>
              <div className="home-download-mainPlatformBtn">
                {/* <button className="home-download-linkWebBtn" onClick={() => { window.location.href = "/profile" }}>Веб-версия</button>  */}
                <div >
                  <Link activeClass="active"
                  to={ helpMap_section.section}
                  spy={true}
                  smooth={true}
                  offset={-42}
                  duration={500}
                ><button className="home-download-linkWebBtn">Веб-версия</button></Link>
                </div> 
                <button className="home-download-otherPatformsBtn"
                  onClick={() => { this.setState({ isOtherPlatformShow: !this.state.isOtherPlatformShow }) }}>
                  {this.state.isOtherPlatformShow ? <FontAwesomeIcon icon={faChevronUp} /> : <FontAwesomeIcon icon={faChevronDown} />}
                </button>
              </div>
              {this.getOtherPlatformBtn()}
            </div>
          </div>
        </div>
        <div className='home-download-image' style={{background: "url(" + BrowserBorder + ")" + "round"}}>
          <ImgSlider img_class="mobile_app_img" data={screen_data}/>
        </div>
      </div>
    )
  }
}


class HomeContent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getUser() {
    let token = localStorage.getItem('token')
    let user = token ? jwt(token) : null
    this.setState({ user: user })
  }

  componentDidMount() {
    this.getUser()
  }

  getOtherPlatformBtn() {
    return (
      <div className="home-download-otherPatforms">
        <Link activeClass="active"
          className="home-download-otherPlatformItem"
          to={ helpMap_section.section }
          spy={true}
          smooth={true}
          offset={0}
          duration={500}
        ><button>IOS</button></Link>
        <Link activeClass="active"
          className="home-download-otherPlatformItem"
          to={ helpMap_section.section }
          spy={true}
          smooth={true}
          offset={0}
          duration={500}
        ><button>Android</button></Link>
      </div>
    )
  }

  render() {
    return (
      <div className="home-content">
        <div className={download_section.section}>
          <HomePlatformSelector />
        </div>
        
        <div className={helpMap_section.section}>
          <HelpMap />
        </div>
          
        <div className={mobile_section.section}>
          <MobileApp mobile_section={mobile_section}/>
        </div>

      </div>
    )
  }
}

class HomeHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="home-navigation">
        <div className="home-navigation-list">
          <div className="home-navigation-item">
          <Link activeClass="active"
              to={ download_section.section }
              spy={true}
              smooth={true}
              offset={-42}
              duration={500}
            ><label>Главная</label></Link>
          </div>
          <div className="home-navigation-item">
            <Link activeClass="active"
              to={ helpMap_section.section }
              spy={true}
              smooth={true}
              offset={-42}
              duration={500}
            ><label>Карта</label></Link>
          </div>
          <div className="home-navigation-item">
            <Link activeClass="active"
              to={ mobile_section.section }
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
            ><label>Приложение</label></Link>
          </div>
        </div>
      </div>
    )
  }
}

export default Home;