import React, { Component } from 'react';
import { MENU as listMenu } from '../../../consts/settings/menuUI'
import asyncComponent from '../../../helpers/asyncComponent';
import {
    Switch,
    Route,
    Link
}
from "react-router-dom";

class UIComponent extends Component {

    render() {
        return (
            <div className="e-ui">
                <div className="e-menu">
                    <div className="logo">
                        components E-menu
                    </div>
                    <ul >
                        {listMenu.map((item, index) => {
                            return (
                            <li key={index}>
                                <Link to={item.path}>{item.title}</Link>
                            </li>
                            );
                        })}

                    </ul>
                </div>
                <div className="content">
                    <Switch>
                        {listMenu.map((item, index) => {
                            return (
                            <Route
                                key={index}
                                path={item.path}
                                component={
                                    asyncComponent(
                                        () => import(item.component + '')
                                    )
                                }>
                            </Route>
                            );
                        })}
                    </Switch>
                </div>
            </div>
        );
    }
}

export default UIComponent;