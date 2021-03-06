import React, { Component } from "react";
import { AppRegistry, View, Vibration } from "react-native";
import PedMap from "./app/components/PedMap";
import Main from "./app/components/Main";
import Coords from "./sample";
var Sound = require("react-native-sound");

Sound.setCategory("Playback", true);

var alarm = new Sound("alarm.mp3", Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log("failed to load the sound", error);
    return;
  }
  // loaded successfully
  console.log(
    "duration in seconds: " +
      alarm.getDuration() +
      "number of channels: " +
      alarm.getNumberOfChannels()
  );
});

function Deg2Rad(deg) {
  return (deg * Math.PI) / 180;
}

function getDistance(latitude1, longitude1, latitude2, longitude2, message) {
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
  var dist =
    Math.acos(
      Math.sin(phi1) * Math.sin(phi2) +
        Math.cos(phi1) * Math.cos(phi2) * Math.cos(ChangeInlambda)
    ) * R;
  return dist;
}

export default class Safewalk extends Component<props> {
  constructor() {
    super();
    this.changePage = this.changePage.bind(this);
    this.changeSettings = this.changeSettings.bind(this);
    this.test = this.test.bind(this);
    this.state = {
      lat: 51.05321,
      long: -114.09524,
      page: 0,
      savedCoords: 0,
      vibrate: false,
      sound: false,
      distance: 5
    };
  }

  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>added function

  test(userlat, userlong) {
    seenCoords = this.state.savedCoords;
    Coords.forEach(location => {
      let distance = getDistance(
        userlat,
        userlong,
        location.latitude,
        location.longitude
      );
      const newCoords = location.latitude + "," + location.longitude;
      if (distance < 30 && newCoords !== this.state.savedCoords) {
        if (this.state.sound === true) {
          alarm.play();
        }
        if (this.state.vibrate === true) {
          alert("VIBRATE LIKE CRAZY");
          Vibration.vibrate(5000);
        }

        this.setState({ savedCoords: newCoords });
      }
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
        vibrate={this.state.vibrate}
        sound={this.state.sound}
        changeSettings={this.changeSettings}
        changePage={this.changePage}
      />
    );
  }

  changeSettings() {
    let setting = 0;
    if (this.state.sound === true && this.state.vibrate === true) {
      setting = 1;
    }
    if (this.state.sound === false && this.state.vibrate === true) {
      setting = 2;
    }
    if (this.state.sound === true && this.state.vibrate === false) {
      setting = 3;
    }
    if (this.state.sound === false && this.state.vibrate === false) {
      setting = 4;
    }
    switch (setting) {
      case 1:
        this.setState({ sound: false });
        this.setState({ vibrate: true });
        this.setState({ distance: 5 });
        break;
      case 2:
        this.setState({ sound: true });
        this.setState({ vibrate: false });
        this.setState({ distance: 5 });
        break;
      case 3:
        this.setState({ sound: false });
        this.setState({ vibrate: false });
        this.setState({ distance: 99999999 });
        break;
      case 4:
        this.setState({ sound: true });
        this.setState({ vibrate: true });
        this.setState({ distance: 5 });
        break;
    }
  }

  changePage(newpage) {
    this.setState({ page: newpage });
  }


  componentDidMount() {
    
      this.watchId = navigator.geolocation.watchPosition(
        position => {
          this.setState({
            lat: position.coords.latitude,
            long: position.coords.longitude,
            error: null
          });
          this.test(position.coords.latitude, position.coords.longitude);
        },
        error => this.setState({ error: error.message }),
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 1000,
          distanceFilter: this.state.distance
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
