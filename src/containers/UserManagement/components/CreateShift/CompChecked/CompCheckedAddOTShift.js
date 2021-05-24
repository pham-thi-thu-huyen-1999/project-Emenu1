import React from "react";
import { CheckBox } from "../../../../../components/common";
export default class CheckedAddOTShift extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      listShift: this.props.listShift,
      checkedAll: false,
      listChecked: this.props.listCheckedOTShift, // list checked ischange
      listCheckedOTShift: this.props.listCheckedOTShift, // list from props to compare with state
      listShiftCalendar: this.props.listShiftCalendar,
      listcheckedInit: this.props.listCheckedOTShift, // list shift init or disable
      dayChoosedOT: this.props.dayChoosedOT
    }
  }
  /**
   * checked case all
   * @param {*} checked
   */
  onCheckedAll = (checked) => {
    let newLstShift = []
    let { listChecked, checkedAll, listShift, listcheckedInit } = this.state;
    listShift.map(item => {
      newLstShift.push(item.id)
    })
    if (checked) {
      listChecked = newLstShift
      checkedAll = true
    } else {
      listChecked = listcheckedInit
      checkedAll = false
      newLstShift = listcheckedInit
    }
    this.setState({
      listChecked,
      checkedAll
    })
    this.props.onChangeShift(newLstShift, this.state.listcheckedInit)
  }
  /**
   * when length list checked === length listShift
   * @param {*} list
   */
  checkAll = list => {
    if (list.length === this.state.listShift.length) {
      this.setState({
        checkedAll: true
      })
    } else {
      this.setState({
        checkedAll: false
      })
    }
  }
  /**
   * when click shift
   * @param {*} checked
   * @param {*} idShift
   */
  onChange = (checked, idShift) => {
    let listChecked = [...this.state.listChecked];
    if (checked) {
      listChecked = [...listChecked, idShift]
    } else {
      listChecked = this.state.listChecked.filter(item => item !== idShift)
    }
    this.checkAll(listChecked)
    this.setState({ listChecked })
    this.props.onChangeShift(listChecked, this.state.listcheckedInit)
  }

  componentDidMount() {
    if (this.props.listCheckedOTShift.length === this.props.listShift.length) {
      this.setState({
        checkedAll: true
      })
    } else {
      this.setState({
        checkedAll: false
      })
    }
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if ((JSON.stringify(nextProps.listCheckedOTShift)
      !== JSON.stringify(prevState.listCheckedOTShift))
      && (nextProps.dayChoosedOT !== prevState.dayChoosedOT)) {
      let checkedAll = false;
      if (nextProps.listCheckedOTShift.length === prevState.listShift.length) {
        checkedAll = true
      }
      return {
        listChecked: nextProps.listCheckedOTShift,
        listcheckedInit: nextProps.listCheckedOTShift,
        listCheckedOTShift: nextProps.listCheckedOTShift,
        checkedAll,
        dayChoosedOT: nextProps.dayChoosedOT
      }
    }
    return null;
  }
  render() {
    const { checkedAll, listShift, listcheckedInit, listChecked } = this.state;
    const { t } = this.props;
    return (
      <>
        <div className="item-shift">
          <CheckBox label={t("user.createShift.all")} checked={checkedAll}
            onChange={this.onCheckedAll} />
        </div>
        {
          listShift.map((shift, index) => {
            let checked = listChecked.includes(shift.id);
            const dataDisable = listcheckedInit.includes(shift.id);
            return (
              <div key={index} className="item-shift">
                <CheckBox
                  className={dataDisable ? "disable-default" : ""}
                  checked={!checked ? dataDisable : checked}
                  label={shift.name}
                  disabled={dataDisable}
                  onChange={checked => this.onChange(checked, shift.id)}
                />
              </div>
            )
          })
        }
      </>
    )
  }
}