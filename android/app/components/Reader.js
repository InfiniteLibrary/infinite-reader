'use strict';

var React = require('react-native');
var {
  Image,
  PixelRatio,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableHighlight,
  TouchableNativeFeedback,
} = React;

var WebView = require('./WebView');

var Reader = React.createClass({
  getInitialState() {
    var imageURI = 'data:image/jpeg;base64,' + this.props.book._attachments["cover.jpg"].data;
    return {
      htmlBook: ["<p>htmlBook Page 1</p><img src='" + imageURI + "' />","<p>htmlBook Page 2</p>","<p>htmlBook Page 3</p>"],
      initialPage: 0,
    }
  },
  //changePage(dir) {
  //  this.state.initialPage += dir
  //},
  render() {
    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
    return (
      <View style={styles.contentContainer}>
        <WebView html={this.state.htmlBook[this.state.initialPage]}/>
        <TouchableElement
          background={TouchableNativeFeedback.Ripple()}
          >
          <View style={styles.leftButton} >
            <View>
              <Text style={styles.title}>Prev</Text>
            </View>
          </View>
        </TouchableElement>
        <TouchableElement
          background={TouchableNativeFeedback.Ripple()}
          >
          <View style={styles.rightButton} >
            <View>
              <Text style={styles.title}>Next</Text>
            </View>
          </View>
        </TouchableElement>
      </View>
    );
  },
});



var styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  container: {  
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  leftButton: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'gold',
    opacity: .5,
  },
  rightButton: {
    flex: 1,
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'green',
    opacity: .5,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  year: {
    textAlign: 'center',
  },
  navItem: {  
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

module.exports = Reader;