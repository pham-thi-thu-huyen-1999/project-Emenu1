import React, { Component } from "react";
import { isMobile } from 'mobile-device-detect';
export default class TableList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listTable: [],
    };
    this.dropRef = [];
  }
  componentDidMount() {
    // Cập nhật lại mảng sắp xếp khi chuyển tab.
    if (this.props.tableList) {
      let { tableList } = this.props
      this.SortListTable(tableList);
    }
    // ...
  }

  componentWillReceiveProps(nextProps) {
    // chạy khi dữ liệu truyền vào hoặc nameSearch ko có hoặc bằng rỗng
    if (nextProps.tableList !== this.props.tableList || !nextProps.nameSearch && nextProps.tableList) {
      this.SortListTable(nextProps.tableList);
    }
    //Chạy khi có dữ liệu nameSearch từ ô input
    if (nextProps.nameSearch) {
      let { listTable } = this.state
      let tableListNew = listTable.filter(
        item => {
          return item.name_search !== null ? item.name_search.toLowerCase().indexOf(nextProps.nameSearch.toLowerCase()) > -1 : null;
        })
      this.SortListTable(tableListNew);
    }
  }


  // Phân loại bàn theo tên hình.
  getCategory = (Item) => {
    if (Item.image) {
      let category = Item.image.split("/")[Item.image.split("/").length - 1].split("_")[0];
      return category;
    }
    return "noImg";
  }


  // Hàm sắp xếp dữ liệu theo kích thước hình.
  SortListTable = (tableList) => {
    let listTable = []
    let noImageTable = tableList.filter(item => (
      this.getCategory(item) === "noImg"
    ))
    let Square_RoundTable = tableList.filter(item => (
      this.getCategory(item) === "round" || this.getCategory(item) === "square"
    ))
    let rectangle = tableList.filter(item => (
      this.getCategory(item) === "rectangle"
    ))
    let vertical = tableList.filter(item => (
      this.getCategory(item) === "vertical-rectangle"
    ))
    Square_RoundTable.sort((a, b) => {
      return a.seat_number - b.seat_number
    })
    rectangle.sort((a, b) => {
      return a.seat_number - b.seat_number
    })
    vertical.sort((a, b) => {
      return a.seat_number - b.seat_number
    })
    listTable.push(...Square_RoundTable, ...rectangle, ...vertical, ...noImageTable);
    this.setState({
      listTable
    })
  }


  // Hàm nhận kích thước và dữ liệu của Item khi OnDrag
  showTableItem = (tableItem) => {
    const sizeItem = { width: this.dropRef[tableItem.id].naturalWidth, height: this.dropRef[tableItem.id].naturalHeight };
    const params = { ...tableItem, unique: this.props.unique };
    this.props.handleOnDrop(params, sizeItem);
  }



  // Render ra mảng bàn
  renderTableList = () => {
    const { listTable } = this.state;
    return listTable.map((tableItem, index) => {
      return (
        tableItem.image ? <div
          className="itemWrapper" key={index} >
          <div
            className="droppable-element"
            draggable={true}
            unselectable="on"
            onDragStart={(e) => {
              this.showTableItem(tableItem, e)
            }}
            onClick={(e) => {
              if (isMobile) {
                this.showTableItem(tableItem, e)
              }
            }}
          >
            <div className={"image-tag"}>
              <img
                src={tableItem.image}
                ref={(ref) => {
                  if (ref) {
                    this.dropRef[tableItem.id] = ref;
                    // Xét lại kích thước cho hình.
                    ref.onload = () => {
                      ref.style.width = ref.naturalWidth * 0.7 + "px";
                      // ref.style.height = ref.naturalHeight * 0.7 + "px";
                      ref.style.maxHeight = "300px";
                      ref.style.margin = "0 auto";
                    };
                  }
                }}
                alt=""
              />
              <div className="image-tag-overlay"
                ref={(ref) => {
                  if (ref) {
                    this.dropRef[tableItem.id] = ref;
                    let a = parseInt(ref.getElementsByClassName("seatNumber")[0].innerHTML);
                    if (a > 10) {
                      ref.style.fontSize = "8px";
                    } else {
                      ref.style.fontSize = "14px";
                    }
                  }
                }}
              >
                <span className="image-tag-info">
                  {tableItem.name}
                  <br />
                  <span className="seatNumber">{tableItem.seat_number}</span> {
                    this.props.t("table_list:chair")
                  }
               </span>
              </div>
            </div>
          </div>
        </div> : ""
      );
    });
  };
  // render ra mảng thông tin phụ
  renderAreaIconList = () => {
    const { areaIconList } = this.props;
    return areaIconList.map((AreaIcon, index) => {
      return AreaIcon.icon ? <div className="itemWrapper" key={index}>
        <div
          className="droppable-element"
          draggable={true}
          unselectable="on"
          onDragStart={(e) => { this.showTableItem(AreaIcon, e) }
          }
          onClick={(e) => {
            if (isMobile) {
              this.showTableItem(AreaIcon, e)
            }
          }}
        >
          <div className={"image-tag"}>
            <img
              src={AreaIcon.icon}
              ref={(ref) => {
                if (ref) {
                  this.dropRef[AreaIcon.id] = ref
                }
              }}
              alt="#"
            />
            <p className="image-tag-overlay">
              <span className="image-tag-info">{AreaIcon.name_vn}</span>
            </p>
          </div>
        </div>
      </div> : ""
    })
  }

  render() {
    const { tableListHeight } = this.props;
    return (
      <div
        id="sidebar"
        style={{ maxHeight: tableListHeight, overflowY: "scroll" }}
      >
        <div className="tbl-status">{
          this.props.areaIconList ? this.renderAreaIconList() :
            this.renderTableList()}</div>
      </div>
    );
  }
}
