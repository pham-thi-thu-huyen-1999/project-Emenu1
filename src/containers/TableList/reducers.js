import freeze from "deep-freeze";
import { isEmpty } from "lodash";
import { handleActions } from "redux-actions";
import * as actions from "./actions";
import { LIMIT_COMBO_ITEM } from "../TableList/actionTypes";
import pagination from "../../utils/pagination";
import TABLE_CONST from './pages/TableContants';
export const name = "notification";

const initialState = freeze({
  listTable: [],
  listSubIcon: [],
  listVipTable: [],
  isLoading: false,
  combineTable: [],
  selectedQRCodeTable: null,
  selectedInUseTable: null,
  selectedFeature: null,
  selectedTableOrders: null,
  selectedOrder: null,
  combinedTables: [],
  itemComboList: [],
  comboList: [],
  countPage: 0,
  partnerSetting: {},
  orderItem: [],
  categoryItemList: [],
  comboItemListItem: [],
  comboItemList: [], // combo is false
  comboItemAll: [], // All combo
  comboItemDetailOfItem: [], //tra ve item luc moi vao va khi search
  orderId: "",
  isPrice: null,
  infoPostOrderById: {},
  orderItemById: {}, //Lay thong tin order theo order id
  iconNotiTalbe: {},
  notiList: [],
  notiListForTable: [],
  areaId: null,
});

const TableListReducerName = "TableList";

const TableListReducer = handleActions(
  {
    // Get list table
    [actions.getListTable]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
        areaId: action.payload.area_id,
      });
    },
    [actions.getListTableSuccess]: (state, action) => {
      let { data } = action.payload;
      let listSubIcon = data.area_arranges.filter((item, index) => {
        let nameIcon = item.icon.split("/")[item.icon.split("/").length - 1].split("_")[0]
        return nameIcon !== "room.svg"
      })
      let listVipTable = data.area_arranges.filter((item, index) => {
        let nameIcon = item.icon.split("/")[item.icon.split("/").length - 1].split("_")[0]
        return nameIcon === "room.svg"
      })
      return freeze({
        ...state,
        listTable: data && data.table_infos ? data.table_infos : [],
        listSubIcon,
        listVipTable,
        isLoading: false,
      });
    },
    [actions.getListTableFailure]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
        areaId: null,
      });
    },
    // Add combine table
    [actions.addCombineTable]: (state, action) => {
      const { table } = action.payload;
      let newCombineTable = [...state.combineTable];
      newCombineTable.push(table);
      return freeze({
        ...state,
        combineTable: newCombineTable,
      });
    },
    // Remove combine table
    [actions.removeCombineTable]: (state, action) => {
      const { tableId } = action.payload;
      let newCombineTable = [...state.combineTable];
      if (tableId) {
        newCombineTable = newCombineTable.filter((table) => {
          return table.id !== tableId;
        });
      } else {
        newCombineTable = [];
      }
      return freeze({
        ...state,
        combineTable: newCombineTable,
      });
    },
    // Combine table
    [actions.combineTable]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.combineTableSuccess]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
        combineTable: [],
      });
    },
    [actions.combineTableFailure]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
      });
    },
    // Select available table
    [actions.selectQRCodeTable]: (state, action) => {
      const { table } = action.payload;
      return freeze({
        ...state,
        selectedQRCodeTable: table,
      });
    },
    // Deselect available table
    [actions.deselectQRCodeTable]: (state, action) => {
      return freeze({
        ...state,
        selectedQRCodeTable: null,
      });
    },
    // Select in-use table
    [actions.selectInUseTable]: (state, action) => {
      const { table } = action.payload;
      return freeze({
        ...state,
        selectedInUseTable: table,
      });
    },
    // Deselect in-use table
    [actions.deselectInUseTable]: (state, action) => {
      return freeze({
        ...state,
        selectedInUseTable: null,
      });
    },
    // Select in-use table feature
    [actions.selectInUseTableFeature]: (state, action) => {
      const { feature } = action.payload;
      return freeze({
        ...state,
        selectedFeature: feature,
      });
    },
    // Deselect in-use table feature
    [actions.deselectInUseTableFeature]: (state, action) => {
      return freeze({
        ...state,
        selectedFeature: null,
      });
    },
    // Get table order
    [actions.getTableOrders]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.getTableOrdersSuccess]: (state, action) => {
      let data = [];
      if (action.payload) {
        data = action.payload.data
      }
      let listTable = [...state.listTable]
      if (!data.length && action.payload.is_api_data) {
        const targetTable = { ...state.selectedInUseTable };
        targetTable.status = 0;
        const index = listTable.findIndex(table => table.id === targetTable.id);
        listTable.splice(index, 1, targetTable)
      }
      return freeze({
        ...state,
        isLoading: false,
        listTable: listTable,
        selectedTableOrders: data,
      });
    },
    [actions.getTableOrdersFailure]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
        selectedTableOrders: []
      });
    },
    // Select order
    [actions.selectOrder]: (state, action) => {
      const { order } = action.payload;
      return freeze({
        ...state,
        selectedOrder: order,
      });
    },
    // Deselect order
    [actions.deselectOrder]: (state, action) => {
      return freeze({
        ...state,
        selectedOrder: null,
      });
    },
    // Get combined table
    [actions.getCombinedTable]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.getCombinedTableSuccess]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
        combinedTables: action.payload.data
      });
    },
    [actions.getCombinedTableFailure]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
        combinedTables: []
      });
    },
    [actions.changeTableStatus]: (state, action) => {
      let listTable = [...state.listTable]
      const targetTableInfo = { ...listTable.find(table_info => table_info.table.id === action.payload.table_id) };
      const targetTable = { ...targetTableInfo.table };
      targetTable.status = action.payload.status;
      targetTableInfo.table = targetTable;
      const index = listTable.findIndex(table_info => table_info.table.id === targetTable.id);
      listTable.splice(index, 1, targetTableInfo)
      return freeze({
        ...state,
        listTable: listTable
      })
    },
    [actions.getItemComboList]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getItemComboListSuccess]: (state, action) => {
      return freeze({
        ...state,
        itemComboList: action.payload.data.data,
        isLoading: false
      })
    },
    [actions.getItemComboListFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
        isError: true
      })
    },
    [actions.resetItemComboList]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
        itemComboList: {}
      })
    },
    /* [actions.getComboList]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getComboListSuccess]: (state, action) => {
      return freeze({
        ...state,
        comboList: action.payload.data,
        //countPage: pagination(LIMIT_COMBO_ITEM, action.payload.total),
        isLoading: false
      })
    },
    [actions.getComboListFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      })
    }, */
    [actions.getPartnerSetting]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getPartnerSettingSuccess]: (state, action) => {
      return freeze({
        ...state,
        partnerSetting: action.payload.data,
        isLoading: false
      })
    },
    [actions.getPartnerSettingFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      })
    },
    [actions.getOrderItem]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getOrderItemSuccess]: (state, action) => {
      return freeze({
        ...state,
        orderItem: action.payload,
        isLoading: false
      })
    },
    [actions.getOrderItemFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      })
    },
    [actions.getComboItemList]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.getComboItemListSuccess]: (state, action) => {
      return freeze({
        ...state,
        comboItemAll: action.payload.data,
        comboItemList: action.payload && action.payload.comboFalse ? action.payload.comboFalse : [], //Combo has is_price : false
        isPrice: action.payload && action.payload.comboFalse && action.payload.comboFalse.length > 0 ? action.payload.comboFalse[0].is_price : null,
        /* comboItemListItem: action.payload.arrayTemp, */ //So luong item cua combo
        countPage: pagination(LIMIT_COMBO_ITEM, action.payload.total),
        isLoading: false
      });
    },
    [actions.getComboItemListFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },
    [actions.getCategoryItemList]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.getCategoryItemListSuccess]: (state, action) => {
      return freeze({
        ...state,
        categoryItemList: action.payload.data,
        isLoading: false
      });
    },
    [actions.getCategoryItemListFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },
    [actions.getComboById]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getComboByIdSuccess]: (state, action) => {
      //duyet mang lay item
      let arrayTemp = [];
      for (var index = 0; index < action.payload.length; index++) {
        for (var index1 = 0; index1 < action.payload[index].items.length; index1++) {
          arrayTemp.push(action.payload[index].items[index1]);
        }
      }

      return freeze({
        ...state,
        /* comboItemDetail: action.payload.data, */
        comboItemDetailOfItem: arrayTemp,
        isLoading: false
      })
    },
    [actions.getComboByIdFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      })
    },
    [actions.createOrder]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.getNotificationsList]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.createOrderSuccess]: (state, action) => {
      return freeze({
        ...state,
        orderId: action.payload[0].order_id,
        isLoading: false,
      });
    },
    [actions.createOrderFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
        errorMessage: action.payload.data.error.internal_message,
      });
    },
    [actions.getNotificationsListSuccess]: (state, action) => {
      let data = action.payload.data.data
      return freeze({
        ...state,
        callStaffNotifications: data,
        indexNoti: (action.payload.index + action.payload.data.page_size),
        total: action.payload.data.total,
        isLoading: false
      });
    },
    [actions.getNotificationsListFailure]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
        errorMessage: action.payload.data.error.internal_message,
      });
    },
    [actions.postOrderItemById]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.postOrderItemByIdSuccess]: (state, action) => {
      return freeze({
        ...state,
        infoPostOrderById: action.payload.data,
        isLoading: false,
      });
    },
    [actions.postOrderItemByIdFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
        errorMessage: action.payload.data.error.internal_message,
      });
    },
    [actions.getOrderItemById]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.getOrderItemByIdSuccess]: (state, action) => {
      return freeze({
        ...state,
        orderItemById: action.payload.data,
        isLoading: false,
      });
    },
    [actions.getOrderItemByIdFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
      });
    },
    [actions.postOrderItemComboById]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.postOrderItemComboByIdSuccess]: (state, action) => {
      return freeze({
        ...state,
        infoPostOrderItemComboById: action.payload.data,
        isLoading: false,
      });
    },
    [actions.postOrderItemComboByIdFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
        errorMessage: action.payload.data.error.internal_message,
      });
    },
    [actions.getComboItemListOnly]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.getComboItemListOnlySuccess]: (state, action) => {
      return freeze({
        ...state,
        comboItemAll: action.payload.data,
        isLoading: false
      });
    },
    [actions.getComboItemListOnlyFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },
    [actions.setOrderId]: (state, action) => {
      return freeze({
        ...state,
        orderId: "",
        isLoading: false
      });
    },

    //////////////////////////////////////////////////////////
    [actions.updateIconTableByNoti]: (state, action) => {
      const { data } = action.payload;
      // Lấy ra action của notification
      const { action: actionNoti, table_id } = data;
      // check xem action có nằm trong các action cần cập nhật dữ liệu không
      let { iconNotiTalbe } = state;
      if (table_id) {
        iconNotiTalbe = {
          ...iconNotiTalbe,
          [table_id]: actionNoti,
        }
      }

      let listTable = [...state.listTable];

      switch (actionNoti) {
        case TABLE_CONST.NOTI_ACTION_STAFF_ORDER_ITEM:
          listTable = listTable.map(pointItem => {
            if (pointItem.table && pointItem.table.id === table_id) {
              return {
                ...pointItem,
                table: {
                  ...pointItem.table,
                  status: TABLE_CONST.TABLE_STATUS_IN_USE
                }
              }
            } else {
              return pointItem;
            }
          })
          break;
        case TABLE_CONST.NOTI_ACTION_RESET_TABLE:
          listTable = listTable.map(pointItem => {
            if (pointItem.table && pointItem.table.id === table_id) {
              return {
                ...pointItem,
                table: {
                  ...pointItem.table,
                  status: TABLE_CONST.TABLE_STATUS_EMPTY
                }
              }
            } else {
              return pointItem;
            }
          })
          break;
      }
      new Audio(require('../../audios/ding_noti_table.mp3')).play();
      return freeze({
        ...state,
        listTable,
        iconNotiTalbe,
        isLoading: false,
      });
    },

    //////////////////////////////////////////////////////////
    [actions.getNotis]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.getNotisSuccess]: (state, action) => {
      const { data } = action.payload;
      let iconNotiTalbe = {};
      for (let notiItem of data) {
        let { table_id } = notiItem.body_data;
        let { action: actionNoti } = notiItem.body_data;
        if (table_id && !iconNotiTalbe.hasOwnProperty(table_id)) {
          iconNotiTalbe = {
            ...iconNotiTalbe,
            [table_id]: actionNoti,
          }
        }
      }
      return freeze({
        ...state,
        notiList: [...data],
        iconNotiTalbe,
        isLoading: false
      });
    },
    [actions.getNotisFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
        errorMessage: action.payload.data.error.internal_message,
      });
    },

    //////////////////////////////////////////////////////////
    [actions.getNotisForTable]: (state, action) => {
      const { notiList } = state;
      let notiListForTable = [];
      for (let notiItem of notiList) {
        let { table_id } = notiItem.body_data;
        if (table_id && table_id === action.payload.data.table_id) {
          notiListForTable.push(notiItem);
        }
      }
      return freeze({
        ...state,
        notiListForTable,
        isLoading: false,
      });
    },

    [actions.removeNotiForTable]: (state, action) => {
      let table_id = action.payload;
      let iconNotiTalbe = { ...state.iconNotiTalbe };
      if (table_id) {
        delete iconNotiTalbe[table_id]
      }
      return freeze({
        ...state,
        iconNotiTalbe,
        isLoading: false,
      });
    },
  },
  initialState
);

export { TableListReducer, TableListReducerName };
