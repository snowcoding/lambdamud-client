import React, { Component } from "react";
import "./App.css";
import { Route, Redirect } from "react-router-dom";
import Login from "./components/Login";
import Adventure from "./components/Adventure";
import Register from "./components/Register"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userAuthToken: ""
    };
  }
  componentWillMount() {

    if (localStorage.getItem("mudToken")) {
      this.setState({ userAuthToken: localStorage.getItem("mudToken") });
    }
  }

  render() {
    return (
      <div className="App">
        <Route exact path="/register" component={Register} />
        <Route exact path="/" render={(props) => this.state.userAuthToken ? 
                        <Redirect to="/adventure" /> : 
                        <Redirect to="/login" /> }/>

        <Route exact path="/login" component={Login} />  
        <Route exact path="/adventure" component={Adventure} />
        
      </div>
    );
  }
}
// const style = {
//   margin: 15,
// };
export default App;
