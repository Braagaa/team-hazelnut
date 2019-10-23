import React, { Component } from "react";
import "../App.scss";
import NavigationBar from "./Navbar";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Card from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import axios from "axios";

// import socket.io client
import openSocket from 'socket.io-client';



const messagesPageStyle = theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },

  cardStyle: {
    height: "82vh"
  },

  bigAvatar: {
    width: 50,
    height: 50,
    marginBottom: "5px",
    marginTop: "5px",
    marginLeft: "10px"
  },

  title: {
    border: "0.5px solid #e6e6e6",
    textAlign: "center"
  },
  border: {
    border: "0.5px solid #e6e6e6",
    borderRight: "0px"
  },

  messagesArea: {
    height: "70vh",
    border: "1px solid red"
  },

  messagingArea: {
    height: "12vh",
    border: "1px solid #e6e6e6"
  },

  textField: {
    width: "70%"
  },
  button: {
    margin: theme.spacing(1),
  },

  sentMessages: {
    textAlign: "right",
    paddingRight:"10px",
    paddingTop: "10px"
  },
  sentMessageLength: {
    textAlign: "right",
    backgroundColor: "white",
    boxShadow: "0px 0px 4px 0px lightgrey",
    borderRadius: "10px",
    padding: "12px"
  }
});

class MessagesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      conversations: [],
      message: "",
      messages: [],
      conversationId: "",
      recipientIds: [],
      recipientProfiles: [],
      token: localStorage.getItem("jwtToken"),
      userId: localStorage.getItem("userId")
    }
  }

  componentDidMount() {
    this.socket = openSocket('http://localhost:3001');
    this.socket.on("message", msg => {
      this.setState({ messages: [...this.state.messages, msg]});
    });
    this.getConversations();
    this.getRecipientProfiles();
  };
  
  // GET a list of conversations
  getConversations() {
    axios.get('/conversation/list/', { headers: { Authorization: `Bearer ${this.state.token}` }})
      .then(res => {
        this.setState({
          conversations: res.data    // Get all conversation
        });
        // save recipient Ids to get their profiles
        res.data.map(con => {
          this.setState({ recipientIds: [...this.state.recipientIds, con.recipientId._id]});
        })  
      })
      .catch(err => {
        console.log("Error fetching and parsing data", err);
      }) 
  }

  // GET a list of recipient profiles
  getRecipientProfiles() {
    let axiosArray = this.state.recipientIds.map(id => 
      axios.get(`/profile/get/${id}`, { headers: { Authorization: `Bearer ${this.state.token}` } }));
    
    axios.all(axiosArray)
      .then(res => {
        res.data.map(profile => {
          this.setState({ recipientProfiles: [...this.state.recipientProfiles, profile] });
        })
      })
      .catch(err => {
        console.log(err);
      }); 
  };

  // Handle message change
  messageChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }
  
  // Handle create a new conversation
  createConversation = e => {
    const newConversation = {
      recipientId: e.target.id
    }
    axios.post('/conversation', newConversation, { headers: { Authorization: `Bearer ${this.state.token}` }} )
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log(err.response.data);
      }); 
  };
  
  // Handle get a conversation Id to start sending messages
  getConversationId = e => {
    this.setState({ conversationId: e.target.id });
  }
  
  // Handle create a new message
  createMessage = e => {
    e.preventDefault();
    const newMessage = {
      conversationId: this.state.conversationId,
      body: this.state.message
    }
    axios.post(`/conversation/${this.state.conversationId}/message`, newMessage, { headers: { Authorization: `Bearer ${this.state.token}` }} )
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log(err.response.data);
      });

    this.socket.emit("message", this.state.message);
    this.setState({ message: "" });  
  }
  
  render() {
    const { classes } = this.props;
<<<<<<< HEAD
    const ids = this.state.recipientIds.map((id) => {
      return id
    })
    console.log(ids);
    // console.log(this.state.conversations);
    // console.log(this.state.recipientIds);
    // console.log(this.state.recipientProfiles);
  
    const message = this.state.messages.map((message, i) => <h2 key={i}>{message}</h2>);
=======
    const message = this.state.messages.map((message, i) => <p key={i}><span className={classes.sentMessageLength}>{message}</span></p> );
>>>>>>> 7c7d33b6f8cb32b35126c34ed3777c70971899aa
    const converId = this.state.conversations.map((con, i) => 
        <Button 
          color="primary" 
          variant="contained" 
          key={i} 
          id={con._id} 
          onClick={this.getConversationId}
        >
          {con.recipientId.name}
        </Button>);
  
    return (
      <div>
        <NavigationBar></NavigationBar>
        <Grid container>
          <Grid item xs={3}>
            <Grid container>
              <Grid item xs={12} className={classes.title}>
                <h3>Inbox Messages</h3>
              </Grid>
              <Grid item xs={12}>
                <Card className={classes.cardStyle}>
                 {converId} 
                  <List className={classes.root} >
                    {/* {this.state.profiles.map((profile, key) =>  */}
                        <ListItem alignItems="flex-start" button onClick={this.createConversation}>
                            <ListItemAvatar temAvatar   >
                              <Avatar
                                alt="Remy Sharp"
                                src={require("../images/07cc6abd390ab904abbf31db5e6ea20357f8b127.png")}
                              />
                            </ListItemAvatar>
                            <ListItemText
                             
                              primary='Name'
                              secondary={
                                <React.Fragment>
                                  I'll be in your neighborhood doing errands this…
                                </React.Fragment>
                              }
                            />
                        </ListItem >
                    {/* )}     */}
                  </List>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={9}>
            <Grid container className={classes.border}>
              <Grid item xs={1}>
                <Avatar
                  alt="Remy Sharp"
                  src={require("../images/07cc6abd390ab904abbf31db5e6ea20357f8b127.png")}
                  className={classes.bigAvatar}
                />
              </Grid>
              <Grid item xs={11}>
                <h3>Name</h3>
              </Grid>
            </Grid>
            <Grid container className={classes.messagesArea}>
              <Grid item xs={12}>
                <div className={classes.sentMessages}>
                {message}
                </div>
              </Grid>
            </Grid>
            <Grid container className={classes.messagingArea}>
              <Grid item xs={12}>
                <TextField
                  id="standard-bare"
                  name="message"
                  value={this.state.message}
                  className={classes.textField}
                  placeholder="Type message here..."
                  margin="normal"
                  inputProps={{ "aria-label": "bare" }}
                  onChange={this.messageChange}
                />
                <Button 
                  variant="contained" 
                  color="secondary" 
                  type="submit"
                  className={classes.button}
                  onClick={this.createMessage}
                >
                  Send
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}
export default withStyles(messagesPageStyle)(MessagesPage);