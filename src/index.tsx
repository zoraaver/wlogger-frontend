import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./components/App";
import { BrowserRouter as Router } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const root: HTMLDivElement = document.getElementById("root") as HTMLDivElement;
root.style.height = "100%";
root.style.width = "100%";

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);
