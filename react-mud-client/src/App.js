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
      userAuthToken: "",
      uuid:"",
      name:"",
      title:"",
      description:"",
      players: []
    };
  }

  componentWillMount() {
    if (localStorage.getItem("mudToken")) {
      this.setState({ userAuthToken: localStorage.getItem("mudToken") });
    }
  }

  initPlayer = (init) => {
    this.setState({
      uuid:init.uuid,
      name:init.name,
      players:init.players,
      title:init.title,
      description:init.description
    })
  }

  render() {
    return (
      <div className="App">

        {/* How to send a prop down to component within a route */}
        <Route exact path="/register" component={() => <Register initPlayer={this.initPlayer} /> } />
        
        
        <Route exact path="/" render={(props) => this.state.userAuthToken ? 
                        // <Redirect to="/adventure" /> : 
                        <Route path="/adventure" component={Adventure} /> : 
                        <Redirect to="/login" /> }/>

        <Route exact path="/login" component={Login} />
        <Route path="/adventure" component={Adventure} />
        
      </div>
    );
  }
}
// const style = {
//   margin: 15,
// };
export default App;
