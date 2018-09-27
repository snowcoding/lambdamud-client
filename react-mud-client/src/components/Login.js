import React, { Component } from "react";
import axios from "axios";
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
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  onLogin = () => {
    let apiBaseUrl = "https://django-mud.herokuapp.com/api/login/";
    let payload = {
      username: this.state.username,
      password: this.state.password
    };

    axios
      .post(apiBaseUrl, payload)
      .then(response => {
        console.log(response);

        if (response.status === 200) {
          console.log("Login successful");

          //Store the Token
          localStorage.setItem("mudToken", response.data.key);
          // this.props.updateAuthToken(response.data.key)
          //Redirect to Adventure Game

          console.log('History push to adventure')
          this.props.history.push("/adventure");

        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  onFieldChange = e => {
    if (e.target.id === "username") {
      this.setState({ username: e.target.value });
    } else if (e.target.id === "password") {
      this.setState({ password: e.target.value });
    }
  };

  onRegister = () => {
    this.props.history.push("/register");
  };

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
        <LoginRow>
          <Col xs="7"></Col>
          <Col xs="2"><Button onClick={this.onLogin}>Login</Button></Col>
          <Col xs="3"></Col>
        </LoginRow>
        <Row>
          <Col xs="4"></Col>
          <Col xs="2"><Label htmlFor="register">Don't have an account?</Label></Col>
          <Col xs="6">
            <Button id="register" onClick={this.onRegister}>Register Here </Button>
          </Col>
        </Row>
        
      </Container>
    );
  }
}

export default Login;
