import React, { Component } from 'react';
import del from '../img/del.png'
import { CleaveInput } from "../../../components/common";
import { red } from '@material-ui/core/colors';
class PopupQuantity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number: this.props.number,
      showErr: false
    }
    this.selected = React.createRef()

  }

  _handleQuantity = () => {
    const { number } = this.state
    if (number > 0) {
      this.props.addNumber(number)
      this.props.onClose()
      return
    }
    this.setState({ showErr: true })
  };

  _onSelectItem = value => {
    this.selected.current = value;
    let addNumber = this.state.number
    const numberValue = addNumber === 0 ? `${value}` : `${addNumber}${value}`;
    this.setState({showErr:false, number: numberValue });
  };


  _onRemoveItem = () => {
    const { number } = this.state
    this.setState({showErr:false})
    if (number === 0) return;
    const subStr = number.toString().slice(0, number.toString().length - 1);
    this.setState({ number: subStr });
  };

  _onRemoveAll = () => this.setState({ number: 0,showErr:false });


  render() {
    const COLORS = {
      primary: '#2699FB',
      gray: '#C8C7C7',
      red: '#FF1010',
      yellow: '#F5E50A',
      green: '#10775E',
    };
    const { number, showErr } = this.state
    const { item, onClose, t } = this.props
    return (
      <div className="popup-calc" >
        <span onClick={onClose} style={{ position: 'fixed', zIndex: 10, width: '100vw', height: '100vh', background: 'rgb(0 0 0 / 5%)' }}></span>
        <div className="body-calc">
          <div className="button-color mfp-close" onClick={onClose}></div>
          <div className="header-calc">
            <div className="title">{t('orderFood.inputQuant')}</div>
            <div className="inner-input">
              <CleaveInput setValue={value => this.setState({ number: value })} value={number ? number : "0"}
                options={{
                  numeral: true,
                }}
              />
              {' '}
              <span style={{ color: COLORS.primary }}>
                /{item.unit_item ? item.unit_item.name : item.unit_name ? item.unit_name : ''}
              </span>
              {showErr && <div className="showErr"> {t('orderFood.showErr')}</div>}
            </div>
          </div>
          <div className="keyboar">
            <div className="item" style={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
              {[7, 8, 9].map((value, index) => (
                <div className="item-inner" key={index}
                  onClick={() => this._onSelectItem(value)}
                >
                  <span style={{ fontWeight: 'bold', fontSize: 18 }}>{value}</span>
                </div>
              ))}

              <div
                className="item-inner"
                style={{
                  backgroundColor: COLORS.red,
                }}
                onClick={() => this._onRemoveItem()}
              >
                <img src={del} />
              </div>
            </div>

            <div className="item">
              {[6, 5, 4].map((value2, index2) => (
                <div className="item-inner" key={index2}
                  onClick={() => this._onSelectItem(value2)}
                >
                  <span style={{ fontWeight: 'bold', fontSize: 18 }}>{value2}</span>
                </div>
              ))}

              <div className="item-inner"
                style={{
                  backgroundColor: COLORS.yellow,
                }}
                onClick={() => this._onRemoveAll()}
              >
                <span style={{ fontWeight: 'bold', fontSize: 18 }}>C</span>
              </div>
            </div>

            <div className="item">
              {[3, 2, 1].map((value3, index3) => (
                <div className="item-inner" key={index3}
                  onClick={() => this._onSelectItem(value3)}
                >
                  <span style={{ fontWeight: 'bold', fontSize: 18 }}>{value3}</span>
                </div>
              ))}

              <div className="item-inner"
                style={{ backgroundColor: COLORS.green, }}
                onClick={() => this._handleQuantity()}
              >
                <span style={{ color: 'white', fontWeight: 'bold' }}>Ok</span>
              </div>
            </div>

            <div className="item">
              {[0, '.'].map((value4, index4) => (
                <div className="item-inner" key={index4}
                  onClick={() => this._onSelectItem(value4)}
                >
                  <span style={{ fontWeight: 'bold', fontSize: 18 }}>{value4}</span>
                </div>
              ))}
              <div style={{ width: 50, height: 50, margin: 5 }} />
              <div style={{ width: 50, height: 50, margin: 5 }} />
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default PopupQuantity;