// HomePage.js
import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import AboutSection from "../component/section/about";
import AppSection from "../component/section/appsection";
import BannerOne from "../component/section/banner";
import MeetSection from "../component/section/meet";
import MemberSection from "../component/section/member";
import StorySection from "../component/section/story";
import WorkSection from "../component/section/work";
import WorkSectionTwo from "../component/section/worktwo";

import FooterFour from "../component/layout/footerFour";
import NotificationPage from "../component/popUps/notification";
import HeaderFourWithNotifications from "../component/layout/HeaderFourWithNotifications";

const HomePage = () => {
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowNotifications(true);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <Fragment>
      <HeaderFourWithNotifications />
      <BannerOne />
      {/* <StorySection /> */}
      {/* <MemberSection /> */}
      <AboutSection />
      <WorkSection />
      {/* <MeetSection /> */}
      <WorkSectionTwo />
      <AppSection />
      {/* {showNotifications && <NotificationPage />} */}
      <FooterFour />
    </Fragment>
  );
};

export default HomePage;
