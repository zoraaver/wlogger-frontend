import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./components/App";
import { BrowserRouter as Router } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

document.getElementById("root")!.style.height = "100%";
document.getElementById("root")!.style.width = "100%";

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);
