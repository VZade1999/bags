import React, { Component } from "react";
import ReactRain from "react-rain-animation";
import Knob from "react-canvas-knob";
import "react-rain-animation/lib/style.css";
import "./wheater.css";

const initVal = 99;

class MyComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      numDrops: initVal,
      knobValue: initVal,
    };
  }

  handleChange = (newValue) => {
    this.setState({ knobValue: newValue });
  };

  onChangeEnd = () => {
    console.log(this.state.numDrops);
    this.setState({ numDrops: this.state.knobValue });
  };

  render() {
    return (
      <div>
        <ReactRain numDrops={this.state.numDrops} />


      </div>
    );
  }
}

export default MyComponent;
