import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import RadioButton from "../../../../components/common/RadioList"
import TblFoodDiscountEdit from "./ComponentEdit/TblFoodDiscountEdit"
import TblOrderDiscountEdit from "./ComponentEdit/TblOrderDiscountEdit"
import TblVoucherEdit from "./ComponentEdit/TblVoucherEdit"
import TblPointEdit from "./ComponentEdit/TblPointEdit"
import TblDatePromotionEdit from "./ComponentEdit/TblDatePromotionEdit"
import { STATUS_PROMOTION, TYPE_PROMOTION } from "../../../../consts/settings/promotion";
const listTableChild = [

]

class PopupEditTbl extends Component {
  constructor() {
    super();
    this.state = {
      tabIndex:0,
      // selected:`${this.props.PromotionInf.typeNum}`,
      selected: 1,
      isStatus: ''
    };
  }

  radioChangedTypePromotion = () => {
    switch (this.state.selected) {
      case 1:
        return <TblOrderDiscountEdit dataTbl = {listTableChild}/>
      case 2:
        return <TblFoodDiscountEdit dataTbl = {listTableChild}/>
      case 3:
        return <TblVoucherEdit dataTbl = {listTableChild}/>
      case 4:
        return <TblPointEdit dataTbl = {listTableChild}/>
      default:
        break;
    }
  }
  addTable = () =>{

  }
  // loadTypeProm = (str) => {
  //   return (TYPE_PROMOTION.find((item) => {
  //     return str === item.text
  //   }) || { key: '' }).key
  // }

  render() {
    const { PromotionInf, hide } = this.props
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
            >
              ×
            </button>

            <h3 className="title">Sửa chương trình khuyến mãi</h3>
            <div className="block-item-1">
              <div className="block-item__left">
                <div className="form-group">
                  <label className="control-label">Tên chương trình </label>
                  <input type="text" className="form-control"
                    defaultValue={PromotionInf.name}
                  />
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
                  <TblDatePromotionEdit
                     startDate = {this.state.startDate}
                     endDate = {this.state.endDate}
                    //  getValueDate = {(start, end)=>this.onGetValueDate((start, end))}
                  />
                </TabPanel>
              </Tabs>
            </div>
            <div style={{ position: 'absolute', bottom: 20, right: 38 }}>
              <div className="main-btn close-popup-btn" onClick={hide}>QUAY LẠI</div>
              <div className="main-btn s2" style={{ marginLeft: 15 }} onClick={this.addTable} >THÊM</div>
            </div>

          </section>
        </div>
      </div>
    );
  }
}
export default PopupEditTbl;