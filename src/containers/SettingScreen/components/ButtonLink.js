import React, { Component } from "react";
// import PropTypes from "prop-types";
import { withNamespaces } from "react-i18next";

import { NavLink } from "react-router-dom";
import ButtonBase from "../../../components/common/ButtonBase";

class CustomLink extends ButtonBase {
  render() {
    const { className, path } = this.props;
    const { classAnimation } = this.state;

    const classCss = className || "";
    return (
        <NavLink
            to={path}
            exact
            activeClassName="active"
            className={`${classCss} ${classAnimation}`}
            onClick={this.handleEvent}
            ref={ref => this.elementRef = ref}
        >
            {this.props.children}
        </NavLink>
    )
  }
}

class ButtonLink extends Component {
  render() {
    const dataLink = this.props.data;
    const { t } = this.props;
    return (
      <ul className="list-item">
        {dataLink.map((item, index) => {
          if (item.show === true) {
            return (
              <li key={index} className="item">
                <CustomLink path={item.url} className="item-inner">
                  <span className="ico">
                    <img
                      src={item.iconNoActive}
                      alt=""
                      className="img-inactive"
                    />
                    <img
                      src={item.iconActive}
                      alt=""
                      className="img-active"
                      style={{ display: "none" }}
                    />
                  </span>
                  <span className="txt">{t(item.name)}</span>
                </CustomLink>
              </li>
            );
          } else {
            return null
          }
        })}
      </ul>
    );
  }
}

export default withNamespaces()(ButtonLink);