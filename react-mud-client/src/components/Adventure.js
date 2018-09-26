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
    if (e.charCode == 13) {
      e.preventDefault();
      e.stopPropagation();
      console.log('You clicked enter!!')

      this.updateMessageHistory('this just in', e.target.value)
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

  render() {
    return (
      <div>
        <p>WELCOME TO THE ADVENTURE!!!</p>

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