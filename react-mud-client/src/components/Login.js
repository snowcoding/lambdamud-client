import React, { Component } from 'react';
import axios from 'axios';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password:""
    };
  }

  // componentDidMount(){
  //   console.log(this.props.history.push(''))
  // }

  
  onLogin = () => {
    let apiBaseUrl = "https://django-mud.herokuapp.com/api/login/";
    let payload = {
      "username": this.state.username,
      "password": this.state.password
    }

    axios.post(apiBaseUrl, payload)
      .then( (response) => {
        
        console.log(response);
        
        if (response.status === 200) {
          console.log("Login successful");

          //Store the Token
          localStorage.setItem('mudToken', response.data.key)
          
          //Redirect to Adventure Game
          this.props.history.push('/adventure')
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  onFieldChange = (e) =>{
    if (e.target.id === 'username'){
      this.setState({username : e.target.value})
    }else if (e.target.id === 'password'){
      this.setState({password:e.target.value})
    }
  }

  onRegister = () => {
    this.props.history.push('/register')
  }

  render() {
    return (
      <div>
        <p>
          <label htmlFor="username" className="username">Username:</label>
          <input id='username' type="text" className="username" onChange={this.onFieldChange}/>          
        </p>
        <p>
          <label htmlFor="password" className="password">Password:</label>
          <input id='password' type="password" className="password" onChange={this.onFieldChange}/>
        </p>
        <button onClick = {this.onLogin}>Login</button>
        <p>Don't have an account?</p>
        <button onClick={this.onRegister}>Register Here </button>
      </div>
    );
  }

}

export default Login