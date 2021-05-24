import React, { Component } from "react";
import { Button, Dialog, ImageLoading } from "../../../components/common";
import image from "../img/PorkLoin.jpg";
import GP from "../img/google-play.png";
import AS from "../img/apple-store.png";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class Food extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDialog: false,
    };
  }
  numberWithCommas = x => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
  render() {
    const { listFood, t } = this.props;
    const { showDialog } = this.state;

    return (
      <div className="e-row item-food">
        <div className="e-col-9 content-item-right">
          <div className="title-food">
            {listFood.item_name}
          </div>
            <div className="fr-text-price">
              {
                listFood.discount_price > 0 ?
                  <>
                    <span style={{textDecoration: 'line-through', marginRight:20 }}>{this.numberWithCommas(listFood.sale_price)} đ</span>
                    <span style={{ color: "#FFA200"}}>{this.numberWithCommas(listFood.discount_price)} đ</span>
                  </> : <span style={{ color: "#FFA200"}}>{this.numberWithCommas(listFood.sale_price)} đ</span>
              }
            </div>
          {listFood.in_stock === false ? <div className="title-istock">
            {t('detailRestaurant.outOfStock')}</div>:null }
          <div style={{width:100}}>

          <Button className="btn-order" onClick={() => { this.setState({ showDialog: true }) }}>{t("detailRestaurant.order")}</Button>
          </div>
        </div>
        <ImageLoading innerClass="thumb content-image-left img-food" src={listFood.image} />
        <Dialog
          show={showDialog}
          innerClass="width30 text-center"
          close={() => this.setState({ showDialog: false })}
        >
          <h1 className="text-center"><FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon></h1>
          <h3 className="sec-tit text-center">{t("detailRestaurant.title_popup_noti")}</h3>
          <div className="">
            <img src={GP} alt="***">
            </img>
            <img src={AS} alt="***">
            </img>
          </div>
          <aside className="acts text-center">
            <Button
              className="grayscale e-m-right-10"
              onClick={() => this.setState({ showDialog: false })}
            >
              {t("detailRestaurant.closed")}
            </Button>
          </aside>
        </Dialog>
      </div>
    );
  }
}

