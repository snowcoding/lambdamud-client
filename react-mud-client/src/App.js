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

        {/* How to send a prop down to component within a route */}
        <Route exact path="/register" component={(props) => <Register {...props}/> } />
        
        
        <Route exact path="/" render={(props) => this.state.userAuthToken ? 
                        // <Redirect to="/adventure" /> : 
                        <Route path="/adventure" component={Adventure} /> : 
                        <Redirect to="/login" /> }/>

        <Route exact path="/login" component={(props) => <Login {...props}/>} />

        <Route path="/adventure" component={() => <Adventure userAuthToken={this.state.userAuthToken}
                                                            uuid={this.state.uuid} 
                                                            name={this.state.name} 
                                                            players={this.state.players}
                                                            title={this.state.title}
                                                            desc={this.state.description}/>} />
        
      </div>
    );
  }
}
// const style = {
//   margin: 15,
// };
export default App;
