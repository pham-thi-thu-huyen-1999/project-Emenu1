import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../styles/scss/table-data.scss";
import { faEllipsisH, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isFunction } from 'lodash'
import { isMobile } from 'mobile-device-detect';

const TableData = (props) => {
  const { option, dataSources, onMore, scrollable, maxHeight, textNotiNoData, innerClass, group_selected } = props;
  const [activeButton, selectActiveButton] = useState(null);
  const [isTrigger, setIsTrigger] = useState(false);

  /**
   * Render header
   */
  const renderHeader = () => {
    return option.heads.map((item, index) => {
      return (
        <th
          style={item.width ? { width: item.width } : null}
          key={`head_${index}`}
        >
          {renderHeaderContent(item)}
        </th>
      );
    });
  };

  /**
   * Render content inner header
   */
  const renderHeaderContent = (item) => {
    return item.text ? (isFunction(item.text) ? item.text() : item.text) : ''
  }
  /**
   * On toggle more button
   */
  const onToggleMoreButton = (index) => {
    if (index === activeButton) {
      setIsTrigger(null);
      selectActiveButton(null);
    } else {
      setIsTrigger(index);
      setTimeout(() => {
        selectActiveButton(index);
      }, 450);
    }
  };

  /**
   * Render data
   */
  const renderData = () => {
    return <>{dataSources.length > 0 ?
      dataSources.map((item, index) => {
        return (
          <tr key={`data_${index}`} className={`${innerClass ? innerClass : ""}`} style={group_selected === index ? { background: "#FFC107" } : null}>
            {option.columns.map((column, col_index) => {
              return (
                <td
                  style={column.width ? { width: column.width } : null}
                  key={`data_col_${col_index}`}
                  className={
                    column["overflow"] !== "undefined" &&
                      column["overflow"] === false
                      ? "ellipsis-text"
                      : null
                  }
                >
                  {column.render
                    ? column.render(item, index)
                    : item[column["key"]]}
                  {column.actions && column.actions.length && isMobile ? (
                    <button
                      className="button-more"
                      onClick={() => onToggleMoreButton(index)}
                    >
                      <FontAwesomeIcon
                        icon={activeButton === index ? faAngleRight : faEllipsisH}
                        color={"#fff"}
                        style={{ fontSize: "20px" }}
                      />
                    </button>
                  ) : null}
                  {column.actions && renderAction(column, item, index)}
                </td>
              );
            })}
          </tr>
        );
      }) :
      <tr>
        <td>
          <div className="no-data-table e-p-50">
            <div>
              <img src={require("../../images/no-data.png")} />
              <div className="text">
                <span>{textNotiNoData}</span>
              </div>
            </div>
          </div>
        </td>
      </tr>
    }
    </>
  };

  /**
   * Render actions
   */
  const renderAction = (column, item, index) => {
    return (
      <div
        className={`button-group-content${!isMobile ? " desktop" : " mobile"}${isTrigger === index ? " show" : ""
          }`}
      >
        {column.actions && column.actions.length
          ? column.actions.map((action, action_index) => {
            return (
              <React.Fragment key={action_index}>
                {action(item, index)}
              </React.Fragment>
            );
          })
          : null}
      </div>
    );
  };

  /**
   * On reach end of table
   */
  const onReachEnd = (event) => {
    const { target } = event;
    const { scrollHeight, clientHeight, scrollTop } = target;
    if (clientHeight + scrollTop >= scrollHeight) {
      if (onMore) {
        onMore();
      }
    }
  };

  return (
    <table className="data-table">
      <thead className="head">
        <tr>{renderHeader()}</tr>
      </thead>
      <tbody
        style={{
          height: scrollable === false ? "fit-content" : null,
          maxHeight: maxHeight ? maxHeight : null
        }}
        onScroll={(event) => onReachEnd(event)}
      >
        {renderData()}
      </tbody>
    </table>
  );
};

TableData.propTypes = {
  option: PropTypes.object,
  dataSources: PropTypes.array,
};

export default TableData;
