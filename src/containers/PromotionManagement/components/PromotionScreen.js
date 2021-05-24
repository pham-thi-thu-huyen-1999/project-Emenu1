import React, { Component } from "react";
import Slider from "react-slick";
import TableItem from "./TableItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusSquare,
  faSearch,
  faAngleDown,
} from "@fortawesome/free-solid-svg-icons";
import SelectBox from "../../../components/common/SelectBox";
import { STATUS_PROMOTION } from "../../../consts/settings/promotion";
import PopupAddTbl from "./PopupAddPromotion";
import PopupEditTbl from "./PopupEditPromotion";
import Swal from "../../../utils/sweetalert2";
import { Button, Input } from "../../../components/common";
import Loading from "../../../components/common/Loading";

export default class PromotionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterStatus: null,
      showPopupAddtbl: false,
      indexSlide: 0,
      heightContent: 0,
      showPopupEditTbl: false,
      promotionInfo: null,
      resultSearch: [],
      searchName: "",
    };
  }
  next = () => {
    this.slider.slickNext();
  };
  previous = () => {
    this.slider.slickPrev();
  };

  componentDidMount() {
    const heightContent = this.divElement.clientHeight;
    this.setState({ heightContent });
  }

  setItemSlider = () => {
    const { heightContent } = this.state;
    let showItemSlider = 0;
    if (heightContent > 600) {
      showItemSlider = 6;
    }
    if (heightContent > 500 && heightContent < 600) {
      showItemSlider = 4;
    }
    if (heightContent < 500) {
      showItemSlider = 3;
    }
    return showItemSlider;
  };

  handleClickDeletePromotion = (promotion) => {
    const data = {
      promotion_id: promotion.id,
    };
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.value) {
        this.props.actions.deletePromotion({ data });
      }
    });
  };

  handleClickEditPromotion = (table) => {
    this.setState({
      showPopupEditTbl: true,
      promotionInfo: table,
    });
    return;
  };

  onSearch = (name, status) => {
    if (name === "" && status === null) {
      return;
    }
    let resultSearch = [];

    const is_active = status ? true : false;

    resultSearch = this.props.promotionList.filter((item) => {
      return (
        item.name.toLowerCase().search(this.state.searchName.toLowerCase()) !==
          -1 && item.is_active === is_active
      );
    });
    this.setState({ resultSearch });
  };

  render() {
    const settings = {
      infinite: false,
      speed: 500,
      slidesToShow: this.setItemSlider(),
      slidesToScroll: 1,
      vertical: true,
      verticalSwiping: true,
      swipeToSlide: true,
      arrows: false,
      afterChange: (current) => this.setState({ indexSlide: current }),
    };

    const {
      indexSlide,
      showPopupAddtbl,
      showPopupEditTbl,
      promotionInfo,
      resultSearch,
    } = this.state;

    let { promotionList, ...rest } = this.props;

    if (resultSearch.length !== 0) {
      promotionList = resultSearch;
    }

    return (
      <main
        id="site-main"
        className="nofooter"
        ref={(divElement) => {
          this.divElement = divElement;
        }}
      >
        <div id="primary" className="no-footer p-management clear">
          <section id="main-cont" className="full clear">
            <Loading show={this.props.isLoading} />
            <aside id="manage-promotion" className="view-table">
              <div className="view-table-cell">
                <div className="popup-box inner-box">
                  <h3 className="title">chương trình khuyến mãi </h3>
                  <div className="filter-search">
                    <div className="flex-view fw100">
                      <div className="flex-view" style={{ width: 700 }}>
                        <Input
                          style={{ width: 300 }}
                          placeholder="Tìm theo tên"
                          onChange={(event) => {
                            this.setState({ searchName: event.target.value });
                          }}
                        />
                        <SelectBox
                          onChange={(e) => this.setState({ filterStatus: e })}
                          value={this.state.filterStatus}
                          dataSource={STATUS_PROMOTION}
                          blank="Vui lòng chọn.."
                          style={{ width: 250 }}
                        >
                          <button type="button" className="arrow">
                            <FontAwesomeIcon icon={faAngleDown} />
                          </button>
                        </SelectBox>
                        <Button
                          main
                          type="s2"
                          onClick={(name, status) =>
                            this.onSearch(
                              this.state.searchName,
                              this.state.filterStatus
                            )
                          }
                        >
                          Tìm kiếm <FontAwesomeIcon icon={faSearch} />
                        </Button>
                      </div>
                      <Button
                        type="s1"
                        style={{ width: 120 }}
                        onClick={() =>
                          this.setState({ showPopupAddtbl: !showPopupAddtbl })
                        }
                      >
                        <FontAwesomeIcon icon={faPlusSquare} /> Thêm
                      </Button>
                    </div>
                  </div>
                  <aside id="manage-tbls-list" className="view-table">
                    <div className="view-table-cell">
                      <aside className="set-scrolling-tbl grey70">
                        <ul className="head">
                          <li style={{ width: 50 }}>Stt</li>
                          <li className="col-name">Tên chương trình</li>
                          <li style={{ width: 140 }}>Từ ngày</li>
                          <li style={{ width: 140 }}>Đến ngày</li>
                          <li className="col-type">Hình thức</li>
                          <li className="col-status">Trạng thái</li>
                          <li className="col-acts"> &nbsp; </li>
                        </ul>
                        <div
                          className="slider-container"
                          style={{ maxHeight: 440 }}
                        >
                          {promotionList.length <=
                          this.setItemSlider() ? null : (
                            <button
                              className={`slick-arrow slick-prev arrow-up ${
                                indexSlide === 0 ? "slick-disabled" : null
                              }`}
                              style={{ display: "block" }}
                              onClick={this.previous}
                            ></button>
                          )}
                          <Slider ref={(c) => (this.slider = c)} {...settings}>
                            {promotionList.map((item, index) => (
                              <TableItem
                                key={index}
                                index={index + 1}
                                promotionInfo={item}
                                Delete={this.handleClickDeletePromotion}
                                Edit={this.handleClickEditPromotion}
                              ></TableItem>
                            ))}
                          </Slider>
                          {promotionList.length <=
                          this.setItemSlider() ? null : (
                            <button
                              className={`slick-arrow slick-next arrow-down ${
                                promotionList.length - this.setItemSlider() <=
                                indexSlide
                                  ? "slick-disabled"
                                  : ""
                              }`}
                              style={{ display: "block" }}
                              onClick={this.next}
                            />
                          )}
                        </div>
                      </aside>
                    </div>
                  </aside>
                  {showPopupAddtbl && (
                    <PopupAddTbl
                      hide={() =>
                        this.setState({ showPopupAddtbl: !showPopupAddtbl })
                      }
                      {...rest}
                    />
                  )}

                  {showPopupEditTbl && (
                    <PopupEditTbl
                      PromotionInf={promotionInfo}
                      editTable={this.editTableOk}
                      hide={() =>
                        this.setState({ showPopupEditTbl: !showPopupEditTbl })
                      }
                      {...rest}
                    />
                  )}
                </div>
              </div>
            </aside>
          </section>
        </div>
      </main>
    );
  }
}
