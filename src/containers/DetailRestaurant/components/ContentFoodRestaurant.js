import React, { Component } from "react";
import { Button, Dialog } from "../../../components/common";
import image from "../img/PorkLoin.jpg";
import GP from "../img/google-play.png";
import AS from "../img/apple-store.png";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default class ContentFoodRestaurant extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { tabMenuFood, t } = this.props;
    return (
      <>
        {tabMenuFood.map((item, index) => (
          <div key={index}>
            <span>{item.name}</span>
          </div>
        )
        )}
      </>
    )
  }
}

