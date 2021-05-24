import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faTimesCircle,
  faSave
} from "@fortawesome/free-solid-svg-icons";
import Button from "../../../../components/common/Button";
import PopupDelete from "./showPopupDelete";
class ContentAction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemEdit: [],
      listData: this.props.DataSource,
      nameItem: "",
      nameItemEdit: "",
      showPopupDelete: false,
      value: null
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.DataSource !== prevState.listData) {
      return { listData: nextProps.DataSource };
    } else return null;
  }

  editClick = id => {
    this.setState({ itemEdit: id, nameItemEdit: id.name });
  };

  saveClick = id => {
    this.setState({ itemEdit: [] });
    this.props.editItem({ newName: this.state.nameItemEdit, id });

    // TODO CALL API
  };

  deleteClick = (id, name) => {
    this.setState({
      showPopupDelete: true,
      value: { id, name }
    });
  };

  handelChange = e => {
    this.setState({ nameItemEdit: e.target.value });
  };

  deleteTableOk = () => {
    this.props.delteItem(this.state.value.id);
    this.setState(prevState => {
      return {
        listData: prevState.listData.filter(
          item => item.id !== this.state.value.id
        )
      };
    });
  };

  render() {
    const { placeHolder, nameTab } = this.props;
    const { nameItem, listData, itemEdit } = this.state;

    return (
      <div className="tab-content">
        <div className="form-group">
          <input
            name="name-search"
            type="text"
            value={nameItem}
            className="form-control"
            placeholder={placeHolder}
            onChange={e => this.setState({ nameItem: e.target.value })}
            onKeyPress={event => {
              if (event.key === "Enter" && nameItem) {
                this.props.addItem(nameItem);
                this.setState({ nameItem: "" });
              }
            }}
          />
          <Button
            main
            type="s2"
            onClick={() => {
              if (nameItem) {
                this.props.addItem(nameItem);
              }
              this.setState({ nameItem: "" });
            }}
          >
             {this.props.t("setting.add")}
          </Button>
        </div>
        <h3>{nameTab}</h3>
        <div className="tab-main">
          {listData.map((item, index) => {
            let nameId = `name-${index}`;
            return (
              <div className="items" key={index}>
                {item.id === itemEdit.id ? (
                  <div className="add-input">
                    <input
                      type="text"
                      defaultValue={item.name}
                      name={nameId}
                      data-id={index}
                      id={nameId}
                      className="name"
                      onChange={this.handelChange}
                    />
                  </div>
                ) : (
                  <div className="name">
                    <span>{item.name}</span>
                  </div>
                )}
                <div className="action">
                  {item.id === itemEdit.id ? (
                    <div className="action-2">
                      <button
                        className="save"
                        onClick={() => this.saveClick(item.id)}
                      >
                        <FontAwesomeIcon icon={faSave} />
                      </button>
                    </div>
                  ) : (
                    <div className="action-1">
                      <button
                        className="edit"
                        onClick={() => this.editClick(item)}
                      >
                        <FontAwesomeIcon icon={faPencilAlt} />
                      </button>
                      <button
                        className="delete"
                        onClick={() => this.deleteClick(item.id, item.name)}
                      >
                        <FontAwesomeIcon icon={faTimesCircle} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {this.state.showPopupDelete ? (
          <PopupDelete
            hide={() =>
              this.setState({ showPopupDelete: !this.state.showPopupDelete })
            }
            deleteOk={this.deleteTableOk}
            info={this.state.value}
          />
        ) : null}
      </div>
    );
  }
}

export default ContentAction;
