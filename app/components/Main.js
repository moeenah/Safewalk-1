import React, { Component } from "react";
import {
  Alert,
  AppRegistry,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  View
} from "react-native";

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: this.props.page,
      lat: this.props.lat,
      long: this.props.long
    };
  }

  _onPressButton() {
    this.props.changePage(1);
  }

  returnSettings(){
    if(this.props.sound === true && this.props.vibrate === true){
      return "Sound & Vibrate"
    }
    if(this.props.sound === false && this.props.vibrate === true){
      return "Vibrate Only"
    }
    if(this.props.sound === true && this.props.vibrate === false){
      return "Sound Only"
    }
    if(this.props.sound === false && this.props.vibrate === false){
      return "Off"
    }
  }

  settingsChange() {
    this.props.changeSettings();
  }

  static defaultProps = {
    message: "Hi there"
  };

  render() {
    return (
      <View>
        <TouchableHighlight
          onPress={this.settingsChange.bind(this)}
          underlayColor="white"
        >
          <View style={styles.button}>
            <Text style={styles.buttonText}>{this.returnSettings()}</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={this._onPressButton.bind(this)}
          underlayColor="white"
        >
          <View style={styles.button}>
            <Text style={styles.buttonText}>Maps</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    bottom: 0,
    paddingTop: 60,
    alignItems: "center"
  },
  button: {
    alignItems: "center",
    backgroundColor: "#2196F3",
    borderRadius: 10,
    margin: 20
  },
  buttonText: {
    padding: 20,
    color: "white",
    fontSize: 30
  }
});

AppRegistry.registerComponent("Main", () => Main);
