'use strict';

import React, { Component } from 'react-native';
import {bindActionCreators} from 'redux';
import * as sessionActions from '../actions/sessionActions';
import { connect } from 'react-redux';

var React = require('react-native');
var Catalog = require('../components/Catalog');
var Details = require('../components/Details');
var Reader = require('../components/Reader');
var MyBooks = require('../components/MyBooks');
var Login = require('../components/Login');

var StatusBarAndroid = require('react-native-android-statusbar');
var {
  BackAndroid,
  Navigator,
  StyleSheet,
  ToolbarAndroid,
  View,
} = React;

var RouteMapper = function(route, navigationOperations, onComponentRef) {
  _navigator = navigationOperations;

  if (route.name === 'catalog') {
    return (
      <Catalog navigator={navigationOperations}/>
    );
  } else if (route.name === 'mybooks') {
    return (
      <MyBooks navigator={navigationOperations}/>
    );
  } else if (route.name === 'login') {
    return (
      <Login navigator={navigationOperations}/>
    );
  } else if (route.name === 'details') {
    return (
      <View style={{flex: 1}} >
        <ToolbarAndroid
          actions={[]}
          navIcon={require('image!android_back_white')}
          onIconClicked={navigationOperations.pop}
          style={styles.toolbar}
          titleColor="white"
          title={route.book.title} />
        <Details
          style={{flex: 1}}
          navigator={navigationOperations}
          book={route.book} />
      </View>
    );
  } else if (route.name === 'reader') {
    return (
      <View style={{flex: 1}}>
        <ToolbarAndroid
          actions={[]}
          navIcon={require('image!android_back_white')}
          onIconClicked={navigationOperations.pop}
          style={styles.toolbar}
          titleColor="white"
          title={route.book.title} />
        <Reader
          style={{flex: 1}}
          navigator={navigationOperations}
          book={route.book} />
      </View>
    );
  }
};

class InfiniteApp extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { state, actions } = this.props;
    var initialRoute = {name: 'login'};
    return (
      <Navigator
        style={styles.container}
        initialRoute={initialRoute}
        configureScene={() => Navigator.SceneConfigs.FadeAndroid}
        renderScene={RouteMapper}
        counter={state.count}
        {...actions} />
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  toolbar: {
    backgroundColor: '#a9a9a9',
    height: 56,
  },
});

export default connect(state => ({
    state: state.session
  }),
  (dispatch) => ({
    actions: bindActionCreators(sessionActions, dispatch)
  })
)(InfiniteApp);