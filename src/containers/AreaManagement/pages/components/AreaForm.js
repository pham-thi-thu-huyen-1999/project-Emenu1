import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import {
  Button,
  Input,
  TextArea,
  RadioList,
  ButtonBase,
} from "../../../../components/common";
import Swal from "../../../../utils/sweetalert2";
import Validator from "../../../../utils/validator";
import { faAsterisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


class InputRatio extends ButtonBase {
  render() {
    const {
      className,
      id,
      name,
      checked,
      type,
      disabled,
      value,
      ratio,
    } = this.props;
    const { classAnimation } = this.state;
    return (
      <>
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={this.handleEvent}
          checked={checked}
          disabled={disabled}
          className={`${className}`}
        />
        <span
          className={`${classAnimation}`}
          ref={(ref) => (this.elementRef = ref)}
        >{`1:${ratio}`}</span>
      </>
    );
  }
}

class AreaForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      areaRatios: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
      params: {
        name: "",
        position: "1",
        description: "",
        is_smoke: true,
        status: "1",
        ratio: 0,
      },
      errors: {},
    };

    // Translations
    const trans = this.props.trans;

    const rules = [
      {
        field: "name",
        method: "isEmpty",
        validWhen: false,
        message: trans("area_management:new_area_name_placeholder"),
      },
      {
        field: "description",
        method: "isEmpty",
        validWhen: false,
        message: trans("area_management:new_area_description_placeholder"),
      },
    ];
    this.validator = new Validator(rules);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!_.isEmpty(nextProps.areaInfo)) {
      return {
        areaInfo: nextProps.areaInfo,
      };
    }
    return null;
  }
  componentDidUpdate(prevProps) {
    const { areaInfo } = this.props;
    if (prevProps.areaInfo !== areaInfo) {
      let newParams = {};
      for (const key in this.state.params) {
        if (
          this.state.params.hasOwnProperty(key) &&
          areaInfo.hasOwnProperty(key)
        ) {
          newParams[key] = areaInfo[key];
        }
      }
      this.setState({
        params: newParams,
      });
    }
  }

  /**
   * Navigate to list screen
   */
  navigateToList = () => {
    this.props.history.push("/area");
  };

  /**
   * Render area ratio list
   */
  renderAreaRatioList = (selectedRatio) => {
    let ratioList = [];
    this.state.areaRatios.map((ratio, index) => {
      return ratioList.push(
        <div key={index} className="ratio-checkbox scale-list">
          <label className="scale-list-lbl">
            <InputRatio
              type="radio"
              value={index}
              name="ratio"
              onChange={() => this.selectRatio(index)}
              checked={selectedRatio === index}
              ratio={ratio}
            />
          </label>
        </div>
      );
    });
    return ratioList;
  };
  /**
   * Select ratio
   */
  selectRatio = (index) => {
    this.setState((prevState) => ({
      params: {
        ...prevState.params,
        ratio: index,
      },
    }));
  };

  /**
   * Render area ratio preview
   */
  renderAreaRatioPreview = () => {
    const height = 150;
    let width = height * this.state.areaRatios[this.state.params.ratio];
    let areaRatioPreview = (
      <div className="area-ratio-preview">
        <div className="preview-panel" style={{ width: width + "px" }}>
          {`1:${this.state.areaRatios[this.state.params.ratio]}`}
        </div>
      </div>
    );
    return areaRatioPreview;
  };

  /**
   * On name change
   */
  onNameChange = (event) => {
    const { value } = event.target;
    this.setState((prevState) => ({
      params: {
        ...prevState.params,
        name: value,
      },
    }));
  };
  /**
   * On desciption change
   */
  onDesciptionChange = (event) => {
    const { value } = event.target;
    this.setState((prevState) => ({
      params: {
        ...prevState.params,
        description: value,
      },
    }));
  };

  /**
   * On submit form
   */
  onSubmitForm = () => {
    if (this.props.onCreate) {
      this.showAlertCreate();
    }

    if (this.props.onEdit) {
      this.showAlertEdit();
    }
  };

  showAlertCreate = (onCreate) => {
    const trans = this.props.trans;
    if (Object.entries(this.validator.validate(this.state.params)).length === 0 &&
      this.validator.validate(this.state.params).constructor === Object) {
      Swal.fire({
        title: trans("area_management:area_create_title"),
        text: trans("area_management:area_create_message"),
        icon: "info",
        showCancelButton: true,
        confirmButtonText: trans("area_management:new_area_submit_button"),
        cancelButtonText: trans("area_management:new_area_cancel_button"),
      }).then((result) => {
        if (result.value) {
          this.props.onCreate(this.state.params);
        } else {
          this.setState({
            errors: {}
          })
        }
      });
    }
    else {
      this.setState({
        errors: this.validator.validate(this.state.params),
      });
    }
  };

  showAlertEdit = () => {
    const trans = this.props.trans;
    if (
      Object.entries(this.validator.validate(this.state.params)).length ===
      0 &&
      this.validator.validate(this.state.params).constructor === Object
    ) {
      Swal.fire({
        title: trans("area_management:area_edit_title"),
        text: trans("area_management:area_edit_message"),
        icon: "info",
        showCancelButton: true,
        confirmButtonText: trans("area_management:edit_area_submit_button"),
        cancelButtonText: trans("area_management:edit_area_cancel_button"),
      }).then((result) => {
        if (result.value) {
          this.props.onEdit(this.state.params);
        }
        else {
          this.setState({
            errors: {}
          })
        }
      });
    } else {
      this.setState({
        errors: this.validator.validate(this.state.params),
      });
    }
  };

  showErrCreate = () => {
    const { trans } = this.props;
    Swal.fire({
      icon: "error",
      text: trans("area_management:area_create_fail"),
      title: trans("area_management:area_message_title"),
    });
  };

  showErrEdit = () => {
    const { trans } = this.props;
    Swal.fire({
      icon: "error",
      text: trans("area_management:area_update_fail"),
      title: trans("area_management:area_message_title"),
    });
  };

  render() {
    const { params } = this.state;
    //Messages
    const showErrors = { ...this.state.errors };

    // Translations
    const trans = this.props.trans;

    const dataSmoke = [
      { key: 1, text: trans("area_management:new_area_smoking.yes") },
      { key: 0, text: trans("area_management:new_area_smoking.no") },
    ];

    return (
      <div className="area-form-wrapper">
        <form>
          <div className="form-input-group">
            <span className="input-title">
              {trans("area_management:new_area_name")}
              <FontAwesomeIcon
                icon={faAsterisk}
                style={{
                  color: "red",
                  fontSize: "7px",
                  margin: "0 0 8px 6px"
                }}
              />
            </span>
            <div className="form-control">
              <Input
                type="text"
                name="name"
                placeholder={trans("area_management:new_area_name_placeholder")}
                onChange={(e) => this.onNameChange(e)}
                value={params.name}
              />
              {showErrors.name ? (
                <div className="error-text">{showErrors.name}</div>
              ) : null}
            </div>
          </div>
          <div className="form-input-group">
            <span className="input-title">
              {trans("area_management:new_area_description")}
            </span>
            <div className="form-control">
              <TextArea
                placeholder={trans(
                  "area_management:new_area_description_placeholder"
                )}
                onChange={(e) => this.onDesciptionChange(e)}
                defaultValue={params.description}
              />
              {showErrors.description ? (
                <div className="error-text">{showErrors.description}</div>
              ) : null}
            </div>
          </div>
          <div className="form-input-group">
            <span className="input-title">
              {trans("area_management:new_area_smoking.title")}
            </span>
            <RadioList
              name="is_smoke"
              dataSource={dataSmoke}
              onChange={(selected) =>
                this.setState({
                  params: { ...params, is_smoke: selected ? true : false },
                })
              }
              selected={params.is_smoke ? 1 : 0}
            />
          </div>
          <div className="form-input-group">
            <span className="input-title">
              {trans("area_management:new_area_ratio")}
            </span>
            <div
              className="row area-ratio-list"
              role="group"
              aria-labelledby="checkbox-group"
            >
              {this.renderAreaRatioList(params.ratio)}
            </div>
          </div>
          <div className="form-input-group">
            <span className="input-title">&nbsp;</span>
            {this.renderAreaRatioPreview()}
          </div>
          <div className="form-input-group group-button">
            <Button type="s3" onClick={this.navigateToList.bind(this)}>
              {trans("area_management:new_area_cancel_button")}
            </Button>
            <Button onClick={this.onSubmitForm}>
              {this.props.isEdit
                ? trans("area_management:edit_area_submit_button")
                : trans("area_management:new_area_submit_button")}
            </Button>
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(AreaForm);
