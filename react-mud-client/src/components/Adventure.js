import React, { Component } from 'react';
import axios from 'axios';
import Pusher from 'pusher-js';
import Outside from '../img/OutsideCave_500_281.jpg';
import Foyer from '../img/Foyer_500_281.png';
import Grand from '../img/GrandOverlook_500_281.jpg';
import Narrow from '../img/NarrowPassage_500_281.jpg';
import Treasure from '../img/TreasureChamber_500_281.jpg';
import styled from 'styled-components';
import { Container, Row, Col, Button } from 'reactstrap';

const imgLookUp = {
  'Outside': Outside,
  'Foyer' : Foyer,
  'Grand' : Grand,
  'Narrow' : Narrow,
  'Treasure': Treasure
}

const MessageHist = styled.textarea`
  background-color: black;
  color:white;
  width:100%;
  height:100%;
  
`

const RoomImg = styled.textarea`
  background-image: url(${props => props.bgImg});
  background-repeat:no-repeat;
  background-size: 100%;
  width:100%;
`
const Logout = styled.i`
  color: white;
`

const WelcomeUser = styled.div`
  color:white;
`

const TitleRow = styled(Row)`
  margin-top:20px;
  margin-bottom:20px;
`

const MudContentRow = styled(Row)`
  margin-top:20px;
`

const CmdPrompt = styled.input`
  background-color:black;
  color:white;
  caret-color:white;
  width:100%;
  
`

const NearbyPlayers = styled.textarea`
  background-color: black;
  color:white;
  width:100%;
  height:100%;
`

const CardTitle = styled.div`
  color: #565356;
  margin-top: ${(props) => props.mt ? "10px" : "0px"};
`

const CommandRow = styled(Row)`
  margin-top:20px;
`

const PlayerName = styled.span`
  color:red;
`
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
      pusher:new Pusher('46fd5ac6d676122e963b', {cluster: 'us2',}),
      currentBG:"",
      nearPlyrs:""
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
        
        let imgKey = data.title.split(' ')[0]
        
        //Spread data and shorthand for set state:
        // this.setState({...data})
        this.setState({...data}, ()=> {
          this.setState({currentBG:imgLookUp[imgKey]})
        })

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

  componentWillUnmount(){
    this.state.pusher.disconnect();
  }


  /**
   * Initiate Commands to the server
   * @command = {move, say}
   * @value = {values associated with move/say}
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
        
        let imgKey = data.title.split(' ')[0]
        console.log(imgKey)
        console.log(imgLookUp[imgKey])

        //Spread data and shorthand for set state:
        // this.setState({...data})
        this.setState({...data}, ()=> {
          this.setState({currentBG:imgLookUp[imgKey]})
        })

        // if (data.players.length > 0) this.updateMessageHistory("Players in Room:", data.players.join(','))
        if (data.players.length > 0) this.updateNearbyPlayers(data.players)
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

  //Update the nearby player list with any incoming messages
  updateNearbyPlayers = (players) => {
    this.setState({
      nearPlyrs: players.join('\n')
    }, ()=> {
      let nearbyPlayers = document.getElementById('nearbyPlayers')
      nearbyPlayers.scrollTop = nearbyPlayers.scrollHeight
    })
  }

  onLogout = () => {
    localStorage.removeItem('mudToken')
    this.props.history.push("/login")
  }

  render() {
    return (
      <Container>
      {/* <TitleRow>
        <Col xs="4"></Col>
        <Col xs="4"><WelcomeUser>{`welcome ${this.state.name} !`}</WelcomeUser></Col>
        <Col xs="4"><i className="fas fa-sign-out-alt" style={{color:"white"}} onClick={this.onLogout}></i></Col>
      </TitleRow> */}

      <MudContentRow>
        <Col xs="6">
          <CardTitle><PlayerName>{this.state.name}'s</PlayerName> Message History</CardTitle>
          <div><MessageHist rows="10" id="messageHistory" readOnly value={this.state.message} /></div>
        </Col>
        <Col xs="6">
          <CardTitle>The View</CardTitle>
          <div><RoomImg bgImg={this.state.currentBG}/></div>
          <CardTitle mt={true}>Nearby Players</CardTitle>
          <div><NearbyPlayers id="nearbyPlayers" readOnly value={this.state.nearPlyrs}/></div>
        </Col>
      </MudContentRow>
      <CommandRow>
        <Col xs="3"><CardTitle>Enter your command</CardTitle></Col>
        <Col xs="5">
          <CmdPrompt type="text" id="command" onChange={this.captureCommand} onKeyPress={this.onCommandKeyPress}/>
        </Col>
        <Col xs="4">
          <i className="fas fa-sign-out-alt" style={{color:"white"}} onClick={this.onLogout}></i>
        </Col>
      </CommandRow>
    </Container>

    );
  }
}

export default Adventure;