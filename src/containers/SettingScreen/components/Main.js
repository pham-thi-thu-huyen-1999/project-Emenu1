import React, { Component } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faGlobeAmericas, faGift } from "@fortawesome/free-solid-svg-icons";
import MenuSetting from "./MenuSetting"

import './Setting.css';
export default class Main extends Component {
  render() {
    const { ...rest } = this.props
    return (
      <main id="site-main" className="nofooter">
        <div id="primary" className="no-footer p-management clear">
          <section id="main-cont" className="full clear ">
            <MenuSetting { ...rest }/>
          </section>
        </div>
      </main>
    )
  }
}
