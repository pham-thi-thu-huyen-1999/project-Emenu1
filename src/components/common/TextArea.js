import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class TextArea extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  static propTypes = {
    onChange: PropTypes.func.isRequired
  }

  /**
	 * Emit event on change
	 */
  onChange(selected) {
    this.setState({ selected });
    this.props.onChange(selected);
  }

  render() {
    const { placeholder, rows, style, defaultValue } = this.props
    return (
      <textarea
        style={style}
        className="emenu-textarea"
        placeholder={placeholder}
        defaultValue={defaultValue}
        rows={rows}
        onChange={e => this.onChange(e)}
      />
    )
  }
}
