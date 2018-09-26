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
      players: []
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

      })
      .catch(error => {
        console.log("Initialization error");
        console.log(error.response);
      });
  }

  render() {
    return (
      <div>
        WELCOME TO THE ADVENTURE!!!
        <p>UUID: {this.state.uuid}</p>
        <p>Name: {this.state.name}</p>
        <p>Title: {this.state.title}</p>
        <p>Description: {this.state.description}</p>
      </div>
    );
  }
}

export default Adventure;