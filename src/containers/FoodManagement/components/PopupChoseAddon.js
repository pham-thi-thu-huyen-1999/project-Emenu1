import React from "react"
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import AddonItem from "./AddonItem";
import Paginate from "../../../components/common/Paginate";
import { LIMIT_ADDON } from "../constants";

export default class PopupChoseAddon extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            listAddonIsChecked: this.props.selected,
            addonListEdit: this.props.addonListEdit,
            addonList: this.props.addonList,
            foodChoose: [],
            checked: false,
            listAddonIsCheckedInner: [],
            filterName: "",
            page: 0
        }
    }

    componentDidMount() {
        const { addonListEdit, listAddonIsCheckedInner } = this.state
        for (let i in addonListEdit) {
            listAddonIsCheckedInner.push({
                id: addonListEdit[i].id,
                name: addonListEdit[i].name,
            })
        }
        this.setState({
            listAddonIsCheckedInner
        })
    }
    /**
     * when select item
     * @param {*} id
     * @param {*} checked
     * @param {*} name
     */
    onHandleAddonCheck = (id, checked, name) => {
        let { listAddonIsCheckedInner } = this.state
        if (checked) {
            listAddonIsCheckedInner.push({ id, name })
        } else {
            listAddonIsCheckedInner = listAddonIsCheckedInner.filter(item => item.id !== id)
        }
        this.setState({ listAddonIsCheckedInner })
    }

    onSubmitDataCheck = () => {
        this.props.onSubmitDataCheck(this.state.listAddonIsCheckedInner)
    }
  
    generateParams = (page) => {
        const params = {
            page,
            limit: LIMIT_ADDON
        }
        if (this.state.filterName) {
            params.name_search = this.state.filterName
        }
        const data = {
          data: params
        }
        return data;
    }

    onPageItemChange = data => {
        this.setState({
            page: data.selected + 1
        })
        this.props.actions.getAddonList(this.generateParams(data.selected + 1));
    }
    render() {
        const { listAddonIsCheckedInner } = this.state;
        const { t, limitAddonPage, ...rest } = this.props;
        var dataChecked = []
        for (let i in listAddonIsCheckedInner) {
            dataChecked[i] = listAddonIsCheckedInner[i].id
        }
        return (
            <>
                <div className="e-dialog-content">
                    <div className="e-dialog-body">
                        <div className="e-row">
                            <div className="e-col-3 e-m-right-15">
                                <Input
                                    placeholder={t("dishManagament.searchfood")}
                                    type="search"
                                    defaultValue={this.state.filterName}
                                    onChange={e => this.setState({ filterName: e.target.value })}
                                />
                            </div>
                            
                            <div className="e-col-3">
                                <Button onClick={() => this.onPageItemChange({ selected: 0 })}>
                                    <FontAwesomeIcon icon={faSearch} className="e-m-right-5" />
                                    {t("dishManagament.search")}
                                </Button>
                            </div>
                        </div>
                        <div className="list-addon-content">
                            {
                                this.props.addonList.length > 0 ? (
                                    <ul className="list-addon" style={{ "padding": "0 40px" }}>
                                        {
                                            this.props.addonList.map((addon, index) => {
                                                const checked = dataChecked.includes(addon.id)
                                                return (
                                                    <AddonItem
                                                        onHandleAddonCheck={this.onHandleAddonCheck}
                                                        checked={checked}
                                                        addon={addon}
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
                                limitAddonPage > 1 ? (
                                    <Paginate
                                        pageCount={this.props.limitAddonPage}
                                        onChange={this.onPageItemChange}
                                        forcePage={this.state.page}
                                    />
                                ) : ''
                            }
                        </div>
                        <span className="e-m-right-5">
                            <Button type="s3" onClick={() => this.props.hide()}>
                                {t("dishManagament.back")}</Button>
                        </span>
                        <span>
                            <Button onClick={this.onSubmitDataCheck}>{t("dishManagament.add")}</Button>
                        </span>
                    </div>
                </div>
            </>
        )
    }
}