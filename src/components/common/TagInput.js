import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ButtonBase from './ButtonBase';

class ButtonTagInput extends ButtonBase{
  render() {
    const { className, children } = this.props;
    const { classAnimation } = this.state;
    return (
      <button
        className={`${className} ${classAnimation}`}
        onClick={this.handleEvent}
        ref={ref => this.elementRef = ref}
      >
        {children}
      </button>
    )
  }
}


export default class TagInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: props.selected,
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({selected: nextProps.selected})
  }

  delete = (tag) => {
    const { onChange } = this.props
    onChange(tag)
  }
  renderItem(action, item) {
    if (typeof action === "function") {
      return action(item)
    } else {
      return item[action]
    }
  }

  render() {
    const { dataSource, style, iconColor, onAction , map} = this.props;
    const { selected } = this.state;

    return (
      <div className="emenu-tag-input" style={style}>
        <ButtonTagInput className="btn-acts-food action" onClick={onAction}>
          <svg aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="bars"
            role="img" xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512">
              <path fill="currentColor"
                d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z">
              </path>
            </svg>
        </ButtonTagInput>
        <div className="tag-box">
          {
              dataSource.map((tag, index) => {
                let indexSelected = selected.indexOf(this.renderItem(map['key'], tag))
                return indexSelected > -1 &&
                (
                  <div className="tag-item" key={index}>
                    <span className="tag-text">{this.renderItem(map['text'], tag)}</span>
                    <svg aria-hidden="true"
                      onClick={() => this.delete(tag)}
                      focusable="false"
                      data-prefix="fas"
                      data-icon="times-circle"
                      className="svg-inline--fa fa-times-circle fa-w-16 tag-icon"
                      role="img" xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512">
                        <path fill={iconColor}
                          d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z">
                        </path>
                      </svg>
                  </div>
                )
              }
            )
          }
        </div>
      </div>
    )
  }
}

TagInput.propTypes = {
	onChange: PropTypes.func.isRequired,
	dataSource: PropTypes.array.isRequired
}
TagInput.defaultProps = {
    map: {
      key: 'key',
      text: 'text'
    }
}
