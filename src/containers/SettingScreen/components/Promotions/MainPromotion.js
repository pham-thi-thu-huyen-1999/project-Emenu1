import React, { Component } from "react";
import Slider from "react-slick";
import TableItem from "./TableItem";
import { NextArrow, PrevArrow } from "../Arrow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare, faSearch } from "@fortawesome/free-solid-svg-icons";
import SelectBox from "../../../../components/common/SelectBox"
import { STATUS_PROMOTION, TYPE_PROMOTION } from "../../../../consts/settings/promotion";
import PopupDeletetbl from "./PopupDeleteTbl"
import PopupAddTbl from "./PopupAddTbl";
import PopupEditTbl from "./PopupEditTbl";
const listTable = [
  {
    id: 1,
    name: "Mừng khai trương",
    startDate: "1/1/2020",
    endDate: "15/1/2020",
    typeProm: 1,
    status: 1
  },
  {
    id: 2,
    name: "Tri âm khách hàng ",
    startDate: "1/1/2020",
    endDate: "15/1/2020",
    typeProm: 2,
    status: 1
  },
  {
    id: 3,
    name: "Kỷ niệm ngày quốc tế thiếu nhi",
    startDate: "1/1/2020",
    endDate: "15/1/2020",
    typeProm: 3,
    status: 0
  },
  {
    id: 4,
    name: "Kỷ niệm ngày quốc tế thiếu nhi",
    startDate: "1/1/2020",
    endDate: "15/1/2020",
    typeProm: 4,
    status: 0
  },
  {
    id: 5,
    name: "Mừng khai trương",
    startDate: "1/1/2020",
    endDate: "15/1/2020",
    typeProm: 1,
    status: 1
  },
  {
    id: 6,
    name: "Tri âm khách hàng",
    startDate: "1/1/2020",
    endDate: "15/1/2020",
    typeProm: 1,
    status: 0
  },
  {
    id: 7,
    name: "Mừng khai trương",
    startDate: "1/1/2020",
    endDate: "15/1/2020",
    typeProm: 1,
    status: 0
  },
  {
    id: 9,
    name: "Mừng khai trương",
    startDate: "1/1/2020",
    endDate: "15/1/2020",
    typeProm: 1,
    status: 0
  },


]
export default class MainPromotion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterStatus: null,
      disableNext: true,
      disablePre: true,
      showPopupAddtbl: false,
      indexSlide: 0,
      heightContent: 0,
      showPopupDeletetbl: false,
      showPopupEditTbl: false,
      inFoTable: null,
      searchName: '',
      datajson: listTable
    }
  }
  next = () => {
    this.slider.slickNext();
  };
  previous = () => {
    this.slider.slickPrev();
  }
  componentDidMount() {
    let items = this.setItemSlider();
    if (this.state.datajson.length > items) {
      this.setState({
        disableNext: false
      });
    }

    const heightContent = this.divElement.clientHeight;
    this.setState({ heightContent });
  }
  componentDidUpdate() {
    const { indexSlide, disableNext, disablePre } = this.state;
    let items = this.setItemSlider();
    if (indexSlide === this.state.datajson.length - items && disableNext === false) {
      this.setState({ disableNext: true });
    } else if (indexSlide < this.state.datajson.length - items && disableNext === true) {
      this.setState({ disableNext: false });
    }

    if (indexSlide === 0 && disablePre === false) {
      this.setState({ disablePre: true });
    } else if (indexSlide !== 0 && disablePre === true) {
      this.setState({ disablePre: false });
    }
  }

  setItemSlider = () => {
    const { heightContent } = this.state;
    let showItemSlider = 0
    if (heightContent > 600) {
      showItemSlider = 6
    }
    if (heightContent > 500 && heightContent < 600) {
      showItemSlider = 4
    } if (heightContent < 500) {
      showItemSlider = 3
    }
    return showItemSlider
  }
  handleClickDeleteTable = table => {
    this.setState({
      showPopupDeletetbl: true,
      inFoTable: table
    });
    return
  };

  handleClickEditTable = table => {
    this.setState({
      showPopupEditTbl: true,
      inFoTable: table
    });
    return
  };

  deleteTableOk = () => {
    const { inFoTable } = this.state;
    this.state.datajson.splice(inFoTable.index - 1, 1);
  };
  editTableOk = () => {
    const { inFoTable } = this.state;
    this.state.datajson.splice(inFoTable.index - 1, 1);
  };
  addTable = table => {
    this.state.datajson.push(table);
  };

  onSearch = (name, status) => {

    if(name === '' && status ===  ''){
      return
    }
    let resultSearch = [];

    resultSearch = this.state.datajson.filter(item => {
      return item.name.toLowerCase().search(
        this.state.searchName.toLowerCase()) !== -1
    })
    this.setState({ datajson: resultSearch })
  }
  render() {

    const settings = {
      infinite: false,
      speed: 500,
      slidesToShow: this.setItemSlider(),
      slidesToScroll: 1,
      vertical: true,
      verticalSwiping: true,
      swipeToSlide: true,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
      afterChange: current => this.setState({ indexSlide: current })
    };

    const {
      disableNext,
      disablePre,
      showPopupAddtbl,
      showPopupDeletetbl,
      showPopupEditTbl,
      inFoTable
    } = this.state;


    const loadTypeProm = (index) => {
      return (TYPE_PROMOTION.find((item) => {
        return index === item.key
      }) || { text: '' }).text
    }

    const loadStatus = (index) => {
      return (STATUS_PROMOTION.find((item) => {
        return index === item.key
      }) || { text: '' }).text
    }

    return (
      <div className="promotion" ref={(divElement) => { this.divElement = divElement }}>
        <h3 className="title">chương trình khuyến mãi </h3>
        <div className="filter-search">
          <div className="name">
            <input name="name-search" type="text" placeholder="Tìm theo tên" onChange={event => { this.setState({ searchName: event.target.value }) }}></input>
          </div>
          <div className="form-group">
            <SelectBox
              onChange={e => this.setState({ filterStatus: e })}
              value={this.state.filterStatus}
              dataSource={STATUS_PROMOTION}
              blank="Vui lòng chọn.."
              style={{ width: 250 }}
            >
              <button type="button" className="arrow" >
                <svg aria-hidden="true" focusable="false"
                  data-prefix="fas" data-icon="angle-down" className="svg-inline--fa fa-angle-down fa-w-10 "
                  role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                  <path fill="currentColor"
                    d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z">
                  </path>
                </svg>
              </button>
            </SelectBox>
          </div>
          <button className="btn-search" type="button" onClick={(name, status) => this.onSearch(this.state.searchName, this.state.filterStatus)}>Tìm kiếm  <FontAwesomeIcon icon={faSearch} /></button>
          <div className="s-btn s1 btn-them" onClick={() => this.setState({ showPopupAddtbl: !showPopupAddtbl })}>
            <FontAwesomeIcon icon={faPlusSquare} /> Thêm
          </div>
        </div>
        <aside id="manage-tbls-list" className="view-table">
          <div className="view-table-cell">
            <aside className="set-scrolling-tbl grey70">
              <ul className="head">
                <li style={{ width: 50 }}>Stt</li>
                <li className="col-name" >Tên chương trình</li>
                <li style={{ width: 130 }}>Từ ngày</li>
                <li style={{ width: 130 }}>Đến ngày</li>
                <li className="col-type" >Hình thức</li>
                <li className="col-status">Trạng thái</li>
                <li className="col-acts"> &nbsp; </li>
              </ul>
              <div className="slider-container" style={{ maxHeight: 440 }}>
                {this.state.datajson.length <= 4 ? null : (
                  <button
                    className={`slick-arrow slick-prev arrow-up ${
                      disablePre ? "slick-disabled" : null
                      }`}
                    style={{ display: "block" }}
                    onClick={this.previous}
                  ></button>
                )}
                <Slider ref={c => (this.slider = c)} {...settings}>
                  {
                    this.state.datajson.map((item, index) => (
                      <TableItem
                        key={index}
                        index={index + 1}
                        name={item.name}
                        startDate={item.startDate}
                        endDate={item.endDate}
                        typeProm={loadTypeProm(item.typeProm)}
                        status={loadStatus(item.status)}
                        Delete={this.handleClickDeleteTable}
                        Edit={this.handleClickEditTable}
                      ></TableItem>
                    ))
                  }
                </Slider>
                {this.state.datajson.length <= 4 ? null : (
                  <button
                    className={`slick-arrow slick-next arrow-down ${
                      disableNext ? "slick-disabled" : null
                      }`}
                    style={{ display: "block" }}
                    onClick={this.next}
                  />
                )}
              </div>
            </aside>
          </div>
        </aside>
        {showPopupAddtbl ? (
          <PopupAddTbl hide={() => this.setState({ showPopupAddtbl: !showPopupAddtbl })}
            addTable={this.addTable}
          />
        ) : null}
        {showPopupDeletetbl ? (
          <PopupDeletetbl
            PromotionInf={inFoTable}
            deleteOk={this.deleteTableOk}
            hide={() =>
              this.setState({ showPopupDeletetbl: !showPopupDeletetbl })
            }
          />
        ) : null}
        {showPopupEditTbl ? (
          <PopupEditTbl
            PromotionInf={inFoTable}
            editTable={this.editTableOk}
            hide={() =>
              this.setState({ showPopupEditTbl: !showPopupEditTbl })
            }
          />
        ) : null}

      </div>
    )
  }
}
