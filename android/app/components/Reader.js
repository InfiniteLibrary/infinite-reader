'use strict';

var React = require('react-native');
var {
  Image,
  PixelRatio,
  ScrollView,
  StyleSheet,
  Text,
  View,
} = React;


var Reader = React.createClass({
  render: function() {
    var imageURI = 'data:image/png;base64,' + this.props.book._attachments["cover.jpg"].data;
    return (
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.mainSection}>
          {/* $FlowIssue #7363964 - There's a bug in Flow where you cannot
            * omit a property or set it to undefined if it's inside a shape,
            * even if it isn't required */}
          <View style={styles.rightPane}>
            <Text style={styles.movieTitle}>{this.props.book.title}</Text>
            <Image 
              source={{uri: imageURI}} 
              style={styles.thumbnail} />
          </View>
        </View>
      </ScrollView>
    );
  },
});



var styles = StyleSheet.create({
  contentContainer: {
    padding: 10,
  },
  rightPane: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  movieTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  rating: {
    marginTop: 10,
  },
  mainSection: {
    flexDirection: 'row',
  },
  thumbnail: {
    width: 134,
    height: 200,
    backgroundColor: '#eaeaea',
    marginRight: 10,
  }
});

module.exports = Reader;