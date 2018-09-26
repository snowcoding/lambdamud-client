import React, { Component } from "react";
import "./App.css";
import { Route, Redirect } from "react-router-dom";
import Login from "./components/Login";
import Adventure from "./components/Adventure";
import Register from "./components/Register"

class App extends Component {

  getUserAuthToken = () => {
    return localStorage.getItem('mudToken')
  }

  render() {
    return (
      <div className="App">
        {/* Send a prop down to component within a route */}
        <Route exact path="/register" component={(props) => <Register {...props}/> } />
        
        
        <Route exact path="/" render={(props) => this.getUserAuthToken() ? 
                        <Route path="/adventure" component={Adventure} /> : 
                        <Redirect to="/login" /> }/>

        <Route exact path="/login" component={(props) => <Login {...props}/>} />

        <Route path="/adventure" render={(props) => this.getUserAuthToken() ? 
                            <Adventure /> :
                            <Redirect to="/login" /> }/>
        
      </div>
    );
  }
}
// const style = {
//   margin: 15,
// };
export default App;
