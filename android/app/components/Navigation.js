
'use strict';

var React = require('react-native');
var {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View,
  Platform,
} = React;



var NavItem = React.createClass({
  render () {
    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
    return (
      <View style={this.props.style}>
        <TouchableElement
          background={TouchableNativeFeedback.Ripple()} 
          onPress={this.props.onSelect}>
          <View style={styles.navItem}>
            <View style={styles.rightContainer}>
              <Text style={styles.title}>{this.props.name}</Text>
            </View>
          </View>
        </TouchableElement>
      </View>
    )
  }
});



var Navigation = React.createClass({
  render () {
    return (
      <View style={styles.navigation}>
        <View style={styles.logoArea}>
          <Image 
            source={require('image!title_logo')}
            style={styles.logo} />
        </View>
        <NavItem 
          style={{flex: 1, backgroundColor: '#FF5252'}}
          name = "My Books"
          onSelect = {() => this.props.goToRoute('mybooks')} />
        <NavItem 
          style={{flex: 1, backgroundColor: '#F44336'}}
          name = "Catalog"
          onSelect = {() => this.props.goToRoute('catalog')} />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  navItem: {  
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightContainer: {
    flex: 1,
  },
  navigation: {  
    flex: 1,
    backgroundColor: '#E53935'
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    color: '#ffffff',
  },
  logoArea: {
    flex: 5,
    backgroundColor: '#E53935',
  }
});

module.exports = Navigation;