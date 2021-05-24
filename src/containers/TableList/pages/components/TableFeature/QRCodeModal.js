import React, { Component } from "react";
import Styles from "../../../scss/TableList.module.scss";
import _ from 'lodash';
import * as actions from "../../../actions";
import { bindActionCreators, compose } from "redux";
import { connect } from "react-redux"
import { TableListReducerName } from "../../../reducers";
import QRCodeGenerator from '../../../../../components/common/QRcode';
import { generateQRCode } from '../../../../../api/table';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dialog } from "../../../../../components/common";
import { faHamburger } from "@fortawesome/free-solid-svg-icons";
import './../../../scss/orderStyleSheet.scss';
import { save } from "../../../../../services/localStorage";
import { withRouter } from "react-router-dom";
class QRCodeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      qrCodeValue: null
    };
  }
  componentDidMount() {
    this.generateQRCode()
  }

  /**
   * Generate QR code
   */
  generateQRCode = async () => {
    try {
      const { data } = await generateQRCode({ table_id: this.props.selectedQRCodeTable.id })
      this.setState({ qrCodeValue: data.data.qrcode_staff })
    } catch (error) { }
  }

  /**
   * Close modal
   */
  closeModal = () => {
    this.props.tableActions.deselectQRCodeTable();
    this.props.onClose();
  }

  OrderFood = () => {
    const {comboItemAll} = this.props;
    save("table-number", this.props.selectedQRCodeTable ? this.props.selectedQRCodeTable.name : '');
    save("table-id", this.props.selectedQRCodeTable ? this.props.selectedQRCodeTable.id : '');
    save("check-table", true);
    save("check-sign-up-combo", true);
    if (/* this.props.partnerSetting.partner_type !== 2 || */ this.props.comboItemAll && this.props.comboItemAll.length <= 0) {
      this.props.history.push("/order-food-list");
    } else {
      if(comboItemAll && comboItemAll.length === 1 && comboItemAll[0].is_price === false)
      {
        save("vi-tri-combo", comboItemAll[0].id);//id cua combo ko co gia dang duoc chon
        this.props.history.push(`/order-food-list?combo-id=${comboItemAll[0].id}&combo-name=${comboItemAll[0].name}`);
      }else {
        this.props.history.push("/order-comboList");
      }
    }
  }

  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    // Normalize translation
    const trans = this.props.trans;
    return (
      <div className={`popup mfp-container mfp-s-ready mfp-inline-holder ${Styles["modal-container"]}`}>
        <div className={`mfp-content ${Styles["modal-wrapper"]}`} style={{ width: '600px', height: '550px' }}>
          <div className={Styles["button-close"]} onClick={this.closeModal.bind(this)}></div>
          <div className={Styles["modal-header-title"]}>
            <span>
              {
                this.props.selectedQRCodeTable ? `${trans('table') } `+ this.props.selectedQRCodeTable.name : ''
              }
            </span>
          </div>
          <div className={`${Styles["modal-content-wrapper"]} ${Styles["modal-qr-code"]}`}>
            {
              this.state.qrCodeValue ?
                <QRCodeGenerator value={this.state.qrCodeValue} /> :
                <QRCodeGenerator value='' />
            }
          </div>
          <div>
            <Button className="m-r-left-235" type="s3" onClick={this.OrderFood.bind(this)}><FontAwesomeIcon
              icon={faHamburger}
              style={{
                fontSize: 30,
                verticalAlign: "middle",
                marginRight: "10px",
              }}
            />{trans('Order')}</Button>
          </div>
          <div className={Styles["modal-action-buttons"]}>
            <button className={Styles["button"]} type="button" onClick={this.closeModal.bind(this)}>
              {
                trans("table_list:ok")
              }
            </button>
          </div>
        </div>
      </div>
    );
  }
}


const mapStateToProps = state => {
  return {
    ...state[TableListReducerName]
  }
}
const mapDispatchToProps = dispatch => {
  return {
    tableActions: bindActionCreators({ ...actions }, dispatch)
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(QRCodeModal);
