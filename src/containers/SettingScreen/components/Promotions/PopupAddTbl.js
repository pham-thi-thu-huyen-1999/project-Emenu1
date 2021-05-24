import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import RadioButton from "../../../../components/common/RadioList"
import TblFoodDiscount from "./ComponentAdd/TblFoodDiscount"
import TblOrderDiscount from "./ComponentAdd/TblOrderDiscount"
import TblVoucher from "./ComponentAdd/TblVoucher"
import TblPoint from "./ComponentAdd/TblPoint"
import TblDatePromotion from "./ComponentAdd/TblDatePromotion"
import { STATUS_PROMOTION, TYPE_PROMOTION } from "../../../../consts/settings/promotion";
import Validator from "../../../../utils/validator";

const listTableChild = [

]

class PopupAddTable extends Component {
  constructor() {
    super();
    this.state = {
      tabIndex: 0,
      selected: 1,
      isStatus: 0,
      name: '',
      startDate:null,
      endDate:null,
      errors: {},
    };
    const rules = [
      {
        field: "name",
        method: "isEmpty",
        validWhen: false,
        message: "Vui lòng nhập tên chương trình."
      }
    ]
    this.validator = new Validator(rules);
  }
  radioChangedTypePromotion = () => {
    switch (this.state.selected) {
      case 1:
        return <TblOrderDiscount dataTbl = {listTableChild}/>
      case 2:
        return <TblFoodDiscount dataTbl = {listTableChild}/>
      case 3:
        return <TblVoucher dataTbl = {listTableChild}/>
      case 4:
        return <TblPoint dataTbl = {listTableChild}/>
      default:
        break;
    }
  }

   onGetValueDate = (start, end) =>{
   
    this.setState({startDate: start, endDate:end})
  }

  addTable = () => {
    const {
      name,
      selected,
      isStatus,
      startDate,
      endDate
    } = this.state;

    const dataTable = {
      name: name,
      typeProm:selected,
      status: isStatus,
      startDate:startDate,
      endDate:endDate
    };

    if (
      Object.entries(this.validator.validate(this.state)).length === 0 &&
      this.validator.validate(this.state).constructor === Object
    ) {
      this.props.addTable(dataTable);
      this.props.hide();
    } else {
      this.setState({
        errors: this.validator.validate(this.state)
      });
    }

  }
  render() {
    const { hide } = this.props;
    return (
      <div className="popup mfp-container mfp-s-ready mfp-inline-holder" style={{ zIndex: 10, position: "fixed" }}>
        <div className="mfp-content">
          <section
            id="popup-add-tbl"
            className="popup-box popup-add-new"
            ref={this.wrapperRef}
            style={{ maxWidth: 1170 }}
          >
            <button
              title="Close (Esc)"
              type="button"
              className="mfp-close"
              onClick={this.props.hide}
            >  × </button>
            <h3 className="title">THÊM chương trình khuyến mãi</h3>
            <div className="block-item-1">
              <div className="block-item__left">
                <div className="group-item">
                  {this.state.errors.name ? (
                    <span className="validation" style={{ display: "block", fontSize:14 }}>
                      {this.state.errors.name}
                    </span>
                  ) : null}
                  <div className="form-group ">
                    <label className="control-label">Tên chương trình (*)</label>
                    <input type="text" className="form-control"
                      onChange={name =>
                       this.setState({ name: name.target.value, errors: {name: ''}})
                      }
                    />
                  </div>

                </div>

                <div className="radio-group flex-box align-center">
                  <label style={{ marginRight: 110 }}>Trạng thái</label>
                  <RadioButton
                    name="status"
                    dataSource={STATUS_PROMOTION}
                    onChange={isStatus => this.setState({ isStatus })}
                    selected={this.state.isStatus}
                  />
                </div>
              </div>
              <div className="block-item__right">
                <textarea placeholder="Ghi chú" className="form-control"></textarea>
              </div>
            </div>
            <div className="block-item-2">
              <Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })}>
                <TabList className="tab-list">
                  <Tab>Hình thức khuyến mãi</Tab>
                  <Tab>Thời gian áp dụng</Tab>
                </TabList>
                <TabPanel>
                  <div className="content">
                    <div className="radio-group flex-box align-center">
                      <RadioButton
                        name="type-promotion"
                        dataSource={TYPE_PROMOTION}
                        onChange={selected => this.setState({ selected })}
                        selected={this.state.selected}
                      />
                    </div>
                    {this.radioChangedTypePromotion()}
                  </div>
                </TabPanel>
                <TabPanel>
                  <TblDatePromotion
                    startDate = {this.state.startDate}
                    endDate = {this.state.endDate}
                    getValueDate = {(start, end)=>this.onGetValueDate((start, end))}
                  />
                </TabPanel>
              </Tabs>
            </div>
            <div style={{ position: 'absolute', bottom: 20, right: 38 }}>
              <div className="main-btn close-popup-btn"  onClick={hide}>QUAY LẠI</div>
              <div className="main-btn s2" style={{ marginLeft: 15 }} onClick={this.addTable}>THÊM</div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}
export default PopupAddTable;
