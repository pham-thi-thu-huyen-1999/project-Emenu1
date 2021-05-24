import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen } from "@fortawesome/free-regular-svg-icons";
import Slider from "react-slick";
import { Button } from "../../../components/common";
import Swal from "./../../../utils/sweetalert2";
import Food from "./Food";
import { LIMIT } from "../constants"
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ComboList from "./ComboList";
import * as CONSTS from "./../constants";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withNamespaces } from "react-i18next";
import * as action from "../actions";
import { name } from "../reducers";

import MagicSliderDots from 'react-magic-slider-dots';
import 'react-magic-slider-dots/dist/magic-dots.css';

class FoodList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      indexSlide: 0,
      categoryItem: this.props.categoryItemList ? this.props.categoryItemList : [],
      categoryName: this.props.categoryItemList.length > 0 ? this.props.categoryItemList[0].name : "",
      showSelectedCategory: false,
      /* listFood: this.props.comboItemListItem.length > 0 ? this.props.comboItemListItem : [], */
      /* filterFood: this.props.comboItemDetailOfItem.length > 0 ? this.props.comboItemDetailOfItem : [], */
      filterFood: this.props.comboItemDetailOfItem.length > 0 ? this.props.comboItemDetailOfItem : [],
      id: 0,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.categoryItemList !== prevState.categoryItem /* || nextProps.comboItemListItem !== prevState.listFood */ || nextProps.comboItemDetailOfItem !== prevState.filterFood) {
      return {
        categoryItem: nextProps.categoryItemList,
        categoryName: nextProps.categoryName,
        filterFood: nextProps.countClickOnSearch === false ?
          nextProps.comboItemListItem : nextProps.comboItemDetailOfItem
      }
    }
    return null;
  }

  next = () => {
    this.slider.slickNext();
  };

  previous = () => {
    this.slider.slickPrev();
  };
  componentDidMount() {
    this.props.onSearch(this.state.categoryName, "", "");
  }
  onClick = (id, name) => {
    const { infoPartnerSetting } = this.props;
    if (infoPartnerSetting.is_combo) {
      this.props.onSearch(name, "", "");
    } else {
      this.props.onSearchItem(name);
    }
    this.setState({
      showSelectedCategory: false,
      categoryName: name,
      id,
      status: true,
    })
  }

  render() {
    const { t } = this.props;
    const { categoryItem, categoryName, showSelectedCategory,
      id, filterFood, status } = this.state;
    const settings = {
      speed: 500,
      infinite: false,
      slidesToShow: 1,
      slidesPerRow: 12,
      slidesToScroll: 1,
      dots: true,
      arrows: false,
      afterChange: (current) => this.setState({ indexSlide: current }),
      appendDots: dots => {
        return <MagicSliderDots dots={dots} numDotsToShow={4} dotWidth={30} dotColor="orange" />;
      },
      responsive: [
        {
          breakpoint: 1100,
          settings: {
            speed: 500,
            slidesToShow: 1,
            slidesPerRow: 4,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
            infinite: false
          },
        },
        {
          breakpoint: 812,
          settings: {
            speed: 500,
            slidesToShow: 4,
            slidesPerRow: 4,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
            infinite: false
          },
        },
      ],
    };

    return (
      <aside className="slider slick-initialized slick-slider FoodList" >
        <div className="combo-content">
          <ComboList
            onClick={this.onClick}
            comboList={categoryItem}
            innerClass="e-m-left-10 e-m-right-10"
            id={id}
          />
        </div>
        <div className="btn-and-title">
          <Button className="btn-category" onClick={() => { this.setState({ showSelectedCategory: !showSelectedCategory }) }}><FontAwesomeIcon icon={faFolderOpen}></FontAwesomeIcon>&nbsp;&nbsp;{t("detailRestaurant.category")}</Button>
          <h2 className="text-center margin-small">{categoryName}</h2>
          <div></div>
        </div>
        { filterFood.length <= 12 ? null : <button
          className={`img-txt slick-arrow slick-prev btn-back `}
          aria-disabled="true"
          onClick={this.previous}
        ></button>}
        <div className="draggable slide-list-food">
          <div
            className="slick-track slick-track-food"
            style={{
              opacity: 1,
              transform: "translate3d(0px, 0px, 0px)",
              height: `${settings.slidesPerRow * 150 + 150}px`
            }}
          >
            <Slider
              ref={c => (this.slider = c)}
              {...settings}
            >
              {filterFood.length > 0 ? filterFood.map((item, index) => {
                return (
                  <Food
                    listFood={item}
                    key={index}
                    t={t}
                  />
                )
              }) : <div className="noti-no-data">
                  {t("detailRestaurant.no_data_dish")}</div>
              }
            </Slider>
          </div>
        </div>
        {filterFood.length <= 12 ? null : <button
          className={`img-txt slick-arrow slick-next btn-next `}
          aria-disabled="false"
          onClick={this.next}
        ></button>}
        {(
          showSelectedCategory && this.props.showSideBar === false) ?
          <div className="combo-category">
            <ComboList
              onClick={this.onClick}
              comboList={categoryItem}
              innerClass="e-m-left-10 e-m-right-10 flex-start"
              categoryName={categoryName}
              id={id}
              vertical={true}
            />
          </div>
          : null
        }
      </aside>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state[name],
  };
};
const mapDispatchToProps = (dispatch) => {
  const actions = {
    ...action,
  };
  return { actions: bindActionCreators(actions, dispatch) };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces()(FoodList));
