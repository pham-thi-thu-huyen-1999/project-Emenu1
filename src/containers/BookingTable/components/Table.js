import React from "react";

export default class Table extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      checked: props.checked
    }
  }

  checkedTable = (checked, table) => {
    this.setState({ checked: !checked })
    this.props.checkedTable(!checked, table)
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.checked !== nextProps.checked) {
      this.setState({ checked: nextProps.checked });
    }
  }
  render() {
    const { t, table } = this.props
    const { checked } = this.state
    return (
      <div className="e-col-3 item"
        onClick={(event) => {
          event.preventDefault()
          this.checkedTable(checked, table)
        }}
      >
        <li
          className={!checked ? "item-table bg-noActive" : "item-table active"}
        >
          <div className="content-text e-flex">
            <span className="name-table">{table.table_name}</span>
            <span className="number-seat e-flex content-end">{table.seat_number}</span>
          </div>
          <div className="content-icon">
            <div className="show-icon e-flex content-center item-center">
              <img src={table.image} />
            </div>
          </div>
        </li>
      </div>
    )
  }
}