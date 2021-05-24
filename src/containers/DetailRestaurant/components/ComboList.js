import React, { Component } from "react";
import ComboItem from "./ComboItem";
import Slider from "react-slick";
export default class ComboList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slickIndex: 0,
    };
  }

  next = () => {
    this.slider.slickNext();

  };

  previous = () => {
    this.slider.slickPrev();
  };

  onClickComboItem = (id, name, comboId) => {
    this.props.onClick(id, name, comboId);
  }
  render() {
    const { slickIndex } = this.state;
    const { t, innerClass, comboList, vertical, styleSideBar } = this.props;
    const { ...rest } = this.props;
    let settingsForCombo = {};
    {
      vertical === true ? settingsForCombo = {
        speed: 500,
        infinite: false,
        slidesToShow: 1,
        slidesPerRow: 8,
        slidesToScroll: 1,
        afterChange: current => this.setState({ slickIndex: current }),
        arrows: false
      } : settingsForCombo = {
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        afterChange: current => this.setState({ slickIndex: current }),
        arrows: false
      }
    }
    return (
      <>
        <aside className="slider slick-initialized slick-slider" style={{ width: "100%" }}>
          <div className="draggable">
              {comboList.length < 1 ? null : (
                <button
                  className={`thumb-nav-slick ${slickIndex !== 0 ? null : "disabled"
                    }`}
                  onClick={this.previous}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="26px" height="px"><path d="M0 0h24v24H0z" fill="none"/><path d="M11.67 3.87L9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z"/></svg>
                </button>
              )}
            <div className={`slick-track ${styleSideBar || ''}`}>
              <Slider ref={c => (this.slider = c)} {...settingsForCombo}>
                {
                  comboList.map((comboItem, index) => {
                    return (
                      comboItem.is_price ?
                        <ComboItem
                          name={comboItem.name}
                          key={index}
                          onClickComboItem={() => {
                            this.onClickComboItem(index, comboItem.name, comboItem.id);
                          }}
                          selected={this.props.id === index}
                          innerClass={innerClass}
                        />
                        :
                        <ComboItem
                          name={comboItem.name}
                          key={index}
                          onClickComboItem={() => {
                            this.onClickComboItem(index, comboItem.name, comboItem.id);
                          }}
                          selected={this.props.id === index}
                          innerClass={innerClass}
                        />
                    )
                  })
                }
              </Slider>
            </div>
            {comboList.length < 1 ? null : (
                <button
                  className={`thumb-nav-slick ${slickIndex === comboList.length || comboList.length <= 4 || comboList.length - slickIndex < 4 || comboList.length - slickIndex * settingsForCombo.slidesPerRow <= 8 || comboList.length - slickIndex * settingsForCombo.slidesPerRow <= 8
                      ? "disabled"
                      : ''
                    }`}
                  onClick={this.next}
                >

                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="18px" height="18px"><path d="M0 0h24v24H0z" fill="none"/><path d="M5.88 4.12L13.76 12l-7.88 7.88L8 22l10-10L8 2z"/></svg>
                </button>
              )}
          </div>
        </aside>
      </>
    );
  }
}
