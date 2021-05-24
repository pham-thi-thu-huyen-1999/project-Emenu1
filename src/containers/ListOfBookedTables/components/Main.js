import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faSearch,
  faPhoneAlt,
  faCalendarAlt,
  faClock,
  faUsers,
  faSmokingBan,
  faSmoking,
  faCommentDots
} from "@fortawesome/free-solid-svg-icons";

export default class Main extends Component {
  render() {
    return (
      <main id="site-main" className="nofooter">
        <div id="primary" className="no-footer p-list-of-booked-tables clear">
          <section id="main-cont" className="full clear">
            <div id="quick-search">
              <h2
                className="text-left main-tit "
                style={{ fontSize: 24, fontWeight: 550 }}
              >
                TÌM KIẾM NHANH
              </h2>
              <aside
                className="top-acts flex-view middle"
                style={{ marginLeft: 100, marginRight: 100, marginBottom: 20 }}
              >
                <div className=" filter  select-box">
                  <div className="curr-val">
                    <div className="lt">
                      <span className="txt">TRẠNG THÁI</span>
                    </div>
                    <div className="rt">
                      <button type="button" className="arrow">
                        <FontAwesomeIcon icon={faAngleDown} />
                      </button>
                    </div>
                    <input type="hidden" className="input-val" value="" />
                  </div>
                </div>
                <div className="">
                  <input type="text" placeholder="TÊN" />
                </div>
                <div className="">
                  <input type="text" placeholder="SỐ ĐIỆN THOẠI" />
                </div>
              </aside>
              <aside className="acts text-center">
                <div className="main-btn s2 ">
                  TÌM KIẾM <FontAwesomeIcon icon={faSearch} />
                </div>
              </aside>
            </div>
            <div id="list-of-booked-tables">
              <div className="card-tbl">
                <div className="card-title">
                  HOÀNG HỒNG THOA
                  <div className="phone-number">
                    <FontAwesomeIcon icon={faPhoneAlt} /> 0902 333 555
                  </div>
                </div>
                <div className="info">
                  <div className="it">
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      size="lg"
                      color="#F27922"
                    />{" "}
                    20-11-2019
                  </div>
                  <div className="it">
                    <FontAwesomeIcon icon={faClock} size="lg" color="#F27922" />{" "}
                    7h:15 PM
                  </div>
                  <div className="it">
                    <FontAwesomeIcon icon={faUsers} size="lg" color="#F27922" />{" "}
                    10 người - 3 trẻ em
                  </div>
                  <div className="it">
                    <FontAwesomeIcon
                      icon={faSmokingBan}
                      size="lg"
                      color="#F27922"
                    />{" "}
                    Không hút thuốc
                  </div>
                </div>

                <div className="v-btn-edit">
                  <div className="btn-edit">XỬ LÝ </div>
                </div>
                <div className="btn-bottom w-confirm"> ĐỢI XÁC NHẬN</div>
              </div>
              <div className="card-tbl">
                <div className="card-title">
                  HOÀNG HỒNG THOA
                  <div className="phone-number">
                    <FontAwesomeIcon icon={faPhoneAlt} /> 0902 333 555
                  </div>
                </div>
                <div className="info">
                  <div className="it">
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      size="lg"
                      color="#F27922"
                    />{" "}
                    20-11-2019
                  </div>
                  <div className="it">
                    <FontAwesomeIcon icon={faClock} size="lg" color="#F27922" />{" "}
                    7h:15 PM
                  </div>
                  <div className="it">
                    <FontAwesomeIcon icon={faUsers} size="lg" color="#F27922" />{" "}
                    10 người - 3 trẻ em
                  </div>
                  <div className="it">
                    <FontAwesomeIcon
                      icon={faSmoking}
                      size="lg"
                      color="#F27922"
                    />{" "}
                    có hút thuốc
                  </div>
                </div>

                <div className="v-btn-edit">
                  <div className="btn-edit">CHỈNH SỬA</div>
                </div>
                <div className="btn-bottom confirmed"> ĐÃ XÁC NHẬN</div>
              </div>
              <div className="card-tbl">
                <div className="card-title">
                  HOÀNG HỒNG THOA
                  <div className="phone-number">
                    <FontAwesomeIcon icon={faPhoneAlt} /> 0902 333 555
                  </div>
                </div>
                <div className="info">
                  <div className="it">
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      size="lg"
                      color="#F27922"
                    />{" "}
                    20-11-2019
                  </div>
                  <div className="it">
                    <FontAwesomeIcon icon={faClock} size="lg" color="#F27922" />{" "}
                    7h:15 PM
                  </div>
                  <div className="it">
                    <FontAwesomeIcon icon={faUsers} size="lg" color="#F27922" />{" "}
                    10 người - 3 trẻ em
                  </div>
                  <div className="it">
                    <FontAwesomeIcon
                      icon={faSmoking}
                      size="lg"
                      color="#F27922"
                    />{" "}
                    có hút thuốc
                  </div>
                </div>

                <div className="v-btn-edit">
                  <div className="btn-edit disable">CHỈNH SỬA</div>
                </div>
                <div className="btn-bottom cancel">KHÁCH HÀNG HỦY</div>
              </div>
              <div className="card-tbl">
                <div className="card-title">
                  HOÀNG HỒNG THOA
                  <div className="phone-number">
                    <FontAwesomeIcon icon={faPhoneAlt} /> 0902 333 555
                  </div>
                </div>
                <div className="info">
                  <div className="it">
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      size="lg"
                      color="#F27922"
                    />{" "}
                    20-11-2019
                  </div>
                  <div className="it">
                    <FontAwesomeIcon icon={faClock} size="lg" color="#F27922" />{" "}
                    7h:15 PM
                  </div>
                  <div className="it">
                    <FontAwesomeIcon icon={faUsers} size="lg" color="#F27922" />{" "}
                    10 người - 3 trẻ em
                  </div>
                  <div className="it">
                    <FontAwesomeIcon
                      icon={faSmokingBan}
                      size="lg"
                      color="#F27922"
                    />{" "}
                    Không hút thuốc
                  </div>
                </div>
                <div className="v-btn-edit">
                  <div className="btn-edit disable">CHỈNH SỬA</div>
                </div>
                <div className="btn-bottom cancel">
                  ĐÃ HỦY{" "}
                  <div className="tooltip">
                    <FontAwesomeIcon
                      icon={faCommentDots}
                      size="lg"
                      color="#F27922"
                    />
                    <span class="tooltiptext">Vì lý do khách quan nên chúng tôi đã hủy đơn hàng này</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }
}
