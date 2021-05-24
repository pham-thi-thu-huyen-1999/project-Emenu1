import React, { Component } from 'react';
import Share from '../Share';
import { PROPERTY } from '../../../../consts/settings/ui/table';
import TableSlider from '../../TableSlider';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import Slider from "react-slick";
import {
	faPencilAlt,
	faTimesCircle,
	faSyncAlt
} from "@fortawesome/free-solid-svg-icons";

const dataSources = [
    {
        'id': 0,
        'foodName': 'Gà quay nướng lu',
        'price': '250.000',
        'tax': '10',
        'image': [],
        'note': '',
        'status': 'Hết',
        'unit': 'Con'
    },
    {
        'id': 1,
        'foodName': 'Gà quay nướng lu ',
        'price': '250.000',
        'tax': '10',
        'image': [],
        'note': '',
        'status': 'Hết',
        'unit': 'Con'
    },
    {
        'id': 2,
        'foodName': 'Gà quay nướng lu ',
        'price': '250.000',
        'tax': 10,
        'image': [],
        'note': '',
        'status': 'Hết',
        'unit': 'Con'
    },
    {
        'id': 3,
        'foodName': 'Gà quay nướng lu',
        'price': '250.000',
        'tax': '10',
        'image': [],
        'note': '',
        'status': 'Hết',
        'unit': 'Con'
    },
    {
        'id': 4,
        'foodName': 'Bánh Chiên Hột Vịt',
        'price': '250.000',
        'tax': '10',
        'image': [],
        'note': '',
        'status': 'Hết',
        'unit': 'Con'
    },
    {
        'id': 5,
        'foodName': 'Bánh Chiên Hột Vịt',
        'price': '250.000',
        'tax': '10',
        'image': [],
        'note': '',
        'status': 'Hết',
        'unit': 'Con'
    },
    {
        'id': 6,
        'foodName': 'Bánh Chiên Hột Vịt',
        'price': '250.000',
        'tax': '10',
        'image': [],
        'note': '',
        'status': 'Hết',
        'unit': 'Con'
    }
];

class UITable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSources: dataSources
        };
      }

    clickItem =(item) => {
        console.log('Detail: ' + item.foodName)
    }
    clickItemDetail =(item) => {
        alert('Detail: ' + item.foodName)
    }
    clickItemEdit =(item) => {
        alert('Edit: ' + item.foodName)
    }
    clickItemDelete =(item) => {
        alert('Delete: ' + item.foodName)
    }
    onMore = () => {
        setTimeout(() => {
            const data = this.state.dataSources;
            this.setState({ dataSources: [...data, ...dataSources]});
        }, 500)
    }

    render() {
        const TABLE_SETTING = {
            heads: [
                {
                    className: 'no',
                    text: 'stt'
                },
                {
                    className: 'dish-name',
                    text: 'Tên món'
                },
                {
                    className: 'price',
                    text: 'Giá'
                },
                {
                    className: 'unit',
                    text: 'Đơn vị'
                },
                {
                    className: 'tax',
                    text: 'Thuế'
                },
                {
                    className: 'status',
                    text: 'Trạng thái'
                },
                {
                    className: 'acts',
                    text: ''
                },
            ],
            columns: [
                {
                    key: 'id',
                    className: 'no',
                    onClick: (item) => {
                       this.clickItem(item)
                    },
                    render: (item, index) => (
                    <span>{index + 1}</span>
                    )
                },
                {
                    key: 'foodName',
                    className: 'dish-name',
                    onClick: (item) => {
                       this.clickItem(item)
                    }
                },
                {
                    key: 'price',
                    className: 'price',
                    onClick: (item) => {
                       this.clickItem(item)
                    }
                },
                {
                    key: 'unit',
                    className: 'unit no',
                    onClick: (item) => {
                       this.clickItem(item)
                    }
                },
                {
                    key: 'tax',
                    className: 'tax',
                    render: (item) => {
                        return item.tax + '%'
                    },
                    onClick: (item) => {
                       this.clickItem(item)
                    }
                },
                {
                    key: 'status',
                    className: 'status',
                    onClick: (item) => {
                       this.clickItem(item)
                    }
                },
                {
                    key: 'acts',
                    className: 'acts grp-btns flex-view middle',
                    render: (item) => (
                        <>
                            <div className="s-btn" onClick={e=>this.clickItemDetail(item)}><FontAwesomeIcon icon={faSyncAlt} /> Chi tiết</div>
                            <div className="s-btn s1 edit-btn" onClick={e=>this.clickItemEdit(item)}><FontAwesomeIcon icon={faPencilAlt} /> Sửa</div>
                            <div className="s-btn s2 delete-btn" onClick={e=>this.clickItemDelete(item)}><FontAwesomeIcon icon={faTimesCircle} /> Xóa</div>
                        </>
                    )
                }
            ]
        }

        const { dataSources } = this.state;

        return (
            <Share propertys={PROPERTY}>
                <TableSlider
                    option={TABLE_SETTING}
                    dataSources={dataSources}
                    onMore={this.onMore}
                >
                </TableSlider>
            </Share>
        );
    }
}

export default UITable;
