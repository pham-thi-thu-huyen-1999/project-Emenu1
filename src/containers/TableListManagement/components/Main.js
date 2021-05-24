import React, { Component } from "react";
import PopupAddTbl from "./PopupAddTbl.js";
import Loading from "../../../components/common/Loading";
import { Input, Button, Paginate, Dialog } from "../../../components/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlusCircle, faLongArrowAltLeft, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import SelectBox from "../../../components/common/SelectBox";
import PopupEditTable from "./PopupEditTable";
import "./style.scss";
import TableList from "./TableList";
import * as CONSTS from "./../constants";
import jsPDF from 'jspdf';
import BgPrintTable from '../images/background-print-table.jpg';
import vietel from '../images/vietel.jpg';
import zalo from '../images/zalo.jpg';
import vnpay from '../images/vnpay.jpg';
import logoRestaurant from '../images/logo-omenu.jpg';
import ReactToPrint from 'react-to-print';
import './PDFContent.scss';

import { PDFContent } from './PDFContent';
import { PDFContentCircle } from './PDFContentCircle';

export default class Main extends Component {
  state = {
    disableNext: true,
    disablePre: true,
    indexSlide: 0,
    showPopupAddtbl: false,
    showPopupEdittbl: false,
    showPopupDetailTbl: false,
    searchByArea: null,
    searchByName: "",
    inFoTable: null,
    isEdit: false,
    tableListAll: this.props.tableListAll
  };

  /**
     * Click detail
     */
  handleClickDetailTable = (table) => {
    this.setState({
      showPopupDetailTbl: true,
      inFoTable: table,
    });
  };

  /**
   * Click edit table
   */
  handleClickEditTable = (table, isEdit) => {
    this.setState({
      showPopupEdittbl: true,
      inFoTable: table,
      isEdit
    });
  };

  /**
   * Search Table
   */
  onSearch = () => {
    const { searchByArea, searchByName } = this.state;
    this.props.actions.resetTable();
    this.props.actions.searchTable({
      searchByName,
      searchByArea
    });
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (JSON.stringify(nextProps.tableListAll) !== JSON.stringify(prevState.tableListAll)) {
      return {
        tableListAll: nextProps.tableListAll
      };
    }
    return null;
  }

  render() {

    const { ...rest } = this.props;
    const { t, isLoading, areaList, infoPartner, tableListAll } = this.props;

    const {
      showPopupAddtbl,
      inFoTable,
      showPopupEdittbl,
      searchByName,
      searchByArea,
    } = this.state;
    let listArea = [];
    listArea.push({
      key: "",
      text: t("tableManagament.searchAll")
    });
    let temp = {};
    for (var i = 0; i < areaList.length; i++) {
      temp = {
        key: areaList[i].id,
        text: areaList[i].name
      }
      listArea.push(temp);
    }
    const pageStyle = `
      @page {
        size: 80mm 80mm;
        margin: 0;
      }

      @media all {
        .pagebreak {
          display: none;
        }
      }

      @media print {
        html, body {
            height: initial !important;
            overflow: initial !important;
            -webkit-print-color-adjust: exact;
          }
        }
        .pagebreak {
          page-break-before: auto;
        }
      }
    `;
    return (
      <main id="site-main" className="nofooter tbl-manage">
        <Loading show={isLoading} />
        <div id="primary" className="no-footer p-management clear">
          <section id="main-cont">
            <aside id="manage-tbls-list" className="view-table">
              <div className="view-table-cell">
                <div className="popup-box" style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}>
                  <div className="btn-title-table e-flex content-center item-center">
                    <div className="btn-back">
                      <Button className="s3"
                        onClick={() => { this.props.history.push("/menu") }}>
                        <FontAwesomeIcon icon={faLongArrowAltLeft} />
                        <span className="e-m-left-5">{t("textCommon.back")}</span>
                      </Button>
                    </div>
                    <h3 className="main-lbl text-center">
                      {t("tableManagament.title")}
                    </h3>
                  </div>
                  <aside className="top-acts flex-view middle tbl-manage__form-group" style={{ marginBottom: 20 }}>
                    <div className="flex-view tbl-manage__form-group-search" >
                      <Input
                        className="form-group-search__name"
                        placeholder={t("tableManagament.searchName")}
                        onChange={e => {
                          this.setState({ searchByName: e.target.value });
                        }}
                      />
                      <SelectBox
                        className="form-group-search__select-box"
                        onChange={e => this.setState({ searchByArea: e })}
                        value={this.state.searchByArea}
                        dataSource={listArea}
                        blank={t("tableManagament.searchArea")}
                        style={{ width: "30%", marginLeft: 10 }}
                      >
                        <div className="icon-angle-dow">
                          <FontAwesomeIcon icon={faAngleDown} />
                        </div>
                      </SelectBox>
                      <Button className="e-m-left-10" onClick={this.onSearch} >
                        {t("dishManagament.search")}{" "}
                        <FontAwesomeIcon
                          icon={faSearch}
                          style={{
                            fontSize: 20,
                            verticalAlign: "middle",
                          }}
                        />
                      </Button>
                    </div>
                    <div className="flex-view tbl-manage__form-group-button" >
                    <Button className="e-m-right-10" type="primary" style={{ maxWidth: "100px" }}>
                        <>
                          <ReactToPrint
                            trigger={() => {
                              return <div className="reactToPrint"><a href="#">{t("tableManagament.print")} CIRCLE</a></div>;
                            }}
                            content={() => this.componentRefCircle}
                            pageStyle={pageStyle}
                          />
                          <PDFContentCircle
                            name={infoPartner.name}
                            logoImage={infoPartner.logo}
                            t={t}
                            tableListAll={this.state.tableListAll}
                            ref={el => (this.componentRefCircle = el)} />
                        </>
                      </Button>
                      <Button className="e-m-right-10" style={{ maxWidth: "50px" }} type="primary">
                        <>
                          <ReactToPrint
                            trigger={() => {
                              return <div className="reactToPrint"><a href="#">{t("tableManagament.print")}</a></div>;
                            }}
                            content={() => this.componentRef}
                            pageStyle={pageStyle}
                          />
                          <PDFContent
                            name={infoPartner.name}
                            logoImage={infoPartner.logo}
                            t={t}
                            tableListAll={this.state.tableListAll}
                            ref={el => (this.componentRef = el)} />
                        </>
                      </Button>
                      <Button
                        /* className="form-group-button__add e-p-top-5" */
                        className=""
                        onClick={() =>
                          this.setState({ showPopupAddtbl: !showPopupAddtbl })
                        }>
                        <FontAwesomeIcon
                          icon={faPlusCircle}
                          style={{
                            fontSize: 20,
                            verticalAlign: "middle"
                          }}
                        />&nbsp;&nbsp;
                        {t("tableManagament.add")}{" "}
                      </Button>
                    </div>
                  </aside>
                  <aside className="tbl-tbls-list set-scrolling-tbl grey70 tbl-manage__list">
                    <TableList
                      searchByName={searchByName}
                      searchByArea={searchByArea}
                      {...rest}
                      {...t}
                      onEdit={this.handleClickEditTable}>
                    </TableList>
                  </aside>
                </div>
              </div>
            </aside>
          </section>
        </div>
        <Dialog
          show={showPopupAddtbl}
          close={() => this.setState({ showPopupAddtbl: false })}
          innerClass="popup-add-tbl"
        >
          <PopupAddTbl
            hide={() => {
              this.setState({ showPopupAddtbl: !showPopupAddtbl })
            }}
            searchByName={searchByName}
            searchByArea={searchByArea}
            {...rest} />
        </Dialog>
        <Dialog
          show={showPopupEdittbl}
          close={() => this.setState({ showPopupEdittbl: false })}
          innerClass="popup-add-tbl"
        >
          <PopupEditTable
            inFoTable={inFoTable}
            hide={() => this.setState({ showPopupEdittbl: !showPopupEdittbl })}
            {...rest}
            searchByName={searchByName}
            searchByArea={searchByArea}
            isEdit={this.state.isEdit}
          />
        </Dialog>

      </main>
    );
  }
}
