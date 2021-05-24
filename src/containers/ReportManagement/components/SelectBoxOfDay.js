import React, { Component } from "react";
class SelectboxOfDay extends Component {
  state = {
    isShowSelectBox: false,
    selectedIndex: 0
  }

  render() {
    const dayList = [
      {
        title: "Hôm nay - Chủ nhật 11/5/2020"
      },
      {
        title: "Thứ 7 10/5/2020"
      },
      {
        title: "Thứ 6 9/5/2020"
      },
      {
        title: "Thứ 5 8/5/2020"
      },
      {
        title: "Thứ 4 7/5/2020"
      },
      {
        title: "Thứ 3 6/5/2020"
      },
      {
        title: "Thứ 2 5/5/2020"
      }
    ]
    const { isShowSelectBox, selectedIndex } = this.state;
    console.log(isShowSelectBox)

    console.log(this.props);
    return (


      <div className="select-box-of-day">
        <div className="select-box-of-day__title e-row e-col-12" onClick={() => {
          this.setState({
            isShowSelectBox: !this.state.isShowSelectBox
          })
        }}><span> {dayList[selectedIndex].title} </span><span className="down-icon">&#8964;</span></div>
        <div className={isShowSelectBox ? "select-box-of-day__popup e-row e-col-12 active" : "select-box-of-day__popup e-row e-col-12"}>
          
          {
            dayList.map((dayItem, index) => {
              if (index === selectedIndex) {
                return (
                  <div key={index} className="date-selected-item" onClick={() => {
                    this.setState({
                      isShowSelectBox: false
                    })
                  }}>{dayItem.title}</div>
                )
              } 
            })
          }
          
          {
            dayList.map((dayItem, index) => {
              if (index === selectedIndex) {
              } else {
                return (
                  <div key={index} className="date-item" onClick={() => {
                    this.setState({
                      selectedIndex: index,
                      isShowSelectBox: false
                    })
                  }}>
                    {dayItem.title}
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

export default SelectboxOfDay;
