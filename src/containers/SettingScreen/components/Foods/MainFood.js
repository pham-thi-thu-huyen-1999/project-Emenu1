import React, { Component } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import ContentAction from "./ContentAction";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { name } from "./reducers";
import * as action from "./actions";
import { withNamespaces } from "react-i18next";

const statusData = [
  {
    id: 1,
    name: "Hết",
    isEdit: false
  },
  {
    id: 2,
    name: "còn",
    isEdit: false
  }
];
class MainFood extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      isInTbl: 0
    };
  }

  componentDidMount() {
    this.props.actions.getUnitItemList();
  }

  onAddItem = name => {
    this.props.actions.createUnitItem({ name, status: 0, position: 0 });
  };

  onDelItem = item_id => {
    this.props.actions.deleteUnitItem({ item_id });
  };

  onEditItem = value => {
    const updateItem = {
      id: value.id,
      name: value.newName,
      status: 1
    };
    this.props.actions.editUnitItem({ updateItem, item_id: value.id });
  };

  render() {
    const { unitItemList, t } = this.props;
    return (
      <div className="promotion">
        <h3 className="title">{t("setting.dish")}</h3>
        <div className="pr-content">
          <div className="setting-tbl">
            <Tabs
              selectedIndex={this.state.tabIndex}
              onSelect={tabIndex => this.setState({ tabIndex })}
            >
              <TabList className="tab-list">
                <Tab>{t("setting.unit")}</Tab>
                <Tab>{t("setting.status")}</Tab>
              </TabList>
              <TabPanel>
                <ContentAction
                  DataSource={unitItemList}
                  placeHolder={t("setting.addunit")}
                  nameTab={t("setting.listunit")}
                  addItem={this.onAddItem}
                  editItem={this.onEditItem}
                  delItem={this.onDelItem}
                />
              </TabPanel>
              <TabPanel>
                <ContentAction
                  DataSource={statusData}
                  placeHolder={t("setting.addstatus")}
                  nameTab={t("setting.liststatus")}
                />
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    ...state[name]
  };
};
const mapDispatchToProps = dispatch => {
  const actions = {
    ...action
  };
  return { actions: bindActionCreators(actions, dispatch) };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces()(MainFood));
