import React from 'react';
import { Pedometer } from 'expo-sensors';
import { StyleSheet, Text, View } from 'react-native';

export default class App extends React.Component {
  //state which are updated 
  state = {
    isPedometerAvailable: 'checking',
    pastStepCount: 0,
    currentStepCount: 0,
  };
  //component will mount for the whole lifecycle
  componentDidMount() {
    this._subscribe();
  }
  // when the event needs to be cleared 
  componentWillUnmount() {
    this._unsubscribe();
  }

  _subscribe = () => {
    this._subscription = Pedometer.watchStepCount(result => {
      this.setState({
        currentStepCount: result.steps,
      });
    });
    //check whether pedometer is available on device

    // get for past one day and simultaneously updating the result for current step counts and will
    //keep updating and when 1 whole day is completed and the pastStepCount state will be set and 
    // hence after that you (if you want maintaing pastStepcount on global server(or redux store) and unmount the component and start again)
    //or simply instead on unmounting set the current count at the end of day back to zero.
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 1);
    Pedometer.getStepCountAsync(start, end).then(
      //Returns a promise that resolves to an Object with a steps key, which is a Number indicating the number of steps taken between the given dates.
      result => {
        this.setState({ pastStepCount: result.steps });
      },
      error => {
        this.setState({
          pastStepCount: 'Could not get stepCount: ' + error,
        });
      }
    );
  };

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Steps taken in the last 24 hours: {this.state.pastStepCount}</Text>
        <Text>Walk! And watch this go up: {this.state.currentStepCount}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
});
