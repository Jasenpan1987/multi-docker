import React, { Component } from "react";
import axios from "axios";

class Fib extends Component {
  state = {
    seenIndexes: [],
    values: {},
    index: "",
  };

  componentDidMount() {
    this.fetchValue();
    this.fetchIndexes();
  }

  async fetchValue() {
    const result = await axios.get("/api/values/current");
    this.setState({
      values: result.data,
    });
  }

  async fetchIndexes() {
    const result = await axios.get("/api/values/all");
    this.setState({
      seenIndexes: result.data,
    });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("/api/values", {
      index: this.state.index,
    });
    this.setState({
      index: "",
    });
  };

  renderSeenIndexes() {
    return this.state.seenIndexes.map(({ number }) => number).join(", ");
  }

  renderCalculatedValues() {
    const entries = [];
    for (let key in this.state.values) {
      entries.push(
        <div key={key}>
          For index {key}, the value is {this.state.values[key]}
        </div>
      );
    }

    return entries;
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Enter your index</label>
          <input
            value={this.state.index}
            onChange={(e) =>
              this.setState({
                index: e.target.value,
              })
            }
          />
          <button type="submit">Submit</button>
        </form>

        <h3>Indexes I have seen</h3>
        {this.renderSeenIndexes()}
        <h3>Calculated values</h3>
        {this.renderCalculatedValues()}
      </div>
    );
  }
}

export default Fib;
