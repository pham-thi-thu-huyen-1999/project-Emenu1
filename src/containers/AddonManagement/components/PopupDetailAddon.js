import React, { Component } from "react";
import { Button, ImageLoading } from "../../../components/common";
export default class PopupDetailAddon extends Component {
  
  render() {
    const { selectedAddon, t, infoVatSetting } = this.props;
    return (
      <div className="popup-detail-addon"
        ref={this.wrapperRef}
      >
        <div className="tbl-info">
          <div className="content-info e-row">
            <div className="e-col-6 content-left edesc fl">
              <div className="row-info">
                <span className="title-name-info">{`${t("addonManagement.name")} :`}</span>
                <span className="text-info">{selectedAddon.name}</span>
              </div>
              <div className="row-info">
                <span className="title-name-info">{`${t("addonManagement.price")} :`}</span>
                <span className="text-info">{selectedAddon.price}</span>
              </div>
              <div className="row-info">
                <span className="title-name-info">{`${t("addonManagement.position")} :`}</span>
                <span className="text-info">{selectedAddon.position}</span>
              </div>
              <div className="row-info">
                <span className="title-name-info">{`${t("addonManagement.tax")} :`}</span>
                <span className="text-info">
                  {infoVatSetting.is_vat ?
                    selectedAddon.is_vat ?
                      `${infoVatSetting.vat}%`
                      : t("addonManagement.no_")
                    : t("addonManagement.no_")}</span>
              </div>
              <div className="row-info">
                <span className="title-name-info">{`${t("addonManagement.status")} :`}</span>
                <span className="text-info">
                  <span className="green">
                    {selectedAddon.status
                      ? t("addonManagement.still")
                      : t("addonManagement.over")}
                  </span>
                </span>
              </div>
              <div className="row-info">
                <span className="title-name-info">{`${t("addonManagement.description")} :`}</span>
                <span className="text-info">
                  <span disabled>{selectedAddon.descr}</span></span>
              </div>
      
            </div>
            <div className="e-col-6 content-right fig  flex-view">
              <div className="image-1-2">
                <div className="image-title">{t("addonManagement.image")} 1:1</div>
                <div className="fixed-image">
                  <ImageLoading innerClass="fixed-image-loading" src={selectedAddon.image} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="e-flex content-end e-p-right-10">
          <Button type="s3"
            onClick={() => { this.props.hide() }}>
            {t("addonManagement.back")}
          </Button>
        </div>
      </div>
    );
  }
}
