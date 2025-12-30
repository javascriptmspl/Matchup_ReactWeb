import { Component, Fragment } from "react";
import FooterFour from "../../component/layout/footerFour";
import HeaderFour from "../../component/layout/HeaderFour";
// import HeaderTwo from "../component/layout/headertwo";
import PageHeader from "../component/layout/pageheader";

class Quickstartguide extends Component {
  render() {
    return (
      <Fragment>
        <HeaderFour />
        {/* <PageHeader
          title={"Privacy & Policy"} curPage={"Policy"}
        /> */}
        <section className="terms-section padding-bottom padding-top">
          <div className="container">
            <div className="terms-content">
              <div className="terms-header">
                <h4> Quick Start Guide</h4>
                <p>
                  <span className="theme-color fw-bold"></span> Welcome to
                  Matchup!
                </p>
              </div>
              <div className="terms-text">
                <p className="mb-4">
                  Congratulations on joining Matchup! We're thrilled to have you
                  as a part of our vibrant community where meaningful
                  connections begin. This Quick Start Guide will help you
                  navigate and make the most out of your experience.
                </p>
                <ol>
                  <li>
                    <h5>Create Your Profile</h5>
                    <p>
                      Begin by creating a captivating profile. Upload a clear
                      and attractive profile picture to make a great first
                      impression. Share a bit about yourself, your interests,
                      and what you're looking for in a potential match. Don't
                      forget to complete the profile verification process for an
                      added layer of authenticity.
                    </p>
                  </li>
                  <li>
                    <h5>Set Your Preferences</h5>
                    <p>
                      Navigate to your settings to customize your dating
                      preferences. Specify your preferred age range, location,
                      and other important criteria to enhance your matching
                      experience.
                    </p>
                  </li>
                  <li>
                    <h5>Explore Matches</h5>
                    <p>
                      Discover potential matches by exploring the "Matches"
                      section. Our advanced matching algorithm suggests profiles
                      based on compatibility and shared interests.
                    </p>
                  </li>
                  <li>
                    <h5>Initiate Conversations</h5>
                    <p>
                      When you find someone intriguing, don't hesitate to
                      initiate a conversation. Send a thoughtful message to
                      break the ice and start getting to know each other.
                    </p>
                  </li>
                  <li>
                    <h5>Safety First</h5>
                    <p>
                      Prioritize your safety. Be cautious about sharing personal
                      information and report any suspicious behavior. Use our
                      in-app blocking and reporting features to maintain a
                      secure environment.
                    </p>
                  </li>
                  <li>
                    <h5>Stay Engaged</h5>
                    <p>
                      Keep the conversation flowing and engage with others
                      regularly. Respond to messages, update your profile, and
                      explore new matches to maximize your chances of finding a
                      meaningful connection.
                    </p>
                  </li>
                  <li>
                    <h5> Privacy Controls</h5>
                    <p>
                      Customize your privacy settings to control who can see
                      your profile and interact with you. Your privacy is
                      important to us, and we provide tools to help you manage
                      it effectively.
                    </p>
                  </li>
                  <li>
                    <h5>Attend Events</h5>
                    <p>
                      Participate in virtual or local events hosted on our
                      platform. Events are a fantastic way to meet new people,
                      share experiences, and expand your social circle.
                    </p>
                  </li>
                  <li>
                    <h5>Get Support</h5>
                    <p>
                      If you have any questions or encounter issues, our support
                      team is here to help. Reach out through the app or check
                      our FAQs for quick assistance.
                    </p>
                  </li>
                  <li>
                    <h5>Have Fun and Be Yourself</h5>
                    <p>
                      Most importantly, have fun! Be yourself, enjoy the
                      journey, and open yourself up to the possibilities of
                      finding genuine connections.
                    </p>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>
        <FooterFour />
      </Fragment>
    );
  }
}

export default Quickstartguide;
