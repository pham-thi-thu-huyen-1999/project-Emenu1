import React, { Component } from "react";
export default class ComboItem extends Component {
  state = {

  };

  render() {
    const { t, selected, innerClass } = this.props;
    const { ...rest } = this.props;

    return (
      <div
        className={selected === true ? `combo-item combo-item--selected e-m-left-10 e-m-right-10 ${innerClass}` : `combo-item ${innerClass}`}
        onClick={this.props.onClickComboItem}>
        <div className="combo-item__icon">
          {
            selected === true ?
              (
                <img className="fork-image" src={require("./../../../images/res_fork_orange.png")} alt="" />
              )
              :
              (
                <img className="fork-image" src={require("./../../../images/res_fork.png")} alt="" />
              )
          }
        </div>
        <div className="combo-item__text">
          {this.props.name}
        </div>
      </div>
    );
  }
}
