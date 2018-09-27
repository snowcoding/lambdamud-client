import React, { Component } from 'react';
import axios from 'axios'
import styled from 'styled-components';
import { Container, Row, Col, Button } from 'reactstrap';

const Label = styled.label`
  color:#565356;
  text-align:right;
`

const LoginRow = styled(Row)`
  margin-top:20px;
  margin-bottom:40px;
`
const UsernameRow = styled(Row)`
  margin-top:20px;
`

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
      <Container>
      <UsernameRow>
        <Col xs="5"></Col>
        <Col xs="1">
          <Label htmlFor="username" className="username">Username:</Label>
        </Col>
        <Col xs="6">
          <input id="username" type="text" className="username" onChange={this.onFieldChange}/>
        </Col>
      </UsernameRow>
      <Row>
        <Col xs="5"></Col>
        <Col xs="1">
        <Label htmlFor="password" className="password">Password:</Label>
        </Col>
        <Col xs="6">
        <input id="password" type="password" className="password" onChange={this.onFieldChange}/>
        </Col>
      </Row>
      <Row>
        <Col xs="5"></Col>
        <Col xs="1">
          <Label htmlFor="password2" className="password2">Password (Retype):</Label>
        </Col>
        <Col xs="6">
          <input id='password2' type="password" className="password2" onChange={this.onFieldChange}/>
        </Col>
      </Row>
      <LoginRow>
        <Col xs="7"></Col>
        <Col xs="2"><Button onClick = {this.onRegister}>Register</Button></Col>
        <Col xs="3"></Col>
      </LoginRow>      
    </Container>

      // <div>
      //   <p>
      //     <label htmlFor="username" className="username">Username:</label>
      //     <input id='username' type="text" className="username" onChange={this.onFieldChange}/>          
      //   </p>
      //   <p>
      //     <label htmlFor="password1" className="password1">Password:</label>
      //     <input id='password1' type="password" className="password1" onChange={this.onFieldChange}/>
      //   </p>
      //   <p>
      //     <label htmlFor="password2" className="password2">Password (Retype):</label>
      //     <input id='password2' type="password" className="password2" onChange={this.onFieldChange}/>
      //   </p>
      //   <button onClick = {this.onRegister}>Register</button>
      // </div>
    );
  }
}

export default Register