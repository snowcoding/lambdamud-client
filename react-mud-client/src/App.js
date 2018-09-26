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
        <Route exact path="/register" component={(props) => <Register initPlayer={this.initPlayer} {...props}/> } />
        
        
        <Route exact path="/" render={(props) => this.state.userAuthToken ? 
                        // <Redirect to="/adventure" /> : 
                        <Route path="/adventure" component={Adventure} /> : 
                        <Redirect to="/login" /> }/>

        <Route exact path="/login" component={(props) => <Login initPlayer={this.initPlayer} {...props}/>} />
        
        <Route path="/adventure" component={() => <Adventure uuid={this.state.uuid} 
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
