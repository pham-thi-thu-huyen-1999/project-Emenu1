import React from "react";
import DishItem from "./DishItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faLongArrowAltLeft, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import PopupDishAdd from "./PopupDishAdd";
import Dialog from "../../../components/common/Dialog";
import PopupDishEdit from "./PopupDishEdit";
import PopupListFood from "./PopupListFood";
import Button from "../../../components/common/Button";
import Paginate from "../../../components/common/Paginate";
import Loading from "../../../components/common/Loading";
import { LIMIT_COMBO_ITEM } from "../../../consts/settings/dish/dish";

export default class Main extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      showPopupDishAdd: false,
      showEditDish: false,
      statusDish: true,
      showPopupMoreFood: false,
      foods: [],
      total: this.props.comboList.length,
      comboItemDetail: this.props.comboItemDetail,
      page: 0,
      total_item: 0,
      comboItemId: "",
      itemDishdetail: {},
      listItems: []
    };

  }
  onEditDish = (dishEditing) => {
    this.setState({
      showEditDish: true,
      dishEdit: dishEditing
    })
  }
  isShowPopupMoreFood = () => {
    const { showPopupMoreFood } = this.state
    return Object.keys(this.props.itemComboList).length !== 0 &&
      showPopupMoreFood
  }
  closePopupMoreFood = () => {
    this.setState({
      showPopupMoreFood: false
    })
    this.props.actions.resetItemComboList()
  }
  isShowEdit = () => {
    const { showEditDish } = this.state
    return Object.keys(this.props.comboItemDetail).length !== 0 &&
      showEditDish
  }

  closePopupEdit = () => {
    this.setState({
      showEditDish: false
    })
    this.props.actions.resetComboDetail()
  }
  onPageChange = (data) => {
    this.props.actions.getComboList({ limit: LIMIT_COMBO_ITEM, page: data.selected + 1 });
    this.setState({
      page: data.selected + 1
    })
  }

  render() {
    const { showPopupDishAdd } = this.state;
    const { countPage, ...rest } = this.props;
    const { t } = this.props;
    console.log(this.props);
    return (
      <section className="dish-management">
        <Loading show={this.props.isLoading} />
        <div className="dishs">
          <div className="container">
            <div className="btnback-title e-flex content-center item-center">
              <div className="btn-back">
                <Button className="s3"
                  onClick={() => { this.props.history.push("/menu") }}>
                  <FontAwesomeIcon icon={faLongArrowAltLeft} />
                  <span className="e-m-left-5">{t("textCommon.back")}</span>
                </Button>
              </div>
              <h2 className="title">{t("dishManagaments.title")}</h2>
            </div>
            <div className="btn-add e-flex content-end">
              <Button
                onClick={() => this.setState({ showPopupDishAdd: true })}
              >
                <FontAwesomeIcon
                  className="e-m-right-5"
                  icon={faPlusCircle}
                />
                <span>{t("dishManagaments.add")}</span>
              </Button>
            </div>
            {
              this.props.comboList.length > 0 ?
                <>
                  <ul className="list-food e-row">
                    {
                      this.props.comboList.map((dishItem, index) => (
                        <div key={index}
                          className="item-combo e-p-10 e-col-4 e-flex">
                          <DishItem
                            dishItem={dishItem}
                            onEditDish={this.onEditDish}
                            showPopupMoreFood={(dishItem) => this.setState({
                              showPopupMoreFood: true,
                              total_item: dishItem.total_item,
                              comboItemId: dishItem.id,
                              itemDishdetail: dishItem,
                              listItems: dishItem.items
                            })}
                            {...rest}
                          />
                        </div>
                      ))
                    }
                  </ul>
                  <div className="e-flex content-center e-m-top-10" style={{ background: '' }}>
                    {
                      countPage > 1 ? (
                        <Paginate
                          pageCount={countPage}
                          onChange={this.onPageChange}
                          forcePage={1}
                        />
                      ) : ""
                    }
                  </div>
                </> :
                <div className="no-data-table e-flex content-center">
                  <div>
                    <img src={require("../../../images/no-data.png")} />
                    <div className="text">
                      <h3 className="text-no-data">
                        {t("dishManagaments.noData")}
                      </h3>
                    </div>
                  </div>
                </div>
            }
          </div>
        </div>
        <Dialog
          show={showPopupDishAdd}
          close={() => this.setState({ showPopupDishAdd: false })}
          title={t("dishManagaments.popupAdd")}
          innerClass="popup-add-combo"
        >
          <PopupDishAdd
            hide={() => this.setState({ showPopupDishAdd: false })}
            {...rest}
          />
        </Dialog>
        <Dialog
          show={this.isShowEdit()}
          close={this.closePopupEdit}
          innerClass="popup-add-combo"
          title={t("dishManagaments.popupEdit")}
        >
          <PopupDishEdit
            dishEdit={this.props.comboItemDetail}
            page={this.state.page}
            hide={() => this.setState({ showEditDish: false })}
            {...rest}
          />
        </Dialog>
        <Dialog
          show={this.state.showPopupMoreFood}
          close={this.closePopupMoreFood}
          title={t("dishManagaments.listItem")}
          innerClass="popup-list-food"
        >
          <PopupListFood
            foods={this.state.listItems}
            total_item={this.state.total_item}
            comboItemId={this.state.comboItemId}
            itemDishdetail={this.state.itemDishdetail}
            hide={() => this.setState({ showPopupMoreFood: false })}
            {...rest}
          />
        </Dialog>
      </section>
    )
  }
}