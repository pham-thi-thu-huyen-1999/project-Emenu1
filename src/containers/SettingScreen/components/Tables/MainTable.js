import React, { Component } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import ContentAction from "./ContentAction";
import RadioButton from "../../../../components/common/RadioList";
import Button from "./../../../../components/common/Button";
import { partner_id } from "../../../../consts/constants";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { name } from "./reducers";
import * as action from "./actions";
import { withNamespaces } from "react-i18next";


class MainTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      isInTbl: 0,
      statusData : [
        {
          id: 1,
          name: this.props.t('setting.cancel'),
          isEdit: false
        },
        {
          id: 2,
          name: this.props.t('setting.use'),
          isEdit: false
        },
        {
          id: 3,
          name: this.props.t('setting.clean'),
          isEdit: false
        }
      ],
      ISCHECK_ITEM : [
        { key: 1, text: this.props.t("setting.yes") },
        { key: 0, text: this.props.t("setting.no") },
      ]
    };
  }
  componentDidMount() {
    this.props.actions.getAreaList();
  }

  onAddArea = name => {
    this.props.actions.createArea({
      name,
      partner_id,
      position: 0,
      status: 0
    });
  };

  onDeleteArea = area_id => {
    this.props.actions.deleteArea({ area_id });
  };

  onEditArea = newArea => {
    const data = {
      partner_id,
      name: newArea.newName,
      position: 0,
      status: 1
    };
    this.props.actions.editArea({ data, area_id: newArea.id });
  };

  saveClick = () => {
    //Save option các nhận vào bàn
    console.log("save");
  };
  render() {
    const { t } = this.props;
    const { statusData, ISCHECK_ITEM } = this.state;   
    return (
      <div className="promotion">
        <h3 className="title">{t("setting.table")}</h3>
        <div className="pr-content">
          <div className="setting-tbl">
            <Tabs
              selectedIndex={this.state.tabIndex}
              onSelect={tabIndex => this.setState({ tabIndex })}
            >
              <TabList className="tab-list">
                <Tab>{t("setting.status")}</Tab>
                <Tab>{t("setting.conftbl")}</Tab>
              </TabList>
              <TabPanel>
                <ContentAction
                  DataSource={statusData}
                  placeHolder={t("setting.addstatus")}
                  nameTab={t("setting.liststatus")}
                  t={this.props.t}
                />
              </TabPanel>
              <TabPanel>
                <div className="tab-content" style={{ textAlign: "center" }}>
                  <div style={{ display: "inline-block" }}>
                    <RadioButton
                      name="status-0"
                      dataSource={ISCHECK_ITEM}
                      onChange={isInTbl => this.setState({ isInTbl })}
                      selected={this.state.isInTbl}
                    />
                  </div>
                  <div className="button-action" style={{ textAlign: "right" }}>
                    <Button main type="s2" onClick={this.saveClick}>
                    {t("setting.save")}{" "}
                    </Button>
                  </div>
                </div>
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
)(withNamespaces()(MainTable));
