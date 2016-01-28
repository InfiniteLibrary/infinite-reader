/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var Catalog = require('./android/app/components/Catalog');
var Details = require('./android/app/components/Details');
var Reader = require('./android/app/components/Reader');
var MyBooks = require('./android/app/components/MyBooks');
var StatusBarAndroid = require('react-native-android-statusbar');
var {
  AppRegistry,
  BackAndroid,
  Navigator,
  StyleSheet,
  ToolbarAndroid,
  View,
} = React;

var _navigator;

StatusBarAndroid.setHexColor('#B71C1C');

BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator && _navigator.getCurrentRoutes().length > 1) {
    _navigator.pop();
    return true;
  }
  return false;
});

var RouteMapper = function(route, navigationOperations, onComponentRef) {
  _navigator = navigationOperations;
  if (route.name === 'catalog') {
    return (
      <Catalog navigator={navigationOperations} />
    );
  } else if (route.name === 'mybooks') {
    return (
      <MyBooks navigator={navigationOperations} />
    );
  } else if (route.name === 'details') {
    return (
      <View style={{flex: 1}}>
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

var ReactNativeCouchbaseLiteExample = React.createClass({
  render: function () {
    var initialRoute = {name: 'catalog'};
    return (
      <Navigator
        style={styles.container}
        initialRoute={initialRoute}
        configureScene={() => Navigator.SceneConfigs.FadeAndroid}
        renderScene={RouteMapper} />
    );
  }
});

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

AppRegistry.registerComponent('ReactNativeCouchbaseLiteExample', () => ReactNativeCouchbaseLiteExample);
