import React from "react";
import ButtonBase from "./ButtonBase";

export default class InputType extends ButtonBase {
    /**
     * Render component
     */
    render() {
        const { className, id, name, checked, type, disabled, value } = this.props;
        const { classAnimation } = this.state;
        return (
            <input
                type={type}
                id={id}
                name={name}
                value={value}
                onChange={this.handleEvent}
                checked={checked}
                disabled={disabled}
                className={`${className} ${classAnimation}`}
                ref={ref => this.elementRef = ref}
            />
        )
    }

}