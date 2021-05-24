import React, { Component } from "react";
import GP from "../img/google-play.png";
import AS from "../img/apple-store.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch, faSadTear,
  faClosedCaptioning
} from "@fortawesome/free-solid-svg-icons";
import { Animated } from "react-animated-css";
import Food from "./Food"
export default class PopupFoodSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textSearch: '',
      isNotfound: false,
      dbDefault: this.props.dataSearch,
      dbSearch:  this.props.dataSearch
    };
    this.TimeoutRef = React.createRef();
  }

  onChange = e => {
    let nameSearch = e.target.value
    this.setState({
      textSearch: nameSearch,
      dbDefault: this.state.dbSearch
    })

    if (!nameSearch) {
      this.setState({
        textSearch: '',
        isNotfound: false,
      })
    }
    if (this.TimeoutRef.current) {
      clearTimeout(this.TimeoutRef.current);
    }
    this.TimeoutRef.current = setTimeout(() => {
      if (nameSearch.trim()) {
        this.onfilterSearchLoaction(nameSearch)
      }
    }, 500);
  };

  onfilterSearchLoaction = textSearch => {
    if (textSearch) {
      const newData = this.state.dbDefault.filter((item) => {
        const itemData = item.item_name ? item.item_name.toUpperCase() : ''.toUpperCase();
        const textData = this.state.textSearch.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      this.setState({ dbDefault: newData })
      if (newData.length > 0) {
        this.setState({ isNotfound: false })
      } else {
        this.setState({ isNotfound: true })
      }
    } else {
      this.setState({ dbDefault: this.state.dbSearch })
    }
  };

  onClearText = () => {
    this.setState({
      textSearch: '',
      isNotfound: false,
      dbDefault: this.state.dbSearch
    })
  };

  render() {
    const { isVisible, t, listFood, onHidden } = this.props;
    const { dbDefault, textSearch, isNotfound } = this.state
    return (
      <Animated animationIn="zoomIn" animationOut="zoomOut" animationInDuration={1000} animationOutDuration={1000} isVisible={isVisible} className="animated-popup">
        <div className="popup-search">
          <div className="header-search" >
            <FontAwesomeIcon icon={faSearch} color="orange"  />
            <div className="box-search">
              <input className="emenu-input input-search "
                placeholder={t('detailRestaurant.placeholder')}
                onChange={e => this.onChange(e)}
                value={this.state.textSearch}
              ></input>
              {textSearch !== '' ? <div className="clear-text" onClick={()=>this.onClearText()}> &#10005;</div> : null}
            </div>
            <div className="btn-close" onClick={onHidden}> {t('detailRestaurant.closed')}</div>
          </div>
          <div className="content-search">
            {isNotfound ? (
              <Animated animationIn="fadeIn" animationOut="fadeIn" animationInDuration={1000} animationOutDuration={1000} isVisible={isNotfound}className="data-search-item">
              <div style={{ textAlign: "center", display: 'flex', flexDirection: 'column', justifyContent: "center", alignItems: "center", minHeight: 300 }}>
                <p><FontAwesomeIcon icon={faSadTear} color="orange" style={{ fontSize: 50 }} /></p>
                <p>{t('detailRestaurant.notFound')}</p>
              </div></Animated>
            ) : null}
              {dbDefault.length > 0 ? <Animated animationIn="fadeIn" animationOut="fadeOut" animationInDuration={1000} animationOutDuration={1000} isVisible={true}className="data-search-item">
                {dbDefault.map((item, index) => (
                  <Food listFood={item} key={index} t={t} />
                ))}</Animated> :null
              }
          </div>
        </div>
      </Animated>
    );
  }
}

