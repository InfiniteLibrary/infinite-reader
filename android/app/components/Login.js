'use strict';

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
ReactCBLite.init(5984, 'admin', 'password');

var Login = React.createClass({
	getInitialState() {
    return {
      users: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      session: {},
      text: "",
    };
  },
	componentWillMount() {
    this.remoteURL = 'https://infinitelibrary:mitmedialab@infinitelibrary.cloudant.com/gitburg'
    this.userDB = new manager('http://admin:password@localhost:5984/', 'users');
    this.sessionDB = new manager('http://admin:password@localhost:5984/', 'session');
    
    // get the full list of users

    this.userDB.createDatabase()
      .then((res) => {
        this.userDB.replicate('users', this.remoteURL)
      })
      .then((res) => {
        return this.userDB.getDesignDocument('_all_docs?include_docs=true&attachments=true')
      })
      .then((res) => {
        this.setState({
          users: this.state.users.cloneWithRows(res.rows)
        });
      })
      .catch((ex) => {
        console.log(ex)
      });

    // get the current session
    // { user: 
    //    { name: "Bob"}
    // }

    this.sessionDB.createDatabase()
      .then((res) => {
        return this.sessionDB.getDesignDocument('_all_docs?include_docs=true&attachments=true')
      })
      .then((res) => {
        if (res.rows.length){
      		this.setState({session: res.rows[0]})  // most resent session
        } else {
      		this.setState({session: { "user": { "name": ""} }});
      	}
      })
      .catch((ex) => {
        console.log(ex)
      }); 
  },

  // if the input button is pressed

	addUser() {
		// object state user object
		this.setState({session: {"user": { "name": this.state.text } }});
		// create user
    console.log(this.state.session)
    this.userDB.createDocument(this.state.session.user);
    // update session
    this.sessionDB.createDocument(this.state.session);
    // move on
    this.props.navigator.push({
      name: 'catalog',
    });
  },

  // if a user is pressed

  selectUser(user) {
  	// object state user object
    this.state.session.user = user;
    // update session
    this.sessionDB.createDocument(this.state.session.user)
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
      <TouchableElement
        background={TouchableNativeFeedback.Ripple()} 
        onPress={this.selectUser(user)}>  // this.props.selectUser  ?
	      <Text>{user.name}</Text>  
	    </TouchableElement>
    );
  },

  render () {
  	return (
  		<View>
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(text) => this.setState({text})}
          value={this.state.text} />
        <MKButton
          backgroundColor={MKColor.Teal}
          onPress={() => {this.addUser(this.state.text);}} >
          <Text pointerEvents="none"
                style={{color: 'white', fontWeight: 'bold',}}>
            REGISTER
          </Text>
        </MKButton>
        <ListView
          dataSource={this.state.users}
          renderRow={this.renderRow} />
	    </View>
		);
	},
});

module.exports = Login