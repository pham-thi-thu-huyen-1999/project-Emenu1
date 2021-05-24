import React, { Component } from 'react';
import Share from '../Share';
import { PROPERTY } from '../../../../consts/settings/ui/layout';
import Swal from '../../../../utils/sweetalert2'
import Dialog from '../../Dialog';
import Button from '../../Button';
import Input from '../../Input';
import Loading from '../../Loading'

const Text = ({children}) => (
  <div style={{
    background: '#eee',
    margin: '5px',
    borderRadius: '5px',
    textAlign: 'center',
    padding: '10px'
  }}>{children}</div>
)

const title = {
  borderTop: '1px solid #ddd',
  paddingTop: '20px'
}

const Content = ({children, cssClass, style}) => (
  <div
    className={cssClass}
    style={{
      background: '#eee',
      margin: '5px',
      borderRadius: '5px',
      padding: '10px',
      maxWidth: '200px',
      ...style
    }}>{children}</div>
)

class UILayout extends Component {
  state = {
    showDialog: false,
    showDialog2: false,
    showLoading: false
  }
  showAlert = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.value) {
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })
  }

  showOk = () => {
    Swal.fire({
      icon: 'success',
      text: "You won't be able to revert this!",
      showConfirmButton: true,
      timer: 1500
    })
  }

  showErr = () => {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Something went wrong!'
    })
  }
  render() {
    return (
      <Share propertys={PROPERTY}>
        <Button onClick={this.showAlert}>Show confirm</Button>
        <Button onClick={this.showOk}>Show success</Button>
        <Button onClick={this.showErr}>Show err</Button>
        <Button onClick={e => this.setState({ showDialog: true })}>Dialog</Button>
        <Button onClick={e => this.setState({ showDialog2: true })}>Dialog filter</Button>
        <Button onClick={e => this.setState({ showLoading: true })}>show loading</Button>
        <Loading
          show={this.state.showLoading}>
        >

        </Loading>
        <Dialog
          show={this.state.showDialog}
          close={() => { this.setState({ showDialog: false }) }}>
          <div className="e-dialog-content">

            {/* Header */}
            <div className="e-dialog-header">
              <h2 className="e-dialog-title e-text center"> TITLE OF DIALOG</h2>
            </div> {/* End Hewader */}

             {/* Body */}
            <div className="e-dialog-body">
              <div className="e-form">
                <div className="e-form-field e-row">
                  <label className="e-col-3 e-form-label flex e-flex content-end e-m-right-10">
                    Title right
                  </label>
                  <div className="e-col-9 e-form-input">
                    <Input onChange={() => {}}/>
                  </div>
                </div>
                <div className="e-form-field e-row">
                  <div className="e-col-3 e-form-label">
                    Tilte left
                  </div>
                  <div className="e-col-9 e-form-input">
                    <Input onChange={() => {}}/>
                  </div>
                </div>
                <div className="e-form-field e-row">
                  <div className="e-col-3 e-form-label e-flex content-center">
                    Tilte center
                  </div>
                  <div className="e-col-9 e-form-input">
                    <Input onChange={() => {}} placeholder="placeholder"/>
                  </div>
                </div>
              </div>
            </div>{/* End Body */}

            <div className="e-dialog-footer e-flex content-end">
              <Button type="s3" style={{marginRight: '5px'}}>Cancel</Button>
              <Button >Ok</Button>
            </div>
          </div>
        </Dialog>
        <Dialog
          show={this.state.showDialog2}
          title="TITLE OF DIALOG"
          innerClass="e-filter-white"
          close={() => { this.setState({ showDialog2: false }) }}>
          <div className="e-dialog-content">
             {/* Body */}
            <div className="e-dialog-body">
              <div className="e-form">
                <div className="e-form-field e-row">
                  <label className="e-col-3 e-form-label flex e-flex content-end e-m-right-10">
                    Title right
                  </label>
                  <div className="e-col-9 e-form-input">
                    <Input onChange={() => {}}/>
                  </div>
                </div>
                <div className="e-form-field e-row">
                  <div className="e-col-3 e-form-label">
                    Tilte left
                  </div>
                  <div className="e-col-9 e-form-input">
                    <Input onChange={() => {}}/>
                  </div>
                </div>
                <div className="e-form-field e-row">
                  <div className="e-col-3 e-form-label e-flex content-center">
                    Tilte center
                  </div>
                  <div className="e-col-9 e-form-input">
                    <Input onChange={() => {}} placeholder="placeholder"/>
                  </div>
                </div>
              </div>
            </div>{/* End Body */}

            <div className="e-dialog-footer e-flex content-end">
              <Button type="s3" style={{marginRight: '5px'}}>Cancel</Button>
              <Button >Ok</Button>
            </div>
          </div>
        </Dialog>
        <div className="e-row">

        </div>
        <h4 style={title}>
          Grid
        </h4>
        <div className="e-row">
          <div className="e-col-3">
            <Text>.e-col-3</Text>
          </div>
          <div className="e-col-9">
            <Text>.e-col-9</Text>
          </div>
          <div className="e-col-6">
            <Text>.e-col-6</Text>
          </div>
          <div className="e-col-6">
            <Text>.e-col-6</Text>
          </div>
          <div className="e-col-4">
            <Text>.e-col-4</Text>
          </div>
          <div className="e-col-4">
            <Text>.e-col-4</Text>
          </div>
          <div className="e-col-4">
            <Text>.e-col-4</Text>
          </div>
        </div>

        <div className="e-row">
          <div className="e-col-4">
            <h4 style={title}>Margin</h4>
            <Content>.e-m-10</Content>
            <Content>.e-m-left-4</Content>
            <Content>.e-m-right-4</Content>
            <Content>.e-m-bottom-4</Content>
            <Content>.e-m-top-4</Content>
          </div>

          <div className="e-col-4">
            <h4 style={title}>Padding</h4>
            <Content>.e-p-4</Content>
            <Content>.e-p-left-4</Content>
            <Content>.e-p-right-4</Content>
            <Content>.e-p-bottom-4</Content>
            <Content>.e-p-top-4</Content>
          </div>

          <div className="e-col-4">
            <h4 style={title}>Content</h4>
            <Content cssClass="e-flex content-start">.e-flex.content-start</Content>
            <Content cssClass="e-flex content-center">.e-flex.content-center</Content>
            <Content cssClass="e-flex content-end">.e-flex.content-end</Content>
          </div>
          <div className="e-col-12">
            <h4 style={title}>Content</h4>
            <div className="e-col-12 e-row">
              <Content cssClass="e-flex item-start" style={{height: '200px'}}>.e-flex.item-start</Content>
              <Content cssClass="e-flex item-center" style={{height: '200px'}}>.e-flex.item-center</Content>
              <Content cssClass="e-flex item-end" style={{height: '200px'}}>.e-flex.item-end</Content>
            </div>
          </div>
        </div>
        <h4 style={title}>Form</h4>
        <div className="e-form">
            <div className="e-form-field e-row">
              <label className="e-col-3 e-form-label flex e-flex content-end e-m-right-10">
                Title right
              </label>
              <div className="e-col-9 e-form-input">
                <Input onChange={() => {}} placeholder="placeholder"/>
              </div>
            </div>
            <div className="e-form-field e-row">
              <div className="e-col-3 e-form-label">
                Tilte left
              </div>
              <div className="e-col-9 e-form-input">
                <Input onChange={() => {}} placeholder="placeholder"/>
              </div>
            </div>
            <div className="e-form-field e-row">
              <div className="e-col-3 e-form-label e-flex content-center">
                Tilte center
              </div>
              <div className="e-col-9 e-form-input">
                <Input onChange={() => {}} placeholder="placeholder"/>
              </div>
            </div>
          </div>
      </Share>

    );
  }
}

export default UILayout;
