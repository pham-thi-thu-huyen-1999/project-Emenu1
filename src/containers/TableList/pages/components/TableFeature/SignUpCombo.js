import React, { Component } from "react";
import { Dialog, NumberRange, Button } from "../../../../../components/common";
import Swal from '../../../../../../src/utils/sweetalert2';
import * as action from "../../../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withNamespaces } from "react-i18next";
import { TableListReducerName } from "../../../reducers";
import { partner_id } from "../../../../../consts/constants";
import common from '../../../../../utils/common';
import { get, save } from "../../../../../services/localStorage";
class SignUpCombo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      numberCombo: this.props.isCheckSignUpCombo ? this.props.quantityCombo : 1,

    };
  }

  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }

  showOk = () => {
    const { t } = this.props;
    Swal.fire({
      icon: 'success',
      text: t("takeaway.register_combo_success"),
      title: t("takeaway.noti")
    })
    this.props.close();
  }

  showErr = (response) => {
    const { t } = this.props;
    Swal.fire({
      icon: 'error',
      title: t("takeaway.noti"),
      text: t("takeaway.register_combo_fail") + response,
    })
  }

  onRunSignUpComboNew = async () => {
    const { t } = this.props;
    await this.props.onSaveAmountCombo(this.state.numberCombo);
    await this.props.loadDataAgain();
    Swal.fire({
      icon: 'success',
      title: t("takeaway.noti"),
      text: t("dishManagament.swalUpdateSuccess"),
    })
    await this.props.close();
  }

  onSaveOrder = () => {

    const { detailCombo, t } = this.props; //detailCombo is combo choosed
    const tableId = get("table-id")
    let infoToken = common.decodeToken(get('accessToken'));
    Swal.fire({
      title: t("takeaway.noti"),
      text: t("takeaway.swalSaveSignUp"),
      icon: "info",
      showCancelButton: true,
      confirmButtonText: t("takeaway.yes"),
      cancelButtonText: t("takeaway.cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.props.isCheckSignUpCombo === true) {
          this.onRunSignUpComboNew();
        } else {
          if (get("check-table") === true) {
            const data = {
              order: {
                customer_name: "",
                customer_tel: "",
                partner_id: infoToken.partner_id,
                guest_number: 0,
                note: "",
                user_order_id: "",
                table_id: tableId
              },
              order_items: [],
            };
            if (get("ordered-no-price") === true) {
              this.showOk();
            } else {
              this.props.actions.createOrder({
                data,
                call_back_success: this.showOk,
                call_back_fail: this.showErr
              });
              save("ordered-no-price", true);
            }
            save("check-sign-up", true);
          }

          this.props.onSaveAmountCombo(this.state.numberCombo);
          this.props.actions.getComboItemList({ categoryName: "", comboName: "", comboDetail: detailCombo, check: true });
          this.props.close();
          this.showOk();
          save("check-sign-up-combo", false);
          save("is-price", true);
          this.props.history.push(`/order-food-list?combo-id=${detailCombo.id}&combo-name=${detailCombo.name}&is-has-price=true`);
        }
        this.setState({
          errors: {},
        });
      }
    });
  }

  render() {
    const { show, close, t, isCheckSignUpCombo } = this.props;
    return (
      <div>
        <Dialog
          show={show}
          close={close}
          title={t("takeaway.choose_quantity")}
          innerClass="popup-sign-up-combo"
        >
          <div>
            <div className="flex-center">
              <NumberRange
                defaultValue={this.state.numberCombo}
                onChange={amount => this.setState({ numberCombo: amount })}
                max={100}
                min={1}
              />
            </div>
            <div className="flex-center">
              <aside className="acts text-right">
                <Button
                  type="s3"
                  className="grayscale e-m-right-10"
                  onClick={close}
                >
                  {t("takeaway.cancel")}
                </Button>
                <Button
                  onClick={this.onSaveOrder}
                >
                  {t("takeaway.yes")}
                </Button>
              </aside>
            </div>
          </div>
        </Dialog>

      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    ...state[TableListReducerName],
  };
};
const mapDispatchToProps = (dispatch) => {
  const actions = {
    ...action,
  };
  return { actions: bindActionCreators(actions, dispatch) };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces()(SignUpCombo));
