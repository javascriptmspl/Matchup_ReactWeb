import React, { useEffect, useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import HomePageTwo from "../pagesDating/hometwo";
import HomePageThree from "../pagesDating/homethree";
import AboutPage from "../pagesDating/about";
import MembershipPage from "../pagesDating/membership";
import ComingSoonPage from "../pagesDating/comingsoon";
import CommunityPage from "../pagesDating/community";
import GroupPage from "../pagesDating/group";
import GroupDetails from "../pagesDating/groupsingle"; 
import MembersPage from "../pagesDating/members";
import ActivityPage from "../pagesDating/activity";
import ShopPage from "../pagesDating/shop";
import ShopDetails from "../pagesDating/shopdetails";
import ShopCart from "../pagesDating/shopcart";
import BlogPage from "../pagesDating/blog";
import BlogPageTwo from "../pagesDating/blogtwo";
import BlogDetails from "../pagesDating/blog-single";
import ContactUs from "../pagesDating/contact";
import MemberDetails from "../pagesDating/member-single";
import Policy from "../pagesDating/policy";
import NotificationPage from "../../component/popUps/notification";
import Termsconditions from "../pagesDating/Terms-conditions";
import FAQ from "../pagesDating/Faq";
import NotificationFullPage from "../pagesDating/notification-page";
import MessengerPage from "../../component/chat/MessengerPage";
import ManageProfile from "../pagesDating/manage-profile";
import HelpDating from "../pagesDating/helpDating";

import MyProfile from "../pagesDating/my-profile";
import MatchPage from "../pagesDating/matches";
import BlogDetailsSingleUser from "../pagesDating/blog-single-user";
import UserProfile from "../pagesDating/user-profile";
import SelectInterest from "../pagesDating/select-intrests";
import { Toaster } from "react-hot-toast";
import AddPhotos from "../pagesDating/add-photos";
import Settings from "../pagesDating/setting-page";
import Chat2 from "../pagesDating/Chat2";
import { ModalProvider } from "../component/popUps/ModalContext";
import ContactDetail from "../pagesDating/ContactDetail";
import Aboutdetail from "../pagesDating/Aboutdetails";
import Safetysecurity from "../pagesDating/Safety-Security";
import Quickstartguide from "../pagesDating/Quick-Start-Guide";
import Events from "../pagesDating/Events";
import ProtectedRoutes from "./protectedRoutes";
import HomePage from "../pagesDating/home";
import FindFriendPageNew from "../pagesDating/FindFreindSwipePage";
import News from "../../component/News/news";
import PurchaseHistory from "../pagesDating/purchasehistory";

function DatingRoutes() {
  

  return (
    <>
      <ModalProvider>
        <Routes>
          <Route path="/" element={<Outlet />}>
            <Route path="index-2" element={<HomePageTwo />} />
            <Route path="index-3" element={<HomePageThree />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="membership" element={<MembershipPage />} />
            <Route path="purchase-history" element={<ProtectedRoutes><PurchaseHistory /></ProtectedRoutes>} />
            <Route path="comingsoon" element={<ComingSoonPage />} />
            <Route path="community" element={<CommunityPage />} />
            <Route path="group" element={<GroupPage />} />
            <Route path="group-single" element={<GroupDetails />} />
            {/* <Route path="members" element={<MembersPage />} /> */}
            <Route path="activity" element={<ActivityPage />} />
            <Route path="shop-page" element={<ShopPage />} />
            <Route path="shop-single" element={<ShopDetails />} />
            <Route path="shop-cart" element={<ShopCart />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="news" element={<News />} />

      <Route  path="/chat-page2"          element={<ProtectedRoutes><Chat2  />   </ProtectedRoutes>   } />
      <Route path="user-profile/:_id" element={<ProtectedRoutes><UserProfile /> </ProtectedRoutes> } />
      <Route path="events" element={<ProtectedRoutes><Events /> </ProtectedRoutes> } />
      <Route path="match-page" element={<ProtectedRoutes><MatchPage /> </ProtectedRoutes> } />
      {/* <Route path="members" element={<ProtectedRoutes><MembersPage /> </ProtectedRoutes> } /> */}

      
      {/* <Route path="match-page" element={<MatchPage />} /> */}


            {/* <ProtectedRoutes>
        <Route path="chat-page2" element={<Chat2 />} />
      </ProtectedRoutes> */}
            {/* <Route path="chat-page2" element={<Chat2 />} /> */}
            {/* <Route path="events" element={<Events />} /> */}
            <Route path="help&support"  element={<HelpDating/>}/>

            <Route
              path="blog/user/blogDetails"
              element={<BlogDetailsSingleUser />}
            />
            <Route path="blog-2" element={<HomePage />} />
            <Route path="blog-2" element={<BlogPageTwo />} />
            <Route path="blog-single" element={<BlogDetails />} />
            <Route path="contact" element={<ContactUs />} />
            <Route path="member-single" element={<MemberDetails />} />
            <Route path="policy" element={<Policy />} />
            <Route path="notification" element={<NotificationPage />} />
            <Route path="termsconditions" element={<Termsconditions />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="notifications" element={<ProtectedRoutes><NotificationFullPage /></ProtectedRoutes>} />
            <Route path="messenger-page" element={<ProtectedRoutes><MessengerPage /></ProtectedRoutes>} />
            <Route path="manage-profile" element={<ProtectedRoutes><ManageProfile /></ProtectedRoutes>} />
            <Route path="contactdetail" element={<ProtectedRoutes><ContactDetail /></ProtectedRoutes>} />
            <Route path="aboutinfo" element={<ProtectedRoutes><Aboutdetail /></ProtectedRoutes>} />
            <Route path="profile" element={<ProtectedRoutes><MyProfile /></ProtectedRoutes>} />
            {/* Duplicate match-page route removed - already protected above on line 77 */}
            {/* <Route path="user-profile" element={<UserProfile />} /> */}
            <Route path="interest" element={<ProtectedRoutes><SelectInterest /></ProtectedRoutes>} />
            <Route path="add-photos" element={<ProtectedRoutes><AddPhotos /></ProtectedRoutes>} />
            <Route path="settings" element={<ProtectedRoutes><Settings /></ProtectedRoutes>} />
            {/* <Route path="testimonial" element={<Testimonial />} /> */}
            <Route path="safety-security" element={<Safetysecurity />} />
            <Route path="quick-start-guide" element={<Quickstartguide />} />
            {/* <Route path="membership" element={<Membershippage />} /> */}
            {/* <Route path="find-friend-new" element={<FindFriendPageNew />} /> */}
            <Route path="members" element={<ProtectedRoutes><FindFriendPageNew /></ProtectedRoutes>} />

            
          </Route>
        </Routes>
      </ModalProvider>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          className: "",
          style: {},
        }}
      />
    </>
  );
}

export default DatingRoutes;
