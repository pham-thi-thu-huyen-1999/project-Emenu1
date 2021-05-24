import React, { Component } from 'react';
import Share from '../Share'
import { PROPERTY } from '../../../../consts/settings/ui/input'
import Input from '../../Input'
import TagInput from '../../TagInput'
import InputFile from '../../InputFile';
import ImageUpload from '../../ImageUpload';
import InputDate from "../../InputDate"
import InputTime from "../../InputTime"
import Moment from "../../Moment";
import moment from "moment";
var d = new Date();
class UIInput extends Component {
  state = {
    selected: [1, 2, 3, 4, 5],
    selectedDate: new Date(),
    timeNow: d.getTime(),
    time: '10:00'
  }

  onChange = time => this.setState({ time })
  render() {
    const data = [
      {
        text: 'Item 1',
        key: 1,
      },
      {
        text: 'Item 2',
        key: 2,
      },
      {
        text: 'Item 3',
        key: 3,
      },
      {
        text: 'Item 4',
        key: 4,
      },
      {
        text: 'Item 5',
        key: 5,
      }
    ]

    return (
      <Share propertys={PROPERTY}>
        <h5>2.1 Input</h5>
        <Input onChange={e => console.log(e.target.value)
        } />
        <h5>2.2 Input placeholder</h5>
        <Input placeholder='placeholder' onChange={e => console.log(e.target.value)
        } />
        <h5>2.3 Input tag</h5>
        <TagInput
          dataSource={data}
          selected={this.state.selected}
          iconColor='#f27922'
          onChange={selected => {
            console.log(selected)
            this.setState({ selected })
          }}
        />
        <h5>2.4 Input file</h5>
        <InputFile
          onChange={event => this.setState({ event })}
        />
        <h5>2.5 Input Date</h5>
        <InputDate
          selected={this.state.selectedDate}
          onChange={date => this.setState({ selectedDate: date })}
          dateFormat="dd/MM/yyyy"
        />
        <h5>2.5 Input Time</h5>
        <InputTime
          id="time"
          type="time"
          inputProps={{ step: 500 }}
          defaultValue={moment(this.state.timeNow).format("HH:mm:ss")}
          onChange={time => console.log(time)}
          className={"test-css"}
        />
        <h5>2.6 Input Number</h5>
        <Input
          number
          onChange={num => console.log(num)}
          className={"test-css"}
        />
        <h5>Moment</h5>
        <Moment
          date="2020-07-11T07:27:24.994Z"
          format="MMMM/DDDD/YYYY"
        />
        <div className="e-row">
          <button
            className="e-p-10"
            onClick={async (e) => {
              const res = await this.imageUpload.getImage()
              console.log(res)
            }}
          >Up file</button>
        <div className="e-col-12 e-p-10">
            <ImageUpload
              ref={imageUpload => (this.imageUpload = imageUpload)}
              source={[
                {
                  "id": "0b759956-b6e2-4b9b-afb4-ec9c359b182e",
                  "image": "3fa85f64-5717-4562-b3fc-2c963f66afa6/46f06b79-ef21-4717-bec8-32223042414b.png",
                  "image_link": "https://emenu-api.taimh.xyz/images/3fa85f64-5717-4562-b3fc-2c963f66afa6/46f06b79-ef21-4717-bec8-32223042414b.png"
                },
                {
                  "id": "541af2fb-1446-47b5-9dfe-65d82e9f782b",
                  "image": "3fa85f64-5717-4562-b3fc-2c963f66afa6/10ee2d83-8e6d-45e5-aba7-39f50b1bf394.png",
                  "image_link": "https://emenu-api.taimh.xyz/images/3fa85f64-5717-4562-b3fc-2c963f66afa6/10ee2d83-8e6d-45e5-aba7-39f50b1bf394.png"
                },
                {
                  "id": "d53bc207-d152-4ed8-b462-d21649fc951e",
                  "image": "3fa85f64-5717-4562-b3fc-2c963f66afa6/ef233e83-0944-43e1-b419-df492f166534.png",
                  "image_link": "https://emenu-api.taimh.xyz/images/3fa85f64-5717-4562-b3fc-2c963f66afa6/ef233e83-0944-43e1-b419-df492f166534.png"
                }
              ]}
            />
          </div>
        </div>
      </Share>
    );
  }
}

export default UIInput;
