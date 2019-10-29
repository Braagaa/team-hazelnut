import React, { Component } from "react";
import axios from "axios";
import openSocket from "socket.io-client";

import "../App.scss";
import NavigationBar from "./Navbar";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import Card from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddBoxIcon from "@material-ui/icons/AddBox";
import IconButton from "@material-ui/core/IconButton";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

const messagesPageStyle = theme => ({
  list: {
    maxHeight: "81vh",
    overflow: "auto"
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
    borderTop: "0.5px solid #e6e6e6",
    borderBottom: "0.5px solid #e6e6e6",
    textAlign: "center"
  },
  addIcon: {
    height: "100%",
    verticalAlign: "middle"
  },
  border: {
    border: "0.5px solid #e6e6e6",
    borderRight: "0px"
  },

  messagesArea: {
    height: "70vh",
    overflow: "auto",
  },

  messagingArea: {
    border: "1px solid #e6e6e6"
  },

  textField: {
    width: "100%",
    paddingLeft: "10px"
  },

  input1: {
    height: "8vh"
  },

  buttonContainer: {
    height: "100%"
  },

  sendButton: {
    margin: theme.spacing(1),
    top: "30%",
    backgroundColor: "#f04040"
  },

  sentMessages: {
    textAlign: "right",
    paddingRight: "10px"
  },
  sentMessageLength: {
    padding: "6px"
  },

  test: {
    backgroundColor: "white",
    boxShadow: "0px 0px 4px 0px lightgrey",
    borderRadius: "10px",
    padding: "12px"
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  paper: {
    maxHeight: "75vh",
    overflow: "auto",
    backgroundColor: theme.palette.background.paper,
    border: "none",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
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
      open: false,
      token: localStorage.getItem("jwtToken"),
    };
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }

  // Handle message change
  messageChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  componentDidMount() {
    this.socket = openSocket("http://localhost:3001");
    this.socket.on("message", msg => {
      this.setState({ messages: [...this.state.messages, msg] });
    });
    this.getConversations();
  }

  // GET a list of conversations and recipient profiles
  getConversations() {
    axios.get('/conversation/list/', { headers: { Authorization: `Bearer ${this.state.token}` }})
      .then(res => {
        this.setState({
          conversations: res.data    // Get all conversation
        });
      })
      .catch(err => {
        console.log("Error fetching and parsing data", err);
      }); 
  };


  // Get a conversation Id to start sending messages
  getConversationId = e => {
    this.setState({ conversationId: e.target.id });
    axios.get(`/conversation/${this.state.conversationId}`, { headers: { Authorization: `Bearer ${this.state.token}` }} )
      .then(res => {
        res.data.map(item => this.setState({ messages: [...this.state.messages, item.body] }))
      })
      .catch(err => {
        console.log(err);
      }); 
  };


  // Create a new message
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
    const message = this.state.messages.map((message, i) => (
      <p key={i} className={classes.sentMessageLength}>
        <span className={classes.test}>{message}</span>
      </p>
    )); 

    console.log(this.state.conversationId);

    return (
      <div>
        <NavigationBar></NavigationBar>
        <Grid container>
          <Grid item xs={3}>
            <Grid container>
              <Grid item xs={11} className={classes.title}>
                <h3>Inbox Messages</h3>
              </Grid>
              <Grid item xs={1} className={classes.title}>
                <IconButton size="small" className={classes.addIcon}>
                  <AddBoxIcon onClick={this.handleOpen} />
                </IconButton>
                <Modal
                  aria-labelledby="transition-modal-title"
                  aria-describedby="transition-modal-description"
                  className={classes.modal}
                  open={this.state.open}
                  onClose={this.handleClose}
                  closeAfterTransition
                  BackdropComponent={Backdrop}
                  BackdropProps={{
                    timeout: 500
                  }}
                >
                  <Fade in={this.state.open}>
                    <div className={classes.paper}>
                      <h2 id="transition-modal-title">Dog Sitters</h2>
                      <p id="transition-modal-description">
                        react-transition-group animates me.
                      </p>
                    </div>
                  </Fade>
                </Modal>
              </Grid>
              <Grid item xs={12}>
                <Card className={classes.cardStyle}>
                  <List className={classes.list}>

                    {this.state.conversations.map(item => (
                      <ListItem alignItems="flex-start" button key={item._id} id={item._id} onClick={this.getConversationId}>
                      <ListItemAvatar>
                        <Avatar
                          alt="Remy Sharp"
                          src={item.recipient_info[0].photoUrl}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={<Typography type="body2">{item.recipient_info[0].firstName} {item.recipient_info[0].lastName}</Typography>}
                        // secondary={
                        //   <React.Fragment>
                        //     I'll be in your neighborhood doing errands this…
                        //   </React.Fragment>
                        // }
                      />
                      <Divider />
                    </ListItem>
                    ))}
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
                <h3>NAME</h3>
              </Grid>
            </Grid>
            <Grid container className={classes.messagesArea}>
              <Grid item xs={12}>
                <div className={classes.sentMessages}>{message}</div>
              </Grid>
            </Grid>

            <Grid container className={classes.messagingArea}>
              <Grid item xs={8}>
                <TextField
                  id="standard-bare"
                  name="message"
                  className={classes.textField}
                  placeholder="Reply to Mc Barkly"
                  margin="normal"
                  value={this.state.message}
                  onChange={this.messageChange}
                  inputProps={{
                    "aria-label": "bare",
                    className: classes.input1
                  }}
                />
              </Grid>
              <Grid item xs={1}></Grid>

              <Grid item xs={2}>
                <div className={classes.buttonContainer}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                    className={classes.sendButton}
                    onClick={this.createMessage}
                  >
                    Send
                  </Button>
                </div>
                <Grid item xs={1}></Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(messagesPageStyle)(MessagesPage);
