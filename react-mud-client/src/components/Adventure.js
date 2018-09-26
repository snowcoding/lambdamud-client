import React, { Component } from 'react';

class Adventure extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        WELCOME TO THE ADVENTURE!!!
        <p>UUID: {this.props.uuid}</p>
        <p>Name: {this.props.name}</p>
        <p>Title: {this.props.title}</p>
        <p>Description: {this.props.desc}</p>
      </div>
    );
  }
}

export default Adventure;