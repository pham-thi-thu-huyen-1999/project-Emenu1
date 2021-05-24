import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faLongArrowAltLeft, faSave } from "@fortawesome/free-solid-svg-icons";
import Button from "./../../../../components/common/Button";
import { withNamespaces } from "react-i18next";
import { save, get } from "../../../../services/localStorage";
import Swal from "./../../../../utils/sweetalert2";
import { history } from "../../../../App";
const dbLanguage = [
  {
    id: 1,
    name: "English",
    code: "en",
  },
  {
    id: 2,
    name: "Tiếng Việt",
    code: "vi",
  },
  {
    id: 3,
    name: "日本人",
    code: "jp",
  },
];
class MainLanguage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: dbLanguage.find((i) => i.code === get("lng")) || dbLanguage[0],
      showPopupConfirm: false,
    };
  }

  changeLanguage = (lng) => {
    const { i18n } = this.props;
    i18n.changeLanguage(lng);
    this.showOk();
  };

  showAlert = (lng) => {
    const t = this.props.t;
    Swal.fire({
      title: t("setting.language.swalTitle"),
      text: t("setting.language.swalUpdateLanguage"),
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: t("setting.language.swalAgree"),
      cancelButtonText: t("setting.language.swalCancel"),
    }).then((result) => {
      if (result.value) {
        this.changeLanguage(lng);
      }
    })
  }
  showOk = () => {
    const t = this.props.t;
    Swal.fire({
      icon: 'success',
      text: t("setting.language.swalUpdateSuccess"),
      title: t("setting.language.swalTitle")
    })
  }

  showErr = () => {
    const t = this.props.t;
    Swal.fire({
      icon: 'error',
      title: t("setting.language.swalTitle"),
      text: t("setting.language.swalUpdateFail"),
    })
  }

  render() {
    const { t } = this.props;
    return (
      <div className="promotion">
        <div className="title-setting e-flex content-center item-center">
          <div className="btn-back">
            <Button className="s3"
              onClick={() => { history.push("/menu") }}>
              <FontAwesomeIcon icon={faLongArrowAltLeft} />
              <span className="e-m-left-5">{t("textCommon.back")}</span>
            </Button>
          </div>
          <h3 className="title">{t("language")}</h3>
        </div>
        <div className="pr-content">
          <div className="langs">
            {dbLanguage.map((item, index) => (
              <div
                key={index}
                className={
                  item.id === this.state.active.id
                    ? "lang-item active"
                    : "lang-item"
                }
                onClick={(value) => this.setState({ active: item })}
              >
                <span className="icon-name">
                  {" "}
                  <FontAwesomeIcon icon={faCheckCircle} />{" "}
                </span>
                <span className="lang-name">{item.name}</span>
              </div>
            ))}
          </div>
          <div className="button-action" style={{ textAlign: "right" }}>
            <Button onClick={() => {
              this.showAlert(this.state.active.code);
              save("lng", this.state.active.code);
            }}>
              <FontAwesomeIcon icon={faSave} />{" "}
              {t("setting.save")}
            </Button>
          </div>
        </div>

      </div>
    );
  }
}

export default withNamespaces()(MainLanguage);
