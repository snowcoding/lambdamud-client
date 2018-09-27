import React, { Component } from 'react';
import axios from 'axios';
import Pusher from 'pusher-js';

/**
 * Adventure class hold state for all variable that are sent back from server
 * message hold the message history
 * pusher hold an instance of the Pusher library 
 */
class Adventure extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uuid:"",
      name:"",
      title:"",
      description:"",
      players: [],
      message:"",
      // command:"",
      pusher:new Pusher('46fd5ac6d676122e963b', {cluster: 'us2',})
    };
  }


  /**
   * Initialize the player making a call to .../api/adv/init
   * Subscribe to pusher channel
   * Bind to certain messages
   */
  componentDidMount(){
    let apiBaseUrl = "https://django-mud.herokuapp.com/api/";
    let authValue = "Token " + localStorage.getItem('mudToken');
    let headerWithUserToken = {
      headers: { Authorization: authValue }
    };
    axios
      .get(apiBaseUrl + "adv/init/", headerWithUserToken)
      .then(response => {
        console.log("Initialization successful");        
        console.log("Init response:", response);
        
        let data = response.data
        console.log("Init response data", data)
        
        //Spread data and shorthand for set state:
        this.setState({...data})

        //Push the initialization messages to the message history
        this.updateMessageHistory(data.title, data.description)

        //Create the subsription for pusher
        const sub = "p-channel-"+data.uuid

        //Create the channel given a subscription
        const channel = this.state.pusher.subscribe(sub);
        console.log('Channel Subscribe',channel)
        
        //Bind the channel to the event, in this case it's broadcast:
        channel.bind('broadcast', data => {
          console.log("pusher message:", data.message)
          this.updateMessageHistory('Pusher msg:', data.message)
        });

      })
      .catch(error => {
        console.log("Initialization error");
        console.log(error.response);
      });
    
  }



  /**
   * Initiate Commands to the server
   * This general purpose function will allow to both move and say
   * the value will be whatever goes with move and say
   */
  initiateCommand = (command, value) => {
    
    //Create the auth value for axios
    let authValue = "Token " + localStorage.getItem('mudToken');
    
    // Create an axios instance 
    let axiosInst = axios.create({
      baseURL: 'https://django-mud.herokuapp.com/api/',
      headers: {"Authorization": authValue},
    });
    
    // Specify the url
    let url = `adv/${command}/`

    //Specify the options right now if it's not move it assumes it's say!
    let options = command === 'move' ? {"direction": value} : {"say-message":value}

    //Axios call
    axiosInst
      .post(url, options)
      .then(response => {
        
        console.log("Command Initiation successful");        
        console.log(response);
        
        let data = response.data
        console.log(data)
        
        //Spread data and shorthand for set state:
        this.setState({...data})

        if (data.players.length > 0) this.updateMessageHistory("Players in Room:", data.players.join(','))
        if (data.error_msg.length !== 0) this.updateMessageHistory("Error Msg:", data.error_msg) 
        
        this.updateMessageHistory(data.title, data.description)

      })
      .catch(error => {
        console.log("Command Initiation error");
        console.log(error.response);
      });
  }

  // Grab the command text
  captureCommand = (e) => {
    if (e.target.id === 'command'){
      console.log(e.target.value)
      
      // If it's coming from the command then update the command state
      this.setState({command:e.target.value})
    }
  }



  /**
   * Check for the enter key in the command input
   * When enter is pressed, parse the input field 
   * Prase, move and say commands and return errors for all others
   */
  onCommandKeyPress = (e) => {

    // If the user presses enter
    if (e.charCode === 13) {
      e.preventDefault();
      e.stopPropagation();
      console.log('You clicked enter!!')

      //Grab the message
      let command = e.target.value.split(' ')
      console.log(command)

      // If the command is less than two words = error
      if (command.length < 2) this.updateMessageHistory('Error', 'Please enter a valid command')
      
      // If it's equal to 2...
      else if (command.length === 2 ){
        
        // if it's move with the right second value...initiate!
        if (command[0] === 'move'){
          if (command[1] === 'n' || command[1] === 's' || command[1] === 'e' || command[1] === 'w'){
            this.initiateCommand(command[0], command[1])
          }

        // else if it's say initiate!
        }else if (command[0] === 'say'){
          this.initiateCommand(command[0], command[1])
        }else this.updateMessageHistory('Error', 'Please enter a valid command')
      
      // if it's greater than 2
      }else {

        // Error out on move
        if (command[0] === 'move') this.updateMessageHistory('Error', 'Please enter a valid command')
        
        //If it's say...
        else if (command[0] === 'say'){
          //Pick off the first value in array as say...
          let comm = command[0]

          //Place the rest as values in the array as the value (message):
          command.splice(0,1)
          let value = command.join(' ')

          //Initiate the command to the server
          this.initiateCommand(comm, value)
        }
      }

      //Clear the command field
      e.target.value = ''

    }
  }

  //Update the message state with any incoming messages
  updateMessageHistory = (title, description) => {
    this.setState({
      message: `${this.state.message} \n ${title} \n ${description} \n`
    }, ()=> {
      let messageHistory = document.getElementById('messageHistory')
      messageHistory.scrollTop = messageHistory.scrollHeight
    })
  }

  onLogout = () => {
    localStorage.removeItem('mudToken')
    this.props.history.push("/login")
  }

  render() {
    return (
      <div>
        <div>
          <p>{`WELCOME ${this.state.name} TO THE ADVENTURE!!!`} <button onClick={this.onLogout}>Logout</button></p>
        </div>
        <textarea rows="10" id="messageHistory" readOnly value={this.state.message}/>
        <div>
          <input type="text" id="command" onChange={this.captureCommand} onKeyPress={this.onCommandKeyPress}/>
          <button>Send</button>
        </div>
      </div>
    );
  }
}

export default Adventure;