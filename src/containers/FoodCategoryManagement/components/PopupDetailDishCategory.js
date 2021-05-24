import React, { Component } from "react";
import { Button, Dialog, TextArea } from "../../../components/common"

export default class PopupDetailDish extends Component {
  render() {
    const { show, hide, dishCategoryInfo, t } = this.props;
    return (
      <Dialog
        innerClass="max-width-detail-food-category"
        show={show}
        close={hide}
      >
        <h2
          className="text-center title-detail-food-category"
        >
          {t("categoryDish.popupDetail")}
        </h2>
        <div className="e-form">
          <div className="e-form-field e-row">
            <div className="e-col-3 e-form-label e-flex content-start">
              {t("categoryDish.categoryName")}
            </div>
            <div className="e-col-9 e-form-input">
              <span>{dishCategoryInfo.name}</span>
            </div>
          </div>
          <div className="e-form-field e-row">
            <div className="e-col-3 e-form-label e-flex content-start">
              {t("categoryDish.description")}
            </div>
            <div className="e-col-9 e-form-input">
              <TextArea
                name="description"
                rows={5}
                defaultValue={dishCategoryInfo.description}
                disabled
              />
            </div>
          </div>
          <div className="e-form-field e-row e-flex content-end">
            <div className="e-form-input e-flex content-center">
              <Button onClick={hide} type="s3">
                {t("categoryDish.back")}{" "}
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    );
  }
}
