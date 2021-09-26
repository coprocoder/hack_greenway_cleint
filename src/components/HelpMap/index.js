

import React, {Component, PropTypes} from 'react';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import ReactDOM from 'react-dom'

// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExpandAlt, faCompressAlt, faShoePrints, faBicycle } from '@fortawesome/free-solid-svg-icons'

import Map from './Map'
import { 
    GetServerPoints,
    GetGeocoderData,
    // GetGeocoderDataNominatim,
    GetRoute,
    GetCategories,
    // GetCharts
} from '../../db/repository'


import Spinner    from '../../images/error/spinner.gif'


import './map.scss'
import mapboxgl from 'mapbox-gl';

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
                // GetCharts()
                    // .then(resp => { console.log(resp.data); this.setState({charts: resp.data}) })      
            })
    }

    setRoute = (data) => {
        console.log({route: data})
        // this.Map.fitBounds(data)
        if (data)
            this.Map.fitBounds([this.state.selectedAddrBegin.point, this.state.selectedAddrEnd.point], {padding: 100})
        this.setState({ route: data })
    }
    changeCat = (cat) => {
        GetServerPoints(cat)
            .then(resp => {
                console.log('GetServerPoints changeCat', resp)
                this.setState({points: resp.data}) 
            })
    }

    setMapOpt = (opt) => {
        // console.log('mapOpt', opt)
        this.setState({
            mapOpt: opt
        })
    }

    componentDidUpdate(){
        this.Map._markers.forEach(i => i.remove())
        if (this.state.selectedAddrBegin)
            new mapboxgl.Marker({color: 'red'}).setLngLat(this.state.selectedAddrBegin.point).addTo(this.Map)
        if (this.state.selectedAddrEnd)
            new mapboxgl.Marker({color: 'blue'}).setLngLat(this.state.selectedAddrEnd.point).addTo(this.Map)
        
    }

    onChangeStartPoint = (selectedAddrBegin) => {
        if (selectedAddrBegin&&this.Map)
        {
            this.Map.flyTo({center: selectedAddrBegin.point, zoom: 12})
        }
        !selectedAddrBegin&&this.setState({route: null})
        this.setState({selectedAddrBegin})
    }
    onChangeFinishPoint = (selectedAddrEnd) => {
        this.Map._markers.forEach(i => i.remove())
        if (selectedAddrEnd&&this.Map){
            this.Map.flyTo({center: selectedAddrEnd.point, zoom: 12})
        }
        !selectedAddrEnd&&this.setState({route: null})
        this.setState({selectedAddrEnd})
    }

    render(){
        // console.log('this.state.points', this.state.points)
        return(
            <div className="helpMap-view">
                <Map 
                    ref = {c => this.Map = c&&c.map}
                    points_geoJson = {this.state.points}
                    route_geoJson = {this.state.route}
                    startMarker = {this.state.selectedAddrBegin}
                    stopMarker = {this.state.selectedAddrEnd}
                    onUpdateMap = {this.setMapOpt}
                />
                <MapGeocoder 
                    changeCat={this.changeCat}
                    setRoute={this.setRoute}
                    mapOpt = {this.state.mapOpt}
                    route={this.state.route}
                    onChangeStartPoint = {this.onChangeStartPoint}
                    onChangeFinishPoint = {this.onChangeFinishPoint}
                />
                {/* {this.state.route ? <MapNavigator path={this.state.route.instructions}/> : null} */}
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
        // GetCategories()
        //     .then(resp => this.setState({categories: resp.data}))

        let categories = [
            {id: 0, name: "foot", icon: faShoePrints},
            {id: 1, name: "bike", icon: faBicycle},
        ]
        this.setState({categories: categories, category: categories[0].name})
    }
    componentDidUpdate(props, old){
        if (old.selectedAddrBegin != this.state.selectedAddrBegin)
            this.props.onChangeStartPoint(this.state.selectedAddrBegin)
        if (old.selectedAddrEnd != this.state.selectedAddrEnd)
            this.props.onChangeFinishPoint(this.state.selectedAddrEnd)
        // this.props.onChange(this.state)
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
            profile: this.state.category
        }

        this.setState({waited:true})
        
        // отправить данные на сервер
        GetRoute(req_data)
            // получить ответ
            .then(resp => {
                // отобразить на карте
                console.log('GetRoute resp', resp)
                // let info = resp.data.paths[0]
                let info = resp.data.paths
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
                this.setState({waited:false})
            })
    }

    getSelectAddrList = (value) => {
        if(!!this.props.mapOpt)
            return new Promise((resolve, reject) => GetGeocoderData(value, this.props.mapOpt)
                .then(resp => {
                    console.log('geodata', resp)
                    let items = []
                    resp.data.hits.map( (res, i) => { 
                        // if(res.city == "Moscow" || res.city == "Москва") {
                            let text = ''
                            // text = res.postcode ? text + res.postcode + ', ' : text
                            // text = res.state ? text + res.state + ', ' : text
                            // text = res.city ? text + res.city + ', ' : text 
                            text = res.street ? text + res.street + ', ' : text 
                            text = res.house_number ? text + res.house_number + ', ' : text 
                            // text = res.housenumber ? text + res.housenumber  : text 
                            text = res.name ? text + res.name : text 
                            // console.log('item text', text)
                            
                            items.push(Object.assign({}, res, { id: i, value: text, label: text }))
                            // items.push(Object.assign({}, { id: i, value: text, label: text }, res))
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
        console.log('geocoder state', this.state)
        // alert(this.state.addrList)

        let categories = this.state.categories.map((item) => {
            return <label key={item.id} className={this.state.category == item.name ? 'active' : ''}>
                        <FontAwesomeIcon icon={item.icon}/>
                        <input 
                            name="category" type="radio" 
                            style={{display: 'none'}}
                            {...this.state.category == item.name ? {checked: true} : {}}
                            value={item.name} onChange={e => this.selectCategory(e)}
                        />
                        {item.name}
                    </label>
        })

        return(
            <div className="helpMap-geocoder-wrapper">
                <div className="helpMap-geocoder" style={{height: this.props.route? "inherit" : ""}}>
                    { this.state.hidden ? 
                        <div className="helpMap-geocoder-hidden">
                            <button onClick={this.toggleViewMode}><FontAwesomeIcon icon={faExpandAlt} /></button>
                        </div> :  
                            <div className="helpMap-geocoder-visible" >
                                <div className="helpMap-geocoder-header">
                                    <button onClick={this.toggleViewMode}><FontAwesomeIcon icon={faCompressAlt} /></button>
                                    <label>Поиск мест</label>
                                </div>
                                <form className="helpMap-geocoder-form" 
                                    onSubmit={(e) => this.handleSubmit(e)}
                                    style={{opacity: this.state.waited ? 0.3 : 1}}
                                >             
                                    <div className="helpMap-geocoder-inputWrapper">
                                        <div className="helpMap-geocoder-inputColor" style={{backgroundColor: this.state.selectedAddrBegin ? "red" : "transparent"}} />
                                        <AsyncSelect
                                            cacheOptions
                                            defaultOptions
                                            loadOptions={this.getSelectAddrList}
                                            onInputChange={this.getSelectAddrList}
                                            onChange={item => this.setState({selectedAddrBegin: item})}
                                            isClearable
                                        />
                                    </div>
                                    <div className="helpMap-geocoder-inputWrapper">
                                        <div className="helpMap-geocoder-inputColor" style={{backgroundColor: this.state.selectedAddrEnd ? "blue" : "transparent"}}/>
                                        <AsyncSelect
                                            cacheOptions
                                            defaultOptions
                                            loadOptions={this.getSelectAddrList}
                                            onInputChange={this.getSelectAddrList}
                                            onChange={item => this.setState({selectedAddrEnd: item})}
                                            isClearable
                                        />
                                    </div>
                                    <div className="category-selector">
                                        {categories}
                                    </div>
                                    <input type="submit" 
                                        className="helpMap-geocoder-field" 
                                        value="Построить машрут"
                                    />
                                </form>
                                {this.props.route && !this.state.waited ? <MapNavigator path={this.props.route.instructions}/> : null}

                                {this.state.waited ? 
                                    <div className="helpMap-geocoder-waited">
                                        <img className='helpMap-geocoder-waitedIcon' src={Spinner} alt=''/>
                                    </div> : null }
                            </div>
                    }
                </div>
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
        // console.log('MapNavigator render props', this.props.path)
        return(
            <div className="helpMap-navigator">
                { this.state.hidden ? 
                    <div className="helpMap-navigator-hidden">
                        <button onClick={this.toggleViewMode}><FontAwesomeIcon icon={faExpandAlt} /></button>
                        <label>Навигатор</label>
                    </div> :
                    <div className="helpMap-navigator-visible">
                        <div className="helpMap-navigator-header">
                            <button onClick={this.toggleViewMode}><FontAwesomeIcon icon={faCompressAlt} /></button>
                            <label>Навигатор</label>
                        </div>
                        <div className="helpMap-navigator-listWrapper">
                            <ul className="helpMap-navigator-list">             
                                {this.props.path.length ? 
                                    this.props.path.map(item => {
                                        let list_item = <li className="helpMap-navigatorItem">
                                            <div className="helpMap-navigatorItem-text">{item.text}</div>
                                            <div className="helpMap-navigatorItem-info">
                                                <div>{(item.distance / 1000).toFixed(2)} км.</div>
                                                <div>{(item.time / 1000 / 60).toFixed(1)} мин.</div>
                                            </div>
                                        </li>
                                        return list_item
                                    }) : null
                                }
                            </ul>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default HelpMap;