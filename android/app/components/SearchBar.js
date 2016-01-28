
'use strict';

var React = require('react-native');
var {
  Image,
  Platform,
  ProgressBarAndroid,
  TextInput,
  StyleSheet,
  TouchableNativeFeedback,
  View,
} = React;

var IS_RIPPLE_EFFECT_SUPPORTED = Platform.Version >= 21;

var SearchBar = React.createClass({
  render: function() {
    var loadingView;
    if (this.props.isLoading) {
      loadingView = (
        <ProgressBarAndroid
          styleAttr="Large"
          style={styles.spinner}
        />
      );
    } else {
      loadingView = <View style={styles.spinner} />;
    }
    var background = IS_RIPPLE_EFFECT_SUPPORTED ?
      TouchableNativeFeedback.SelectableBackgroundBorderless() :
      TouchableNativeFeedback.SelectableBackground();
    return (
      <View style={styles.searchBar}>
        <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple()} 
            onPress={() => this.refs.input && this.refs.input.focus()}>
          <View>
            <Image
              source={require('image!android_search_white')}
              style={styles.icon}
            />
          </View>
        </TouchableNativeFeedback>
        <TextInput
          ref="input"
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus={false}
          // onChange={this.props.onSearchChange}
          placeholder="Search..."
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          // onFocus={this.props.onFocus}
          style={styles.searchBarInput}
        />
        {loadingView}
      </View>
    );
  }
});

var styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF5350',
    height: 56,
  },
  searchBarInput: {
    flex: 1,
    fontSize: 20,
    color: 'white',
    height: 50,
    padding: 0,
    backgroundColor: 'transparent'
  },
  spinner: {
    width: 30,
    height: 30,
  },
  icon: {
    width: 24,
    height: 24,
    marginHorizontal: 19,
  },
});

module.exports = SearchBar;