import React, { Component } from 'react';

class Share extends Component {
  createMarkup = () => {
    return { __html: this.props.propertys.code };
  }
  state = {
    tab: 1
  }
  onTab = (tab) => {
    this.setState({
      tab: tab
    })
  }
  table = (propertys) => {
    return propertys && <table className="ui-table session">
      <thead>
        <tr>
          {Object.keys(propertys[0]).map(key => {
            return <th key={key}>{key}</th>
          })}
        </tr>
      </thead>
      <tbody>
        {propertys.map((item, i) => {
          return (
            <tr key={i}>
              {Object.keys(item).map(key => {
                return <td key={key}>{item[key]}</td>
              })
              }
            </tr>
          )
        })}
      </tbody>
      <tfoot></tfoot>
    </table>
  }

  render() {
    const { tab } = this.state
    const { methods, propertys, name } = this.props.propertys

    return (
      <div className="ui-share">
        <h3>{name}</h3>
        <h4 className="ui-title">1. Property</h4>
        {this.table(propertys)}
        <h4 className="ui-title">2. Demo</h4>
        <div className="session">
          <div className="ui-tab">
            <div className="ui-tab-nav">
              <div className={tab === 1 ? 'nav active' : 'nav'} onClick={() => (this.onTab(1))}>Demo</div>
              <div className={tab !== 1 ? 'nav active' : 'nav'} onClick={() => (this.onTab(2))}>JS</div>
            </div>
            <div className="ui-tab-content">
              {tab === 1 ?
                (
                  <div className="demo-content">
                    {this.props.children}
                  </div>
                ) : (
                  <div
                    className="code-demo"
                    contentEditable
                    dangerouslySetInnerHTML={this.createMarkup()}
                  >
                  </div>
                )
              }
            </div>
          </div>
        </div>
        <h4 className="ui-title">3. Method</h4>
        {this.table(methods)}
      </div>
    );
  }
}

export default Share;
