import React, { useEffect, useState, lazy, Suspense } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import "../assets/css/custom.css";
import ErrorPage from "../../pages/errorpage";
import Lodder from "../component/layout/Lodder";

const HomePageTwo = lazy(() => import("../pagesMetrimoniul/hometwo"));
const HomePageThree = lazy(() => import("../pagesMetrimoniul/homethree"));
const AboutPage = lazy(() => import("../pagesMetrimoniul/about"));
const MembershipPage = lazy(() => import("../pagesMetrimoniul/membership"));
const ComingSoonPage = lazy(() => import("../pagesMetrimoniul/comingsoon"));
const CommunityPage = lazy(() => import("../pagesMetrimoniul/community"));
const GroupPage = lazy(() => import("../pagesMetrimoniul/group"));
const GroupDetails = lazy(() => import("../pagesMetrimoniul/groupsingle"));
const MembersPage = lazy(() => import("../pagesMetrimoniul/members"));
const ActivityPage = lazy(() => import("../pagesMetrimoniul/activity"));
const ShopPage = lazy(() => import("../pagesMetrimoniul/shop"));
const ShopDetails = lazy(() => import("../pagesMetrimoniul/shopdetails"));
const ShopCart = lazy(() => import("../pagesMetrimoniul/shopcart"));
const BlogPage = lazy(() => import("../pagesMetrimoniul/blog"));
const BlogPageTwo = lazy(() => import("../pagesMetrimoniul/blogtwo"));
const BlogDetails = lazy(() => import("../pagesMetrimoniul/blog-single"));
const ContactUs = lazy(() => import("../pagesMetrimoniul/contact"));
const MemberDetails = lazy(() => import("../pagesMetrimoniul/member-single"));
const Policy = lazy(() => import("../pagesMetrimoniul/policy"));
const NotificationPage = lazy(() =>
  import("../../component/popUps/notification")
);
const Termsconditions = lazy(() =>
  import("../pagesMetrimoniul/Terms-conditions")
);
const FAQ = lazy(() => import("../pagesMetrimoniul/Faq"));
const NotificationFullPage = lazy(() =>
  import("../pagesMetrimoniul/notification-page")
);
const MessengerPage = lazy(() => import("../../component/chat/MessengerPage"));
const ManageProfile = lazy(() => import("../pagesMetrimoniul/manage-profile"));
const ManageProfileCareerAndEducation = lazy(() =>
  import("../pagesMetrimoniul/manage-profile-eduAndCareer")
);
const ManageProfileFamily = lazy(() =>
  import("../pagesMetrimoniul/manage-profile-family")
);
const MyProfile = lazy(() => import("../pagesMetrimoniul/my-profile"));
const MatchPage = lazy(() => import("../pagesMetrimoniul/matches"));
const BlogDetailsSingleUser = lazy(() =>
  import("../pagesMetrimoniul/blog-single-user")
);
const UserProfile = lazy(() => import("../pagesMetrimoniul/user-profile"));
const SelectInterest = lazy(() =>
  import("../pagesMetrimoniul/select-intrests")
);
const Chat = lazy(() => import("../pagesMetrimoniul/chat-page"));
const Safetysecurity = lazy(() =>
  import("../pagesMetrimoniul/Safety-Security")
);
const Quickstartguide = lazy(() =>
  import("../pagesMetrimoniul/Quick-Start-Guide")
);
const Settings = lazy(() => import("../pagesMetrimoniul/setting-page"));
const HelpAndSuport = lazy(() => import("../pagesMetrimoniul/help-support"));
const FamilyDetails = lazy(() => import("../pagesMetrimoniul/family-details"));
const PartnerPreference = lazy(() =>
  import("../pagesMetrimoniul/prefer-partner")
);
const AddPhotos = lazy(() => import("../pagesMetrimoniul/addUserPicture"));
const Event = lazy(() => import("../pagesMetrimoniul/Events"));
const AstroPage = lazy(() => import("../pagesMetrimoniul/Astro-page"));
const PurchaseHistory = lazy(() => import("../pagesMetrimoniul/purchasehistory"));

function MetrimoniulRoutes() {
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowNotifications(true);
    }, 10000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Outlet />}>
          <Route path="*" element={<ErrorPage />} />
          <Route
            path="index-2"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <HomePageTwo />
              </Suspense>
            }
          />
          <Route
            path="index-3"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <HomePageThree />
              </Suspense>
            }
          />
          <Route
            path="about"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <AboutPage />
              </Suspense>
            }
          />
          <Route
            path="membership"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <MembershipPage />
              </Suspense>
            }
          />
          <Route
            path="purchase-history"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <PurchaseHistory />
              </Suspense>
            }
          />
          <Route
            path="comingsoon"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <ComingSoonPage />
              </Suspense>
            }
          />
          <Route
            path="community"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <CommunityPage />
              </Suspense>
            }
          />
          <Route
            path="group"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <GroupPage />
              </Suspense>
            }
          />
          <Route
            path="group-single"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <GroupDetails />
              </Suspense>
            }
          />
          <Route
            path="members"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <MembersPage />
              </Suspense>
            }
          />
          <Route
            path="activity"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <ActivityPage />
              </Suspense>
            }
          />
          <Route
            path="shop"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <ShopPage />
              </Suspense>
            }
          />
          <Route
            path="shop-single"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <ShopDetails />
              </Suspense>
            }
          />
          <Route
            path="shop-cart"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <ShopCart />
              </Suspense>
            }
          />
          <Route
            path="blog"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <BlogPage />
              </Suspense>
            }
          />
          <Route
            path="blog/user/blogDetails"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <BlogDetailsSingleUser />
              </Suspense>
            }
          />
          <Route
            path="blog-2"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <BlogPageTwo />
              </Suspense>
            }
          />
          <Route
            path="blog-single"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <BlogDetails />
              </Suspense>
            }
          />
          <Route
            path="contact"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <ContactUs />
              </Suspense>
            }
          />
          <Route
            path="member-single"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <MemberDetails />
              </Suspense>
            }
          />
          <Route
            path="policy"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <Policy />
              </Suspense>
            }
          />
          <Route
            path="notification"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <NotificationPage />
              </Suspense>
            }
          />
          <Route
            path="termsconditions"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <Termsconditions />
              </Suspense>
            }
          />
          <Route
            path="faq"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <FAQ />
              </Suspense>
            }
          />
          <Route
            path="notifications"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <NotificationFullPage />
              </Suspense>
            }
          />
          <Route
            path="messenger-page"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <MessengerPage />
              </Suspense>
            }
          />
          <Route
            path="manage-profile"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <ManageProfile />
              </Suspense>
            }
          />
          <Route
            path="manage-profile-Edu&career"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <ManageProfileCareerAndEducation />
              </Suspense>
            }
          />
          <Route
            path="manage-profile-family"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <ManageProfileFamily />
              </Suspense>
            }
          />
          <Route
            path="profile"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <MyProfile />
              </Suspense>
            }
          />
          <Route
            path="match-page"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <MatchPage />
              </Suspense>
            }
          />
          <Route
            path="user-profile/:id"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <UserProfile />
              </Suspense>
            }
          />
          <Route
            path="interest"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <SelectInterest />
              </Suspense>
            }
          />
          <Route
            path="chat"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <Chat />
              </Suspense>
            }
          />
          <Route
            path="safety-security"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <Safetysecurity />
              </Suspense>
            }
          />
          <Route
            path="quick-start-guide"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <Quickstartguide />
              </Suspense>
            }
          />
          <Route
            path="settings"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <Settings />
              </Suspense>
            }
          />
          <Route
            path="help&support"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <HelpAndSuport />
              </Suspense>
            }
          />
          <Route
            path="family-details"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <FamilyDetails />
              </Suspense>
            }
          />
          <Route
            path="partner-preference"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <PartnerPreference />
              </Suspense>
            }
          />
          <Route
            path="add-photos"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <AddPhotos />
              </Suspense>
            }
          />
          <Route
            path="events"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <Event />
              </Suspense>
            }
          />
          <Route
            path="astro"
            element={
              <Suspense
                fallback={
                  <div>
                    <Lodder />
                  </div>
                }
              >
                <AstroPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default MetrimoniulRoutes;
