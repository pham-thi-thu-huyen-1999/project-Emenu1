import React, { Component } from "react";
import { Link } from "react-router-dom";
import ButtonBase from "../../../components/common/ButtonBase";
import Swal from '../../../../src/utils/sweetalert2';
import Omenu_logo from "../../../images/logo-omenu.png";
import emenuWelcome from "../../../images/emenu-welcome.png";
import {  OmenuUrl, OmenuPhoneNumber, OmenuEmail, OmenuUrlName } from "../../../consts/settings/partnerContract";

class CustomLink extends ButtonBase {
  showSupportModal = () => {
    Swal.fire({
      showConfirmButton: true,
      confirmButtonText: 'Ok',
      width: '800px',
      html: (
        <>
          <div className="supportModal">
            <div className="left_spModal">
              <img src={emenuWelcome} />
            </div>
            <div className="right_spModal">
              <div><img src={Omenu_logo} /></div>
              <p className="note">Nhà hàng chưa đăng ký chức năng này.</p>
              <p className="note">Vui lòng liên hệ <span className="note_5">{OmenuPhoneNumber}</span> và <span className="note_5">{OmenuEmail}</span></p>
              <p className="note note_1">Hoặc</p>
              <p className="note">Chi tiết xem tại <a className="OmenuURL" href={OmenuUrl} target="blank"><i>{OmenuUrlName}</i></a></p>
              <p className="note_2">Để được hướng dẫn cụ thể!</p>
              <p className="note_3">Xin cảm ơn!</p>
            </div>
          </div>
        </>
      )
    })
  }
  actionLink = (dataIndex) => {
    if(dataIndex==="#") this.showSupportModal()
    else this.handleEvent();
  }
  render() {
    const { className, path } = this.props;
    const { classAnimation } = this.state;

    const classCss = className || "";
    return (
        <Link
            to={path}
            className={`${classCss} ${classAnimation}`}
            onClick={((e) => this.actionLink(path))}
            ref={ref => this.elementRef = ref}
        >
            {this.props.children}
        </Link>
    )
  }
}

class ButtonLink extends Component {
  render() {
    const dataLink = this.props.data;
    const { t } = this.props;
    return (
      <ul id="manager-menu">
        {dataLink.map((item, index) => {
          return (
            <li key={index} >
              <CustomLink path={item.class === "disable" ? "#" : item.url} className={item.class === "disable" ? "disabled-link" : ""} >
                <span className="wrap">
                  <span className="ico">
                    <img src={item.iconImg} alt="" />
                  </span>
                  <span className="txt" style={{ textTransform: "uppercase" }}>
                    {t(item.name)}
                  </span>
                </span>
              </CustomLink>
            </li>
          );
        })}
      </ul>
    );
  }
}

export default ButtonLink;