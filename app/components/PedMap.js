import React, { Component, DeviceEventEmitter } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import Marker from "./Marker";

export default class PedMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pixel:1,
      region: {
        latitude: this.props.lat,
        longitude: this.props.long,
        latitudeDelta: 0.0422,
        longitudeDelta: 0.0121
      },
      coordinate: {
        latitude: this.props.lat,
        longitude: this.props.long
      },
      page: this.props.page,
      lat: this.props.lat,
      long: this.props.long,
      error: null
    };
  }

  _onPressButton() {
    this.props.changePage(0);
    console.log(this.props.page);
  }

  static defaultProps = {
    message: "Hi there"
  };
moveto(){
  this.map.animateToRegion(this.state.region)
}

  componentDidMount() {
    setTimeout(()=>this.setState({pixel: 0}),500)
  }

  componentWillUnmount() {}

  render() {
    const containerstyle = {
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white",
      paddingTop: this.state.pixel
    }

    return (
      <View style={containerstyle}>
        <MapView
          ref={node => {this.map = node}}
          style={styles.map}
          showsUserLocation={true}
          showsMyLocationButton={true}
          region={this.state.region}
          customMapStyle={mapStyle}
        >
          <Marker />
        </MapView>
        <View style={styles.btncontainer}>
          <TouchableHighlight
            onPress={this._onPressButton.bind(this)}
            underlayColor="white"
          >
            <View style={styles.button}>
              <Text style={styles.buttonText}>Go Back</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const mapStyle = [
  {
    featureType: "poi.business",
    stylers: [
      {
        visibility: "off"
      }
    ]
  },
  {
    featureType: "poi.park",
    elementType: "labels.text",
    stylers: [
      {
        visibility: "off"
      }
    ]
  }
];

const styles = StyleSheet.create({
  container: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  },
  map: {
    height: "100%",
    width: "100%"
  },
  btncontainer: {
    position: "absolute",
    bottom: 0,
    width: "60%"
  },
  button: {
    alignItems: "center",
    backgroundColor: "#2196F3",
    borderRadius: 10,
    marginBottom: 15,
    zIndex: 1
  },
  buttonText: {
    padding: 20,
    color: "white",
    fontSize: 30
  },
  myloc: {
    height: 20,
    width: 20,
    borderRadius: 20 / 2,
    overflow: "hidden",
    backgroundColor: "rgba(16, 187, 240, 0.3)",
    borderWidth: 2,
    borderColor: "rgba(16, 187, 240, 0.7)",
    alignItems: "center",
    justifyContent: "center"
  }
});

AppRegistry.registerComponent("PedMap", () => PedMap);
