
import React from 'react';
import BgPrintTable from '../../../images/bg-qr-code_circle.jpg';
import logoOmenu from '../../../images/omenu-1.png';
import vietel from '../images/vietel.jpg';
import zalo from '../images/zalo.jpg';
import vnpay from '../images/vnpay.jpg';
import './PDFContentCircle.scss';
import {
  faPhoneAlt, faEnvelope
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import QRCode from "qrcode.react";
import LogoImage from "../../../images/logo-qr-code.svg";

export class PDFContentCircle extends React.PureComponent {

  render() {
    const { tableListAll, name, logoImage, t, infoPartnerSetting } = this.props;

    return (
      <div className="PDFContentCircleSCSS">
        {tableListAll.map((table, index) => {
          return (
            table.qrcode_table != "" ?
              <div className="content-pdf"
                key={index} style={{
                  backgroundImage: `url(${BgPrintTable})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "100% 100%"
                }}>
                <div className="content-all">
                  <div className="header-logo-name e-flex item-center">
                    <div className="logo-name-res content-end">
                      <div className="logo-res">
                        {logoImage ? <img src={logoImage} alt="***" className="e-m-right-5" /> : ""}
                        <span>{name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="content-container">
                    <div className="content-qr-pro">
                      <div className="content-right-qr">
                        <div className="logo-omenu">
                          <img src={logoOmenu} />
                          <div className="name-omenu">
                            <div className="title-name-omenu">OMENU.VN </div>
                            <div className="name-email">hotro@omenu.vn</div>
                          </div>
                        </div>
                        <div className="content-qr">
                          <QRCode
                            value={table.qrcode_table}
                            size={200}
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
                      <div className="name-content-left">
                        <span>
                          Quét QR code để xem menu và gọi món
                      </span>
                      </div>
                    </div>
                  </div>
                  <div className="content-name-table">
                    <span className="name-table">
                      Bàn {table.name}
                    </span>
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