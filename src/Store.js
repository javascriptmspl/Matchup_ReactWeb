import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import userSlice from "./dating/store/slice/AuthSlice";
import profileSlice from "./dating/store/slice/profileSlice";
import findPartnerSlice from './dating/store/slice/find-partner-Slice'
import ActivitiesSlice from "./dating/store/slice/ActivitiesSlice";
import termAndConditionSlice from "./dating/store/slice/commonSlice"
import { productReducer } from "./dating/store/slice/shop/ProductSlice";
import { shopReducer } from "./dating/store/slice/shop/shopSlice";
import { cartReducer } from "./dating/store/slice/shop/CartSlice";
import  memberSlice  from "./dating/store/slice/localSlices/FindPartnerSlice"
import allUsersSlice from "./service/MANAGE_SLICE/find-user-SLICE"
import intersetSlice from "./service/MANAGE_SLICE/interest-SLICE"
import EventSlice from "./dating/store/slice/shop/EventSlice";
import datingApiReducer from "../src/service/common-service/getuserbyGender"
import eventReducer from "../src/service/common-service/eventSlice"
import findPatnerSlice from "./service/common-service/find-patner"
import notificationReducer from "./service/common-service/notificationslice"
const store = configureStore({
  reducer: {
    userCreate: userSlice,
    profile: profileSlice,
    findPartner: findPartnerSlice,
    activies: ActivitiesSlice,
    termAndConditionSlice: termAndConditionSlice,
    findPatner: findPatnerSlice,
    eventSlice: EventSlice,  
    // shop
    products: productReducer,
    cart: cartReducer,
    shop: shopReducer,

    //member locally
    members : memberSlice,

    //metrimonial
    getAllUser: allUsersSlice,
    intersetSlice: intersetSlice,

    datingApi: datingApiReducer,
    event: eventReducer,
    notifications: notificationReducer
    

  },
  middleware: [thunk],
});

export default store;
