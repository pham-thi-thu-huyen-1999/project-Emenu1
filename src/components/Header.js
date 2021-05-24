import React, { Component, useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { withNamespaces } from "react-i18next";
import { Notification } from "./Notification";
import { getPartnerById } from "../api/partner";
import { getOrderForm } from "../api/order";
import { getPartnerSetting } from "../api/partnerSetting";
import { updateStatusRead } from "../api/notification";
import { getNotifications } from "../api/notification";
import { getTotalListReqPayment } from "../api/requestPayment";
import { getTotalListBooking } from "../api/bookingTable";
import moment from "moment";
import { getAccountInfoStaff } from "../api/account";
import common from "../utils/common";
import { get, save } from "../services/localStorage";
import Logout from "./Logout";
import CheckOut from "./CheckOut";
import Calendar from "./Calendar";
import _ from "lodash";
import defaultUserLogo from "../images/avatar.png";
import defaultResImg from "../images/logo-omenu.png";
import emenuWelcome from "../images/emenu-welcome.png";
import Swal from "../utils/sweetalert2";
import { isMobile, isTablet } from 'mobile-device-detect';
import { history } from "../App";

import {
  faCompress,
  faExpand,
  faChevronUp,
  faChevronDown,
  faBars,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import audio from "../utils/audio";
import {
  TEMP_CONTRACT, TRIAL_CONTRACT, OFFICIAL_CONTRACT,
  OmenuUrl, OmenuPhoneNumber, OmenuEmail, OmenuUrlName, userRoleCheck, foundRole
} from "../consts/settings/partnerContract";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import * as actions from "../containers/TableList/actions";
import { STATUS_CONFIRM } from "../consts/settings/notification";
import { name as nameNoti } from "./Notification/reducers";
import * as actionsNoti from "./Notification/actions";
import { KITCHEN, BAR, TAKE_AWAY, BOOK_TABLE} from "./Notification/constants"

export const name = "header";
/**
 * Restaurant info component
 */
let userRole = common.decodeToken(get('accessToken')).role;

const RestaurantInfo = ({ partnerInfo, passPropsToTableScreen, isShowMoreFeature }) => {

  return (
    <Link to="/" onClick={() => passPropsToTableScreen()}>
      <div className="restaurant-info">
        <div className="restaurant-logo-container">
          <img
            className="restaurant-logo"
            src={ partnerInfo.logo ? partnerInfo.logo : defaultResImg }
            onError={((e) => loadDefaultResImg(e))}
            alt="res_logo"
          />
        </div>
        {isShowMoreFeature ? ""
          : <div className="restaurant-name-contaniner">
            <span className="restaurant-name">{partnerInfo.name}</span>
          </div>}
      </div>
    </Link>
  );
};
// load default avt if current avt fail
const loadDefaultUserAvt = (event) => {
  event.target.src = defaultUserLogo
}
// load default restaurant img if fail
const loadDefaultResImg = (event) => {
  event.target.src = defaultResImg
}
/**
 * Header user component
 */
const HeaderUser = (props) => {
  const {
    isShake,
    toggleNotifications,
    stopShake,
    userInfo,
    toggleUser,
    totalNotiUnread,
    isShowMoreFeature,
    forwardRefUser
  } = props;
  /**
   * Get current date
   */
  const currentDate = () => {
    return moment().format("dddd, DD-MM-YYYY").toUpperCase();
  };
  return (
    <div className="header-user" ref={forwardRefUser}>
      {isShowMoreFeature ? ""
        : <div className="current-date">{currentDate()}</div>
      }
      <div
        id="header__noti-icon"
        className={`notification-icon-container ${isShake ? "shake" : ""}`}
        onAnimationEnd={() => stopShake()}
        onClick={() => toggleNotifications()}
      >{totalNotiUnread > 0 ? <span className="total-noti">{totalNotiUnread}</span> : ""}
        <img
          src="/images/bell2.png"
          alt="notification_ico"
          className="notification-icon"
        />
      </div>
      <div className="user-avatar-container" onClick={() => toggleUser()}>
        <img
          src={defaultUserLogo}
          alt="user_avatar"
          className="user-avatar"
          onError={((e) => loadDefaultUserAvt(e))}
        />
      </div>
    </div>
  );
}

/**
 * Button link
 */
const ButtonLink = (props) => {
  const { path, className, dataIndex, active, is_disable } = props;
  const [classAnimation, setClassAnimation] = React.useState('')
  const buttonRefs = React.useRef();

  React.useEffect(() => {
    buttonRefs.current.addEventListener('animationend', addEventAnimationEnd);
    return () => {
      buttonRefs.current.removeEventListener('animationend', addEventAnimationEnd);
    }
  }, [])

  const addEventAnimationEnd = () => {
    setClassAnimation('');
  }

  /**
   * Play animation
   */
  const runAnimation = () => {
    setClassAnimation('animated-btn');
  }

  /**
   * Play audio
   */
  const runAudio = () => {
    const isAudio = audio.getAudioLocal();
    if (isAudio) {
      new Audio(require('../audios/sell3.mp3')).play();
    }
  }

  /**
   * Handler clicked button
   */
  const handleClick = (e) => {
    const { disabled, onClick } = props;
    if (!disabled) {
      runAudio();
      runAnimation();
      if (typeof onClick === 'function') {
        onClick(e);
      }
    }
  }
  const showSupportModal = () => {
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
              <div><img src={defaultResImg} /></div>
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
  const actionLink = (e, isDisabled) => {
    if (isDisabled === "disable") showSupportModal()
    else handleClick(e);
  }

  return <NavLink
    className={`${className} ${classAnimation} ${is_disable === "disable" ? "disabled-link" : ""}`}
    onClick={((e) => actionLink(e, is_disable))}
    to={path}
    activeClassName={active}
    exact
    data-index={dataIndex}
    ref={buttonRefs}
  >
    {props.children}
  </NavLink>
}

/**
 * Header features
 */
const HeaderFeature = (props) => {
  const {
    trans,
    headerFeatures,
    forwardRef,
    isShowMoreFeature,
    showMoreFeature,
    isShowMoreFeatureMenu,
    passPropsToTableScreen,
    subFeature,
    quantityNotis,
  } = props;
  const { resetQuantityNoti } = props.actions;
  return (
    <React.Fragment>
      <div
        className={`header-feature-wrapper ${isShowMoreFeature && subFeature.length > 0 ? "has-more" : ""
          }`}
      >
        <div className={`header-feature`} ref={forwardRef}>
          {headerFeatures.map((feature, index) => {
            return (
              <ButtonLink
                className={`feature-item ${!feature.isShow ? "hidden" : ""}`}
                key={index}
                path={feature.route}
                dataIndex={index}
                active="active"
                is_disable={feature.is_active}
                onClick={() => {
                  resetQuantityNoti({
                    type: feature.keyNoti || "",
                    quantity: -1
                  });
                  passPropsToTableScreen()
                }}
              >
                <div className="feature-icon-container">
                  <img
                    className="feature-icon"
                    src={`${feature.icon}`}
                    alt={feature.feature_name}
                  />
                </div>
                <span className="feature-name">
                  {trans(`layout:header.feature.${feature.feature_name}`)}
                </span>
                {feature.keyNoti && quantityNotis[feature.keyNoti]? (
                  <span className="notification-count">
                    {quantityNotis[feature.keyNoti]}
                  </span>
                ) : null}

              </ButtonLink>
            );
          })}
        </div>
        {isShowMoreFeature && subFeature.length > 0 ? (
          <ButtonLink className="more-button" path="#" onClick={() => showMoreFeature()}>
            <FontAwesomeIcon
              icon={isShowMoreFeatureMenu ? faChevronUp : faChevronDown}
              color={"#fff"}
            />
          </ButtonLink>
        ) : null}
      </div>
      <div className="table-menu-container" onClick={() => showMoreFeature()}>
        <div className="mobile-menu-container">
          <FontAwesomeIcon
            icon={isShowMoreFeatureMenu ? faTimes : faBars}
            color={"#fff"}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

/**
 * User setting
 */
const UserSetting = (props) => {
  const { userInfo, partnerInfo } = props;
  const hasCheckInOut = get("is_checkin_out") ? get("is_checkin_out") : false;
  const showFullAccInfo = partnerInfo.contract_type === TEMP_CONTRACT || moment.utc(new Date()).isAfter(new Date(partnerInfo.end_time)) ? false : true;
  return (
    <div className="user-setting">
      <div className="user-setting-item">
        <div className="logout-button-group">
          <div className="logout-icon-container">
            <img
              className="logout-icon"
              src={require("../images/avatar.png")}
              alt="user-setting"
            />
          </div>
          <span>
            {userInfo && userInfo.full_name ? userInfo.full_name : ""}
          </span>
        </div>
      </div>

      {hasCheckInOut && showFullAccInfo && userRole.indexOf(userRoleCheck.calendar) !== foundRole ? (<div className="user-setting-item">
        <Calendar />
      </div>) : null}
      {hasCheckInOut && showFullAccInfo && userRole.indexOf(userRoleCheck.checkInOut) !== foundRole ? (<div className="user-setting-item">
        <CheckOut />
      </div>) : null}
      <div className="user-setting-item">
        <Logout />
      </div>
    </div>
  );
};

/**
 * Feature sub menu
 */
const FeatureSubMenu = (props) => {
  const { subFeature, trans } = props;
  return (
    <div className={`header-sub-menu`}>
      {subFeature.map((feature, index) => {
        return (
          <ButtonLink
            className={`feature-item`}
            key={index}
            path={feature.route}
            dataIndex={index}
            is_disable={feature.is_active}
          >
            <div className="feature-icon-container">
              <img
                className="feature-icon"
                src={`${feature.icon}`}
                alt={feature.feature_name}
              />
            </div>
            <span className="feature-name">
              {trans(`layout:header.feature.${feature.feature_name}`)}
            </span>
            {feature.notificationCount ? (
              <span className="notification-count">
                {feature.notificationCount}
              </span>
            ) : null}
          </ButtonLink>
        );
      })}
    </div>
  );
};

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowNotification: false,
      isShowMoreFeature: false,
      isShake: false,
      userInfo: null,
      isShowUserSetting: false,
      isShowMoreFeatureMenu: false,
      partnerInfo: {
        logo: null,
        name: null,
      },
      qtyOrder: 0,
      headerFeatures: [],
      subFeature: [],
      notifications: [],
      isResetData: false,
      totalNotiUnread: 0
    };
    this.headerFeaturesRef = React.createRef();
    this.headerFeaturesRefUser = React.createRef();
  }
  componentDidMount() {
    this.getPartnerInfo();
    this.getPartnerSetting();
    this.getStaffInfo();
    this.onResize();
    window.addEventListener("resize", this.onResize.bind(this));
    document.addEventListener("click", this.clickOutSite);
  }
  componentDidUpdate(prevProps, prevState) {
    if (!this.state.isShake && 0) {
      setTimeout(() => {
        this.setState({ isShake: true });
      }, 0);
    }
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize.bind(this));
  }
  clickOutSite = (event) => {
    const { target } = event;
    if (this.headerFeaturesRef.current === null) {
      return;
    }
    if (
      !this.headerFeaturesRef.current.contains(target)
      && target.outerHTML !== `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAC5RJREFUeNrsXd9TE1kWjj0QZhFwCFklWAbQjNYyhWiJiRKxiEwBQ5XjVOnL1vyJsw/j7ANimWAZgwMmBZoapsAoAQYImoRdAluVwMh+ycX25nan05307QSY80AZJN19vj7nOz/u6dsn9vf3TRWSRCKRSqXwM5PJxONxhb+0Wq1ms7mlpaWxsRE/K3XBJ4wEC6BEo9G1tTUAtJVKWXJirqvL/jSblb+YTCYz6XQyJ005yNra2jo6OpS/ePjAAjTRnNTU1rbabK2trQSj0kHPoRaDrK/v7e525MQAi+MIFrGjYDB4BvDYbI6vv+Z0osibN0BtIxbr7e3lamtcwNre3gZGW1tb59rbHQ5HOUakydwikcjK0lJTUxNQa2hoqHawANPExET9yZOwI1hTRWgYVgZb+9/Ojsfj0Rcy3cCC0z19+vTPjx+vXL1qqVzAEiWZSMzOzHwhCAMDA3o5pj5ghUKh1dXV6y5XNcDEQPZyaurs2bPXrl2rPFgwKPjdVxYLDMpUrQIT+08yCa8s08TKAiscDi8uLrr7+xsaG03VLdupVMDv7+zs7O7urgBYhKFu3b5tOjzy/NkzwmLGgQXXGx8fv3zlSqXiXZmx8vXs7PDwcAkuqRksJAeBQABIVRuXa2J94OV2u7UmFtrAQuECpDyDg8bkmVwz2AmvF3hpKpIErTZ1BJCCQAUoAnWglP5gkRQBge8IICXiBXWgFFTTEyzC6L1OZ/WnCJoE6kApqKYSL1VgEaQOL6MrCJQieOlD8Minzp47Z29vNx1dWV5aWl1ZKZp/FQELOfrex49d33xjOuoy99tvNYKgnN8LyonCH6urxwEpCNSEslC5FLDAeYHJyVv9/aZjI1AWKiuQvaBAVdedziOTKKhMJqAyFNcGVjQa/Vt9/ZEMf0WDIxSH+mrBgh2+DoeruT/FVaA41Jd1RploGAqFrKdPH8aOgo6difj799LmqiAtABEUjjNSEKgPEKRlIwtWMBh0ulymYy8AAVAogQUs/7u1dQx5XZbpAQVjXAJjVseW12WZnjEugQ6CH+LxY85WDHMBEDosfgZrfn7+mFQ2mmogwCJ+rPkM1sLC8MiI8RcUefMmmUgkk0mZlNpsBnc4HI5K9dHsdvv4o0didV0j1szNzc1GFjeZdPq537+yvKz8Z/iDVzMztWYzCjfj20QABLAAHNKqP0hKjWxaAabZmZnf5+a0frE5t+5tMGR0q+uAs9bW1oy5CJz7Xz/9VAJSkM1kcsLr9T15AriN88T2doDzmeCzPmixGHDi58+eQdtd1QsEhRwTcCcVG0/6CsAhfa6sGxrTDoVFyDLUBYcDLJ6dncxPhmE+sVgMxI8IsCOpPMBidwYHjUl0xCZqFqzHjx939/RwTdxhU28jEekdwx0qOj65nUrhcqWeC7xGvvvOgHoDVhx+9WpoaCjrhvF4nOspQedSpDyDg9//8IOaQVPkDc4bN/75449nWlvp38OdH42NGcBfAIdMngsof05yGL+k2x2I/fRvcLq79+5pjSeI4iOjo//o6mLw8nm9BngirhlACalUqoEnWEimpFxTsiHDxMBx9G82YjGQGm+wABGAEhAX+eXH4BqGm8tnmVu3bzP+CDfn7YyACEAJKBQt3PIGgEV/7NFpNhfZfC01XYX7sVysEiiXtiwWACWAujhN2SP/pM0Kbq9X/wf3mUl0mLuif91jNgMogTgkJ7CY9pCOB3fkMxeSe2QYXDkrGw2Rm3LiLMY1UMHrSyIMc3H1RJwOQAmZ8ooPhUSOLmugmO4tDSZHQ47Ct/4HZ/E7NP2RR13CmCqnu04LL7BQ1jHRhEeziU6nN/LPeJjAkkYTfrxrmAimv+QvsLiAxelpWcZBNE1Qa4i51DLHSf4uKYBNeARdA8BCFkpnJw2ceyc2m42XGzLhj8f9MCDgspbV1tbG47ZnF5Goq0dc170xwJRTXFvMgKiuri7rhpwIpTW/HJkraUVHwQeZjj5zOt3BArkLVquVUwkqbQzoeKLpqSn64wXOz/ijemtsbMxGQ06WxdS6IGNGw3LoljErfptGiJaVBQtuuMMHLFNuJIz+CA2nf/21fAdk+u7n7HauhAW23UwmD6IhPJHTmqWlpYVpmf8+N1dOyxzX7ZMs0/IeVUQ2R7LRLFjALMatCoUmtfmFYcDvn81f71FvU788fLiZP2/Tc/Uq7xkbgIOc4QAs/ItfMwi8K31M49XMjNaRBSQKQIphjGZDtkggGekBWLCxnZ0dfiezt7f3SFQiIwtqXDJLUk+eSIckyIo0b6RwRzc+WdbByNGLFy+sp09zHaQBtcsOz0BnJN84NZOCZzIZWBP4YlNuzg2VYDnrj+oFt3N1ZWVoaMgkDrPBzN6+e8cVLOeNG4hZz/1+xkDwEbdOU+sO4e+WUQ8g44ZdOH8+r0XT0dGxubnJ+8S4Gd/fu3emjFQbZnjd5brz7bfGIEXqBIBDPn5+HCUUCn1ZX887uxMpEwFRkzUBJpQEXV1dRs5your4sLFBfNBED+BeunTJ6/MZAxb8cQT5yvp6LDepoJwVkwEuwzYtY8By9/WJH2voftCppiYYnmGjwdn9/2w2xH4yrSytusrfHbBMaj+RIygZsIhxwTuM34sHhlOFz8AAiuu9vfRv8sBCTAwGgzoal7jtI1tjNzTY7XatJgMDlC4741DZDTz1xhpBEGZ18eLFgmBB+vr6dDGuohQeyC1Tk/QKChe6PTgOSbiAuAK1Ie2Cz+roE9NTU4xZyYCFbP4LQcAlllzHq490dHrVLLevK6xS5WgzcHwbicDudImYuP4v6+oYszLJPskKovX5fMOjoyU4nZqHJnhLmY9jkHJ9ZHjYJjEX+U0wShj2BqEAKdnSRKxpSrMaumymrQ83VcExUY2WVmOjDv3q1KmbN29K/6tG9gvd3d3j4+PgYJVMD5t6NDYmVR5U4nS5sqxU4DhIZMBHhdQmEIPQcNtkKZwEEFmvJ1O/WvFCuoD7PXjnjuz/FtxeRb0zEqQYmwJ5Q0P1vpDM7d2d19vJPRKm/uvAXTpA7u7vV59m4yBQxDMwQOdWqsCCLCwsbLx/jwJYE1KACfezIg95gm6kM/fq8frl55/Pd3Yq7GiqtMiKcPDn3h6zPCcNsTRSKE1GRkcr9TgsnB3Zgzu/14grVNM0B8p/t1qV934tsiI9MDDwLhIpdDJkCfRtPKNrplOywI5ovNSsKkGRP5aXi24JVXz53uPxvJyell3yoy+CdOOqpFJh8AL9K/gHVHs9O3v37t2ihy0OFogWlXfA72da5rgbtAOCp6pqlx/gRTfOCs1+Qyn125aqGgxBWu92uye8Xhovun2OyzKmt6NJ6LwBxiV1DrIB5+XLl1UOJqqdohHxEk9J17TVuRsE4gxtXEwRXsJWpRpGjghe42Nj4Hv4oJiCZovYat0NgrZ32hWgwr8fPtS6qWuNpnPj0HBvJPf0OJG+TwPoK7i2wKd/iwwL1JDfQxGtU4+ah9kIXnR5Uc171zDj3+T1Ay+npkpAylTaAC5O8+DBA/FkBs9Xa85UqctDroN8CllCaZO0QslXcP/+fVKaJwt0GqpQ9nZ3S0ZKM2dJmxNWqxUUBvN2ulzVvJsikgOUMuW8ZsCkyws/tre3JycnP8TjSCCqLdtC1PZ5vdaWFl1eK6Pbq2QWFhaCweBBA6sKKB8wgaGQ3wAmm06ZjZ4vKcpkMuFwOBQKXXA4KvuSIoQ8JApwOl3eIMMFLNErYWJra2v7uZzQsAV3lBbI0VEDwpq6c6L701UcX6wWjUZhaPFEwkHW33m+WG15aYlMcECkqzKHACwi6+vrsLL5+XlYXKFtZzT7ezoNI8IBiTXVmc2wo87OTt4Zn3Evg4Rqi4uLwC4ej+9/WkkGr8FZirIbQMHXs++DzC24buYmYkmn3Jg3GxoNFmNu6XQ6kUjA6KB/oljbV3zHKBGDX5gpyv8FGADp5sX3opZRKAAAAABJRU5ErkJggg==" alt="user_avatar" class="user-avatar">`
    ) {
      this.setState({ isShowUserSetting: false })
    }
  }
  /**
   * Get partner info
   */
  getPartnerInfo = async () => {
    try {
      const data = await getPartnerById();
      if (data.data && data.data.data) {
        if (!data.data.data.contract_type_id) {
          history.push("/login");
        }
        else this.setState({
          partnerInfo: {
            logo: data.data.data.logo,
            name: data.data.data.name,
            contract_type: data.data.data.contract_type_id,
            end_time: data.data.data.contract_end_time
          },
        });
      }
    } catch (error) { }
  };
  /**
   * Get Order List
   */
  getOrderList = async () => {
    try {
      const data = await getOrderForm({ page: "", limit: "" });
      if (data.data && data.data.data) {
        this.setState({
          qtyOrder: data.data.total,
        });
      }
    } catch (error) { }
  };
  /**
   * Get partner setting
   */
  getPartnerSetting = async () => {
    try {
      await this.getOrderList();
      const data = await getPartnerSetting();
      if (data.data && data.data.data) {
        save("is_table", data.data.data.is_table);
        const is_Disabled_link = this.state.partnerInfo.contract_type === TEMP_CONTRACT || moment.utc(new Date()).isAfter(new Date(this.state.partnerInfo.end_time)) ? true : false;
        const disableIsTriaAndIsConfiCal = (
          (this.state.partnerInfo.contract_type === TRIAL_CONTRACT)
          || (this.state.partnerInfo.contract_type === OFFICIAL_CONTRACT))
        if (!data.data.data.is_table) {
          this.setState({
            headerFeatures: [
              {
                icon: require("../images/HeaderIcon/Dish.png"),
                feature_name: "FEATURE_KITCHEN",
                route:  is_Disabled_link || userRole.indexOf(userRoleCheck.kitchen) === foundRole ? "#" : "/dish-processing",
                notificationCount: 0,
                keyNoti: KITCHEN,
                isShow: true,
                is_active:  is_Disabled_link || userRole.indexOf(userRoleCheck.kitchen) === foundRole ? "disable" : ""
              },
              {
                icon: require("../images/HeaderIcon/Dish.png"),
                feature_name: "FEATURE_BAR",
                route:  is_Disabled_link || userRole.indexOf(userRoleCheck.kitchen) === foundRole ? "#" : "/dish-processing-bar",
                notificationCount: 0,
                keyNoti: BAR,
                isShow: true,
                is_active:  is_Disabled_link || userRole.indexOf(userRoleCheck.kitchen) === foundRole ? "disable" : ""
              },
              // {
              //   icon: require("../images/HeaderIcon/Payment.png"),
              //   feature_name: "FEATURE_PAYMENT",
              //   route: "/payment/order",
              //   notificationCount: 99,
              //   isShow: true,
              // },
              {
                icon: require("../images/HeaderIcon/Payment.png"),
                feature_name: "FEATURE_REQUEST_PAYMENT",
                route: is_Disabled_link || userRole.indexOf(userRoleCheck.payment) === foundRole ? "#" : "/request-payment",
                notificationCount: this.state.totalReqPayment,
                isShow: true,
                is_active:  is_Disabled_link || userRole.indexOf(userRoleCheck.payment) === foundRole ? "disable" : ""
              },
              {
                icon: require("../images/HeaderIcon/TakeAway.png"),
                feature_name: "FEATURE_ORDER",
                route:  is_Disabled_link || userRole.indexOf(userRoleCheck.takeaway) === foundRole ? "#" : "/takeaway",
                notificationCount: parseInt(this.state.qtyOrder),
                keyNoti: TAKE_AWAY,
                isShow: true,
                is_active:  is_Disabled_link || userRole.indexOf(userRoleCheck.takeaway) === foundRole ? "disable" : ""
              },
              {
                icon: require("../images/HeaderIcon/Setting.png"),
                feature_name: "FEATURE_MANAGEMENT",
                route: "/menu",
                isShow: true,
              }
            ],
          });
        } else {
          // this.setState({
          //   headerFeatures: [
          //     {
          //       icon: require("../images/HeaderIcon/Table.png"),
          //       feature_name: "FEATURE_TABLE",
          //       route: userRole.indexOf(userRoleCheck.tableList) === foundRole ? "#" : "/",
          //       isShow: true,
          //       is_active: userRole.indexOf(userRoleCheck.tableList) === foundRole ? "disable" : ""
          //     },
          //     {
          //       icon: require("../images/HeaderIcon/Table.png"),
          //       feature_name: "FEATURE_BOOKING_TABLE",
          //       route: disableIsTriaAndIsConfiCal || is_Disabled_link ? "#" : "/booking-table",
          //       notificationCount: this.state.totalBooking,
          //       isShow: true,
          //       is_active: disableIsTriaAndIsConfiCal || is_Disabled_link ? "disable" : ""
          //     },
          //     {
          //       icon: require("../images/HeaderIcon/Dish.png"),
          //       feature_name: "FEATURE_KITCHEN_BAR",
          //       route: is_Disabled_link || userRole.indexOf(userRoleCheck.kitchen) === foundRole ? "#" : "/dish-processing",
          //       notificationCount: 0,
          //       isShow: true,
          //       is_active: is_Disabled_link || userRole.indexOf(userRoleCheck.kitchen) === foundRole ? "disable" : ""
          //     },
          //     // {
          //     //   icon: require("../images/HeaderIcon/Payment.png"),
          //     //   feature_name: "FEATURE_PAYMENT",
          //     //   route: "/payment/order",
          //     //   notificationCount: 99,
          //     //   isShow: true,
          //     // },
          //     {
          //       icon: require("../images/HeaderIcon/Payment.png"),
          //       feature_name: "FEATURE_REQUEST_PAYMENT",
          //       route: disableIsTriaAndIsConfiCal || is_Disabled_link || userRole.indexOf(userRoleCheck.payment) === foundRole ? "#" : "/request-payment",
          //       notificationCount: this.state.totalReqPayment,
          //       isShow: true,
          //       is_active: disableIsTriaAndIsConfiCal || is_Disabled_link || userRole.indexOf(userRoleCheck.payment) === foundRole ? "disable" : ""
          //     },
          //     {
          //       icon: require("../images/HeaderIcon/TakeAway.png"),
          //       feature_name: "FEATURE_TAKE_AWAY",
          //       route: disableIsTriaAndIsConfiCal || is_Disabled_link || userRole.indexOf(userRoleCheck.takeaway) === foundRole ? "#" : "/takeaway",
          //       notificationCount: parseInt(this.state.qtyOrder),
          //       isShow: true,
          //       is_active: disableIsTriaAndIsConfiCal || is_Disabled_link || userRole.indexOf(userRoleCheck.takeaway) === foundRole ? "disable" : ""
          //     },
          //     {
          //       icon: require("../images/HeaderIcon/Setting.png"),
          //       feature_name: "FEATURE_MANAGEMENT",
          //       route: "/menu",
          //       isShow: true,
          //     }
          //   ],
          // });
          if (is_Disabled_link) {
            this.setState({
              headerFeatures: [
                {
                  icon: require("../images/HeaderIcon/Table.png"),
                  feature_name: "FEATURE_TABLE",
                  route: userRole.indexOf(userRoleCheck.tableList) === foundRole ? "#" : "/",
                  isShow: true,
                  is_active: userRole.indexOf(userRoleCheck.tableList) === foundRole ? "disable" : ""
                },
                // {
                //   icon: require("../images/HeaderIcon/Table.png"),
                //   feature_name: "FEATURE_BOOKING_TABLE",
                //   route: is_Disabled_link ? "#" : "/booking-table",
                //   notificationCount: this.state.totalBooking,
                //   isShow: true,
                //   is_active: is_Disabled_link ? "disable" : ""
                // },
                {
                  icon: require("../images/HeaderIcon/Dish.png"),
                  feature_name: "FEATURE_KITCHEN",
                  route: is_Disabled_link || userRole.indexOf(userRoleCheck.kitchen) === foundRole ? "#" : "/dish-processing",
                  notificationCount: 0,
                  keyNoti: KITCHEN,
                  isShow: true,
                  is_active: is_Disabled_link || userRole.indexOf(userRoleCheck.kitchen) === foundRole ? "disable" : ""
                },
                {
                  icon: require("../images/HeaderIcon/Dish.png"),
                  feature_name: "FEATURE_BAR",
                  route: is_Disabled_link || userRole.indexOf(userRoleCheck.kitchen) === foundRole ? "#" : "/dish-processing-bar",
                  notificationCount: 0,
                  keyNoti: BAR,
                  isShow: true,
                  is_active: is_Disabled_link || userRole.indexOf(userRoleCheck.kitchen) === foundRole ? "disable" : ""
                },
                // {
                //   icon: require("../images/HeaderIcon/Payment.png"),
                //   feature_name: "FEATURE_PAYMENT",
                //   route: "/payment/order",
                //   notificationCount: 99,
                //   isShow: true,
                // },
                // {
                //   icon: require("../images/HeaderIcon/Payment.png"),
                //   feature_name: "FEATURE_REQUEST_PAYMENT",
                //   route: is_Disabled_link || userRole.indexOf(userRoleCheck.payment) === foundRole ? "#" : "/request-payment",
                //   notificationCount: this.state.totalReqPayment,
                //   isShow: true,
                //   is_active: is_Disabled_link || userRole.indexOf(userRoleCheck.payment) === foundRole ? "disable" : ""
                // },
                // {
                //   icon: require("../images/HeaderIcon/TakeAway.png"),
                //   feature_name: "FEATURE_TAKE_AWAY",
                //   route: is_Disabled_link || userRole.indexOf(userRoleCheck.takeaway) === foundRole ? "#" : "/takeaway",
                //   notificationCount: parseInt(this.state.qtyOrder),
                //   isShow: true,
                //   is_active: is_Disabled_link || userRole.indexOf(userRoleCheck.takeaway) === foundRole ? "disable" : ""
                // },
                {
                  icon: require("../images/HeaderIcon/Setting.png"),
                  feature_name: "FEATURE_MANAGEMENT",
                  route: "/menu",
                  isShow: true,
                }
              ],
            });
          } else {
            this.setState({
              headerFeatures: [
                {
                  icon: require("../images/HeaderIcon/Table.png"),
                  feature_name: "FEATURE_TABLE",
                  route: userRole.indexOf(userRoleCheck.tableList) === foundRole ? "#" : "/",
                  isShow: true,
                  is_active: userRole.indexOf(userRoleCheck.tableList) === foundRole ? "disable" : ""
                },
                {
                  icon: require("../images/HeaderIcon/Table.png"),
                  feature_name: "FEATURE_BOOKING_TABLE",
                  route: is_Disabled_link ? "#" : "/booking-table",
                  notificationCount: this.state.totalBooking,
                  keyNoti: BOOK_TABLE,
                  isShow: true,
                  is_active: is_Disabled_link ? "disable" : ""
                },
                {
                  icon: require("../images/HeaderIcon/Dish.png"),
                  feature_name: "FEATURE_KITCHEN",
                  route: is_Disabled_link || userRole.indexOf(userRoleCheck.kitchen) === foundRole ? "#" : "/dish-processing",
                  notificationCount: 0,
                  keyNoti: KITCHEN,
                  isShow: true,
                  is_active: is_Disabled_link || userRole.indexOf(userRoleCheck.kitchen) === foundRole ? "disable" : ""
                },
                {
                  icon: require("../images/HeaderIcon/Dish.png"),
                  feature_name: "FEATURE_BAR",
                  route: is_Disabled_link || userRole.indexOf(userRoleCheck.kitchen) === foundRole ? "#" : "/dish-processing-bar",
                  notificationCount: 0,
                  keyNoti: BAR,
                  isShow: true,
                  is_active: is_Disabled_link || userRole.indexOf(userRoleCheck.kitchen) === foundRole ? "disable" : ""
                },
                // {
                //   icon: require("../images/HeaderIcon/Payment.png"),
                //   feature_name: "FEATURE_PAYMENT",
                //   route: "/payment/order",
                //   notificationCount: 99,
                //   isShow: true,
                // },
                {
                  icon: require("../images/HeaderIcon/Payment.png"),
                  feature_name: "FEATURE_REQUEST_PAYMENT",
                  route: is_Disabled_link || userRole.indexOf(userRoleCheck.payment) === foundRole ? "#" : "/request-payment",
                  notificationCount: this.state.totalReqPayment,
                  isShow: true,
                  is_active: is_Disabled_link || userRole.indexOf(userRoleCheck.payment) === foundRole ? "disable" : ""
                },
                {
                  icon: require("../images/HeaderIcon/TakeAway.png"),
                  feature_name: "FEATURE_TAKE_AWAY",
                  route: is_Disabled_link || userRole.indexOf(userRoleCheck.takeaway) === foundRole ? "#" : "/takeaway",
                  notificationCount: parseInt(this.state.qtyOrder),
                  keyNoti: TAKE_AWAY,
                  isShow: true,
                  is_active: is_Disabled_link || userRole.indexOf(userRoleCheck.takeaway) === foundRole ? "disable" : ""
                },
                {
                  icon: require("../images/HeaderIcon/Setting.png"),
                  feature_name: "FEATURE_MANAGEMENT",
                  route: "/menu",
                  isShow: true,
                }
              ],
            });
          }
        }
      }
      this.onResize();
    } catch (error) { }
  };
  /**
   * Get staff info
   */
  getStaffInfo = async () => {
    try {
      let infoToken = common.decodeToken(get("accessToken"));
      const data = await getAccountInfoStaff({ id: infoToken.sub });
      if (data.data && data.data.data) {
        this.setState({
          userInfo: data.data.data,
        });
      }
    } catch (error) { }
  };
  updateStatusNotiRead = async (notification_id) => {
    let data = await updateStatusRead({ notification_id, status: STATUS_CONFIRM })
    return data.data.data
  }
  /**
   * Toggle notification
   */
  toggleNotifications = async () => {
    let notifications = [...this.state.notifications];
    if (this.state.isShowUserSetting) {
      this.setState({
        isShowUserSetting: false,
        isShake: true,
        isShowNotification: !this.state.isShowNotification,
        notifications,
        isResetData: true
      });
    } else {
      this.setState({
        isShake: true,
        isShowNotification: !this.state.isShowNotification,
        notifications,
        isResetData: true
      });
    }


  };
  /**
   * On window resize
   */
  onResize = _.debounce(() => {
    if (
      this.headerFeaturesRef.current &&
      this.headerFeaturesRef.current.children &&
      this.headerFeaturesRef.current.children.length
    ) {
      const headerFeatureEl = this.headerFeaturesRef.current.children;
      const headerFeatureArray = [].slice.call(headerFeatureEl);
      headerFeatureArray[headerFeatureArray.length - 1].getBoundingClientRect();
      let features = [...this.state.headerFeatures];
      let subFeature = [];
      let count = features.length;
      headerFeatureArray.forEach((element) => {
        if (
          element.getBoundingClientRect().top > 5 ||
          element.getBoundingClientRect().top === 0
        ) {
          if (element.dataset && element.dataset.index) {
            features[element.dataset.index].isShow = false;
            count -= 1;
            if (element.dataset && (Number(element.dataset.index) + 1) < features.length) {
              subFeature.push(features[(Number(element.dataset.index) + 1)]);
            }
          }
          // if (element.dataset && element.dataset.index) {
          //   features[element.dataset.index].isShow = false;
          //   count -= 1;
          //   subFeature.push(features[element.dataset.index]);
          // }
        } else {
          if (element.dataset && element.dataset.index) {
            features[element.dataset.index].isShow = true;
          }
        }
      });
      if (count < features.length) {
        this.setState({ isShowMoreFeature: true }, () => {
          if (
            headerFeatureArray[count - 1] &&
            (headerFeatureArray[count - 1].getBoundingClientRect().top > 5 ||
              headerFeatureArray[count - 1].getBoundingClientRect().top === 0)
          ) {
            subFeature.push(features[count - 1]);
          }
          this.setState({ subFeature: subFeature });
        });
      } else {
        this.setState({
          isShowMoreFeature: false,
          isShowMoreFeatureMenu: false
        });
      }
      this.setState({
        subFeature
      })
    }
  }, 500);
  /**
   * Toggle user
   */
  toggleUser = () => {
    this.setState({ isShowUserSetting: !this.state.isShowUserSetting });
    if (this.state.isShowNotification) {
      this.setState({ isShowNotification: false });
    }
  };
  /**
   * Toggle full screen
   */
  handleFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      this.setState({
        isFullScrren: false,
      });
    } else {
      document.documentElement.requestFullscreen();
      this.setState({
        isFullScrren: true,
      });
    }
  };
  /**
   * Show more feature
   */
  showMoreFeature = () => {
    this.setState({ isShowMoreFeatureMenu: !this.state.isShowMoreFeatureMenu });
    this.passPropsToTableScreen()
  };
  callbackFunction = (data) => {
    this.setState(state => ({
      notifications: state.isResetData ? state.notifications : data.noti,
      totalNotiUnread: data.total
    }))
  }

  //pass props to Table List
  passPropsToTableScreen = () => {
    this.props.actions.selectQRCodeTable({ table: null });
    this.props.actions.selectInUseTable({ table: null });
  }
  onCallNoti = () => {
    this.setState(state => ({
      isShake: true
    }))
  }
  render() {
    const { t } = this.props;
    const {...rest} = this.props
    const {
      isShowNotification,
      isShake,
      partnerInfo,
      userInfo,
      headerFeatures,
      isShowUserSetting,
      isShowMoreFeature,
      isShowMoreFeatureMenu,
      subFeature,
      totalNotiUnread
    } = this.state;
    return (
      <header className="emenu-header">
        <div className="header-wrapper">
          {isMobile ?
            <></> :
            <div className="full-screen" onClick={this.handleFullScreen}>
              <FontAwesomeIcon
                icon={this.state.isFullScrren ? faCompress : faExpand}
                style={{ fontSize: "20px" }}
              />
            </div>
          }
          <RestaurantInfo partnerInfo={partnerInfo} passPropsToTableScreen={this.passPropsToTableScreen} isShowMoreFeature={isShowMoreFeature} />
          <HeaderFeature
            forwardRef={this.headerFeaturesRef}
            trans={t}
            headerFeatures={headerFeatures}
            isShowMoreFeature={isShowMoreFeature}
            showMoreFeature={this.showMoreFeature}
            isShowMoreFeatureMenu={isShowMoreFeatureMenu}
            passPropsToTableScreen={this.passPropsToTableScreen}
            subFeature={subFeature}
            {...rest}
          />
          <HeaderUser
            isShake={isShake}
            isShowNotification={isShowNotification}
            toggleNotifications={this.toggleNotifications}
            stopShake={() => this.setState({ isShake: false })}
            userInfo={userInfo}
            toggleUser={this.toggleUser}
            notifications={this.state.notifications}
            isShowMoreFeature={isShowMoreFeature}
            totalNotiUnread={totalNotiUnread}
            forwardRefUser={this.headerFeaturesRefUser}
          />
          <Notification
            show={isShowNotification}
            close={this.toggleNotifications}
            parentCallback={this.callbackFunction}
            onCallNoti={this.onCallNoti}
          />
          {isShowUserSetting ? <UserSetting userInfo={userInfo} partnerInfo={partnerInfo} /> : null}
          {isShowMoreFeatureMenu ? (
            <FeatureSubMenu subFeature={subFeature} trans={t} />
          ) : null}
        </div>
      </header>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    ...state[name],
    ...state[nameNoti],
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ ...actions, ...actionsNoti }, dispatch),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(withNamespaces()(Header));