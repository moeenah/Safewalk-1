import React, { Component } from "react";
import { AppRegistry, View } from "react-native";
import PedMap from "./app/components/PedMap";
import Main from "./app/components/Main";
import Coords from "./sample";
export default class Safewalk extends Component<Props> {
  constructor() {
    super();
    this.changePage = this.changePage.bind(this);
    this.state = {
      lat: 51.05321,
      long: -114.09524,
      page: 0
    };
  }

  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>added function
  test(userlat, userlong) {
    function Deg2Rad(deg) {
      return (deg * Math.PI) / 180;
    }

    function getDistance(
      latitude1,
      longitude1,
      latitude2,
      longitude2,
      message
    ) {
      //Toronto Latitude  43.74 and longitude  -79.37
      //Vancouver Latitude  49.25 and longitude  -123.12
      let lat1 = Deg2Rad(latitude1);
      let lat2 = Deg2Rad(latitude2);
      let lon1 = Deg2Rad(longitude1);
      let lon2 = Deg2Rad(longitude2);
      let latDiff = lat2 - lat1;
      let lonDiff = lon2 - lon1;
      var R = 6371000; // metres
      var phi1 = lat1;
      var phi2 = lat2;
      var ChangeInphi = latDiff;
      var ChangeInlambda = lonDiff;

      var a =
        Math.sin(ChangeInphi / 2) * Math.sin(ChangeInphi / 2) +
        Math.cos(phi1) *
          Math.cos(phi2) *
          Math.sin(ChangeInlambda / 2) *
          Math.sin(ChangeInlambda / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      var d = R * c;
      // console.log('d: ' + d);

      var dist =
        Math.acos(
          Math.sin(phi1) * Math.sin(phi2) +
            Math.cos(phi1) * Math.cos(phi2) * Math.cos(ChangeInlambda)
        ) * R;
      // console.log('dist: ' + dist);
      // console.log(`${dist}m from ${message}`)
      return dist;
      // console.log(dist);
      // console.log(latitude1, longitude1)
      // console.log(latitude2, longitude2)
    }
    // console.log(Coords)
    Coords.forEach(function(location) {
      let distance = getDistance(
        userlat,
        userlong,
        location.latitude,
        location.longitude
      );
      if (distance < 30) {
        console.log(
          `ALERT at User:${userlat}, ${userlong} and Danger point:${
            location.latitude
          }, ${location.longitude}, user is ${distance}m away from danger point`
        );
      }
      // console.log(distance)
    });
  }
 //>>>>>>>>>>>>>>>>>>>>>>>>>>>>added function above


  currentPage() {
    if (this.state.page === 1) {
      return (
        <PedMap
          lat={this.state.lat}
          long={this.state.long}
          page={this.state.page}
          changePage={this.changePage}
        />
      );
    }
    return (
      <Main
        lat={this.state.lat}
        long={this.state.long}
        page={this.state.page}
        changePage={this.changePage}
      />
    );
  }

  changePage(newpage) {
    this.setState({ page: newpage });
  }

  changeLat(num) {
    this.setState({ lat: num });
  }

  changeLong(num) {
    this.setState({ long: num });
  }

  componentDidMount() {
    this.watchId = navigator.geolocation.watchPosition(
      position => {
        this.setState({
          lat: position.coords.latitude,
          long: position.coords.longitude,
          error: null
        });
      this.test(position.coords.latitude, position.coords.longitude)
      },
      error => this.setState({ error: error.message }),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 10
      }
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  render() {
    return <View>{this.currentPage()}</View>;
  }
}

AppRegistry.registerComponent("Safewalk", () => Safewalk);
