
'use strict';

var React = require('react-native');
var Navigation = require('./Navigation');
var CatalogCell = require('./CatalogCell');

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
ReactCBLite.init(5984, 'admin', 'password', (e) => {});

var sessionDB = new manager('http://admin:password@localhost:5984/', 'session');
var catalogDB = new manager('http://admin:password@localhost:5984/', 'catalog');

var MyBooks = React.createClass({
  getInitialState() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      user: {},
    };
  },
  componentDidMount() {
    var books = [];
    sessionDB.createDatabase()
      .then((res) => {
        return sessionDB.getDocument("current")
      })
      .then((res) => {
        this.setState({user, res});
      });
      then((res) => {
        return catalogDB.createDatabase()
      })
      .then((res) => {
        return catalogDB.getDesignDocument('_all_docs?include_docs=true&attachments=true')
      })
      .then((res) => {
        for (let id of this.state.user.downloads) {
          catalogDB.getDocument(id)
            .then((res) => {
              books.push(res)
            });
        }
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(books)
        });
      })
      .catch((ex) => {
        console.log(ex)
      })
  },
  selectBook(book) {
    // fix for iOS/Android dismiss keyboard needs to be added
    this.props.navigator.push({
      title: book.title,
      name: 'reader',
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
          title="My Books" />
        
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          style={styles.listView} />
      </DrawerLayoutAndroid>
    );
  },
});


var styles = StyleSheet.create({
  catalogCell: {
    flex: 1
  },
  listView: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  toolBar: {
    backgroundColor: '#FF5252',
    height: 56,
  },
});

module.exports = MyBooks;