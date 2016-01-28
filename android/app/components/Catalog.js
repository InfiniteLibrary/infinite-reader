
'use strict';

var React = require('react-native');
var Navigation = require('./Navigation');
var CatalogCell = require('./CatalogCell');
var SearchBar = require('./SearchBar')

var {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  DrawerLayoutAndroid,
  TouchableHighlight,
  TouchableNativeFeedback,
  ToolbarAndroid,
} = React;

import {manager, ReactCBLite} from 'react-native-couchbase-lite'
ReactCBLite.init(5984, 'admin', 'password');


var Catalog = React.createClass({
  getInitialState() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    };
  },
  componentDidMount() {
    var remoteURL = 'https://infinitelibrary:mitmedialab@infinitelibrary.cloudant.com/gitburg'
    var database = new manager('http://admin:password@localhost:5984/', 'demoapp');
    database.createDatabase()
      .then((res) => {
        database.replicate(remoteURL, 'demoapp')
      })
      .then((res) => {
        return database.getAllDocuments()
      })
      .then((res) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(res.rows)
        });
        console.log(res.rows)
      })
      .catch((ex) => {file:///android_asset/
        console.log(ex)
      })
  },
  selectBook(book) {
    // fix for iOS/Android dismiss keyboard needs to be added
    this.props.navigator.push({
      title: book.title,
      name: 'details',
      book: book,
    });
  },
  goTo(route) {
    // fix for iOS/Android dismiss keyboard needs to be added
    this.props.navigator.push({
      name: route,
    });
  },
  renderRow(data) {
    var book = data.doc
    return (
      <CatalogCell
        key= {book._id}
        onSelect={() => this.selectBook(book)}
        book={book}
        style={styles.catalogCell} />
    );
  },
  render() {
    var navigationView = (
      <Navigation 
        goToRoute= {(route) => this.goTo(route)}/>
    );
    return (
      <DrawerLayoutAndroid
        drawerWidth={300}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        ref={(drawer) => { return this.drawer = drawer  }}
        renderNavigationView={() => navigationView}>

        <ToolbarAndroid
          actions={[]}
          navIcon={require('image!three_bar')}
          onIconClicked={() => this.drawer.openDrawer()}
          style={styles.toolBar}
          titleColor="white"
          title="Catalog" />

        <SearchBar />
        
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          style={styles.listView} />

      </DrawerLayoutAndroid>
    )
  },
});


var styles = StyleSheet.create({
  catalogCell: {
    flex: 1,
  },
  listView: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  toolBar: {
    backgroundColor: '#F44336',
    height: 56,
  },
});

module.exports = Catalog;