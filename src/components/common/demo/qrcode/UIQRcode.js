import React, { Component } from 'react';
import Share from '../Share';
import { PROPERTY } from '../../../../consts/settings/ui/qrCode';
import QRcode from '../../QRcode';
import Button from '../../Button';
import Swal from '../../../../utils/sweetalert2';

class UIQRcode extends Component {

  onChange = (data) => {
    console.log(data)
  }

  showSwalQR = () => {
    Swal.fire({
      showConfirmButton: true,
      confirmButtonText: 'Close',
      html: (
        <>
          <p>This is QR code</p>
          <QRcode value={'text-QR-code'} />
        </>
      )
    })
  }

  render() {
    return (
      <Share propertys={PROPERTY}>
        <h5>1.QR code normal</h5>
        <div className="e-p-10" style={{ background: '#eee' }}>
          <QRcode value={'text-QR-code'} />
        </div>
        <h5>2.QR code in modal message</h5>
        <div className="e-p-10" style={{ background: '#eee' }}>
          <Button onClick={this.showSwalQR}>Show QR swal</Button>
        </div>
      </Share>
    );
  }
}

export default UIQRcode;
