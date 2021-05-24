import React, { Component } from "react";
import Slider from "react-slick";

class SlickIndexForEmployee extends Component {
  state = {
    slickIndex: 0,
    indexSlide: 0,
  };
  next = () => {
    this.slider.slickNext();
    
  };

  previous = () => {
    this.slider.slickPrev();
   
  };
  render() {
    
    const { indexSlide } = this.state;
    let { employeeList, settings } = this.props;
    settings = {
      ...settings,
      afterChange: current => this.setState({ indexSlide: current })
    }
    console.log(indexSlide);

    
    return (

      
          <div className="slider slick-initialized slick-slider slick-vertical">
            {employeeList.length <= settings.slidesToShow ? null : (
              <button
                className={`slick-arrow slick-prev arrow-up ${
                 indexSlide <= 0 ? "slick-disabled" : null
                  }`}
                style={{ display: "block",top: "30%",right: "0",left: "unset" }}
                onClick={this.previous}
              ></button>
            )}

            <div className="slick-list draggable" style={{ height: `${settings.slidesToShow * 100}px` }}>
              <div
                className="slick-track"
                style={{
                  opacity: 1,
                  transform: "translate3d(0px, 0px, 0px)",
                  height: `${settings.slidesToShow * 100}px`
                }}
              >
                {employeeList.length === 0 ? (
                  <div style={{ textAlign: "center" }}>

                  </div>
                ) : null}
                <Slider ref={c => (this.slider = c)} {...settings}>
                  {employeeList.map((listItem, index) => (
                    <div key={index} className="employee-card e-row">
                      
                      <div className="e-col-1 employee-card-number">{index + 1}</div>
                      <div className="e-col-3 employee-card-image">
                        <img className="user-image" src={require("../../../images/userIcon.png")} alt="" />
                        </div>
                      <div className="e-col-7 employee-card-info e-row">
                        <span className="e-col-12 e-row employee-card-info__name">
                          {listItem.name}
                        </span>
                        <span className="e-col-12 e-row employee-card-info__area">
                          Khu vực 1,2
                        </span>
                      </div>

                    </div>
                  ))}
                </Slider>
              </div>

              {employeeList.length > settings.slidesToShow ? (
                <button
                  className={`slick-arrow slick-next arrow-down ${
                   indexSlide + settings.slidesToShow >= employeeList.length ? "slick-disabled" : null
                    }`}
                  style={{ display: "block",bottom: "40%",right: "0",left: "unset" }}
                  onClick={this.next}
                ></button>
              ) : null}
            </div>

          </div>
       

    );
  }
}

export default SlickIndexForEmployee;
