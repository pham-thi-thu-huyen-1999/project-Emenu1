import React, { Component } from "react";
class SelectBoxCommon extends Component {
  state = {
    isShowSelectBox: false,
    selectedIndex: 0
  }
  render() {

    const { isShowSelectBox, selectedIndex } = this.state;
    const { list, collumn } = this.props;
    console.log(isShowSelectBox)

    console.log(this.props);
    return (


      <div className="select-box-common">
        <div className="select-box-common__title e-row e-col-12" onClick={() => {
          this.setState({
            isShowSelectBox: !this.state.isShowSelectBox
          })
        }}><span>{list[selectedIndex].title}</span><span className="down-icon">&#8964;</span></div>
        <div className={isShowSelectBox ? `select-box-common__popup e-row e-col-12 collumn-${collumn} active-common` : "select-box-common__popup"}>
          {
            list.map((listItem, index) => {
              if (index === selectedIndex) {
                return (
                  <div key={index} className="date-selected-item"  onClick={() => {
                    this.setState({
                      isShowSelectBox: false
                    })
                  }}>{listItem.title}</div>
                )
              } else {
                return (
                  <div key={index} className="date-item" onClick={() => {
                    this.setState({
                      selectedIndex: index,
                      isShowSelectBox: false
                    })
                  }}>
                    {listItem.title}
                  </div>
                )
              }
            })
          }
         
         
        </div>

      </div>


    );
  }
}

export default SelectBoxCommon;
