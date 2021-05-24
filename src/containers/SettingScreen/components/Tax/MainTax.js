import React, { Component } from "react";
import "./taxStyle.scss";
import RadioButton from "../../../../components/common/RadioList";
import Button from "./../../../../components/common/Button";
import Input from "./../../../../components/common/Input";
import { withNamespaces } from "react-i18next";
import Swal from '../../../../../src/utils/sweetalert2';
import { history } from "../../../../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowAltLeft, faSave } from "@fortawesome/free-solid-svg-icons";
import { TEMP_CONTRACT } from "../../../../consts/settings/partnerContract";
import moment from "moment";
import Validator from "../../../../utils/validator";
class MainTax extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      dbTaxOption: [
        {
          key: "is_vat_surcharge",
          name: `${this.props.t("setting.tax.taxSurcharge")}?`,
          status: false,
          displayNoTax: false,
          displayContact: false,
        },
        {
          key: "is_vat_promotion",
          name: `${this.props.t("setting.tax.taxPromotion")}?`,
          status: false,
          displayNoTax: false,
          displayContact: false,
        },
        // {
        //   key: "is_vat_round",
        //   name: `${this.props.t("setting.tax.isRound")}?`,
        //   status: false,
        //   displayNoTax: true,
        // }
      ],
      selected: 0,
      item1Stt: 0,
      isStatus: null,
      listTableChild: [],
      isTax: this.props.infoTax.is_vat,
      infoTax: {},
      tax: this.props.infoTax.vat,
      errors: {},
    };

    const rules = [
      {
        field: "tax",
        method: (val) => {
          if (parseInt(val) > 0 && !Number.isNaN(parseInt(val))) {
            return true;
          } else {
            return false;
          }
        },
        validWhen: true,
        message: `${this.props.t("setting.tax.largeZeroTax")}`,
      },
    ];
    this.validator = new Validator(rules);
  }

  onChangeValue = (value, key) => {
    const dbTaxOption = [...this.state.dbTaxOption]
    dbTaxOption.map(item => {
      if (key === item.key) {
        item.status = value
      }
    })
    this.setState({ dbTaxOption });
  };
  showSuccess = () => {
    const { t } = this.props
    Swal.fire({
      icon: 'success',
      title: `${t("setting.tax.updateSuccess")}!`,
      showConfirmButton: true
    })
  }
  showErr = () => {
    const { t } = this.props
    Swal.fire({
      icon: 'error',
      title: `${t("setting.tax.updateErr")}!`,
      text: `${t("setting.tax.reqCheckAgain")}`
    })
  }
  onSaveChageTax = () => {
    const { t } = this.props
    
    Swal.fire({
      title: `${t("setting.tax.youSure")}?`,
      text: `${t("setting.tax.confirmChangeInfoTax")}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `${t("setting.yes")}`,
      cancelButtonText: `${t("setting.no")}`,
    }).then((result) => {
      if (result.value) {
        const lstTax = []
        const { isTax } = this.state;
        if (isTax) {
          if (
            Object.entries(this.validator.validate(this.state)).length === 0 &&
            this.validator.validate(this.state).constructor === Object
          ) {
            this.setState({
              errors: {}
            })
          } else {
            this.setState({
              errors: this.validator.validate(this.state)
            });
            this.showErr();
            return;
          }
        }
        const isContract = this.isTempContract();
        this.state.dbTaxOption.map(item => {
          if (item.key === "is_vat_surcharge") {
            lstTax.is_vat_surcharge = isTax && !isContract ? item.status : false
          }
          if (item.key === "is_vat_promotion") {
            lstTax.is_vat_promotion = isTax && !isContract ? item.status : false
          }
          // if (item.key === "is_vat_round") {
          //   lstTax.is_vat_round = item.status
          // }
        })
        let data = {
          ...lstTax,
          is_vat: isTax,
          vat: isTax ? this.state.tax : 0,
          is_vat_round: false
        }
        this.props.actions.updateInfoTaxSetting({
          data,
          showSuccess: this.showSuccess,
          showErr: this.showErr
        })
      }
    })
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.infoTax !== prevState.infoTax) {
      let dbTaxOption = [...prevState.dbTaxOption]
      dbTaxOption = dbTaxOption.map(item => {
        if (item.key === "is_vat_surcharge") {
          item.status = nextProps.infoTax.is_vat_surcharge
        }
        if (item.key === "is_vat_promotion") {
          item.status = nextProps.infoTax.is_vat_promotion
        }
        // if (item.key === "is_vat_round") {
        //   item.status = nextProps.infoTax.is_vat_round
        // }
        return item
      })
      return {
        infoTax: nextProps.infoTax,
        isTax: nextProps.infoTax.is_vat,
        tax: nextProps.infoTax.vat,
        dbTaxOption
      }
    }
    return null;
  }

  isTempContract = () => {
    const userInfo = this.props.userInfo;
    return (
      userInfo &&
      (userInfo.contract_type_id === TEMP_CONTRACT ||
        moment.utc(new Date()).isAfter(new Date(userInfo.contract_end_time)))
    );
  };

  renderRadioGroup(item, index) {
    const { t } = this.props;
    return (
      <div className="tax-item" key={index}>
        <span className="tax-item-name"> {t(item.name)}</span>
        <span className="tax-item-status">
          <RadioButton
            name={"status" + index}
            dataSource={[
              { key: true, text: this.props.t("setting.yes") },
              { key: false, text: this.props.t("setting.no") },
            ]}
            onChange={value => this.onChangeValue(value, item.key)}
            selected={
              this.state.isStatus == null
                ? item.status
                : this.state.isStatus
            }
          />
        </span>
      </div>
    )
  }
  componentWillUnmount() {
    this.setState({
      infoTax: {}
    })
  }
  render() {
    const { t, infoTax } = this.props;
    let isContract = this.isTempContract();
    const { isTax, errors } = this.state;
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
          <h3 className="title">{t("setting.taxConf")}</h3>
        </div>
        <div className="pr-content">
          <div className="e-flex field-istax">
            <span className="title-istax">
              {t("setting.tax.quesIsTax")}?</span>
            <RadioButton
              dataSource={[{
                key: true,
                text: `${t("setting.yes")}`
              }, {
                key: false,
                text: `${t("setting.no")}`
              }]}
              selected={this.state.isTax}
              onChange={isTax => this.setState({ isTax })}
            />
          </div><div className="tax-content">

            {
              isTax ? <div className="tax-item">
                <span className="tax-item-name">{t("setting.tax.enterTax")}:</span>
                <span
                  className="tax-item-status flex-box"
                  style={{ alignItems: "center" }}
                >
                  <Input
                    onChange={e => this.setState({ tax: e.target.value })}
                    defaultValue={infoTax.vat}
                    type="number"
                    className="tax-input"
                  ></Input>
                  <span className="text-percent">%</span>
                </span>
                
              </div> : <></>
              
            }
            {errors.tax ? (
              <div className="tax-item">
                <span className="tax-item-name"></span>
                <span
                  className="validation tax-item-status flex-box"
                  style={{
                    display: "block"
                  }}
                >
                  {errors.tax}
                </span>
                </div>
            ) : null}
            {this.state.dbTaxOption.map((item, index) => {
              if (isContract === true) {
                  if (item.displayContact === true) {
                    return this.renderRadioGroup(item, index);
                  }               
              } else if(isContract === false) {
                if (isTax === false) {
                  if (item.displayNoTax === true) {
                    return this.renderRadioGroup(item, index);
                  } 
                } else {
                  return this.renderRadioGroup(item, index)
                }
              }
            })}
          </div>
          <div className="button-action" style={{ textAlign: "right" }}>
            <Button onClick={this.onSaveChageTax}>
              <FontAwesomeIcon icon={faSave} />{" "}
              {t("setting.save")}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default withNamespaces()(MainTax);
