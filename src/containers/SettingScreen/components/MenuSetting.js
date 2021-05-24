import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { SettingGenerals } from "./General";
import { SettingLanguages } from "./Languages";
import { SettingTables } from "./Tables";
import { SettingTax } from "./Tax";
import { SettingPrint } from "./Print";
import ButtonLink from "./ButtonLink";
import { TEMP_CONTRACT } from "../../../consts/settings/partnerContract";
import moment from "moment";
class MenuSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      JSON.stringify(prevState.userInfo) !== JSON.stringify(nextProps.userInfo)
    ) {
      return {
        userInfo: nextProps.userInfo,
      };
    } else return null;
  }
  isTempContract = () => {
    const userInfo = this.state.userInfo;
    return (
      userInfo &&
      (userInfo.contract_type_id === TEMP_CONTRACT ||
        moment.utc(new Date()).isAfter(new Date(userInfo.contract_end_time)))
    );
  };

  render() {
    let show = !this.isTempContract();
    const dataLink = [
      {
        name: "language",
        iconNoActive: require("../../../../src/images/setting-lang.png"),
        iconActive: require("../../../../src/images/setting-lang2.png"),
        url: "/setting/language-management",
        show: show,
      },
      {
        name: "general",
        iconNoActive: require("../../../../src/images/setting-mon.png"),
        iconActive: require("../../../../src/images/setting-mon2.png"),
        url: "/setting/general-management",
        show: true,
      },
      {
        name: "tax",
        iconNoActive: require("../../../../src/images/setting-thue.png"),
        iconActive: require("../../../../src/images/setting-thue2.png"),
        url: "/setting/tax-management",
        show: true,
      },
      {
        name: "print",
        iconNoActive: require("../../../../src/images/setting-print-blue.png"),
        iconActive: require("../../../../src/images/setting-print-white.png"),
        url: "/setting/print-management",
        show: true,
      },
      // {
      //   name: "setting.table",
      //   iconNoActive: require("../../../../src/images/setting-ban.png"),
      //   iconActive: require("../../../../src/images/setting-ban2.png"),
      //   url: "/setting/table-management"
      // }
    ];
    const { ...rest } = this.props;
    const { userInfo } = this.props;
    return (
      <Router>
        <div className="setting-main">
          <div className="setting-content">
            <Switch>
              {userInfo && this.isTempContract() ? (
                <>
                  <Route path="/setting/general-management">
                    <SettingGenerals />
                  </Route>
                  <Route path="/setting/tax-management">
                    <SettingTax {...rest} />
                  </Route>
                  <Route path="/setting/print-management">
                    <SettingPrint {...rest}/>
                  </Route>
                </>
              ) : userInfo && !this.isTempContract() ? (
                <>
                  <Route path="/setting/language-management">
                    <SettingLanguages />
                  </Route>
                  <Route path="/setting/tax-management">
                    <SettingTax {...rest} />
                  </Route>
                  <Route path="/setting/general-management">
                    <SettingGenerals />
                  </Route>
                  <Route path="/setting/print-management">
                      <SettingPrint {...rest}/>
                  </Route>
                </>
              ) : null}

              {/* <Route path="/setting/table-management">
                <SettingTables />
              </Route> */}
            </Switch>
          </div>
          <div className="setting-nav">
            <ButtonLink data={dataLink} />
          </div>
        </div>
      </Router>
    );
  }
}

export default MenuSetting;
