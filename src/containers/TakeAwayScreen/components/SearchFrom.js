import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import { Input, Button } from "../../../components/common";
class SearchFrom extends Component {
  searching = () => {
    this.props.onClick();
  };
  render() {
    const { placeholder, valSearch } = this.props;
    return (
      <div className="search-form">
        <Input
          style={{
            width: 350,
            height: 60,
          }}
          placeholder={placeholder}
          className="e-m-top-10 e-m-right-10 e-m-bottom-10"
          onChange={(e) => {
            this.props.dishSearch(e.target.value);
          }}
          defaultValue={valSearch}
        />
        <Button main type="s2" onClick={this.searching}>
          Tìm kiếm{" "}
          <FontAwesomeIcon
            icon={faSearch}
            style={{
              fontSize: 20,
              verticalAlign: "middle",
            }}
          />
        </Button>
      </div>
    );
  }
}

export default SearchFrom;
