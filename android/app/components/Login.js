'use strict';

var UserCell = require('./UserCell');

var React = require('react-native');
var {
  Image,
  TextInput,
  StyleSheet,
  View,
  ListView,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  Platform,
} = React;
var MK = require('react-native-material-kit');
var { 
  MKButton,
  MKColor,
} = MK;

import {manager, ReactCBLite} from 'react-native-couchbase-lite'
ReactCBLite.init(5984, 'admin', 'password', (e) => {});

var Login = React.createClass({
	getInitialState() {
    return {
      users: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      text: "",
      session: {
        user: {
          name: "",
        }
      },
    };
  },
	componentWillMount() {
    this.remoteURL = 'https://infinitelibrary:mitmedialab@infinitelibrary.cloudant.com/gitburg'
    this.userDB = new manager('http://admin:password@localhost:5984/', 'users');
    this.sessionDB = new manager('http://admin:password@localhost:5984/', 'session');
    
    // get the full list of users

    this.userDB.createDatabase()
      /*
      .then((res) => {
        this.userDB.replicate('users', this.remoteURL)
      }) */
      .then((res) => {       
        return this.userDB.getDesignDocument('_all_docs?include_docs=true')
      })
      .then((res) => {
        this.setState({
          users: this.state.users.cloneWithRows(res.rows)
        });
        console.log(res.rows)
      })
      .catch((ex) => {
        console.log(ex)
      });

    this.sessionDB.createDatabase()
  },

  // if the input button is pressed

	addUser() {
		// update session
		this.setState({session: {"user": { "name": this.state.text } }});
		// create user
    var date = new Date
    var dateString = date.toISOString()
    var userID = this.state.text + '-' + dateString 
    this.userDB.createDocument(this.state.session.user, userID);
    // update session
    this.sessionDB.createDocument(this.state.session, "currentSession");
    // move on
    this.props.navigator.push({
      name: 'catalog',
    });
  },

  // if a user is pressed

  selectUser(user) {
  	// object state user object
    this.setState({session: {"user": user}});
    // update session
    this.sessionDB.createDocument(this.state.session, "currentSession")
    // move on
    this.props.navigator.push({
      name: 'catalog',
    });

  },

  // render all the current users 

  renderRow(data) {
    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
    var user = data.doc
    return (
        <UserCell
        key= {user._id}
        onSelect={() => this.selectUser(user)}
        user={user}
        style={{flex: 1}} />
    );
  },

  render () {
  	return (
  		<View>
        <Text style={styles.prompt}> Register</Text>
        <TextInput
          style={styles.nameInput}
          ref="input"
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus={false}
          placeholder="Enter your name"
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          onChangeText={(text) => this.setState({text})}
          value={this.state.text} />
        <MKButton
          style={styles.button}
          backgroundColor={MKColor.Teal}
          onPress={() => {this.addUser(this.state.text);}} >
          <Text pointerEvents="none"
                style={{color: 'white', fontWeight: 'bold',}}>
            SUBMIT
          </Text>
        </MKButton>
        <Text style={styles.prompt}> Or select your username </Text>
        <ListView
          dataSource={this.state.users}
          renderRow={this.renderRow} />
	    </View>
		);
	},
});

var styles = StyleSheet.create({
  nameInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    height: 50,
    margin: 15,
    backgroundColor: '#aaa'
  },
  button: {
    margin: 15,
    borderRadius: 4,
    width: 80,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prompt: {
    fontSize: 15,
    margin: 15,
  }
});

module.exports = Login