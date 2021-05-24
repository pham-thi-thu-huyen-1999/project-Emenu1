import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import Swal from "../../../utils/sweetalert2";
//import { Responsive, WidthProvider } from 'react-grid-layout';
import GridLayout from "react-grid-layout";
import RoomGridContainer from "./RoomGridContainer";
import Button from "../../../components/common/Button";
import "./style.scss";
import _ from "lodash";

//const ResponsiveGridLayout = WidthProvider(Responsive);

export default class Area extends Component {
  static defaultProps = {
    className: "layout-custom",
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
      tableArrangement: [],
      dataFromGridRoom: [],
      refreshGridRoom: false,
      layoutInfo: [],
      layout: [],
      cols: 100,
      areaWidth: 0,
      areaHeight: 0,
      isShowScrollLeft: false,
      isShowScrollRight: false,
      isDroppable: true,
      editVipRoomStatus: false,
      currentEditRoom: "",
    };
  }
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {
    /* Render sơ đồ bàn cùng với thông tin phụ */
    if (nextProps.tableArrangement !== this.props.tableArrangement) {
      this.getDataFromProps(nextProps);
    }
    if (nextProps.areaHeight !== this.props.areaHeight) {
      const newAreaHeight = nextProps.areaHeight;
      const areaWidth = newAreaHeight * this.props.currentRatio;
      this.setState({
        areaWidth: areaWidth,
        areaHeight: newAreaHeight,
      });
      if (areaWidth > this.refs.tablistWrapper.clientHeight) {
        this.setState({
          isShowScrollRight: true,
        });
      }
    }
    if (nextProps.currentRatio !== this.props.currentRatio) {
      this.setAreaWidth(nextProps.currentRatio);
    }
  }
  componentDidUpdate(preProps, preState) {
    if (
      this.checkDevice() &&
      !_.isEmpty(this.props.tableItem) &&
      !_.isEmpty(this.props.sizeItem) &&
      this.props.tableItem !== preProps.tableItem
    ) {
      let { isDroppable } = this.state;
      let layoutItem = {
        i: "__dropping-elem__",
        w: 1,
        h: 1,
        x: 1,
        y: 1,
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
      if (isDroppable) {
        this.onDrop({}, layoutItem);
      }
    }
  }
  /**
   * Kiểm tra phòng vip
   */
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
  /**
   * Kiểm tra thiết bị truy cập
   */
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
  /* Function random mảng theo độ dài */
  randomStr(len, arr) {
    var ans = "";
    for (var i = len; i > 0; i--) {
      ans += arr[Math.floor(Math.random() * arr.length)];
    }
    return ans;
  }
  /**
   * Hàm nhận data lúc drop
   * recevid data when get table from right
   */
  onDrop = (layoutNew, layoutItem) => {
    let layout = [...this.state.layout];
    let layoutInfo = [...this.state.layoutInfo];
    let { tableItem, sizeItem } = this.props;
    const ratioItem = sizeItem.width / sizeItem.height;
    if (tableItem && layoutItem) {
      const w = parseInt(layoutItem.w * 15 * (ratioItem >= 1 ? ratioItem : 1));
      const h = parseInt(
        layoutItem.h * 15 * (ratioItem < 1 ? 1 / ratioItem : 1)
      );
      if (tableItem.unique === "table") {
        let { name, image, seat_number } = tableItem;
        layout.push({
          ...layoutItem,
          i: tableItem.id,
          w,
          h,
          name,
          image,
          seat_number,
        });
        // xóa Item khi đã nhận được item từ TableList
        this.props.deleteItemDraged(tableItem);
        // Thêm vào mảng tablistInfo nếu là item loại bàn
        layoutInfo.push(tableItem);
      } else if (tableItem.unique === "icon") {
        const id = this.randomStr(20, "yametekudasai123");
        let { icon } = tableItem;
        if (this.isVipRoom(icon)) {
          layout.push({
            ...layoutItem,
            w:
              (((w * 2) / (ratioItem >= 1 ? ratioItem : 1)) * sizeItem.width) /
              100,
            h:
              (((h * 2) / (ratioItem < 1 ? 1 / ratioItem : 1)) *
                sizeItem.height) /
              100,
            i: id,
            icon,
            isEdit: false,
            name: tableItem.name,
          });
        } else {
          layout.push({
            ...layoutItem,
            w: ((w / (ratioItem >= 1 ? ratioItem : 1)) * sizeItem.width) / 100,
            h:
              ((h / (ratioItem < 1 ? 1 / ratioItem : 1)) * sizeItem.height) /
              100,
            i: id,
            icon,
            name: tableItem.name,
          });
        }
      }
      this.setState({
        layout,
        layoutInfo,
      });
    }
  };
  /**
   * Xóa bàn trong lưới lớn
   * change table form list table arranged to list table left
   */
  deleteTableItem = (itemClick) => {
    let { layout, layoutInfo } = this.state;
    let index = layout.findIndex((item) => {
      return item.i === itemClick.i;
    });
    if (index !== -1 && itemClick.image) {
      let currentItem = layoutInfo.find((item) => item.id === itemClick.i);
      layout.splice(index, 1);
      this.props.addItemRemoved(currentItem);
    } else if (index !== -1 && itemClick.icon) {
      if (this.isVipRoom(itemClick.icon)) {
        this.deleteVipRoom(itemClick.i);
      }
      layout.splice(index, 1);
    }
    this.setState({
      layout,
    });
  };
  /** Cập nhật lại vị trí bàn mỗi khi di chuyển */
  onDragStop = (layoutNew, itemold, itemnew) => {
    let { layout } = this.state;
    let index = layout.findIndex((item) => {
      return item.i === itemold.i;
    });
    if (index !== -1) {
      let { x, y, w, h } = itemnew;
      layout[index] = { ...layout[index], x, y, w, h };
      this.setState({
        layout,
      });
    }
  };
  onResizeStop = (layoutNew, itemold, itemnew) => {
    let { layout } = this.state;
    let index = layout.findIndex((item) => {
      return item.i === itemold.i;
    });
    if (index !== -1) {
      let { x, y, w, h } = itemnew;
      layout[index] = { ...layout[index], x, y, w, h };
      this.setState({
        layout,
      });
    }
  };

  /**Lưu thông tin bàn  */
  saveTableArranged = () => {
    let {
      layout,
      areaHeight,
      dataFromGridRoom,
      editVipRoomStatus,
    } = this.state;
    if (editVipRoomStatus === true) {
      Swal.fire({
        icon: "error",
        title: "Thông báo",
        text: "Vui lòng hoàn thành phiên hiệu chỉnh trước đó!",
      });
      return;
    }
    let { areaInfo } = this.props;
    let areaTable_infos = [],
      area_Arranges = [],
      dataArea = {};
    let objectItem;
    layout.map((item, index) => {
      if (item.image) {
        objectItem = this.convertItemToApiForm(item);
        areaTable_infos.push(objectItem);
      } else if (item.icon) {
        if (this.isVipRoom(item.icon)) {
          let table_infos = [];
          let area_arrange_subs = [];
          let objectItemTemp;
          let ListItemByVipRoom = dataFromGridRoom.filter((data, index) => {
            return data.vipId === item.i;
          });
          ListItemByVipRoom.map((item, index) => {
            let { layoutItem, tableInfo } = item;
            layoutItem = this.convertItemToApiForm(layoutItem);
            if (tableInfo.icon) {
              delete layoutItem.table_id;
              area_arrange_subs.push({
                ...layoutItem,
                icon: tableInfo.icon,
                name: tableInfo.name_vn,
              });
            } else {
              table_infos.push(layoutItem);
            }
          });
          objectItemTemp = this.convertItemToApiForm(item);
          delete objectItemTemp.table_id;
          objectItem = {
            ...objectItemTemp,
            icon: item.icon,
            table_infos,
            area_arrange_subs,
            name: item.name,
          };
          area_Arranges.push(objectItem);
        } else {
          objectItem = this.convertItemToApiForm(item);
          delete objectItem.table_id;
          area_Arranges.push({
            ...objectItem,
            icon: item.icon,
            name: item.name,
            table_infos: [],
            area_arrange_subs: [],
          });
        }
      }
    });
    let data = {
      table_infos: [...areaTable_infos],
      area_arranges: [...area_Arranges],
    };
    dataArea = { ...areaInfo, height: areaHeight };
    Swal.fire({
      title: "Thông báo",
      text: "Bạn có muốn lưu sơ đồ bàn mới chỉnh sửa?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        this.props.actions.postTableListArrangementById({
          data,
          areaId: areaInfo.id,
        });

        this.props.actions.editArea({ dataArea, areaId: areaInfo.id });
      }
    });
  };
  /**
   * Chuyển data api thành data của library
   */
  getDataFromProps = (props) => {
    let dataFromGridRoom = [];
    let layout = [];
    let layoutInfo = [];
    if (props.tableArrangement !== null) {
      // Chuyển sang dạng layout library của bàn
      let { table_infos, area_arranges } = props.tableArrangement;
      table_infos.map((item, index) => {
        layoutInfo.push(item.table);
        let objectAdd = { ...this.convertItemFromApiToLayout(item) };
        layout.push(objectAdd);
      });
      // Chuyển sang dạng layout của thông tin phụ
      area_arranges.map((item) => {
        let objectAdd = { ...this.convertItemFromApiToLayout(item) };
        if (objectAdd.area_arrange_subs && objectAdd.table_infos) {
          let { area_arrange_subs, table_infos } = objectAdd;
          area_arrange_subs.map((item) => {
            let tableInfo = { name: item.name, id: item.id, icon: item.icon };
            let layoutItem = { ...this.convertItemFromApiToLayout(item) };
            let data = { tableInfo, layoutItem, vipId: objectAdd.i };
            dataFromGridRoom.push(data);
          });
          table_infos.map((item) => {
            let tableInfo = { ...item.table };
            let layoutItem = { ...this.convertItemFromApiToLayout(item) };
            let data = { tableInfo, layoutItem, vipId: objectAdd.i };
            dataFromGridRoom.push(data);
          });
        }
        layout.push(objectAdd);
      });
    }
    this.setState(
      {
        layout,
        layoutInfo,
        dataFromGridRoom,
      },
      () => {
        this.setState({
          refreshGridRoom: false,
        });
      }
    );
  };
  /**
   * Các hàm chuyển dạng từ api -> layout
   */
  convertItemToApiForm = (layoutItem) => {
    let { x, y, w, h, i } = layoutItem;
    let objectItem = {
      point_x: x,
      point_y: y,
      width: w,
      height: h,
      table_id: i,
    };
    return objectItem;
  };
  convertItemFromApiToLayout = (dataItem) => {
    let { point_x, point_y, width, height, table_id, id } = dataItem;
    let objectItem;
    if (dataItem.table) {
      objectItem = {
        x: point_x,
        y: point_y,
        w: width,
        h: height,
        i: table_id,
        maxH: undefined,
        maxW: undefined,
        minH: undefined,
        minW: undefined,
        name: dataItem.table.name,
        image: dataItem.table.image,
        seat_number: dataItem.table.seat_number,
      };
    } else {
      if (!this.isVipRoom(dataItem.icon)) {
        objectItem = {
          x: point_x,
          y: point_y,
          w: width,
          h: height,
          maxH: undefined,
          maxW: undefined,
          minH: undefined,
          minW: undefined,
          i: id,
          icon: dataItem.icon,
        };
      } else {
        objectItem = {
          x: point_x,
          y: point_y,
          w: width,
          h: height,
          maxH: undefined,
          maxW: undefined,
          minH: undefined,
          minW: undefined,
          i: id,
          icon: dataItem.icon,
          area_arrange_subs: dataItem.area_arrange_subs,
          table_infos: dataItem.table_infos,
          isEdit: false,
          name: dataItem.name,
        };
      }
    }
    return objectItem;
  };

  // Hàm merge 2 mảng objecet ko bị trùng
  mergeByProperty = (arr1, arr2, prop) => {
    _.each(arr2, function (arr2obj) {
      var arr1obj = _.find(arr1, function (arr1obj) {
        return arr1obj.layoutItem[prop] === arr2obj.layoutItem[prop];
      });
      arr1obj ? _.extend(arr1obj, arr2obj) : arr1.push(arr2obj);
    });
  };
  /**
   * Hàm lấy dữ liệu từ VipRoom
   */
  getTableList = (data, vipId) => {
    let { dataFromGridRoom } = this.state;
    let layout = [...this.state.layout];
    this.mergeByProperty(dataFromGridRoom, data, "i");
    let indexLayout = layout.findIndex((item) => {
      return item.i === vipId;
    });
    if (indexLayout !== -1) {
      layout[indexLayout].isEdit = !layout[indexLayout].isEdit;
      for (let i = 0; i < layout.length; i++) {
        if (layout[i].i !== layout[indexLayout].i) {
          layout[i] = { ...layout[i], static: false };
        }
      }
    }
    this.setState({
      layout,
      dataFromGridRoom,
      editVipRoomStatus: false,
      isDroppable: true,
      currentEditRoom: "",
    });
  };
  /**
   * Xóa phòng vip
   */
  deleteVipRoom = (id) => {
    let { dataFromGridRoom } = this.state;
    let deleteList = dataFromGridRoom.filter((item, index) => {
      return item.vipId === id;
    });
    deleteList.map((item, index) => {
      let itemIndex = dataFromGridRoom.findIndex((item2) => {
        return item2.layoutItem.i === item.layoutItem.i;
      });
      dataFromGridRoom.splice(itemIndex, 1);
    });
    this.props.addItemInVipRoom(deleteList);
    this.setState({
      isDroppable: true,
      dataFromGridRoom,
    });
  };
  /**
   * Xóa phần từ được đem bên ngoài để lưu khi xóa bàn bên trong phòng vip
   */
  deleteStateGridRoom = (data) => {
    let { dataFromGridRoom } = this.state;
    dataFromGridRoom = dataFromGridRoom.filter((item) => {
      return item.layoutItem.i !== data.layoutItem.i;
    });
    this.setState({
      dataFromGridRoom,
    });
  };
  /**
   * Xóa bàn trong phòng vip
   */
  deleteItemInGridRoom = (tableItem) => {
    this.props.deleteItemDraged(tableItem);
  };
  /**
   * Thêm bàn vào danh sách khi xóa
   */
  addItemInGridRoom = (itemClick) => {
    this.props.addItemRemoved(itemClick);
  };
  /**
   * Hiệu chỉnh và đánh dấu bàn Vip đang trong tiến trình sửa
   */
  editVipTable = (vipId, status) => {
    let { editVipRoomStatus } = this.state;
    let layout = [...this.state.layout];
    if (status === editVipRoomStatus) {
      return false;
    } else {
      let index = layout.findIndex((item) => {
        return item.i === vipId;
      });
      if (index !== -1) {
        layout[index].isEdit = !layout[index].isEdit;
        for (let i = 0; i < layout.length; i++) {
          if (layout[i].i !== layout[index].i) {
            layout[i] = { ...layout[i], static: true };
          }
        }
        this.setState({
          layout,
          editVipRoomStatus: true,
          isDroppable: false,
          currentEditRoom: vipId,
        });
      }
      return true;
    }
  };
  /**
   * Khi nhấn trở về thì reset layout
   */
  refreshGridLayout = (areaId) => {
    const { editVipRoomStatus } = this.state;
    if (editVipRoomStatus === true) {
      Swal.fire({
        icon: "error",
        title: "Bạn chưa nhấn nút xong",
        text: "Vui lòng hoàn thành phiên hiệu chỉnh trước đó!",
      });
      return;
    }
    this.props.actions.getTableListByAreaId({ area_id: areaId });
    this.props.actions.getTableListArrangementById({ area_id: areaId });
    this.setState({
      refreshGridRoom: true,
      isDroppable: true,
      editVipRoomStatus: false,
    });
  };

  /**
   * Set dynamic width area
   */
  setAreaWidth = (currentRatio) => {
    const newAreaHeight = this.props.areaHeight;
    const areaWidth = newAreaHeight * currentRatio;
    this.setState({
      areaWidth: areaWidth,
      areaHeight: newAreaHeight,
    });
    if (areaWidth > this.refs.tablistWrapper.clientWidth) {
      this.setState({
        isShowScrollRight: true,
      });
    }
  };

  /**
   * Scroll right
   */
  scrollRight = () => {
    this.refs.tablistWrapper.scrollTo(
      this.refs.tablistWrapper.scrollLeft + this.state.areaHeight,
      0
    );
    this.handleScroll(
      this.refs.tablistWrapper.scrollLeft + this.state.areaHeight
    );
  };

  /**
   * Scroll left
   */
  scrollLeft = () => {
    this.refs.tablistWrapper.scrollTo(
      this.refs.tablistWrapper.scrollLeft - this.state.areaHeight,
      0
    );
    this.handleScroll(
      this.refs.tablistWrapper.scrollLeft - this.state.areaHeight
    );
  };

  /**
   * Handle show hide navigate button when scroll
   */
  handleScroll = (scrollLeft) => {
    const { scrollWidth, clientWidth } = this.refs.tablistWrapper;
    if (scrollLeft < scrollWidth - clientWidth) {
      this.setState({
        isShowScrollRight: true,
      });
    } else {
      this.setState({
        isShowScrollRight: false,
      });
    }
    if (scrollLeft > 0) {
      this.setState({
        isShowScrollLeft: true,
      });
    } else {
      this.setState({
        isShowScrollLeft: false,
      });
    }
  };

  /**
   * Render scroll left
   */
  renderScrollLeft = () => {
    return (
      <span
        onClick={this.scrollLeft.bind(this)}
        className={`icon-hand-left icon-hand-custom`}
      >
        <span className="path1"></span>
        <span className="path2"></span>
      </span>
    );
  };

  /**
   * Render scroll right
   */
  renderScrollRight = () => {
    return (
      <span
        onClick={this.scrollRight.bind(this)}
        className={`icon-hand-right icon-hand-custom`}
      >
        <span className="path1"></span>
        <span className="path2"></span>
      </span>
    );
  };

  /**
   * Update name room vip
   */
  handleNameRoom(e, id) {
    const { layout } = this.state;

    let index = layout.findIndex((item) => item.i === id);
    if (index !== -1) {
      layout[index].name = e.target.value;
    }

    this.setState({ layout });
  }

  onResizeInput(e, refInfo) {
    if (e.key) {
    }
  }

  generateDOM() {
    let { layout, areaHeight, editVipRoomStatus } = this.state;
    const { maxRows, tableItem, sizeItem } = this.props;
    return layout.map((item, index) => {
      let dataFromGridRoom = [...this.state.dataFromGridRoom];
      let dataInGridRoom = dataFromGridRoom.filter((item2) => {
        return item2.vipId === item.i;
      });
      return (
        <div
          className={item.isEdit === true ? "cancelDraggableOn" : ""}
          key={item.i}
          data-grid={{ ...item }}
        >
          <div className="image-tag e-table ">
            {this.isVipRoom(item.icon) ? (
              <>
                <div className="e-name-room">
                  <input
                    className="name-room"
                    id={`room-` + index}
                    onChange={(e) => this.handleNameRoom(e, item.i)}
                    type="text"
                    placeholder="Hãy nhập tên"
                    value={item.name ? item.name : ""}
                  />
                </div>
                <RoomGridContainer
                  vipId={item.i}
                  item={item}
                  dataInGridRoom={dataInGridRoom}
                  editVipRoomStatus={this.state.editVipRoomStatus}
                  editVipTable={this.editVipTable}
                  isEdit={item.isEdit}
                  refreshGridRoom={this.state.refreshGridRoom}
                  deleteItemInGridRoom={this.deleteItemInGridRoom}
                  deleteTableItem={this.deleteTableItem}
                  deleteStateGridRoom={this.deleteStateGridRoom}
                  addItemInGridRoom={this.addItemInGridRoom}
                  getTableList={this.getTableList}
                  tableItem={tableItem}
                  sizeItem={sizeItem}
                  height={(layout[index].h * areaHeight) / maxRows - 10}
                  width={(layout[index].w * areaHeight) / maxRows - 10}
                  t={this.props.t}
                />
              </>
            ) : (
              <React.Fragment>
                <img src={item.image ? item.image : item.icon} alt="" />
                <div className="image-tag-overlay">
                  <span className="image-tag-info">
                    {item.image ? item.name : ""}
                    <br />
                      {item.seat_number ? item.seat_number + ` ${
                    this.props.t("table_list:chair")
                  }` : ""}
                  </span>
                </div>
                <div
                  className="e-btn-delete"
                  onClick={() =>
                    item.static === true ? "" : this.deleteTableItem(item)
                  }
                >
                  <FontAwesomeIcon
                    icon={faTimesCircle}
                    style={{
                      fontSize: 22,
                      color: "#f27922",
                      background: "white",
                      borderRadius: "50%",
                      filter: editVipRoomStatus ? "grayscale(100%)" : "",
                    }}
                  />
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      );
    });
  }

  render() {
    const { ...rest } = this.props;
    const { maxRows } = this.props;
    const { layout, areaWidth, areaHeight } = this.state;
    const areaId = this.props.areaInfo.id;
    return (
      <>
        <div className="area-title" style={{ maxWidth: `${areaWidth}px` }}>
          <div className="title-btn">
            <Button
              style={{
                height: "40px",
                lineHeight: "40px",
                backgroundColor: "#898989",
                padding: "0 10px",
                color: "#ffffff",
              }}
              type="s3"
              onClick={() => { window.history.back()
                // this.refreshGridLayout(areaId);
              }}
            >
              <span>Trở về</span>
            </Button>
            <Button
              style={{
                height: "40px",
                lineHeight: "40px",
                backgroundColor: "#F58F1C",
                padding: "0 10px",
                color: "#ffffff",
                marginLeft: "10px",
              }}
              onClick={this.saveTableArranged.bind(this, areaId)}
            >
              <span>Lưu</span>
            </Button>
          </div>
          <h3
            className={
              areaWidth <= areaHeight ? "title-name title-custom" : "title-name"
            }
          >
            {rest.areaInfo.name}
          </h3>
        </div>

        <div ref="tablistWrapper" className="area-tableList-wrapper">
          <GridLayout
            {...this.props}
            draggableCancel=".cancelDraggableOn"
            draggableHandle=".image-tag-overlay"
            isDroppable={this.state.isDroppable}
            layout={layout}
            onDrop={this.onDrop}
            onDragStop={this.onDragStop}
            onResizeStop={this.onResizeStop}
            rowHeight={areaHeight / maxRows}
            style={{ width: areaWidth, minHeight: areaHeight }}
            width={areaWidth}
            cols={100 * this.props.currentRatio}
            autoSize={true}
          >
            {this.generateDOM()}
          </GridLayout>
        </div>

        {this.state.isShowScrollRight ? this.renderScrollRight() : null}
        {this.state.isShowScrollLeft ? this.renderScrollLeft() : null}
      </>
    );
  }
}
