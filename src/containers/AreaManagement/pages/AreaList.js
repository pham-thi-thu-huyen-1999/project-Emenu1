import React, { Component } from "react";
import "./AreaManagement.scss";
import { withNamespaces } from "react-i18next";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import * as actions from "../actions";
import { AreaReducerName } from "../reducers";
import Swal from "../../../utils/sweetalert2";
import { Input, Button, TableData, Loading } from "../../../components/common";
import { faSearch, faPlusCircle, faLongArrowAltLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class AreaList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      areaRatios: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
      name_search: "",
      areaListAfterSearch: [],
      isSearching: false
    };
  }

  componentDidMount() {
    this.props.actions.getListArea();
  }

  /**
   * Navigate to create new screen
   */
  navigateToCreate = () => {
    this.props.history.push("/area/new");
  };

  /**
   * Navigate arrange table
   */
  navigateArrangeTable = (areaId) => {
    // TODO: Navigate to arange table route
    this.props.history.push(`/area/${areaId}/arrange`);
  };

  /**
   * Navigate edit area
   */
  navigateToEdit = (areaId) => {
    this.props.history.push(`/area/${areaId}/edit`);
  };

  /**
   * Delete area
   */
  deleteArea = (areaId) => {
    Swal.fire({
      title: this.props.t("area_management:area_delete_title"),
      text: this.props.t("area_management:area_delete_title"),
      icon: "question",
      showCancelButton: true,
      confirmButtonText: this.props.t("area_management:confirm_button.delete"),
      cancelButtonText: this.props.t("area_management:confirm_button.cancel"),
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        this.props.actions.deleteArea({
          onSuccess: this.onDeleteSuccess,
          onFailure: this.onDeleteFail,
          areaId: areaId,
        });
      }
    });
  };

  /**
   * On delete success
   */
  onDeleteSuccess = () => {
    Swal.fire({
      icon: "success",
      title: this.props.t("area_management:area_delete_sucess"),
      showConfirmButton: true,
    });
  };

  /**
   * On delete fail
   */
  onDeleteFail = () => {
    Swal.fire({
      icon: "error",
      title: this.props.t("area_management:area_delete_fail"),
      showConfirmButton: true,
    });
  };

  /**
   * Search area
   */
  searchArea = () => {
    this.setState({
      areaListAfterSearch: this.props.listArea.filter(area => {
        return area.name_search.toLowerCase().indexOf(this.state.name_search.toLowerCase()) > -1 }),
      isSearching: true
    })
  };

  /**
   * On name search change
   */
  onNameSearchChange = (event) => {
    const { value } = event.target;
    this.setState({
      name_search: value,
    });
  };

  render() {
    // Normalize translation
    const trans = this.props.t;
    const TABLE_SETTING = {
      heads: [
        {
          text: trans("area_management:table_order"),
          width: "10%",
        },
        {
          text: trans("area_management:table_area_name"),
          width: "40%",
        },
        {
          text: trans("area_management:table_area_description"),
          width: "30%",
        },
        {
          text: trans("area_management:table_area_ratio"),
          width: "20%",
        },
      ],
      columns: [
        {
          key: "id",
          width: "10%",
          render: (item, index) => {
            return index + 1;
          },
        },
        {
          key: "name",
          width: "40%",
        },
        {
          key: "description",
          overflow: false,
          width: "30%",
        },
        {
          key: "ratio",
          width: "20%",
          render: (area) => {
            return `1:${this.state.areaRatios[area.ratio]}`;
          },
          actions: [
            (area) => (
              <Button
                className="btn-table-small e-m-right-5"
                type="s1"
                onClick={this.navigateArrangeTable.bind(this, area.id)}
              >
                {this.props.t("area_management:action_order")}
              </Button>
            ),
            (area) => (
              <Button
                className="btn-table-small e-m-right-5"
                type="s1"
                onClick={this.navigateToEdit.bind(this, area.id)}
              >
                <span
                  className="icon-pencil icon-pencil-custom margin-right-icon-text e-m-right-5"
                ></span>
                {this.props.t("area_management:action_edit")}
              </Button>
            ),
            (area) => (
              <Button
                className="btn-table-small e-m-right-10"
                type="s2"
                onClick={this.deleteArea.bind(this, area.id)}
              >
                <span
                  className="icon-cancel-circle icon-pencil-custom margin-right-icon-text e-m-right-5"
                ></span>
                {this.props.t("area_management:action_delete")}
              </Button>
            ),
          ],
        },
      ],
    };

    return (
      <main id="site-main" className="nofooter">
        <div className="area-management e-main-content center">
          <div
            className="area-management-wrapper width-area-list"
          >
            <Loading show={this.props.isLoading} />
            <div
              className="area-management-title center"
            >
              <div className="btn-back">
                <Button className="s3"
                  onClick={() => { this.props.history.push("/menu") }}>
                  <FontAwesomeIcon icon={faLongArrowAltLeft} />
                  <span className="e-m-left-5">{trans("textCommon.back")}</span>
                </Button>
              </div>
              <span className="title-area">{trans("area_management:area_list_title")}</span>
            </div>
            <div
              className="table-actions-toolbar margin-left-important"
            >
              <div className="search-group">
                <Input
                  type="text"
                  value={this.state.name_search}
                  placeholder={trans(
                    "area_management:search_area_by_name_placeholder"
                  )}
                  className="search-input"
                  onChange={this.onNameSearchChange.bind(this)}
                />
                <Button onClick={this.searchArea.bind(this)}>
                  {trans("area_management:search")}
                  <FontAwesomeIcon
                    icon={faSearch}
                    style={{
                      fontSize: 20,
                      verticalAlign: "middle",
                      marginLeft: "5px",
                      marginBottom: "5px"
                    }}
                  />
                </Button>
              </div>

              <Button
                onClick={this.navigateToCreate.bind(this)}
                className="margin-right-important"
              >
                {trans("area_management:add_new_button")}
                <FontAwesomeIcon
                  icon={faPlusCircle}
                  style={{
                    fontSize: 20,
                    verticalAlign: "middle",
                    marginLeft: "5px",
                  }}
                />
              </Button>
            </div>
            <div style={{ height: "calc(100% - 140px)", padding: "10px" }}>
              <TableData
                option={TABLE_SETTING}
                dataSources={this.state.isSearching ? this.state.areaListAfterSearch : this.props.listArea}
                textNotiNoData={trans("areas.notiNodata")}
              />
            </div>
          </div>
        </div>
      </main>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state[AreaReducerName],
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ ...actions }, dispatch),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(withNamespaces()(AreaList));
