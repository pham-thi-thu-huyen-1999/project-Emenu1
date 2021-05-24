import React from "react";
import { withRouter } from "react-router-dom";
import { withNamespaces } from "react-i18next";
import { bindActionCreators, compose } from "redux";
import { connect } from "react-redux";
import * as paymentActions from "../../actions";
import { PaymentReducerName } from "../../reducers";
import { Button, QRcode } from "../../../../components/common/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import "../stylePrintOrder.scss";
import CompPrintBill from './CompPrintBill';
import CompPrintBillPrint from './CompPrintBillPrint';
import ReactToPrint from 'react-to-print';
import { remove } from '../../../../services/localStorage';
class PrintOrder extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      orderDetail: this.props.orderDetail
    }
  }
  componentDidMount() {
    const { orderId } = this.props.match.params;
    if (orderId) {
      this.props.paymentActions.getOrderDetail({ order_id: orderId });
    }
    this.props.paymentActions.getInfoPartner();
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (JSON.stringify(nextProps.orderDetail) !== JSON.stringify(prevState.orderDetail)) {
      return {
        orderDetail: nextProps.orderDetail
      }
    }
  }
  render() {
    const { orderDetail } = this.state;
    const { ...rest } = this.props
    const { infoPartner, t } = this.props;
    const pageStyle = `
      @page {
        size: auto;
        margin: 10px 10px 10px 10px !important;
      }

      @media all {
        .pagebreak {
          display: none;
        }
      }

      @media print {
        .pagebreak {
          page-break-before: auto;
        }
      }
    `;

    return (
      <div className="print-provisi">
        {orderDetail ? <>
          <CompPrintBill isCheckPayment={true} orderDetail={orderDetail} infoPartner={infoPartner} t={t} {...rest} />
          <div className="e-flex content-center">
            <Button className="e-m-right-5 btn-print">
              <ReactToPrint
                trigger={() => {
                  return <div className="reactToPrint">
                    <a href="#"><FontAwesomeIcon icon={faPrint} /></a>
                  </div>
                }}
                content={() => this.componentRef}
                pageStyle={pageStyle}
              />
              <CompPrintBillPrint isCheckPayment={true} orderDetail={orderDetail} infoPartner={infoPartner} t={t} ref={el => (this.componentRef = el)} {...rest} />
            </Button>
            {/* this.props.history.push(`/payment/order/${orderDetail.id}`) */}
            <Button className="s3"
              onClick={() => { remove("Phu-Thu");this.props.history.push(`/`)}}>
              {t("dishManagaments.close")}
            </Button>
          </div>
        </> :
          <div className="no-data-table e-p-50 e-flex content-center item-center">
            <div>
              <img src={require("../../../../images/no-data.png")} />
              <div className="text">
                <span>{t("requestPayment.noDataOrder")}</span>
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    ...state[PaymentReducerName]
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    paymentActions: bindActionCreators({ ...paymentActions }, dispatch),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(withNamespaces()(PrintOrder));