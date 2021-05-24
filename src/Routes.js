import React, { Component } from "react";
import { Switch, Redirect, Route } from "react-router-dom";
import UIComponent from "./components/common/demo/UIComponent";
import { PrivateRoute } from "./components";
import { getPartnerById } from "./api/partner";
import { get } from "./services/localStorage";
import {
  MainManagement,
  FoodManagement,
  TableListManagement,
  FoodListIsProcessing,
  LoginScreen,
  ListOfBookedTables,
  UserManagement,
  Setting,
  PromotionManagement,
  FoodCategoryManagement,
  TakeAwayScreen,
  DishManagement,
  BookingTable,
  PromotionManagements,
  ReportManagement,
  ShiftManagement,
  AreaList,
  AreaNew,
  AreaEdit,
  CalendarManagement,
  TableList,
  TableArrangement,
  DetailRestaurant,
  PaymentOrder,
  PaymentList,
  PaymentRequest,
  PaymentRequestDetail,
  OrderedList,
  ViewProvisiVotes,
  ProvisionalVotes,
  PageNotFound,
  ComboList,
  CheckInPage,
  CheckOutPage,
  PersonalCalendarPage,
  RegisterOTPage,
  RegisterWorkInsteadPage,
  CalendarStaffPage,
  TakeLeavePage,
  FoodList,
  PrintOrder,
  FoodListIsProcessingBar,
  AddonManagement
} from "./containers";
import { userRoleCheck } from "./consts/settings/partnerContract";

class Router extends Component {
  _isMounted = false;
  constructor(props) {
    super(props)
    this.state = {
      is_limit_feature: true
    }
  }
  getPartnerInfo = async () => {

    try {
      if (this._isMounted) {
        const data = await getPartnerById();
        if (data.data && data.data.data) {
          this._isMounted && this.setState({
            partner_Info: data.data.data
          });
        }
      }
    } catch (error) { }

  };
  render() {
    const { partner_Info, is_limit_feature } = this.state;
    const hasCheckInOut = get("is_checkin_out") ? get("is_checkin_out") : false;
    return (
      <Switch>
        <Route path="/UI">
          <UIComponent />
        </Route>
        <Route exact path="/login">
          <LoginScreen />
        </Route>
        <Route exact path="/dev">
          <ListOfBookedTables />
        </Route>
        <PrivateRoute userRole={userRoleCheck.takeaway} userInfo={partner_Info} is_limit_feature={is_limit_feature} exact path="/takeaway">
          <TakeAwayScreen />
        </PrivateRoute>
        <PrivateRoute userRole={userRoleCheck.setting} path="/setting">
          <Setting />
        </PrivateRoute>
        <PrivateRoute userInfo={partner_Info} is_limit_feature={is_limit_feature} exact path="/promotion-management">
          <PromotionManagement />
        </PrivateRoute>

        <PrivateRoute userRole={userRoleCheck.promotion} exact path="/promotions-management">
          <PromotionManagements />
        </PrivateRoute>

        <PrivateRoute exact path="/menu">
          <MainManagement />
        </PrivateRoute>
        <PrivateRoute userRole={userRoleCheck.mealManagament} exact path="/dish-management">
          <DishManagement />
        </PrivateRoute>
        <PrivateRoute userRole={userRoleCheck.shift} userInfo={partner_Info} is_limit_feature={is_limit_feature} exact path="/shift-management">
          <ShiftManagement />
        </PrivateRoute>
        {/* <PrivateRoute path="/find-table">
          <SearchTableScreen />
        </PrivateRoute> */}
        <PrivateRoute userRole={userRoleCheck.account} exact path="/user">
          <UserManagement />
        </PrivateRoute>
        <PrivateRoute userRole={userRoleCheck.dishManagament} exact path="/dish">
          <FoodManagement />
        </PrivateRoute>
        <PrivateRoute userRole={userRoleCheck.tableManagement} exact path="/table">
          <TableListManagement />
        </PrivateRoute>
        <PrivateRoute userInfo={partner_Info} is_limit_feature={is_limit_feature} exact path="/booking-table">
          <BookingTable />
        </PrivateRoute>
        <PrivateRoute userRole={userRoleCheck.kitchen} userInfo={partner_Info} is_limit_feature={is_limit_feature} exact path="/dish-processing">
          <FoodListIsProcessing />
        </PrivateRoute>
        <PrivateRoute userRole={userRoleCheck.kitchen} userInfo={partner_Info} is_limit_feature={is_limit_feature} exact path="/dish-processing-bar">
          <FoodListIsProcessingBar />
        </PrivateRoute>
        <PrivateRoute userRole={userRoleCheck.categoryDish} exact path="/dish-category">
          <FoodCategoryManagement />
        </PrivateRoute>
        <PrivateRoute userRole={userRoleCheck.report} userInfo={partner_Info} is_limit_feature={is_limit_feature} exact path="/report">
          <ReportManagement />
        </PrivateRoute>
        {/* Area management routes */}
        <PrivateRoute userRole={userRoleCheck.areaManagement} exact path="/area">
          <AreaList />
        </PrivateRoute>
        <PrivateRoute userRole={userRoleCheck.areaManagement} exact path="/area/new">
          <AreaNew />
        </PrivateRoute>
        <PrivateRoute userRole={userRoleCheck.areaManagement} exact path="/area/:areaId/edit">
          <AreaEdit />
        </PrivateRoute>
        <PrivateRoute userRole={userRoleCheck.areaManagement} exact path="/area/:areaId/arrange">
          <TableArrangement />
        </PrivateRoute>
        <PrivateRoute exact path="/restaurant">
          <DetailRestaurant />
        </PrivateRoute>
        {/* End area management routes */}
        <PrivateRoute userRole={userRoleCheck.calendar} userInfo={partner_Info} is_limit_feature={is_limit_feature} exact path="/calendar">
          <CalendarManagement />
        </PrivateRoute>
        <Route userRole={userRoleCheck.checkInOut} path="/checkin">
          {hasCheckInOut ? <CheckInPage /> : <PageNotFound />}
        </Route>
        <PrivateRoute userRole={userRoleCheck.checkInOut} path="/checkout">
          {hasCheckInOut ? <CheckOutPage /> : <PageNotFound />}
        </PrivateRoute>
        <PrivateRoute userRole={userRoleCheck.checkInOut} path="/personal-calendar">
          {hasCheckInOut ? <PersonalCalendarPage /> : <PageNotFound />}
        </PrivateRoute>
        <PrivateRoute path="/add-ot-shift">
          {hasCheckInOut ? <RegisterOTPage /> : <PageNotFound />}
        </PrivateRoute>
        <PrivateRoute path="/work-instead">
          {hasCheckInOut ? <RegisterWorkInsteadPage /> : <PageNotFound />}
        </PrivateRoute>
        <PrivateRoute path="/calendar-staff">
          {hasCheckInOut ? <CalendarStaffPage /> : <PageNotFound />}
        </PrivateRoute>
        <PrivateRoute path="/take-leave">
          {hasCheckInOut ? <TakeLeavePage /> : <PageNotFound />}
        </PrivateRoute>
        {/* Payment routes */}
        <PrivateRoute exact path="/payment/order">
          <PaymentList />
        </PrivateRoute>
        <PrivateRoute exact path="/payment/order/:orderId">
          <PaymentOrder />
        </PrivateRoute>
        {/* Request payment */}
        <PrivateRoute userRole={userRoleCheck.payment} userInfo={partner_Info} is_limit_feature={is_limit_feature} exact path="/request-payment">
          <PaymentRequest />
        </PrivateRoute>
        <PrivateRoute userRole={userRoleCheck.payment} userInfo={partner_Info} is_limit_feature={is_limit_feature} path="/request-payment/:reqPaymentId/request-detail">
          <PaymentRequestDetail />
        </PrivateRoute>
        <PrivateRoute userRole={userRoleCheck.payment} userInfo={partner_Info} is_limit_feature={is_limit_feature} exact path="/request-payment/:orderId">
          <OrderedList />
        </PrivateRoute>
        <PrivateRoute userRole={userRoleCheck.payment} userInfo={partner_Info} is_limit_feature={is_limit_feature} exact path="/request-payment/:paymentReqDetailId/provisi-detail">
          <ViewProvisiVotes />
        </PrivateRoute>
        <PrivateRoute userRole={userRoleCheck.payment} userInfo={partner_Info} is_limit_feature={is_limit_feature} path="/request-payment/send-provisional">
          <ProvisionalVotes />
        </PrivateRoute>
        {/* print order */}
        <PrivateRoute path="/printProvisi/:orderId">
          <PrintOrder />
        </PrivateRoute>
        {/* End payment routes */}
        <PrivateRoute userRole={userRoleCheck.tableList} exact path="/">
          <TableList partner_Info={partner_Info} />
        </PrivateRoute>
        <PrivateRoute exact path="/not-found">
          <PageNotFound />
        </PrivateRoute>
        {/* <PrivateRoute path="*">
          <PageNotFound />
        </PrivateRoute> */}
        <PrivateRoute exact path="/order-comboList">
          <ComboList />
        </PrivateRoute>
        <PrivateRoute exact path="/order-food-list">
          <FoodList />
        </PrivateRoute>
        {/* End table list routes */}

        <PrivateRoute exact path="/addon">
          <AddonManagement />
        </PrivateRoute>
        {/* <Route
        path="/"
        exact
        render={() => {
          return <Redirect to={`/ `} />;
        }}
        /> */}
        <Redirect exact to="/not-found" />

      </Switch>
    );
  }

  resize = () => {
    const viewport = document.querySelector('[name=viewport]');
    const normal = window.innerWidth < window.innerHeight
    let body = document.querySelector('body')
    let html = document.querySelector('html')
    if (this.props.history.location.pathname === "/restaurant" || this.props.history.location.pathname === "/login") {
      html.className = "not-rotate"
    } else {
      html.className = ""
      if (normal) {
        viewport.setAttribute('content', 'height=1366')
        body.className = 'e-vertical'
      } else {
        viewport.setAttribute('content', 'width=1366')
        body.className = 'e-horizontal'
      }
    }
  }
  release = () => {
    if ('WakeLock' in window && 'request' in window.WakeLock) {
      let wakeLock = null;
      const requestWakeLock = () => {
        const controller = new AbortController();
        const signal = controller.signal;
        window.WakeLock.request('screen', { signal })
          .catch((e) => {
            if (e.name === 'AbortError') {
            } else {
              console.error(`${e.name}, ${e.message}`);
            }
          });
        return controller;
      };
      window.setTimeout(() => {
        requestWakeLock()
      }, 5000);
      const handleVisibilityChange = () => {
        if (wakeLock !== null && document.visibilityState === 'visible') {
          wakeLock = requestWakeLock();
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);
    } else if ('wakeLock' in navigator && 'request' in navigator.wakeLock) {
      let wakeLock = null;

      const requestWakeLock = async () => {
        try {
          wakeLock = await navigator.wakeLock.request('screen');
          wakeLock.addEventListener('release', (e) => { });
        } catch (e) {
          console.error(`${e.name}, ${e.message}`);
        }
      };
      window.setTimeout(() => {
        requestWakeLock()
      }, 5000);
      const handleVisibilityChange = () => {
        if (wakeLock !== null && document.visibilityState === 'visible') {
          requestWakeLock();
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

    } else {
      console.error('Wake Lock API not supported.');
    }
  }
  componentDidMount = () => {
    this.resize()
    window.addEventListener('resize', this.resize, true)
    this._isMounted = true
    this._isMounted && this.getPartnerInfo();
    this.release()
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.resize, true)
    this._isMounted = false;
    // window.removeEventListener('release', this.release, true)
  }
}

export default Router;
