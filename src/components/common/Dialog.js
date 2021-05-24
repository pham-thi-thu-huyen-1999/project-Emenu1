import React from 'react';
import ReactDOM from 'react-dom';
import ButtonBase from './ButtonBase'

class CloseButton extends ButtonBase {

  render() {
    const { title, className } = this.props;
    const { classAnimation } = this.state;

    const classCss = className || "";
    return (
      <div
        ref={ref => this.elementRef = ref}
        onClick={this.handleEvent}
        className={`${classCss} ${classAnimation}`}
        title={title}
      >
      </div>
    )
  }
}

class Dialog extends React.Component {
  render() {
    const { show, close, children, innerClass, title, header } = this.props
    return (
      <> {
        show ? ReactDOM.createPortal(
          <React.Fragment>
            <div className="popup mfp-container mfp-s-ready mfp-inline-holder emenu-dialog">
              <div className="mfp-content">
                <div
                  onClick={close}
                  className="background-after"
                ></div>
                <section className={`${innerClass || ''} popup-box`}>
                  {header}
                  <CloseButton
                    onClick={close}
                    className="button-color mfp-close"></CloseButton>
                  {title && <h2 className="e-menu-dialog-title">{title}</h2>}
                  {children}
                </section>
              </div>
            </div>
          </React.Fragment>, document.body
        ) : null
      } </>
    )
  }
}
export default Dialog