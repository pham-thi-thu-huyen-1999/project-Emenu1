import React, { Component } from "react";
import ButtonLink from "./ButtonLink";
import { withNamespaces } from "react-i18next";
import { get } from "../../../services/localStorage";
import { getPartnerById } from "../../../api/partner";
import moment from "moment";
import {
  TEMP_CONTRACT, TRIAL_CONTRACT, OFFICIAL_CONTRACT,
  userRoleCheck, foundRole
} from "../../../consts/settings/partnerContract";
import common from "../../../utils/common";

let userRole = common.decodeToken(get('accessToken')).role;
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_table: get("is_table"),
      dataLink: []
    }
  }
  componentDidMount = () => {
    this.checkPartnerContract(this.state.is_table)
  }
  /**
   * Get partner contract type && end_Time
   */
  checkPartnerContract = async (is_Table) => {
    try {
      const data = await getPartnerById();
      if (data.data && data.data.data) {
        const activebtn = data.data.data.contract_type_id === TEMP_CONTRACT || moment.utc(new Date()).isAfter(new Date(data.data.data.contract_end_time)) ? true : false;
        const disableIsTriaAndIsConfiCal = ((data.data.data.contract_type_id === TRIAL_CONTRACT)
          || (data.data.data.contract_type_id === OFFICIAL_CONTRACT))
        if (is_Table) {
          this.setState({
            dataLink: [
              {
                name: "menu.area",
                url: "/area",
                iconImg: require("../../../images/area.png"),
                class: userRole.indexOf(userRoleCheck.areaManagement) === foundRole ? "disable" : ""
              },
              {
                name: "table",
                url: "table",
                iconImg: "/images/ico-tbl.png",
                class: userRole.indexOf(userRoleCheck.tableManagement) === foundRole ? "disable" : ""
              },
              {
                name: "categoryDish.title",
                url: "/dish-category",
                iconImg: "/images/ico-dish.png",
                class: userRole.indexOf(userRoleCheck.categoryDish) === foundRole ? "disable" : ""
              },
              {
                name: "menu.combo",
                url: "/dish-management",
                iconImg: "/images/compo.png",
                class: userRole.indexOf(userRoleCheck.mealManagament) === foundRole ? "disable" : ""
              },
              {
                name: "dish",
                url: "dish",
                iconImg: "/images/ico-dish.png",
                class: userRole.indexOf(userRoleCheck.dishManagament) === foundRole ? "disable" : ""
              },
              {
                name: "menu.promotion",
                url: "/promotions-management",
                iconImg: require("../../../images/setting-km2.png"),
                class: userRole.indexOf(userRoleCheck.promotion) === foundRole ? "disable" : ""
              },
              {
                name: "menu.report",
                iconImg: "/images/ico-report.png",
                url: "/report",
                class: userRole.indexOf(userRoleCheck.report) === foundRole ? "disable" : ""
              },
              {
                name: "menu.account",
                iconImg: "/images/account.png",
                url: "/user",
                class: userRole.indexOf(userRoleCheck.account) === foundRole ? "disable" : ""
              },
              {
                name: "menu.setting",
                url: "/setting/general-management",
                iconImg: "/images/setting.png",
                class: userRole.indexOf(userRoleCheck.setting) === foundRole ? "disable" : ""
              },
              {
                name: "menu.shift",
                url: "/shift-management",
                iconImg: "/images/danh-muc-ca.png",
                class:   userRole.indexOf(userRoleCheck.shift) === foundRole ? "disable" : ""
              },
              {
                name: "menu.calendar",
                iconImg: require("../../../images/lich-lam-viec.png"),
                url: "/calendar",
                class:  userRole.indexOf(userRoleCheck.calendar) === foundRole ? "disable" : ""
              },
              {
                name: "menu.addon",
                iconImg: require("../../../images/lich-lam-viec.png"),
                url: "/addon",
                class:  ""
              },
            ],
          })
        }
        else this.setState({
          dataLink: [
            {
              name: "categoryDish.title",
              url: "/dish-category",
              iconImg: "/images/ico-dish.png",
              class: userRole.indexOf(userRoleCheck.categoryDish) === foundRole ? "disable" : ""
            },
            {
              name: "menu.combo",
              url: "/dish-management",
              iconImg: "/images/compo.png",
              class: userRole.indexOf(userRoleCheck.mealManagament) === foundRole ? "disable" : ""
            },
            {
              name: "dish",
              url: "dish",
              iconImg: "/images/ico-dish.png",
              class: userRole.indexOf(userRoleCheck.dishManagament) === foundRole ? "disable" : ""
            },
            {
              name: "menu.promotion",
              url: "/promotions-management",
              iconImg: require("../../../images/setting-km2.png"),
              class: activebtn || userRole.indexOf(userRoleCheck.promotion) === foundRole ? "disable" : ""
            },
            {
              name: "menu.report",
              iconImg: "/images/ico-report.png",
              url: "/report",
              class: activebtn || userRole.indexOf(userRoleCheck.report) === foundRole ? "disable" : ""
            },
            {
              name: "menu.account",
              iconImg: "/images/account.png",
              url: "/user",
              class: activebtn || userRole.indexOf(userRoleCheck.account) === foundRole ? "disable" : ""
            },
            {
              name: "menu.setting",
              url: "/setting/language-management",
              iconImg: "/images/setting.png",
              class: activebtn || userRole.indexOf(userRoleCheck.setting) === foundRole ? "disable" : ""
            },
            {
              name: "menu.shift",
              url: "/shift-management",
              iconImg: "/images/danh-muc-ca.png",
              class: activebtn || userRole.indexOf(userRoleCheck.shift) === foundRole ? "disable" : ""
            },
            {
              name: "menu.calendar",
              iconImg: require("../../../images/lich-lam-viec.png"),
              url: "/calendar",
              class: activebtn || userRole.indexOf(userRoleCheck.calendar) === foundRole ? "disable" : ""
            },
          ],
        })
      }
    } catch (error) { }
  };
  render() {
    const { ...rest } = this.props;
    return (
      <main id="site-main" className="nofooter">
        <div id="primary" className="no-footer p-management clear">
          <section id="main-cont" className="full clear">
            <aside id="mag-menu-scr" className="view-table e-flex align-center content-center">
              <div className="inner view-table-cell">
                <ButtonLink {...rest} data={this.state.dataLink} />
              </div>
            </aside>
          </section>
        </div>
      </main>
    );
  }
}
export default withNamespaces()(Main);
