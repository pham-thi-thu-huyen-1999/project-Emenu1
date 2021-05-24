import React from "react"
import Input from "../../../components/common/Input";
import Select from "../../../components/common/SelectBox";
import Button from "../../../components/common/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import FoodItem from "./FoodItem";
import { OPTIONS } from "../../../consts/settings/dish/dish"
import Paginate from "../../../components/common/Paginate";
import { LIMIT_ITEM } from "../../../consts/settings/dish/dish";

export default class PopupChoseListFood extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            listFoodIsChecked: this.props.selected,
            comboItemDetails: this.props.comboItemDetails,
            listFood: this.props.itemList,
            optionFood: OPTIONS,
            foodChoose: [],
            checked: false,
            listFoodIsCheckedInner: [],
            filterType: null,
            filterName: "",
            page: 0
        }
    }

    componentDidMount() {
        const { comboItemDetails, listFoodIsCheckedInner } = this.state
        for (let i in comboItemDetails) {
            listFoodIsCheckedInner.push({
                id: comboItemDetails[i].id,
                name: comboItemDetails[i].name,
            })
        }
        this.setState({
            listFoodIsCheckedInner
        })
    }
    /**
     * when select item
     * @param {*} id
     * @param {*} checked
     * @param {*} name
     */
    onHandleFoodCheck = (id, checked, name) => {
        let { listFoodIsCheckedInner } = this.state
        if (checked) {
            listFoodIsCheckedInner.push({ id, name })
        } else {
            listFoodIsCheckedInner = listFoodIsCheckedInner.filter(item => item.id !== id)
        }
        this.setState({ listFoodIsCheckedInner })
    }

    onSubmitDataCheck = () => {
        this.props.onSubmitDataCheck(this.state.listFoodIsCheckedInner)
    }
    generateParams = (page) => {
        const params = {
            page,
            limit: LIMIT_ITEM
        }
        if (this.state.filterName) {
            params.name_search = this.state.filterName
        }
        if (this.state.filterType) {
            params.group_type = this.state.filterType
        }
        return params;
    }

    onPageItemChange = data => {
        this.setState({
            page: data.selected + 1
        })
        this.props.actions.getItems(this.generateParams(data.selected + 1));
    }
    render() {
        const { optionFood, listFoodIsCheckedInner } = this.state;
        const { t, countPageItem, ...rest } = this.props;
        var dataChecked = []
        for (let i in listFoodIsCheckedInner) {
            dataChecked[i] = listFoodIsCheckedInner[i].id
        }
        return (
            <>
                <div className="e-dialog-content">
                    <div className="e-dialog-body">
                        <div className="e-row">
                            <div className="e-col-3 e-m-right-15">
                                <Input
                                    placeholder={t("dishManagaments.searchByName")}
                                    type="search"
                                    defaultValue={this.state.filterName}
                                    onChange={e => this.setState({ filterName: e.target.value })}
                                />
                            </div>
                            <div className="e-col-3 e-m-right-15">
                                <Select
                                    style={{
                                        color: "#707070",
                                        height: "50px",
                                        borderRadius: "10px",
                                        boxShadow: "none"
                                    }}
                                    dataSource={optionFood}
                                    value={this.state.filterType}
                                    selected={null}
                                    blank={t("dishManagaments.searchByType")}
                                    map={{
                                        key: "key",
                                        text: "text"
                                    }}
                                    onChange={type => this.setState({ filterType: type })}

                                />
                            </div>
                            <div className="e-col-3">
                                <Button onClick={() => this.onPageItemChange({ selected: 0 })}>
                                    <FontAwesomeIcon icon={faSearch} className="e-m-right-5" />
                                    {t("dishManagaments.search")}
                                </Button>
                            </div>
                        </div>
                        <div className="list-food-content">
                            {
                                this.props.itemList.length > 0 ? (
                                    <ul className="list-food" style={{ "padding": "0 40px" }}>
                                        {
                                            this.props.itemList.map((food, index) => {
                                                const checked = dataChecked.includes(food.id)
                                                return (
                                                    <FoodItem
                                                        onHandleFoodCheck={this.onHandleFoodCheck}
                                                        idFoodCheck={food.id}
                                                        checked={checked}
                                                        food={food}
                                                        key={index}
                                                        {...rest}
                                                    />
                                                )
                                            })
                                        }
                                    </ul>
                                )
                                    :
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
                    <div className="e-flex content-end">
                        <div className="e-flex flex align-center">
                            {
                                countPageItem > 1 ? (
                                    <Paginate
                                        pageCount={this.props.countPageItem}
                                        onChange={this.onPageItemChange}
                                        forcePage={this.state.page}
                                    />
                                ) : ''
                            }
                        </div>
                        <span className="e-m-right-5">
                            <Button type="s3" onClick={() => this.props.hide()}>
                                {t("dishManagaments.back")}</Button>
                        </span>
                        <span>
                            <Button onClick={this.onSubmitDataCheck}>{t("dishManagaments.add")}</Button>
                        </span>
                    </div>
                </div>
            </>
        )
    }
}