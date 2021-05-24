import React, { Component } from "react";
import Slider from "react-slick";

export default class PopupDetailTbl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nav1: null,
      nav2: null,
    };
    this.wrapperRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener("click", this.handleClick);
    this.setState({
      nav1: this.slider1,
      nav2: this.slider2,
    });
  }

  componentWillUnmount() {
    // important
    document.removeEventListener("click", this.handleClick);
  }

/**
 * Click outside
 */
  handleClick = (event) => {
    const { target } = event;
    if (this.wrapperRef.current === null) {
      return;
    }
    if (!this.wrapperRef.current.contains(target)) {
      this.props.hide();
    }
  };
  render() {
    const { inFoTable, hide, t } = this.props;
    return (
      <div className="popup mfp-container mfp-s-ready mfp-inline-holder">
        <div className="mfp-content">
          <section
            id="popup-detail-tbl"
            className="popup-box popup-add-new"
            ref={this.wrapperRef}
          >
            <h3 className="main-lbl text-center">
              {t("tableManagament.popupDetail")}
            </h3>
            <div className="tbl-info">
              <div className="inner clear">
                <aside className="desc fl">
                  <table>
                    <tbody>
                      <tr>
                        <th>{`${t("tableManagament.tableName")}:`}</th>
                        <td>{`${inFoTable.name}`}</td>
                      </tr>
                      <tr>
                        <th>{`${t("tableManagament.area")}:`}</th>
                        <td>{inFoTable.area_name}</td>
                      </tr>
                      <tr>
                        <th>{`${t("tableManagament.tblType")}:`}</th>
                        <td>VIP</td>
                      </tr>
                      <tr>
                        <th>{`${t("tableManagament.numseat")}:`}</th>
                        <td>{`Tối đa ${inFoTable.seat_number} người`}</td>
                      </tr>
                      <tr>
                        <th>{`${t("tableManagament.status")}:`}</th>
                        <td>
                          <span className="green">
                            {inFoTable.is_active
                              ? t("tableManagament.use")
                              : t("tableManagament.notUse")}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <th>{`${t("tableManagament.note")}:`}</th>
                        <td>{inFoTable.description}</td>
                      </tr>
                    </tbody>
                  </table>
                </aside>
                <aside className="fig fl flex-view">
                  <div style={{ width: "100%", margin: "auto" }}>
                    {inFoTable.table_imgs.length ? null : (
                      <div>
                        <img src="./images/tbl-img.jpg" alt="" />
                        <p className="note grey70">
                          <i>*Hình ảnh</i>
                        </p>
                      </div>
                    )}
                    <Slider
                      asNavFor={this.state.nav2}
                      ref={(slider) => (this.slider1 = slider)}
                      arrows={false}
                    >
                      {inFoTable.table_imgs.map((item, i) => (
                        <div key={i}>
                          <img
                            style={{
                              height: 200,
                              width: "auto",
                              margin: "auto",
                            }}
                            src={item.image_link}
                            alt=""
                          />
                        </div>
                      ))}
                    </Slider>
                    <Slider
                      asNavFor={this.state.nav1}
                      ref={(slider) => (this.slider2 = slider)}
                      slidesToShow={
                        inFoTable.table_imgs.length < 3
                          ? inFoTable.table_imgs.length
                          : 3
                      }
                      swipeToSlide={true}
                      focusOnSelect={true}
                      centerMode={
                        inFoTable.table_imgs.length < 4 ? false : true
                      }
                      arrows={false}
                      autoplay={true}
                    >
                      {inFoTable.table_imgs.length === 1
                        ? null
                        : inFoTable.table_imgs.map((item, i) => (
                            <div key={i}>
                              <img
                                style={{
                                  height: 50,
                                  width: "auto",
                                  margin: "auto",
                                }}
                                src={item.image_link}
                                alt=""
                              />
                            </div>
                          ))}
                    </Slider>
                  </div>
                </aside>
              </div>

              <aside className="bot-acts flex-view middle">
                <span></span>
                <div className="grp-btns flex-view middle">
                  <div
                    className="act back-btn"
                    style={{ cursor: "pointer" }}
                    onClick={hide}
                  >
                    <img src="./images/back-btn.png" alt="" />
                  </div>
                </div>
              </aside>
            </div>
          </section>
        </div>
      </div>
    );
  }
}
