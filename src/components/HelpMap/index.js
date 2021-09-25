

import React, {Component, PropTypes} from 'react';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import ReactDOM from 'react-dom'

// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExpandAlt, faCompressAlt } from '@fortawesome/free-solid-svg-icons'

import Map from './Map'
import { 
    GetServerPoints,
    GetGeocoderData,
    GetRoute,
    GetCategories,
    GetCharts
} from '../../db/repository'


import './map.scss'

class HelpMap extends Component {
    constructor(props){
      super(props);
      this.state = {
      }
    }

    componentDidMount(){
        GetServerPoints()
            .then(resp => {
                console.log('GetServerPoints', resp)
                this.setState({points: resp.data})  
                GetCharts()
                    .then(resp => { console.log(resp.data); this.setState({charts: resp.data}) })      
            })
    }

    setRoute = (data) => {
        this.setState({ route: data })
    }
    changeCat = (cat) => {
        GetServerPoints(cat)
            .then(resp => {
                console.log('GetServerPoints changeCat', resp)
                this.setState({points: resp.data}) 
            })
    }

    render(){
        // console.log('this.state.points', this.state.points)
        return(
            <div className="helpMap-view">
                <Map 
                    points_geoJson = {this.state.points}
                    route_geoJson = {this.state.route}
                    charts = {this.state.charts}
                />
                <MapGeocoder 
                    changeCat={this.changeCat}
                    setRoute={this.setRoute}
                />
                {this.state.route ? <MapNavigator path={this.state.route.instructions}/> : null}
            </div>
        )
    }
}

class MapGeocoder extends Component {
    constructor(props){
      super(props);
      this.state = {
        categories: [],
        hidden: false,
      }
    }

    componentDidMount(){
        GetCategories()
            .then(resp => this.setState({categories: resp.data}))
    }
    componentDidUpdate(){
        // console.log('geocoder addrList', this.state.addrList)
        // console.log('state', this.state)
    }

    handleSubmit(e) {
        e.preventDefault();
        // console.log('handleSubmit e', e)
        // console.log('handleSubmit state', this.state)

        if(!!!this.state.selectedAddrBegin)
            return alert("Введите начальный адрес")
        if(!!!this.state.selectedAddrEnd)
            return alert("Введите конечный адрес")
        if(!!!this.state.category)
            return alert("Выберите категорию")

        let req_data = {
            point_from: [this.state.selectedAddrBegin.point.lng, this.state.selectedAddrBegin.point.lat], 
            point_to: [this.state.selectedAddrEnd.point.lng, this.state.selectedAddrEnd.point.lat], 
            user_config: Number(this.state.category)
        }
        
        // отправить данные на сервер
        GetRoute(req_data)
            // получить ответ
            .then(resp => {
                // отобразить на карте
                console.log('GetRoute resp', resp)
                let info = resp.data.paths[0]
                this.props.setRoute({
                    route: {
                        "type": "FeatureCollection",
                        "features": [
                            {
                            "type": "Feature",
                            "geometry": info.points
                            }
                        ]
                    }, 
                    distance: info.distance, 
                    time: info.time,
                    instructions: info.instructions
                })
            })
    }

    getSelectAddrList = (value) => {
        // console.log('getSelectAddrList', value)
        return new Promise((resolve, reject) => GetGeocoderData(value)
            .then(resp => {
                console.log('geodata', resp)
                let items = []
                resp.data.hits.map( (res, i) => { 
                    // if(res.city == "Krasnoyarsk") {
                        let text = ''
                        // text = res.postcode ? text + res.postcode + ', ' : text
                        // text = res.state ? text + res.state + ', ' : text
                        text = res.city ? text + res.city + ', ' : text 
                        text = res.street ? text + res.street + ', ' : text 
                        text = res.house_number ? text + res.house_number + ', ' : text 
                        // text = res.housenumber ? text + res.housenumber  : text 
                        text = res.name ? text + res.name : text 
                        console.log('item text', text)
                        
                        items.push(Object.assign({}, res, { id: i, value: text, label: text }))
                        // console.log('items', items)
                    // }
                })
                this.setState({ addrList: items })
                resolve(items)
            })
        )
    }

    selectCategory(e){
        this.setState({ category: e.currentTarget.value})
        this.props.changeCat(e.currentTarget.value)
    }

    toggleViewMode = () => {
        this.setState({hidden: !this.state.hidden})
    }

    render(){
        console.log('geocoder addrList', this.state.addrList)
        // alert(this.state.addrList)

        let categories = this.state.categories.map((item) => {
            return <label key={item.id}>
                        <input name="category" type="radio" value={item.id} onChange={e => this.selectCategory(e)}
                        />{item.name}
                    </label>
        })

        return(

            <div className="helpMap-geocoder">
                { this.state.hidden ? 
                    <div className="helpMap-geocoder-hidden">
                        <button onClick={this.toggleViewMode}><FontAwesomeIcon icon={faExpandAlt} /></button>
                    </div> :
                    <div className="helpMap-geocoder-visible">
                        <div className="helpMap-geocoder-header">
                            <button onClick={this.toggleViewMode}><FontAwesomeIcon icon={faCompressAlt} /></button>
                            <label>Геокодер</label>
                        </div>
                        <form className="helpMap-geocoder-form" onSubmit={(e) => this.handleSubmit(e)}>             
                            <AsyncSelect
                                cacheOptions
                                defaultOptions
                                loadOptions={this.getSelectAddrList}
                                onInputChange={this.getSelectAddrList}
                                onChange={item => this.setState({selectedAddrBegin: item})}
                                isClearable
                            />
                            <AsyncSelect
                                cacheOptions
                                defaultOptions
                                loadOptions={this.getSelectAddrList}
                                onInputChange={this.getSelectAddrList}
                                onChange={item => this.setState({selectedAddrEnd: item})}
                                isClearable
                            />
                            {/* {categories} */}
                            <input type="submit" 
                                className="helpMap-geocoder-field" 
                                value="Построить машрут"
                            />
                        </form>
                    </div>
                }
            </div>
        )
    }

}

class MapNavigator extends Component {
    constructor(props){
      super(props);
      this.state = {
          hidden: false
      }
    }

    toggleViewMode = () => {
        this.setState({hidden: !this.state.hidden})
    }

    render(){
        console.log('MapNavigator render props', this.props.path)
        return(
            <div className="helpMap-navigator">
                { this.state.hidden ? 
                    <div className="helpMap-navigator-hidden">
                        <button onClick={this.toggleViewMode}><FontAwesomeIcon icon={faExpandAlt} /></button>
                    </div> :
                    <div className="helpMap-navigator-visible">
                        <div className="helpMap-navigator-header">
                            <button onClick={this.toggleViewMode}><FontAwesomeIcon icon={faCompressAlt} /></button>
                            <label>Навигатор</label>
                        </div>
                        <div className="helpMap-navigator-listWrapper">
                            <ul className="helpMap-navigator-list">             
                                {this.props.path.map(item => {
                                    let list_item = <li className="helpMap-navigatorItem">
                                        <div className="helpMap-navigatorItem-text">{item.text}</div>
                                        <div className="helpMap-navigatorItem-info">
                                            <div>{(item.distance / 1000).toFixed(2)} км.</div>
                                            <div>{(item.time / 1000 / 60).toFixed(1)} мин.</div>
                                        </div>
                                    </li>
                                    return list_item
                                })}
                            </ul>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default HelpMap;