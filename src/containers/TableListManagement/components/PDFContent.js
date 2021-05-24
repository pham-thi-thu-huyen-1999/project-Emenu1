
import React from 'react';
import BgPrintTable from '../../../images/bg-qr-code.jpg';
import logoOmenu from '../../../images/omenu-1.png';
import vietel from '../images/vietel.jpg';
import zalo from '../images/zalo.jpg';
import vnpay from '../images/vnpay.jpg';
import './PDFContent.scss';
import {
  faPhoneAlt, faEnvelope
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import QRCode from "qrcode.react";
import LogoImage from "../../../images/logo-qr-code.svg";

export class PDFContent extends React.PureComponent {

  render() {
    const { tableListAll, name, logoImage, t, infoPartnerSetting } = this.props;

    return (
      <div className="PDFContentSCSS">
        {tableListAll.map((table, index) => {
          return (
            table.qrcode_table != "" ?
              <div className="content-pdf"
                key={index} style={{
                  backgroundImage: `url(${BgPrintTable})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "100% 100%"
                }}>
                <div className="header-logo-name e-flex item-center">
                  <div className="logo-omenu">
                    <img src={logoOmenu} />
                    <div className="name-omenu">
                      <span className="title-name-omenu">OMENU.VN </span>
                      <span className="name-email">hotro@omenu.vn</span>
                    </div>
                  </div>
                  <div className="logo-name-res content-end">
                    <div className="logo-res">
                      {logoImage ? <img src={logoImage} alt="***" className="e-m-right-5" /> : ""}
                      <span>{name}</span>
                    </div>
                  </div>
                </div>
                <div className="content-container">
                  <div className="content-qr-pro">
                    <div className="name-content-left">
                      <span>
                        Quét QR code để xem menu và gọi món
                      </span>
                    </div>
                    <div className="content-right-qr">
                      <div className="content-qr">
                        <QRCode
                          value={table.qrcode_table}
                          size={227}
                          renderAs={"svg"}
                          imageSettings={{
                            src: LogoImage,
                            x: null,
                            y: null,
                            height: 50,
                            width: 50,
                            excavate: true
                          }}
                        />
                      </div>
                      <div className="text-english">
                        <span>Scan QR code to see MENU and ORDER</span>
                      </div>
                    </div>
                    <div className="content-name-table">
                      <span className="name-table">
                        Bàn {table.name}
                      </span>
                    </div>
                  </div>
                </div>

                {/* <div className="list-payment-method e-flex item-end">
                  <div className="title-connect-payment e-flex item-center">
                    <span>THANH TOÁN TRỰC TUYẾN</span>
                    <img src={require("../../../images/icon-thanhtoan.png")} alt="***" />
                  </div>
                  {infoPartnerSetting && infoPartnerSetting.is_payment_online ?
                    <div className="list-payment">
                      <div className="payment-method">
                        <img src={vietel} alt="***" />
                      </div>

                      <div className="payment-method">
                        <img src={zalo} alt="***" />
                      </div>

                      <div className="payment-method">
                        <img src={vnpay} alt="***" />
                      </div>
                    </div> : null
                  }
                </div> */}
                <div className="footer-file-res e-flex item-center">
                  <div className="item-footer name-company">
                    CÔNG TY TNHH MIDOTA
                    </div>
                  <div className="contact-phone">
                    <div className="item-footer contact-item-phone item-contact">
                      <FontAwesomeIcon icon={faPhoneAlt} />
                      <span>028 6650 3102</span>
                    </div>
                    <div className="item-footer contact-mail item-contact">
                      <FontAwesomeIcon icon={faEnvelope} />
                      <span>contact@midota.com</span>
                    </div>
                  </div>
                </div>
              </div>
              : null
          );
        })}
      </div>
    );
  }
}