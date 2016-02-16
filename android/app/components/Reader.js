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

var WebView = require('./WebView');

import {manager, ReactCBLite} from 'react-native-couchbase-lite'
ReactCBLite.init(5984, 'admin', 'password', (e) => {});


var Reader = React.createClass({
  getInitialState() {
    return {
      bookURL: "",
    }
  },
  componentDidMount() {
    // booksDB
    var booksDB = new manager('http://admin:password@localhost:5984/', 'books');
    booksDB.createDatabase()
      .then((res) => {
        return booksDB.getDocument(this.props.book._id)
      })
      .then((res) => {
        var localURI = res._attachments["book.xhtml"].data;
        this.setState({bookURL: localURI})
      })
  },
  render() {
    return (
      <WebView url={this.state.bookURL}/>
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