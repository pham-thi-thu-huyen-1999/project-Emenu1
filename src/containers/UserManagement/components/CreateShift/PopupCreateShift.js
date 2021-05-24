import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "./myStyles.scss"
import MainShift from "./MainShift";
import OvertimeShift from "./OvertimeShift";
import TakeLeave from "./TakeLeave";
import CheckinCheckout from "./CheckinCheckout";
import { TAB } from "./consts";
export default class PopupCreateShift extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeTab: 0
    }
  }
  onChangeTab = value => {
    this.setState({
      activeTab: value
    })
  }
  render() {
    const { ...rest } = this.props
    const { t } = this.props
    const { activeTab } = this.state
    return (
      <div className="create-shift-main">
        <h3>{activeTab === TAB.OTSHIFT ?
          `${t("user.createShift.titleTabCreateOTShift")}` : activeTab === TAB.TAKELEAVE ?
            `${t("user.createShift.titleTabTakeLeave")}` : activeTab === TAB.CHECKINOUT ?
              "CHECKIN-CHECKOUT" :
              `${t("user.createShift.titleTabCreateWork")}`}</h3>
        <div className="tab-list-shift">
          <Tabs>
            <TabList className="tab-list">
              <Tab value={1}
                onClick={e => this.onChangeTab(e.target.value)}>
                {t("user.createShift.workShift")}</Tab>
              <Tab value={2}
                onClick={e => this.onChangeTab(e.target.value)}>
                {t("user.createShift.overTimeShift")}</Tab>
              <Tab value={3}
                onClick={e => this.onChangeTab(e.target.value)}>
                {t("user.createShift.takeLeave")}</Tab>
              <Tab value={4}
                onClick={e => this.onChangeTab(e.target.value)}>
                Checkin/Checkout</Tab>
            </TabList>
            <TabPanel>
              <MainShift
                userDetail={this.props.userDetail}
                {...rest}
              />
            </TabPanel>
            <TabPanel>
              <OvertimeShift
                userDetail={this.props.userDetail}
                {...rest}
              />
            </TabPanel>
            <TabPanel>
              <TakeLeave
                userDetail={this.props.userDetail}
                {...rest}
              />
            </TabPanel>
            <TabPanel>
              <CheckinCheckout
                userDetail={this.props.userDetail}
                {...rest}
              />
            </TabPanel>
          </Tabs>
        </div>
      </div >
    )
  }
}