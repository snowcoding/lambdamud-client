import React, { Component } from 'react';
import axios from 'axios'

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password1:"",
      password2:""
    };
  }
  
  onRegister = () => {
    let apiBaseUrl = "https://django-mud.herokuapp.com/api/";
    let payload = {
      "username": this.state.username,
      "password1": this.state.password1,
      "password2": this.state.password2
    }

    axios.post(apiBaseUrl + "registration/", payload)
    .then( (response) => {
      
      console.log(response);
      
      if (response.status === 201) {
        console.log("Register successful");
        
        //Store the Token
        localStorage.setItem("mudToken", response.data.key);

        //Redirect to Adventure Game

        console.log('History push to adventure')
        this.props.history.push("/adventure");

      }
    })
    .catch((error) => {
      console.log(error.response);
    });
  }

  onFieldChange = (e) =>{
    if (e.target.id === 'username'){
      this.setState({username : e.target.value})
    }else if (e.target.id === 'password1'){
      this.setState({password1:e.target.value})
    }else if (e.target.id === 'password2'){
      this.setState({password2:e.target.value})
    }
  }

  render() {
    return (
      <div>
        <p>
          <label htmlFor="username" className="username">Username:</label>
          <input id='username' type="text" className="username" onChange={this.onFieldChange}/>          
        </p>
        <p>
          <label htmlFor="password1" className="password1">Password:</label>
          <input id='password1' type="password" className="password1" onChange={this.onFieldChange}/>
        </p>
        <p>
          <label htmlFor="password2" className="password2">Password (Retype):</label>
          <input id='password2' type="password" className="password2" onChange={this.onFieldChange}/>
        </p>
        <button onClick = {this.onRegister}>Register</button>
      </div>
    );
  }
}

export default Register