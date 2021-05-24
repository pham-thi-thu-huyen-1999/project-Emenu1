import React, { Component } from "react";
import "./popupAddDish.scss";
import { Button, ImageLoading } from "./../../../components/common";
import formats from "../../../utils/formats"
export default class PopupDetailDish extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nav1: null,
      nav2: null
    };
    this.wrapperRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener("click", this.handleClick);
    this.setState({
      nav1: this.slider1,
      nav2: this.slider2
    });
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleClick);
  }
  handleClick = event => {
    const { target } = event;
    if (this.wrapperRef.current === null) {
      return;
    }
    if (!this.wrapperRef.current.contains(target)) {
      this.props.hide();
    }
  };

  render() {
    const { dishInfo, t, infoVatSetting } = this.props;
    const vatValue = ((infoVatSetting.vat * dishInfo.sale_price) / 100)
    return (
      <div className="popup-detail-dish"
        ref={this.wrapperRef}
      >
        <div className="tbl-info">
          <div className="content-info e-row">
            <div className="e-col-6 content-left edesc fl">
              <div className="row-info">
                <span className="title-name-info">{`${t("dishManagament.kind")}:`}</span>
                <span className="text-info">{dishInfo.group_type === 1 ? t("dishManagament.food")
                  : (dishInfo.group_type === 2
                    ? t("dishManagament.drink")
                    : t("dishManagament.other"))}</span>
              </div>
              <div className="row-info">
                <span className="title-name-info">{`${t("dishManagament.category")} :`}</span>
                <span className="text-info">{dishInfo.category_item.name}</span>
              </div>
              <div className="row-info">
                <span className="title-name-info">{`${t("dishManagament.dishName")} :`}</span>
                <span className="text-info">{dishInfo.name}</span>
              </div>
              <div className="row-info">
                <span className="title-name-info">{`${t("dishManagament.code")} :`}</span>
                <span className="text-info">{dishInfo.sku}</span>
              </div>
              <div className="row-info">
                <span className="title-name-info">{`${t("dishManagament.unit")} :`}</span>
                <span className="text-info">{dishInfo.unit_item.name}</span>
              </div>
              <div className="row-info">
                <span className="title-name-info">
                  {`${t("dishManagament.price")} :`}</span>
                <span className="text-info">{`${formats.moneyFormat(dishInfo.sale_price)} VNĐ`}</span>
              </div>
              <div className="row-info">
                <span className="title-name-info">{`${t("dishManagament.tax")} :`}</span>
                <span className="text-info">
                  {infoVatSetting.is_vat ?
                    dishInfo.is_vat ?
                      `${infoVatSetting.vat}%`
                      : t("dishManagament.no_")
                    : t("dishManagament.no_")}</span>
              </div>
              <div className="row-info">
                <span className="title-name-info">{`${t("dishManagament.status")} :`}</span>
                <span className="text-info">
                  <span className="green">
                    {dishInfo.status
                      ? t("dishManagament.still")
                      : t("dishManagament.over")}
                  </span>
                </span>
              </div>
              <div className="row-info">
                <span className="title-name-info">{`${t("dishManagament.note")} :`}</span>
                <span className="text-info">
                  <span disabled>{dishInfo.des_full}</span></span>
              </div>
              <div className="row-info">
                <span className="title-name-info">Giá trị sau thuế:</span>
                <span className="text-info">
                  <span disabled>
                    {infoVatSetting && infoVatSetting.is_vat
                      ? vatValue
                      : "Không có"}</span>
                </span>
              </div>
            </div>
            <div className="e-col-6 content-right fig fl flex-view">
              <div className="image-1-2">
                <div className="image-title">{t("dishManagament.image")} 1:2</div>
                <div className="fixed-image">
                  <ImageLoading innerClass="fixed-image-loading" src={dishInfo.image_large} />
                </div>
              </div>
              <div className="content-list-image">
                <div className="image-title">{t("dishManagament.image")} 1:1</div>
                <div className="list-image e-flex content-start">
                  {dishInfo.item_imgs.map((img, index) => (
                    <div key={index} className="img-item"> <div className="content-img">
                      <ImageLoading innerClass="content-img-loading" src={img.image} />
                    </div>
                    </div>
                  ))
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="e-flex content-end e-p-right-10">
          <Button type="s3"
            onClick={() => { this.props.hide() }}>
            {t("dishManagament.back")}
          </Button>
        </div>
      </div>
    );
  }
}
