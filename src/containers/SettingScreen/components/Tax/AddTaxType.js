import React, { Component } from 'react';
import Button from './../../../../components/common/Button';
class AddTaxType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataListTbl: this.props.dataTbl,
      defaultId: 0
    }
  }

  addTable = () => {
    let id = this.state.defaultId + 1
    this.setState({ defaultId: id })
    let table = {
      id: this.state.defaultId,
      name: '',
      percent: '',
      ischeck: false
    }
    this.setState({ dataListTbl: this.state.dataListTbl.concat(table) })
  }

  handleCheck = (e) => {
    const id = e.target.id;
    this.setState(prevState => {
      return {
        dataListTbl: prevState.dataListTbl.map(
          li => (li.id === +id ? {
            ...li,
            ischeck: !li.ischeck
          } : li)
        )
      };
    });
  }

  removeItemCheck = () => {
    this.setState(prevState => {
      return {
        dataListTbl: prevState.dataListTbl.filter(li => !li.ischeck)
      };
    });
  }

  handelChange = e => {
    let newItems = [...this.state.dataListTbl]
    newItems[e.target.dataset.id][e.target.className] = e.target.value
    this.setState({ dataListTbl: newItems })
  }

  saveTypeTax = () => {
    console.log(this.state.dataListTbl)
  }

  render() {
    return (
      <aside className="tbl-promotion">
        <ul className="head">
          <li style={{ width: '10%' }}>STT</li>
          <li style={{ width: '25%' }}>Tên Thuế</li>
          <li style={{ width: '30%' }}>Tỉ lệ %</li>
        </ul>
        <div className="slider-container" style={{ maxHeight: 400 }}>
          <div style={{ height: 250, overflow: "auto" }} className="tblCustom" >
            {
              this.state.dataListTbl.map((item, index) => {
                let nameId = `name-${index}`, percentId = `percent-${index}`
                return (
                  <ul key={index} className="row-tbl">
                    <li style={{ width: '100px' }}>
                      <div className="form-group" >
                        <label className="control-label">{index + 1}</label>
                      </div>
                    </li>

                    <li style={{ width: 300 }}>
                      <div className="form-group">
                        <input type="text"
                          name={nameId}
                          data-id={index}
                          id={nameId}
                          className="name"
                          onChange={this.handelChange}
                        />
                      </div>
                    </li>
                    <li style={{ width: 300 }}>
                      <div className="form-group">
                        <input type="text"
                          name={percentId}
                          data-id={index}
                          id={percentId}
                          className="percent"
                          onChange={this.handelChange}
                        />
                      </div>
                    </li>

                    <li style={{
                      padding: "0 0 7px", width: '45%', textAlign: 'right'
                    }}>
                      <label className="nice-chkbox"><input type="checkbox" id={item.id} onChange={this.handleCheck} checked={item.ischeck} /><span className="pl"></span></label>
                    </li>
                  </ul>
                )

              })

            }
          </div>
        </div>
        <div className="block-action">
          <Button type='s4' onClick={this.addTable}>Thêm hàng</Button>
          <Button type='s4' onClick={this.removeItemCheck}>Xóa hàng đã chọn</Button>
        </div>
        <div className="button-action" style={{ textAlign: "right" }}>
          <Button main type='s2' onClick={this.saveTypeTax}>LƯU </Button>
        </div>
      </aside >
    );
  }
}

export default AddTaxType;