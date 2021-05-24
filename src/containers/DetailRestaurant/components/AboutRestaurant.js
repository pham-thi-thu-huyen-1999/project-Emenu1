import React, { Component } from "react";
import { Button, Dialog, ImageLoading } from "../../../components/common";
import image from "../img/PorkLoin.jpg";
import GP from "../img/google-play.png";
import AS from "../img/apple-store.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faPhoneAlt,
  faStar,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import MagicSliderDots from 'react-magic-slider-dots';
import 'react-magic-slider-dots/dist/magic-dots.css';
export default class AboutRestaurant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      indexSlide: 0,
    };
  }

  next = () => {
    this.slider.slickNext();
  };

  previous = () => {
    this.slider.slickPrev();
  };

  render() {
    const { partner, t } = this.props;
    const settings = {
      speed: 500,
      infinite: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      dots: true,
      arrows: false,
      afterChange: (current) => this.setState({ indexSlide: current }),
      appendDots: dots => {
        return <MagicSliderDots dots={dots} numDotsToShow={4} dotWidth={30} dotColor="orange" />;
      },
    };

    return (
      <div className="about-res">
        <div className="draggable slide-list-food">
          <div
            className="slick-track slick-track-food"
            style={{
              opacity: 1,
              transform: "translate3d(0px, 0px, 0px)",
              height: 300
            }}
          >
            <Slider
              ref={c => (this.slider = c)}
              {...settings}
            >
              {partner.images.length > 0 ? partner.images.map((item, index) => {
                return (
                  <div key={index}>
                    <ImageLoading src={item}/>
                  </div>
                )
              }) : <div className="noti-no-data">
                  {t("detailRestaurant.no_data_dish")}</div>
              }
            </Slider>
          </div>
        </div>

        <div className="info-restaurant">
          <div className="distance-start-end e-flex item-end " style={{flexWrap:'nowrap', fontFamily:'Roboto', justifyContent: 'space-between'}}>
            <h1 className="title">{partner.name}</h1>
            <div className="">
               <div><FontAwesomeIcon icon={faStar} color="orange" /> {partner.point}</div>
               <div>{partner.number_vote} {t("detailRestaurant.votes")}</div>
             </div>
          </div>
          <p><span> <FontAwesomeIcon icon={faMapMarkerAlt} /></span>{partner.address}</p>
          <p><span> <FontAwesomeIcon icon={faClock} /></span>{partner.open_time + '-' + partner.close_time}</p>
          <p><span> <FontAwesomeIcon icon={faPhoneAlt} /></span>{partner.phone_number}</p>
          <div className="desc">{partner.description}</div>
        </div>
      </div>
    );
  }
}

