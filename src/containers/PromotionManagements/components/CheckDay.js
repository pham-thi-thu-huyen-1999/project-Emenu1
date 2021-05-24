import React from "react";
import { CheckBox } from "../../../components/common"

export default class CheckDayList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      days: props.days,
      isAllSelected: false,
      data: [
        {
          key: "monday",
          name: `${this.props.t("promotions.monday")}`
        },
        {
          key: "tuesday",
          name: `${this.props.t("promotions.tuesday")}`
        },
        {
          key: "wednesday",
          name: `${this.props.t("promotions.wednesday")}`
        },
        {
          key: "thursday",
          name: `${this.props.t("promotions.thursday")}`
        },
        {
          key: "friday",
          name: `${this.props.t("promotions.friday")}`
        },
        {
          key: "saturday",
          name: `${this.props.t("promotions.saturday")}`
        },
        {
          key: "sunday",
          name: `${this.props.t("promotions.sunday")}`
        }
      ]
    }
  }
  onChangeChecked = (data, key) => {
    const { days } = this.state;
    this.setState({
      days: {
        ...days,
        [key]: data
      }
    }, this.changeCheckAll)
    this.props.onChangeDay({
      ...days,
      [key]: data
    })
  }

  changeCheckAll = () => {
    const { days } = this.state;
    let count = 0;
    for (const key in days) {
      if (days[key]) {
        count++;
      }
    }
    this.setState({
      isAllSelected: count === 7
    });
  }
  componentWillMount() {
    this.changeCheckAll();
  }

  onChangeAll = (value) => {
    const { data } = this.state
    const days = {};
    data.map(day => {
      days[day.key] = value;
    })
    this.setState({ days, isAllSelected: value });
    this.props.onChangeDay({ ...days })
  }
  render() {
    const { t } = this.props
    const { days, data } = this.state
    return (
      <>
        <div className="day">
          <CheckBox
            name="checkAll"
            label={t("promotions.all")}
            checked={this.state.isAllSelected}
            onChange={this.onChangeAll}
          />
        </div>
        {
          data.map((day, index) => (
            <div className="day" key={index} >
              <CheckBox
                checked={days[day.key]}
                label={day.name}
                name={day.name}
                onChange={data => this.onChangeChecked(data, day.key)}
              />
            </div>
          ))
        }
      </>
    )
  }
}