import React from "react";

class CircleItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedId: this.props.selectedId,
      item: this.props.item,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.selectedId !== nextProps.selectedId) {
      return {
        selectedId: nextProps.selectedId,
      };
    }
    return null;
  }

  render() {
    const { ...rest } = this.props;
    const { t } = this.props;
    const { selectedId, item } = this.state;
    return (
      <div
        className={
          selectedId === item.id
            ? `function-item function-item--selected`
            : `function-item`
        }
      >
        <div
          className="function-item__icon"
          onClick={() => {
            this.props.onChangeSelectedItem();
          }}
        >
          <img
            alt=""
            src={
              selectedId === item.id
                ? item.image_link_selected
                : item.image_link
            }
          />
        </div>
        <div className="function-item__text text-over">{item.text}</div>
      </div>
    );
  }
}
export default CircleItem;
