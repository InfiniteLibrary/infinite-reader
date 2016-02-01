'use strict';

var React = require('react-native');
var {
  Image,
  TextInput,
  StyleSheet,
  View,
} = React;
var MK = require('react-native-material-kit');
var { 
  MKButton,
  MKColor,
} = MK;

var CatalogCell = React.createClass({
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
    var remoteURL = 'https://infinitelibrary:mitmedialab@infinitelibrary.cloudant.com/gitburg'
    var userDB = new manager('http://admin:password@localhost:5984/', 'users');
    var sessionDB = new manager('http://admin:password@localhost:5984/', 'session');
    
    // get the full list of users

    userDB.createDatabase()
      .then((res) => {
        userDB.replicate('users', remoteURL)
      })
      .then((res) => {
        return userDB.getDesignDocument('_all_docs?include_docs=true&attachments=true')
      })
      .then((res) => {
        this.setState({
          users: this.state.users.cloneWithRows(res.rows)
        });
        console.log(res.rows)
      })
      .catch((ex) =>
        console.log(ex)
      });

    // get the current session
    // { user: 
    //    { name: "Bob"}
    // }

    sessionDB.createDatabase()
      .then((res) => {
      	if (res.rows.length){
      		this.state.session = res.rows[0]  // most resent session
        } else {
      		this.state.session = { "user": { "name": ""} };
      	}
      })
      .catch((ex) =>
        console.log(ex)
      }); 
  },

  // if the input button is pressed

	addUser() {
		// object state user object
		this.state.session.user.name = this.state.text
		// create user
    userDB.createDocument(this.state.session.user);
    // update session
    sessionDB.createDocument(this.state.session.user);
    // move on
    this.props.navigator.push({
      name: 'catalog',
    });
  },

  // if a user is pressed

  selectUser() {
  	// object state user object
    this.state.session.user.name = userName;
    // update session
    sessionDB.createDocument(this.state.session.user)
    // move on
    this.props.navigator.push({
      name: 'catalog',
    });

  }

  // render all the current users 

  renderRow(data) {
    var user = data.doc
    return (
      <TouchableElement
        background={TouchableNativeFeedback.Ripple()} 
        onPress={this.selectUser}>  // this.props.selectUser  ?
	      <Text>{user.name}</Text>  
	    </TouchableElement>
    );
  },

  render () {
  	return(
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
	}
});