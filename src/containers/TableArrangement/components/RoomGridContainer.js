import React, { Component, Fragment } from "react";
import GridLayout from "react-grid-layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faCheck,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "../../../utils/sweetalert2";
import _ from "lodash";
export default class RoomGridContainer extends Component {
  static defaultProps = {
    isBounded: true,
    preventCollision: true,
    isDraggable: true,
    compactType: null,
    useCSSTransforms: false,
    containerPadding: [0, 0],
    margin: [0, 0],
    maxRows: 100,
  };

  constructor(props) {
    super(props);
    this.state = {
      layout: [],
      roomTableList: [],
      isEdit: false,
    };
  }
  componentDidMount() {
    let layout = [...this.state.layout];
    if (this.props.dataInGridRoom) {
      this.props.dataInGridRoom.map((item) => {
        layout.push({ ...item.layoutItem, static: true });
      });
    }
    this.setState({
      layout,
      roomTableList: [...this.props.dataInGridRoom],
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.refreshGridRoom === true) {
      let layout = [];
      nextProps.dataInGridRoom.map((item) => {
        layout.push({ ...item.layoutItem, static: true });
      });
      this.setState({
        layout,
        roomTableList: [...nextProps.dataInGridRoom],
        isEdit: false,
      });
    }
    if (nextProps.isEdit !== this.props.isEdit) {
      let layout = [...this.state.layout];
      if (nextProps.editVipRoomStatus === true) {
        for (let i = 0; i < layout.length; i++) {
          layout[i] = { ...layout[i], static: false };
        }
        this.setState({
          layout,
        });
      } else {
        for (let i = 0; i < layout.length; i++) {
          layout[i] = { ...layout[i], static: true };
        }
        this.setState({
          layout,
        });
      }
    }
    if (
      nextProps.width !== this.props.width ||
      nextProps.height !== this.props.height
    ) {
      const ratioRoomOld = this.props.width / this.props.height;
      const ratioRoomNew = nextProps.width / nextProps.height;
      const { layout } = this.state;
      let layoutNew = layout.map((el, index) => {
        return {
          ...el,
          w:
            (el.w * (ratioRoomOld >= 1 ? ratioRoomOld : 1)) /
            (ratioRoomNew >= 1 ? ratioRoomNew : 1),
          h:
            (el.h * (ratioRoomOld < 1 ? 1 / ratioRoomOld : 1)) /
            (ratioRoomNew < 1 ? 1 / ratioRoomNew : 1),
        };
      });
      this.setState({ layout: layoutNew });
    }
  }
  componentDidUpdate(preProps, preState) {
    if (
      this.checkDevice() &&
      !_.isEmpty(this.props.tableItem) &&
      !_.isEmpty(this.props.sizeItem) &&
      this.props.tableItem !== preProps.tableItem &&
      this.props.isEdit
    ) {
      let layoutItem = {
        h: 1,
        w: 1,
        x: 0,
        y: 0,
        i: "__dropping-elem__",
        isBounded: undefined,
        isDraggable: true,
        isResizable: undefined,
        maxH: undefined,
        maxW: undefined,
        minH: undefined,
        minW: undefined,
        moved: false,
        static: false,
      };
      this.onDrop({}, layoutItem);
    }
  }

  checkDevice = (window.mobileAndTabletCheck = function () {
    let check = false;
    (function (a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
          a
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substr(0, 4)
        )
      )
        check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
  });
  onDrop = (layoutNew, layoutItem) => {
    let roomTableList = [...this.state.roomTableList];
    let layout = [...this.state.layout];
    const { tableItem, sizeItem, vipId } = this.props;
    const ratioItem = sizeItem.width / sizeItem.height;
    const ratioRoom = this.props.width / this.props.height;
    let objectItem;
    // xóa item khi đã drop
    this.props.deleteItemInGridRoom(tableItem);
    if (tableItem.unique === "icon") {
      const id = this.randomStr(20, "randomString2020");
      objectItem = {
        ...layoutItem,
        w:
          (((layoutItem.w * 20) / (ratioRoom >= 1 ? ratioRoom : 1)) *
            sizeItem.width) /
          100,
        h:
          (((layoutItem.h * 20) / (ratioRoom < 1 ? 1 / ratioRoom : 1)) *
            sizeItem.height) /
          100,
        i: id,
        icon: tableItem.icon,
      };
      if (this.isVipRoom(tableItem.icon)) {
        Swal.fire({
          title: "Lỗi thao tác",
          text: "Không được thêm phòng vào phòng vip!",
          icon: "warning",
        });
        return;
      }
    } else {
      objectItem = {
        ...layoutItem,
        w:
          ((layoutItem.w * 15) / (ratioRoom >= 1 ? ratioRoom : 1)) *
          (ratioItem >= 1 ? ratioItem : 1),
        h:
          ((layoutItem.h * 15) / (ratioRoom < 1 ? 1 / ratioRoom : 1)) *
          (ratioItem < 1 ? 1 / ratioItem : 1),
        i: tableItem.id.toString(),
        name: tableItem.name,
        image: tableItem.image,
        seat_number: tableItem.seat_number,
      };
    }
    let objectRoomTable = {
      tableInfo: { ...tableItem },
      vipId,
      layoutItem: { ...objectItem },
    };
    layout.push({ ...objectItem });
    roomTableList.push(objectRoomTable);
    this.setState({
      roomTableList,
      layout,
    });
  };
  onDragStop = (layoutNew, itemold, itemnew) => {
    this.saveAfterDrag_Resize(itemold, itemnew);
  };
  onResizeStop = (layoutNew, itemold, itemnew) => {
    this.saveAfterDrag_Resize(itemold, itemnew);
  };

  deleteTableItem = (itemClick) => {
    let { roomTableList, layout } = this.state;
    const indexLayout = layout.findIndex((item) => {
      return item.i === itemClick.i;
    });
    if (indexLayout !== -1) {
      if (itemClick.image) {
        this.props.addItemInGridRoom(roomTableList[indexLayout].tableInfo);
      }
      this.props.deleteStateGridRoom(roomTableList[indexLayout]);
      layout.splice(indexLayout, 1);
      roomTableList.splice(indexLayout, 1);
      this.setState({
        layout,
        roomTableList,
      });
    }
  };
  /* Function kiểm tra phòng vip */
  isVipRoom = (icon) => {
    let nameIcon = icon
      ? icon.split("/")[icon.split("/").length - 1].split("_")[0]
      : "";
    if (nameIcon === "room.svg") {
      return true;
    } else {
      return false;
    }
  };
  /* Function random mảng theo độ dài */
  randomStr(len, arr) {
    var ans = "";
    for (var i = len; i > 0; i--) {
      ans += arr[Math.floor(Math.random() * arr.length)];
    }
    return ans;
  }
  /* Funtion lưu lại vị trí mỗi khi drag hoặc resize */
  saveAfterDrag_Resize = (itemold, itemnew) => {
    let roomTableList = [...this.state.roomTableList];
    let { layout } = this.state;
    let index = layout.findIndex((item) => {
      return item.i === itemold.i;
    });
    if (index !== -1) {
      let { x, y, w, h } = itemnew;
      layout[index] = { ...layout[index], x, y, w, h };
      roomTableList[index].layoutItem = { ...layout[index], x, y, w, h };
    }
    this.setState({
      layout,
      roomTableList,
    });
  };

  generateDOM() {
    const { layout, isEdit } = this.state;
    return layout.map((item, index) => (
      <div
        className={isEdit === false ? "cancelDraggableOn" : ""}
        key={item.i}
        data-grid={{ ...item }}
        style={{ zIndex: 1 }}
      >
        <div className="image-tag e-table ">
          <React.Fragment>
            <img src={item.image ? item.image : item.icon} alt="" />
            <div className="image-tag-overlay">
              <span className="image-tag-info">
                {this.props.height > 400 ? (
                  <>
                    {item.image ? item.name : ""}
                    <br />
                    {item.seat_number ? item.seat_number + ` ${this.props.t("table_list:chair")
                      }` : ""}
                  </>
                ) : (
                  <>{item.image ? item.name : ""}</>
                )}
              </span>
            </div>
          </React.Fragment>
          <span
            className="e-btn-delete"
            onClick={() =>
              this.props.isEdit ? this.deleteTableItem(item) : ""
            }
          >
            <FontAwesomeIcon
              icon={faTimesCircle}
              style={{
                fontSize: this.props.height > 400 ? 22 : 16,
                color: "#f27922",
                background: "white",
                borderRadius: "50%",
                filter: this.props.isEdit ? "" : "grayscale(100%)",
              }}
            />
          </span>
        </div>
      </div>
    ));
  }
  render() {
    return (
      <Fragment>
        <GridLayout
          {...this.props}
          className={
            this.props.isEdit
              ? "image-tag-overlay e-vip-room-enable"
              : "image-tag-overlay e-vip-room"
          }
          isDroppable={this.state.isEdit}
          draggableCancel=".cancelDraggableOn"
          draggableHandle=".image-tag-overlay"
          onDrop={this.onDrop}
          onDragStop={this.onDragStop}
          onResizeStop={this.onResizeStop}
          layout={this.state.layout}
          rowHeight={this.props.height / this.props.maxRows}
          style={{ height: "100%" }}
          width={this.props.width}
          cols={100}
        >
          {this.generateDOM()}
        </GridLayout>
        <div className="e-viproom-handle">
          <span
            className="e-btn-edit"
            onClick={() => {
              if (this.state.isEdit === false) {
                let isUpdate = this.props.editVipTable(this.props.vipId, true);
                if (isUpdate === true) {
                  this.setState({
                    isEdit: true,
                  });
                }
              } else {
                this.props.getTableList(
                  this.state.roomTableList,
                  this.props.vipId
                );
                this.setState({
                  isEdit: false,
                });
              }
            }}
          >
            {" "}
            {this.state.isEdit ? (
              <FontAwesomeIcon
                icon={faCheck}
                style={{
                  fontSize: 28,
                  color: "white",
                  background: " #93cc39",
                  padding: 5,
                  borderRadius: "50%",
                }}
              ></FontAwesomeIcon>
            ) : (
              <FontAwesomeIcon
                icon={faCog}
                style={{
                  fontSize: 28,
                  color: "white",
                  background: "#f27922",
                  padding: 5,
                  borderRadius: "50%",
                  filter:
                    this.state.isEdit === this.props.editVipRoomStatus
                      ? ""
                      : "grayscale(100%)",
                }}
              ></FontAwesomeIcon>
            )}
          </span>
          <span
            className="e-btn-delete-vip"
            onClick={() => {
              if (this.state.isEdit) {
                console.log("ok");
                this.props.getTableList(
                  this.state.roomTableList,
                  this.props.vipId
                );
                this.setState(
                  {
                    isEdit: false,
                  },
                  () => {
                    this.props.deleteTableItem(this.props.item);
                  }
                );
              } else {
                if (!this.props.editVipRoomStatus) {
                  this.props.deleteTableItem(this.props.item);
                }
              }
            }}
          >
            <FontAwesomeIcon
              icon={faTimesCircle}
              style={{
                fontSize: 28,
                color: "#f27922",
                background: "white",
                borderRadius: "50%",
                filter:
                  this.state.isEdit === this.props.editVipRoomStatus
                    ? ""
                    : "grayscale(100%)",
              }}
            />
          </span>
        </div>
      </Fragment>
    );
  }
}
