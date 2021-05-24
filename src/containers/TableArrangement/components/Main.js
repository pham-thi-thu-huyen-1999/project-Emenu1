import React, { Component } from 'react'
import Loading from "../../../components/common/Loading";
import "./style.scss";
import TableList from "./TableList";
import { Input } from "../../../components/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Area from "./Area";

export default class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      areaRatioList: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
      currentRatio: 1,
      tableList: [],
      tableListTemp: [],
      tableArrangement: [],
      tableItem: {},
      sizeItem: {},
      nameSearch: "",
      newAreaHeight: 0,
      tableListHeight: 0,
      screenWidth: 0,
    };

  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.areaInfo !== nextProps.areaInfo) {
      this.setState({
        currentRatio: this.state.areaRatioList[nextProps.areaInfo.ratio],
      })
    }
    if (nextProps.tableList !== this.props.tableList) {
      this.setState({
        tableList: [...nextProps.tableList]
      })
    }
    if (nextProps.tableArrangement !== this.props.tableArrangement) {
      this.setState({
        tableArrangement: nextProps.tableArrangement
      })
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }
  /**
   * calulate to fit layout when window change
   */
  updateDimensions = () => {
    let inputListItemHeight = 0;
    if (document.getElementById("inputSearchListTable")) {
      inputListItemHeight = document.getElementById("inputSearchListTable").clientHeight;
    }
    const buttonTabTableHeight = document.getElementById("tableTabInfo").clientHeight;
    const screenWidth = window.screen.width;

    this.setState({
      newAreaHeight: this.refs.areaLeftWrapper.clientHeight - 40,
      tableListHeight: this.refs.areaRightWrapper.clientHeight - (inputListItemHeight + buttonTabTableHeight),
      screenWidth
    })
  }
  /**
   * Get data of item in TableList.js when drop
   */
  handleOnDrop = (tableItem, sizeItem) => {
    if (tableItem && sizeItem) {
      this.setState({
        tableItem,
        sizeItem
      })
    }
  }
  /**
   * Get data from inputSearch
   */
  handleChange = (e) => {
    this.setState({
      nameSearch: e.target.value
    })
  }
  /**
   * add item to TableList when delete table in Viproom
   */
  addItemInVipRoom = (data) => {
    let tableList = [...this.state.tableList];
    data.map(item => {
      if (item.tableInfo.image) {
        tableList.unshift({ ...item.tableInfo });
      }
    })
    this.setState({
      tableList
    })
  }
  /**
   * When Ondrop() is trigger in Area.js, TableItem in tableList will be deleted
   */
  deleteItemDraged = (Item) => {
    let tableList = [...this.state.tableList];
    tableList.map((item, index) => {
      if (item.id === Item.id) {
        tableList.splice(index, 1);
        return
      }
    })
    this.setState({
      tableList
    })
  }
  /**
   * add item to TableList when delete table not in VipRoom
   */
  addItemRemoved = (Item) => {
    let tableList = [...this.state.tableList];
    tableList.push(Item)
    this.setState({
      tableList
    })
  }
  render() {
    const { ...rest } = this.props;
    const { tableList, tableItem, sizeItem, newAreaHeight, tableListHeight, currentRatio, nameSearch, tableArrangement } = this.state;
    return (
      <main id="site-main">
        <Loading show={this.props.isLoading} />
        <div className="area" style={{ height: "calc(100vh - 70px)" }}>
          <div ref="areaLeftWrapper" className="area-left">
            <Area {...rest} addItemInVipRoom={this.addItemInVipRoom} deleteItemDraged={this.deleteItemDraged} addItemRemoved={this.addItemRemoved} currentRatio={currentRatio} tableItem={tableItem} sizeItem={sizeItem} areaHeight={newAreaHeight} tableArrangement={tableArrangement} t={this.props.t}/>
          </div>

          <div ref="areaRightWrapper" className="area-right" style={{ backgroundColor: "#202831" }}>
            <Tabs>
              <TabPanel>
                <div className="tab-table">
                  <div className="input-group" id="inputSearchListTable">
                    <Input
                      placeholder="Nhập tên bàn hoặc số ghế"
                      onChange={this.handleChange.bind(this)}
                    />
                    <div className="input-group-prepend"
                      onClick={() => { }}>
                      <span className="input-group-text">
                        <FontAwesomeIcon
                          icon={faSearch}
                          style={{
                            fontSize: 20,
                            verticalAlign: "middle",
                            color: "#f27922",
                            cursor: "pointer"
                          }}
                        />
                      </span>
                    </div>
                  </div>
                  <TableList tableList={tableList} nameSearch={nameSearch}
                    unique={"table"} tableListHeight={tableListHeight}
                    handleOnDrop={this.handleOnDrop} t={this.props.t}/>
                </div>
              </TabPanel>
              <TabPanel>
                <div className="tab-info">
                  <TableList areaIconList={this.props.areaIconList} unique={"icon"} tableListHeight={tableListHeight} handleOnDrop={this.handleOnDrop} t={this.props.t} />
                </div>
              </TabPanel>
              <TabList className="tab-list" id="tableTabInfo">
                <Tab>Bàn</Tab>
                <Tab>Thông tin phụ</Tab>
              </TabList>
            </Tabs>
          </div>
        </div>


      </main >

    )
  }
}