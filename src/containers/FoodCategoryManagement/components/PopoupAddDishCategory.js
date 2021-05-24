import React, { Component } from "react";
import { Input, TextArea, Dialog } from "../../../components/common";
import { MSG_NOT_EMPTY_REQUIRED } from "../../../consts/constants";
import { Button, NumberRange } from "../../../components/common";
import Validator from "../../../utils/validator";
import Swal from "./../../../utils/sweetalert2";

export default class PopoupAddDishCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameCategoryDish: "",
      descCategoryDish: "",
      errors: {},
      position: 1
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

  addDishCategory = () => {
    const {
      nameCategoryDish,
      descCategoryDish, position
    } = this.state;
    const data = {
      name: nameCategoryDish,
      description: descCategoryDish,
      status: 1,
      position
    };

    this.props.actions.createCategoryItem({
      data,
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
        text: t("categoryDish.swalAddCategoryDish"),
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: t("categoryDish.swalAgree"),
        cancelButtonText: t("categoryDish.swalCancel"),
      }).then((result) => {
        if (result.value) {
          this.addDishCategory();
        }
      })
    } else {
      this.setState({
        errors: this.validator.validate(this.state)
      });
    }
  }
  showOk = () => {
    const t = this.props.t;
    Swal.fire({
      icon: 'success',
      text: t("categoryDish.swalAddSuccess"),
      title: t("categoryDish.swalTitle")
    })
  }

  showErr = () => {
    const t = this.props.t;
    Swal.fire({
      icon: 'error',
      title: t("categoryDish.swalTitle"),
      text: t("categoryDish.swalAddFail"),
    })
  }
  render() {
    const { show, hide, t/* , ...rest */ } = this.props;
    const { /* nameCategoryDish, */ descCategoryDish, errors } = this.state;
    return (
      <Dialog
        innerClass="max-width-edit-food-category"
        show={show}
        close={hide}
      >
        <h2
          className="main-lbl text-center"
          style={{ fontSize: "26px", fontWeight: "420" }}
        >
          {t("categoryDish.popupAdd")}
        </h2>
        <div className="text-center">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 15,
            }}
          >
            <label style={{ paddingRight: 10, minWidth: "130px" }}>
              {t("categoryDish.categoryName")} <span>*</span>
            </label>
            <div
              style={{ maxWidth: 500, width: 500, position: "relative" }}
            ><Input
              onChange={(e) =>
                this.setState({
                  nameCategoryDish: e.target.value,
                  errors: { nameCategoryDish: "" },
                })
              }
            ></Input>
            </div>
          </div>
          {errors.nameCategoryDish ? (
            <div
              className="validation"
              style={{
                fontSize: 14,
                margin: "0.8em",
                marginLeft: "-50px",
              }}
            >
              {errors.nameCategoryDish}
            </div>
          ) : null}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ minWidth: "130px" }}>{t("categoryDish.description")}</span>
            <div style={{ maxWidth: 500, width: 500 }}>
              <TextArea
                name="Mô tả"
                rows={8}
                value={descCategoryDish}
                style={{ marginRight: "10px", fontSize: "16px", padding: "10px" }}
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
          style={{ textAlign: "center" }}
        >
          <Button type="s3" onClick={hide}>
            {t("categoryDish.back")}{" "}
          </Button>
          <div style={{ width: "30px" }}></div>
          <Button onClick={this.showAlert}>
            {t("categoryDish.add")}{" "}
          </Button>
        </aside>
      </Dialog>

    );
  }
}




