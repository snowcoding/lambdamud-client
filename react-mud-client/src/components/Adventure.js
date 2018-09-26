import React, { Component } from 'react';
import axios from 'axios'

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
      command:""
    };
  }

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
        console.log(response);
        
        let data = response.data
        console.log(data)
        
        this.setState({...data})

        this.updateMessageHistory(data.title, data.description)


      })
      .catch(error => {
        console.log("Initialization error");
        console.log(error.response);
      });
  }

  initiateCommand = (command, value) => {
    let authValue = "Token " + localStorage.getItem('mudToken');
    
    let axiosInst = axios.create({
      baseURL: 'https://django-mud.herokuapp.com/api/',
      headers: {"Authorization": authValue},
    });
    
    let url = `adv/${command}/`
    let options = {
      "direction": value
    };

    axiosInst
      .post(url, options)
      .then(response => {
        console.log("Initialization successful");        
        console.log(response);
        
        let data = response.data
        console.log(data)
        
        this.setState({...data})
        
        console.log(data.error_msg)
        
        if (data.error_msg.length !== 0) this.updateMessageHistory("Error Msg", data.error_msg) 
        
        this.updateMessageHistory(data.title, data.description)


      })
      .catch(error => {
        console.log("Initialization error");
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

  // Check the key of the command input
  onCommandKeyPress = (e) => {

    // If the user presses enter
    if (e.charCode === 13) {
      e.preventDefault();
      e.stopPropagation();
      console.log('You clicked enter!!')

      //Grab the message
      let command = e.target.value.split(' ')
      console.log(command)

      //Parse the commands
      if (command.length !== 2){
        this.updateMessageHistory('Error', 'Please enter a valid command')  
      }else if (command[0] === 'move'){
        if (command[1] === 'n' || command[1] === 's' || command[1] === 'e' || command[1] === 'w'){
          
          this.initiateCommand(command[0], command[1])
        }
        else {
          this.updateMessageHistory('Error', 'Please enter a valid command')
        }
      }else if (command[0] === 'say'){
        this.updateMessageHistory('Say', 'You said say')
      }else {
        this.updateMessageHistory('Error', 'Please enter a valid command')
      }

      //Update the MessageHistory
      // this.updateMessageHistory('this just in', e.target.value)
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
          <p>WELCOME TO THE ADVENTURE!!! <button onClick={this.onLogout}>Logout</button></p>
        </div>

        <textarea rows="10" id="messageHistory" readOnly value={this.state.message}/>
        {/* <textarea id="messageHistory" defaultValue={this.state.message}/> */}
        <div>
          <input type="text" id="command" onChange={this.captureCommand} onKeyPress={this.onCommandKeyPress}/>
          <button>Send</button>
        </div>
      </div>
    );
  }
}

export default Adventure;