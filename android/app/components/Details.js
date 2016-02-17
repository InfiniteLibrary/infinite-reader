'use strict';

var React = require('react-native');
var {
  Image,
  PixelRatio,
  ScrollView,
  StyleSheet,
  Text,
  Platform,
  View,
  TouchableNativeFeedback,
  TouchableHighlight,
} = React;

var MK = require('react-native-material-kit');
var { 
  MKButton,
  MKColor,
} = MK;

import {manager, ReactCBLite} from 'react-native-couchbase-lite'
ReactCBLite.init(5984, 'admin', 'password', (e) => {});

var booksDB = new manager('http://admin:password@localhost:5984/', 'books');
booksDB.createDatabase();
var usersDB = new manager('http://admin:password@localhost:5984/', 'users')
usersDB.createDatabase();
var sessionDB = new manager('http://admin:password@localhost:5984/', 'session');


var Details = React.createClass({
  getInitialState() {
    return {
      user : {}
    }
  },
  componentDidMount() {
    sessionDB.createDatabase()
      .then((res) => {
        return sessionDB.getDocument("current")
      })
      .then((res) => {
        this.setState({user, res});
      });
  },
  downloadBook(book) {
    var remoteBookURL = "https://rawgit.com/InfiniteLibraryLibrary/" + book.title + "/master/book.xhtml"
    fetch(remoteBookURL)  // should be (book.url)
      .then((res) => {
        return res.text()
      })
      .then((htmlText) => {
        // save book to booksDB
        return booksDB.createAttachment(book._id, htmlText, 'book.xhtml', 'text/html')
      })
      .then((res) => {
        // save book to user
        this.state.user.downloaded.push(book._id);
        updateDocument(this.state.user, user.rev)
      })
      .then((res) => { 
        this.props.navigator.push({ name: 'mybooks' });
      })
      .catch((ex) => {
        console.log(ex)
      });
  },
  render() {
    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
    var imageURI = 'data:image/jpeg;base64,' + this.props.book._attachments["cover.jpg"].data;
    var book = this.props.book;
    return (
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.mainSection}>
          {/* $FlowIssue #7363964 - There's a bug in Flow where you cannot
            * omit a property or set it to undefined if it's inside a shape,
            * even if it isn't required */}
          <View style={styles.rightPane}>
            <Text style={styles.movieTitle}>{book.title}</Text>
            <Image 
              source={{uri: imageURI}} 
              style={styles.thumbnail} />
          </View>
          <MKButton
            style={styles.button}
            backgroundColor={MKColor.Teal}
            onPress={() => {this.downloadBook(book);}} >
            <Text pointerEvents="none"
                  style={{color: 'white', fontWeight: 'bold',}}>
              DOWNLOAD
            </Text>
          </MKButton>
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
    flexDirection: 'column',
    alignItems: 'center',
  },
  thumbnail: {
    height: 200,
    width: 128,
    resizeMode: 'cover',
    backgroundColor: '#eaeaea',
  }, 
  button: {
    margin: 7,
    borderRadius: 4,
    width: 80,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

module.exports = Details;