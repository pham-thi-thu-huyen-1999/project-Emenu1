import React from "react";
import { Redirect, Route } from "react-router-dom";
import { get } from "../services/localStorage";
import Header from "./Header";
import { TEMP_CONTRACT } from "../consts/settings/partnerContract";
import moment from "moment";
import Loading from './common/Loading'
import common from '../utils/common';
import { foundRole, userRoleCheck } from "../consts/settings/partnerContract";
import * as CONSTS from "./../containers/Login/constants";
import * as CONST_COMMON from "./../consts/constants";
const PrivateRoute = ({ children, ...rest }) => {
  const isLoggined = get("accessToken");
  let userRole = common.decodeToken(isLoggined).role || [];
  const isCheckIn = get("checkIn") ? get("checkIn") : CONSTS.NOT_YET_CHECK_IN;
  const hasCheckIn = get("is_checkin_out");
  return (
    rest.is_limit_feature ?
    (!rest.userInfo ?
    <Loading
      show="true"></Loading> : (rest.userInfo.contract_type_id === TEMP_CONTRACT || moment.utc(new Date()).isAfter(new Date(rest.userInfo.contract_end_time)) || (rest.userRole && userRole.indexOf(rest.userRole)) === foundRole ?
    <Route
      {...rest}
      exact
      render={({ location }) =>
        isLoggined
        ?
          hasCheckIn
          ?
            isCheckIn === CONSTS.CHECKED_IN
              ?
                (rest.userRole && userRoleCheck.tableList === rest.userRole ? <Redirect to={{ pathname: "/menu", state: { from: location } }} /> : <Redirect to={{ pathname: "/", state: { from: location } }} />)
              :
                <Redirect to={{ pathname: "/checkin", state: { from: location } }} />
          :
            (rest.userRole && userRoleCheck.tableList === rest.userRole ? <Redirect to={{ pathname: "/menu", state: { from: location } }} /> : <Redirect to={{ pathname: "/", state: { from: location } }} />)
        :
        (<Redirect to={{ pathname: "/login", state: { from: location } }} />)
      }
    /> :
    <Route
    {...rest}
    exact
    render={({ location }) =>
      rest.path === "/restaurant" ? (
        children
      ) : isLoggined
          ?
            hasCheckIn
            ?
              isCheckIn === CONSTS.CHECKED_IN ?
              (
              <div id="page-wrapper" className="use-bg">
                  {(rest.path === "/restaurant" || rest.path === "/order-food-list" || rest.path === "/order-comboList") ? null : <Header />}
                {children}
              </div>
              )
              :
                <Redirect to={{ pathname: "/checkin", state: { from: location } }} />
            :
              (
                <div id="page-wrapper" className="use-bg">
                    {(rest.path === "/restaurant" || rest.path === "/order-food-list" || rest.path === "/order-comboList") ? null : <Header />}
                  {children}
                </div>
              )
          :
            (<Redirect to={{ pathname: "/login", state: { from: location } }} />)
    }
  /> ) )
    :
    (
      rest.userRole && userRole.indexOf(rest.userRole) === foundRole ?
      <Route
        {...rest}
        exact
        render={({ location }) =>
          isLoggined
          ?
            rest.path === "/checkin"
            ? <Redirect to={{ pathname: "/not-found", state: { from: location } }} />
            :
              hasCheckIn
              ?
                isCheckIn === CONSTS.CHECKED_IN
                ?
                  (rest.userRole && userRoleCheck.tableList === rest.userRole ? <Redirect to={{ pathname: "/menu", state: { from: location } }} /> : <Redirect to={{ pathname: "/", state: { from: location } }} />)
                :  <Redirect to={{ pathname: "/checkin", state: { from: location } }} />
              : 
                (rest.userRole && userRoleCheck.tableList === rest.userRole ? <Redirect to={{ pathname: "/menu", state: { from: location } }} /> : <Redirect to={{ pathname: "/", state: { from: location } }} />)
          :
          (<Redirect to={{ pathname: "/login", state: { from: location } }} />)
        }
      /> :
      <Route
        {...rest}
        exact
        render={({ location }) =>
          rest.path === "/restaurant" ? (
            children
          )
          : isLoggined
            ?
              hasCheckIn
              ?
                isCheckIn === CONSTS.CHECKED_IN ?
                (
                  <div id="page-wrapper" className="use-bg">
                      {(rest.path === "/restaurant" || rest.path === "/order-food-list" || rest.path === "/order-comboList") ? null : <Header />}
                    {children}
                  </div>
                )
                : !CONST_COMMON.LINK_ALLOW.includes(rest.path)
                  ?
                      <Redirect to={{ pathname: "/checkin", state: { from: location } }} />
                  : (<div id="page-wrapper" className="use-bg">
                    {(rest.path === "/restaurant" || rest.path === "/order-food-list" || rest.path === "/order-comboList") ? null : <Header />}
                    {children}
                    </div>)
              :
                (
                  <div id="page-wrapper" className="use-bg">
                    {(rest.path === "/restaurant" || rest.path === "/order-food-list" || rest.path === "/order-comboList") ? null : <Header />}
                    {children}
                  </div>
                )
            :
              (<Redirect to={{ pathname: "/login", state: { from: location } }} />)
        }
      />
    )

  );
};

export default PrivateRoute;
