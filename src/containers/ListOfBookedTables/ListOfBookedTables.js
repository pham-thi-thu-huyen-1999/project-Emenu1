import React, { Component } from "react";
import { Header } from "../../components";
import "./styles.css"

import bgEmenu from "../../images/bg-emenu.png";
import { Main } from "./components";

export default class ListOfBookedTables extends Component {
  render() {
    return (
      <div
        id="page-wrapper"
        className="use-bg"
        data-bg="images/body-bg.jpg"
        style={{ backgroundImage: `url(${bgEmenu})` }}
      >
        <Header />
        <Main />
      </div>
    );
  }
}
