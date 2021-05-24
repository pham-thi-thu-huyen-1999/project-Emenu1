import { isEmpty } from 'lodash';
import React, { Component } from 'react';
import GridLayout from 'react-grid-layout';
import Styles from '../../scss/TableList.module.scss';
import _ from 'lodash';
import TABLE_CONST from '../TableContants';
import VipIconSource from "../../../../images/tbl-type.png";

class VipTableGrid extends Component {
    constructor(props){
        super(props)
        this.state={
            tableLayoutData: [],
            subIconLayoutdata: [],
        }
    }


   componentDidMount(){
    if(this.props.currentVipRoom){
        this.generateTableLayoutData(this.props.currentVipRoom.table_infos)
        this.generateSubIconLayoutData(this.props.currentVipRoom.area_arrange_subs)
    }
   }


   generateTableLayoutData = (listTable) => {
    let { resolutionRatio } = this.props;
    if (isEmpty(resolutionRatio)) {
      resolutionRatio = 1;
    }
    let tableLayoutData = [];
    if (!isEmpty(listTable)) {
      listTable.map((table_info) => {
        if (table_info) {
          return tableLayoutData.push({
            i: table_info.table_id,
            h: table_info.height ,
            w: table_info.width ,
            x: table_info.point_x,
            y: table_info.point_y,
            static: true
          });
        } else {
          return null;
        }
      });
    }
    this.setState({
      tableLayoutData: tableLayoutData,
    });
  };

  generateSubIconLayoutData = (subIcons) => {
    let { resolutionRatio } = this.props;
    if (isEmpty(resolutionRatio)) {
      resolutionRatio = 1;
    }
    let subIconLayoutData = [];
    if (!isEmpty(subIcons)) {
      subIcons.map((icon) => {
        return subIconLayoutData.push({
          i: icon.id,
          h: icon.height ,
          w: icon.width ,
          x: icon.point_x,
          y: icon.point_y,
          static: true,
        });
      });
    }
    this.setState({
      subIconLayoutdata: subIconLayoutData,
    });
  };

  renderTables = () => {
    return this.props.currentVipRoom.table_infos.map((table_info) => {
      return (
        <div
          className={`${Styles["table-base"]} ${
            this.props.isCombinedTable(table_info.table_id) ? Styles["is-combined"] : ""
            }`}
          key={table_info.table_id}
          onClick={this.props.handleChooseTable.bind(this, table_info.table)}
          style={{ backgroundImage: this.props.getBackgroundImage(table_info.table) }}
        >
          {table_info.table.name}
          <br />
          {this.props.height > 400 ? <>{`${table_info.table.seat_number} ${this.props.trans("table_list:chair")}`}</> : ""}
          {TABLE_CONST.TABLE_TYPE_VALUE.VIP === table_info.table.table_type_id ? (
            <div className={Styles["vip"]}>
              <img src={VipIconSource} style={{ width: "30px" }} alt="" />
            </div>
          ) : null}
          {table_info.table.is_table_join ? (
            <span
              className={`icon-users ${Styles["icon-users-custom"]}`}
            ></span>
          ) : null}
        </div>
      );
    });
  };


  renderListSubIcon = () => {
    return this.props.currentVipRoom.area_arrange_subs.map((subIcon) => {
      return (
        <div
          className={Styles["sub-icon-base"]}
          key={subIcon.id}
          style={{ backgroundImage: `url(${subIcon.icon})` }}
        ></div>
      );
    });
  };

    render() {
        return (
            <GridLayout
            layout={this.state.tableLayoutData.concat(this.state.subIconLayoutdata)}
            width={this.props.width}
            autoSize={false}
            rowHeight={this.props.height / 100}
            cols={100}
            maxRows={100}
            containerPadding={[0, 0]}
            margin={[0, 0]}
            isDraggable={true}
            isResizable={true}
            compactType={null}
            useCSSTransforms={true}
            preventCollision={true}
            style={{height: "100%", border: "5px solid #fff"}}
            >
            {this.renderTables()}
            {this.renderListSubIcon()}
      </GridLayout>
        );
    }
}

export default VipTableGrid;