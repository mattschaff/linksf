import React, { Component } from 'react'

import { fetchLocations } from '../../core/firebaseRestAPI'
import { calculateAllDistances } from '../../core/distance'

import Layout from '../../components/Layout'
import Loading from '../../components/Loading'
import FilterBar from '../../components/FilterBar'
import LocationList from '../../components/LocationList'
import { filterByOptionsString } from '../../lib/filterLocations'
import R from 'ramda'

function getParameterByName(name) {
  const match = RegExp(`[?&]${name}=([^&]*)`).exec(window.location.search)
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '))
}

function mergeLocationsAndDistances(locations, matrixResponses) {
  const zip = (e, index) => {
    return [locations[index], matrixResponses[index]]
  }

  const merge = ([location, responseObj]) => {
    const locationAndDistance = location
    const durationInfo = responseObj || {}
    locationAndDistance.duration = durationInfo.duration // i hate this; it breaks the consistency of the whole app
    return locationAndDistance
  }

  return locations.map((e, i) => merge(zip(e, i)))
}

export default class LocationsPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      locations: null,
      locationsWithDistance: [],
      currentLocation: null,
    }
  }

  componentDidMount() {
    document.title = 'Link-SF'

    fetchLocations(20)
      .then(locations => {
        this.setState({ locations }, this.loadRemaining)
      })
  }

  setCurrentLocation = () => {
    if (navigator) {
      navigator.geolocation.getCurrentPosition(currentLocation => {
        this.setState({ currentLocation }, this.addDistances)
      })
    }
  }

  addDistances = () => {
    const { currentLocation, locations, locationsWithDistance } = this.state
    const locationSlices = R.splitEvery(25, locations)

    if (!currentLocation) return

    this.calculateDistances(locationSlices, currentLocation)
  }

  calculateDistances = (locationSlices, currentLocation) => {
    const { locationsWithDistance } = this.state
    const a = R.splitAt(1, locationSlices)
    const locations = a[0][0] // this will always only have one element, the array of our working locations
    const remaining = a[1]

    if (locations) {
      // we can only call the distance matrix API with 25 elements at a time,
      // and 100 elements per second, so lets call with 25 elements every 250ms
      setTimeout(_ => {
        calculateAllDistances(locations, currentLocation)
          .then(matrixResponse => {
            const matrixResponses = matrixResponse.rows[0].elements
            const updatedLocations = mergeLocationsAndDistances(locations, matrixResponses)

            this.setState({ locationsWithDistance: [...locationsWithDistance, ...updatedLocations] }, _ => {
              this.calculateDistances(remaining, currentLocation)
            })
          })
      }, 250)
    } else {
      // we should have to do this, but mergeLocationsAndDistances modifies the
      // the location, so as a side effect the state gets updated anyway
      // this.setState({ locations: locationsWithDistance }) // if the above comment is implemented,
    }
  }

  loadRemaining = () => {
    const { locations } = this.state
    const lastItemId = locations[locations.length - 1].id

    fetchLocations(0, lastItemId)
      .then(newLocations => {
        this.setState({ locations: [...locations, ...newLocations] }, this.setCurrentLocation)
      })
  }

  render() {
    const { locations } = this.state
    const loading = locations == null
    const category = getParameterByName('categories')
    const showOpen = window.location.search.includes('hours=open')
    const sortDist = window.location.search.includes('sort=dist')
    const locationsList = Object.values(locations || {})
    const queryString = window.location.search
    const filteredLocations = filterByOptionsString(queryString.slice(1, queryString.length), locationsList)

    filteredLocations.sort(function(a,b) {
      if (a.duration && b.duration) {
        return a.duration.value - b.duration.value
      } else {
        return 0
      }
    });

    return (
      <Layout>
        { loading ?
          <Loading /> :
          <div>
            <FilterBar
              showOpen={showOpen}
              sortDist={sortDist}
              queryString={queryString}
            />
            <LocationList locations={filteredLocations} />
          </div>
        }
        </Layout>
    )
  }
}
