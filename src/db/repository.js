import axios from 'axios';

import config from '../config'
const server = config.server

const GetServerPoints = async (user_config) => {
    let url = server + '/points'
    if(!!user_config)
        url += "?user_config=" + user_config
    return await axios.get(url)
}

const GetGeocoderData = async (query, point) => {
    console.log('GetGeocoderData point', point)
    let key = "45a22cf4-a8ac-406f-8086-710e80b2085b"
    let my_query = query
    let point_opt = [point.lat, point.lng] 
    let geo_url = "https://graphhopper.com/api/1/geocode?q="+my_query+"&point="+point_opt+"&type=json&locale=ru&debug=true&key="+key
    // console.log('GetGeocoderData my_query', my_query)
    console.log('GetGeocoderData geo_url', geo_url)
    return await axios.get(geo_url)
}

const GetRoute =  async (data) => {
    console.log('GetRoute', data)

    return await axios.post(
        server + "/get_route/", 
        data
    )
}

const GetCategories = async () => {
    let url = server + "/get_people_types"
    return await axios.get(url)
}

const GetCharts = async () => {
    let url = server + "/get_charts/"
    return await axios.get(url)
}

export { 
    // === Server ===
    GetServerPoints,
    GetRoute,
    GetCategories,
    GetCharts,

    // === GraphHopper ===
    GetGeocoderData,
    // GetGeocoderDataNominatim,

    
}
