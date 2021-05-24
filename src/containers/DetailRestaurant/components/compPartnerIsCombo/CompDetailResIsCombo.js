import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faPhoneAlt,
  faClock,
  faSearch
} from "@fortawesome/free-solid-svg-icons";
import FoodListPartnerIsCombo from "./FoodListPartnerIsCombo";
import { Link } from 'react-scroll';
import ReactDOM from 'react-dom';

export default class CompDetailResIsCombo extends Component {
  constructor(props) {
    super(props);
    this.tabRef = React.createRef([])
    this.state = {
      itemLists: this.props.itemLists,
      listItemsIsCombo:this.props.itemLists,
      listPointTab:[]
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (JSON.stringify(prevState.itemLists) !== JSON.stringify(nextProps.itemLists)) {
      return {
        listItemsIsCombo: nextProps.itemLists,
        itemLists: nextProps.itemLists,
        infoPartnerSetting: nextProps.infoPartnerSetting
      }
    }
    return null;
  }


  onScrollEvent = (index)=> {
     let node = ReactDOM.findDOMNode(this).getElementsByClassName('item-nar-bar-'+ index)
    // let element = document.getElementByClass('item-nar-bar-'+ index);
    // console.log(node);
    this.tabRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })

  }

  render() {
    const { listItemsIsCombo,listPointTab } = this.state;
    const { t } = this.props;
    // if(this.tabRef.current !==null)
    // console.log(this.tabRef.current.getBoundingClientRect().right);
    return (
      <>
        <div className="food-res__header sticky" >
          <div className="search-food" onClick={() => this.props.onShowPopupSearch(true)}>
            <FontAwesomeIcon icon={faSearch} />
          </div>
          {listItemsIsCombo && listItemsIsCombo.length > 0 ?
            <div className="category" ref={this.tabRef}>
              {listItemsIsCombo.map((comboItem, index) => (
                index === 0 ?
                  <div className={"item-nar-bar item-nar-bar-"+index} key={index}>
                    <Link activeClass="active"
                      onSetActive={this.handleSetActive}
                      onSetInactive={this.handleSetInactive}
                      to={'conten-' + index} spy={true}
                      offset={50}
                      smooth={true} key={index}
                      containerId="detail-root"
                      onClick ={()=>this.onScrollEvent(index)}
                    >{comboItem.name}</Link> </div>
                  : <div className={"item-nar-bar item-nar-bar-"+index} key={index}  > <Link
                    containerId="detail-root"
                    to={'conten-' + index}
                    spy={true}
                    smooth={true}
                    key={index}
                    onClick ={()=>this.onScrollEvent(index)}
                    >{comboItem.name}</Link></div>
              ))}</div>
            : null
          }
        </div>
        {listItemsIsCombo && listItemsIsCombo.length > 0 ?
          <FoodListPartnerIsCombo listItemsIsCombo={listItemsIsCombo} t={t}/>
          : null}

      </>
    );
  }
}