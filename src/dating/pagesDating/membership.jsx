import { Component, Fragment } from "react";
import FooterFour from "../../component/layout/footerFour";
import HeaderFour from "../../component/layout/HeaderFour";
import StripePaymentModal from "../../dating/component/payment/StripePaymentModal";
import toast from "react-hot-toast";

const title = "Membership Levels";
const subtitle =
  "Our dating platform is like a breath of fresh air. Clean and trendy design with ready-to-use features we are sure you will love.";

let MembershipList = [
  {
    daycount: "Silver",
    perMonth: "$15.00 Now And Then $30.00 Per Month.",
    price: "$20.00",
    btnText: "Select Plan",
    faciList: [
      { iconName: "fa-solid fa-circle-check", text: "View Members Directory" },
      { iconName: "fa-solid fa-circle-check", text: "View Members Profile" },
      { iconName: "fa-solid fa-circle-check", text: "Send Private Messages" },
      { iconName: "fa-solid fa-circle-xmark", text: "Add Media To Your Profile" },
    ],
  },
  {
    daycount: "Gold",
    perMonth: "$15.00 Now And Then $30.00 Per Month.",
    price: "$30.00",
    btnText: "Select Plan",
    faciList: [
      { iconName: "fa-solid fa-circle-check", text: "View Members Directory" },
      { iconName: "fa-solid fa-circle-check", text: "View Members Profile" },
      { iconName: "fa-solid fa-circle-check", text: "Send Private Messages" },
      { iconName: "fa-solid fa-circle-check", text: "Add Media To Your Profile" },
    ],
  },
];

let coinsPlan = [
  {
    daycount: "Choose your best coin plan",
    perMonth: "Elevate connections with our premier Best Coin Plan!",
    price: "Free",
    btnText: "Select Plan",
    faciList: [
      { iconName: "fa-solid fa-circle-check", text: "5 coins $8.99", offer: "save 45%" },
      { iconName: "fa-solid fa-circle-check", text: "30 coins $37.99", offer: "best value" },
      { iconName: "fa-solid fa-circle-check", text: "15 coins $22.99", offer: "save 48%" },
      { iconName: "fa-solid fa-circle-check", text: "2 coins $2.99", offer: "small plan" },
    ],
  },
];

class MembershipPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCoinPlan: null,
      isPaymentModalOpen: false,
      selectedPlan: null,
      userId: null,
    };
  }

  componentDidMount() {
    const userId = JSON.parse(localStorage.getItem("userData"))?.data?._id;
    this.setState({ userId });
  }

  handleSelectPlan = (index) => {
    this.setState({ selectedCoinPlan: index });
  };

  handleSubscriptionClick = (planName, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const { userId } = this.state;
    if (!userId) {
      toast.error("Please login to subscribe", { duration: 2000, position: "top-center" });
      return;
    }

    this.setState({
      isPaymentModalOpen: true,
      selectedPlan: planName.toLowerCase(),
    });
  };

  handlePaymentModalClose = (success, confirmationData) => {
    this.setState({ isPaymentModalOpen: false, selectedPlan: null });

    if (success) {
      toast.success("Payment Successful!", {
        duration: 2000,
        position: "top-center",
        style: {
          background: "#4BB543",
          color: "#fff",
          fontSize: "16px",
          padding: "12px 20px",
          borderRadius: "8px",
          textAlign: "center",
        },
      });
    }
  };

  render() {
    const { selectedCoinPlan, isPaymentModalOpen, selectedPlan, userId } = this.state;
    return (
      <Fragment>
        <HeaderFour />

        <StripePaymentModal
          isOpen={isPaymentModalOpen}
          onClose={this.handlePaymentModalClose}
          subscriptionPlan={selectedPlan}
          userId={userId}
        />

        <div className="membership padding-top padding-bottom">
          <div className="container" style={{ maxWidth: "1200px" }}>
            <div className="section__header style-2 text-center">
              <h2>{title}</h2>
              <p>{subtitle}</p>
            </div>

            <div className="section__wrapper">
              <div className="row g-4 justify-content-center row-cols-xl-3 row-cols-lg-3 row-cols-sm-2 row-cols-1">
                {/* Coin Plans */}
                {coinsPlan.map((val, i) => (
                  <div
                    className={`col ${selectedCoinPlan === i ? "selected-coin-plan" : ""}`}
                    key={i}
                    onClick={() => this.handleSelectPlan(i)}
                  >
                    <div className="membership__item">
                      <div className="membership__inner">
                        <div className="membership__head">
                          <h4>{val.daycount}</h4>
                          <p>{val.perMonth}</p>
                        </div>
                        <div className="membership__body">
                          <ul>
                            {val.faciList.map((item, j) => (
                              <li key={j} className="pointer" style={{ padding: "20px 0px" }}>
                                <i className={item.iconName}></i>
                                <span className="px-2">{item.text}</span>
                                <span className="px-2">{item.offer}</span>
                                <img
                                  src="https://png.pngtree.com/png-clipart/20220823/original/pngtree-flying-gold-coin-png-png-image_8447452.png"
                                  alt=""
                                  style={{ width: "40px", height: "40px" }}
                                />
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="membership__footer">
                          <button
                            type="button"
                            className="default-btn reverse"
                            style={{ border: "none", width: "100%", cursor: "pointer" }}
                            onClick={() =>
                              toast.info("Coin plans coming soon!", {
                                duration: 1500,
                                position: "top-center",
                              })
                            }
                          >
                            <span>{val.btnText}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Membership Plans */}
                {MembershipList.map((val, i) => (
                  <div className="col" key={i}>
                    <div className="membership__item">
                      <div className="membership__inner">
                        <div className="membership__head">
                          <h4>{val.daycount}</h4>
                          <p>{val.perMonth}</p>
                        </div>
                        <div className="membership__body">
                          <h4>{val.price}</h4>
                          <ul>
                            {val.faciList.map((item, j) => (
                              <li key={j}>
                                <i className={item.iconName}></i> <span>{item.text}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="membership__footer">
                          <button
                            type="button"
                            className="default-btn reverse"
                            style={{ border: "none", width: "100%", cursor: "pointer" }}
                            onClick={(e) => this.handleSubscriptionClick(val.daycount, e)}
                          >
                            <span>{val.btnText}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <FooterFour />
      </Fragment>
    );
  }
}

export default MembershipPage;
