import React, { Component } from 'react';
import Slider from "react-slick";
import PropTypes from "prop-types";
import { withNamespaces } from "react-i18next";

function NextArrow() {
  return <div style={{ display: "none" }} />;
}
function PrevArrow() {
  return <div style={{ display: "none" }} />;
}

class TableSlider extends Component {
  state = {
    slickIndex: 0,
    textNotiNoData: `${this.props.t("dishManagaments.noData")}`
  };

  next = () => {
    this.slider.slickNext();
  };

  previous = () => {
    this.slider.slickPrev();
  };

  beforeChange = current => {
    const { dataSources, slidesToShow, onMore } = this.props;
    if (onMore && dataSources.length - slidesToShow - 1 === current) {
      this.props.onMore(current);
    }
  };

  afterChange = current => {
    this.setState({ slickIndex: current })
  };

  static propTypes = {
    className: PropTypes.string,
    textNotiNoData: PropTypes.string
  };

  render() {
    const {
      option,
      dataSources,
      slidesToShow,
      infinite,
      speed,
      vertical,
      verticalSwiping,
      height,
      className,
      statusSlickIndex,
      classNameHead,
      selectedGroup,
      textNotiNoData,
      fixHeight,
      classNameBody
    } = this.props;
    const { slickIndex } = this.state;
    const settings = {
      infinite,
      slidesToShow,
      speed,
      vertical,
      verticalSwiping,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
      afterChange: this.afterChange,
      beforeChange: this.beforeChange
    };
    return (
      <aside className={"main-tbl " + className}>
        <ul className={"head " + classNameHead}>
          {
            option.heads.map((head, index) => (
              <li className={head.className} key={index} >
                {head.text}
              </li>
            ))
          }
        </ul>
        {
          dataSources.length > 0 ?
            <>
              <div className="slider slick-initialized slick-slider slick-vertical">
                {dataSources.length >= slidesToShow && !statusSlickIndex ? (
                  <button
                    className={`slick-arrow arrow-up slick-next ${
                      slickIndex === 0 ? "slick-disabled" : null
                      }`}
                    style={{ display: "block" }}
                    onClick={this.previous}
                  ></button>
                ) : null}
                <div className="slick-list draggable" style={{ height: `${height === "auto" ? height : fixHeight ? fixHeight : "292px"}`}}>
                  <div
                    className="slick-track"
                    style={{
                      opacity: 1,
                      height: `${height === "auto" ? height : fixHeight ? fixHeight : "292px"}`,
                      transform: "translate3d(0px, 0px, 0px)"
                    }}
                  >
                    <Slider ref={c => (this.slider = c)} {...settings}>
                      {dataSources.map((item, index) => (
                        <div
                          className="slide-it slick-slide slick-current slick-active"
                          key={index}
                        >
                          <ul className={`row-its ${classNameBody ? classNameBody : null}`}>
                            {
                              option.columns.map((column, index_li) => {
                                return (
                                  <li
                                    className={column.className}
                                    key={index_li}
                                    onClick={() => column.onClick ? column.onClick(item, this) : {}} >
                                    {column.render ? column.render(item, index) : item[column.key]}
                                  </li>
                                )
                              })
                            }
                          </ul>
                        </div>
                      ))}
                    </Slider>
                  </div>
                </div>
                {dataSources.length >= slidesToShow && !statusSlickIndex ? (
                  <button
                    className={`slick-arrow slick-next arrow-down ${
                      slickIndex === dataSources.length - slidesToShow ? "slick-disabled" : null
                      }`}
                    style={{ display: "block" }}
                    onClick={this.next}
                  ></button>
                ) : null}
              </div>
            </> : <h4 className="text-no-data">{textNotiNoData ? textNotiNoData : this.state.textNotiNoData}!</h4>
        }
      </aside>
    );
  }
}

TableSlider.defaultProps = {
  infinite: false,
  slidesToShow: 4,
  speed: 150,
  vertical: true,
  verticalSwiping: true,
  height: 365
}

export default (withNamespaces()(TableSlider));
