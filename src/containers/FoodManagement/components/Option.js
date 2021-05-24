import React, { Component } from "react";
import { RadioList } from "./../../../components/common";

export default class Option extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 0,
    };
  }
  onChange = selected => {
    this.props.search(selected);
    this.setState({
      selected
    })
  }
  render() {
    const { selected } = this.state;
    const { t } = this.props;
    var groupType = [
      {
        key: 0,
        text: t("dishManagament.all"),
      },
      {
        key: 1,
        text: t("dishManagament.food"),
      },
      {
        key: 2,
        text: t("dishManagament.drink"),
      },
      {
        key: 3,
        text: t("dishManagament.other"),
      }];
    return (
      <div className="content-radio-lst e-flex">
        <div className="text-type e-flex content-start item-center">
          {t("dishManagament.kind")}</div>
        <div className="list-catogory-radio">
          <RadioList
            name="category"
            dataSource={groupType}
            onChange={selected => this.onChange(selected)}
            selected={selected}
          />
        </div>
        <div />
      </div>
    );
  }
}
