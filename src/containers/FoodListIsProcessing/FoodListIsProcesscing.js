import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Main } from "./components";
import { withNamespaces } from "react-i18next";
import "./FoodListIsProcessing.css";
import { name } from "./reducers";
import * as action from "./actions";
import { WAITING_ORDER, NOTI_ACTION_CHANGE_ITEM } from "./constants"
import Swal from "./../../utils/sweetalert2";
import common from '../../utils/common';
import { get } from "../../services/localStorage";
class FoodListIsProcessing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMessage: false,
      notiData: null,
    }
  }

  componentDidMount() {
    let infoToken = common.decodeToken(get('accessToken'));
    this.props.actions.getUserInfo();
    this.props.actions.getAreaList({ partner_id: infoToken.partner_id });
    this.props.actions.getOrderFoodList({ data: { order_item_status_id: WAITING_ORDER } });
    const data = {};
    this.props.actions.getOrderByTable({ data });
    this.props.actions.getInfoStaff({ id: infoToken.sub });
  }

  showOk = () => {
    const { t } = this.props;
    let notiData = this.state.notiData || {};
    Swal.fire({
      icon: 'success',
      timer: 5000,
      text: notiData.body || "Có cập nhật mới cho món ăn",
      title: notiData.title || t("foodProcessing.alertTitle")
    })
  }

  showToast = () => {
    const { t } = this.props;
    let notiData = this.state.notiData || {};
    const duration = 10000;
    const type = notiData.action === NOTI_ACTION_CHANGE_ITEM ? "warning" : "info";


    let main = document.getElementById('toast');
    if (!main) {
      let mainElement = document.createElement('div');
      mainElement.id = "toast";
      document.body.appendChild(mainElement);
    }
    main = document.getElementById('toast');
    if (main) {
      const toast = document.createElement('div');
      const delay = (duration / 1000).toFixed(2);
      toast.classList.add("toast", `toast--${type}`);
      toast.style.animation = `showToast ease 0.3s, closeToast linear 1s ${delay}s forwards`;
      toast.innerHTML =
        `<div class="toast__icon">
        </div>
        <div class="toast__body">
          <h3 class="toast__body-title">
            ${notiData.title}
          </h3>
          <p class="toast__body-message">
            ${notiData.body}
          </p>
        </div>
        <div class="toast__close">
          x
        </div>`

      main.appendChild(toast);
      const removeId = setTimeout(() => {
        main.removeChild(toast);
      }, duration + 1000)

      toast.onclick = function (e) {
        if (e.target.closest('.toast__close')) {
          main.removeChild(toast);
          clearTimeout(removeId);
        }
      }
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.showMessage !== prevState.showMessage
    ) {
      return {
        showMessage: nextProps.showMessage,
        notiData: nextProps.notiData,
      };
    }
    return null;
  }

  render() {
    const { ...rest } = this.props;
    const { showMessage } = this.state;
    if (showMessage) {
      this.showToast();
    }
    let listFood = {};
    return <Main {...rest} listFood={listFood} />;
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
)(withNamespaces()(FoodListIsProcessing));
