import React, { Component } from "react";
import { Button, TextArea, Input, Dialog, NumberRange } from "../../../components/common";
import Validator from "../../../utils/validator";
import { MSG_NOT_EMPTY_REQUIRED } from "../../../consts/constants";
import Swal from "./../../../utils/sweetalert2";
export default class PopoupEditDish extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameCategoryDish: this.props.dishCategoryInfo.dishCategory.name,
      descCategoryDish: this.props.dishCategoryInfo.dishCategory.description,
      showPopupConfirm: false,
      errors: {},
      position: this.props.dishCategoryInfo.dishCategory.position ? this.props.dishCategoryInfo.dishCategory.position : 1
    };
    const rules = [
      {
        field: "nameCategoryDish",
        method: "isEmpty",
        validWhen: false,
        message: MSG_NOT_EMPTY_REQUIRED,
      },
    ];
    this.validator = new Validator(rules);
  }

  editDishCategory = () => {
    let category_id = this.props.dishCategoryInfo.dishCategory.id;
    const name = this.state.nameCategoryDish;
    const description = this.state.descCategoryDish;
    const { position } = this.state;
    const data = {
      name,
      description,
      position
    };
    this.props.actions.editCategoryItem({
      data, category_id,
      callback_success: this.showOk,
      callback_fail: this.showErr
    });
    this.props.hide();
  }

  showAlert = () => {
    const t = this.props.t;
    if (
      Object.entries(this.validator.validate(this.state)).length === 0 &&
      this.validator.validate(this.state).constructor === Object
    ) {
      Swal.fire({
        title: t("categoryDish.swalTitle"),
        text: t("categoryDish.swalUpdateCategoryDish"),
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: t("categoryDish.swalAgree"),
        cancelButtonText: t("categoryDish.swalCancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          this.editDishCategory();
        }
      })
    } else {
      this.setState({
        errors: this.validator.validate(this.state),
      });
    }
  }
  showOk = () => {
    const t = this.props.t;
    Swal.fire({
      icon: 'success',
      text: t("categoryDish.swalUpdateSuccess"),
      title: t("categoryDish.swalTitle")
    })
  }

  showErr = () => {
    const t = this.props.t;
    Swal.fire({
      icon: 'error',
      title: t("categoryDish.swalTitle"),
      text: t("categoryDish.swalUpdateFail"),
    })
  }

  render() {
    const { show, hide, t } = this.props;
    const { nameCategoryDish, descCategoryDish, errors } = this.state;
    return (
      <Dialog
        innerClass="max-width-edit-food-category"
        show={show}
        close={hide}
      >
        <h2
          className="text-center"
        >
          {" "}
          {t("categoryDish.popupEdit")}
        </h2>
        <div className="text-center content-form-edit">
          <div
            className=""
            style={{
              display: "flex",
              alignItems: "center"
            }}
          >
            <div className="title-form">{t("categoryDish.categoryName")}</div>
            <div className="flex">
              <Input
                defaultValue={nameCategoryDish}
                onChange={(e) =>
                  this.setState({
                    nameCategoryDish: e.target.value,
                    errors: { nameCategoryDish: "" },
                  })
                }
              ></Input>
              {errors.nameCategoryDish ? (
                <span
                  className="validation"
                  style={{
                    display: "block",
                    fontSize: 14,
                    position: "absolute",
                    left: 20,
                    fontStyle: "italic",
                  }}
                >
                  {errors.nameCategoryDish}
                </span>
              ) : null}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center"
            }}
          >
            <div className="title-form">
              {t("categoryDish.description")}</div>
            <div className="flex">
              <TextArea
                name="Mô tả"
                rows={8}
                defaultValue={descCategoryDish}
                style={{ marginTop: "10px", fontSize: "16px" }}
                onChange={(e) =>
                  this.setState({ descCategoryDish: e.target.value })
                }
              />
            </div>
          </div>
          <div className="priority e-flex item-center">
            <label className="e-form-label">
              {t("Độ ưu tiên")}
            </label>
            <div className="e-flex field-listss">
              <NumberRange
                defaultValue={this.state.position}
                max={10}
                onChange={position => this.setState({ position })}
              />
            </div>
          </div>
        </div>
        <aside
          className="acts grp-btns text-right"
          style={{ textAlign: "center", display: "block", width: "100%", marginTop: "10px", fontSize: "14px" }}
        >
          <Button onClick={hide} type="s3" style={{ marginRight: "5px" }}>
            {t("categoryDish.back")}{" "}
          </Button>
          <Button
            onClick={this.showAlert}
          >
            {t("categoryDish.edit")}
          </Button>
        </aside>

      </Dialog>
    );
  }
}
