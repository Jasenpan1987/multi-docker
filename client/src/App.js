import React from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import OtherPage from "./OtherPage";
import Fib from "./Fib";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h2>Fib calculator1</h2>
          <Link to="/" className="App-link">
            Home
          </Link>
          <Link to="/otherpage" className="App-link">
            Other page
          </Link>
        </header>
        <Route exact path="/" component={Fib} />
        <Route exact path="/otherpage" component={OtherPage} />
      </div>
    </Router>
  );
}

export default App;
