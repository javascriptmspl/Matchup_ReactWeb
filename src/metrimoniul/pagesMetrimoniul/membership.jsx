import { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import FooterFour from "../component/layout/footerFour";
import HeaderFour from "../component/layout/HeaderFour";
import StripePaymentModal from "../component/payment/StripePaymentModal";
import toast from "react-hot-toast";

const title = "Membership Levels";
const subtitle =
  "Our metrimony platform is like a breath of fresh air. Clean and trendy design with ready to use features we are sure you will love.";

let MembershipList = [
  {
    daycount: "Silver",
    perMonth: "$15.00 Now And Then $30.00 Per Month.",
    price: "$20.00",
    btnText: "Select Plan",
    faciList: [
      {
        iconName: "fa-solid fa-circle-check",
        text: "View Members Directory",
      },
      {
        iconName: "fa-solid fa-circle-check",
        text: "View Members Profile",
      },
      {
        iconName: "fa-solid fa-circle-check",
        text: "Send Private Messages",
      },
      {
        iconName: "fa-solid fa-circle-xmark",
        text: "Add Media To Your Profile",
      },
    ],
  },
  {
    daycount: "Gold",
    perMonth: "$15.00 Now And Then $30.00 Per Month.",
    price: "$30.00",
    btnText: "Select Plan",
    faciList: [
      {
        iconName: "fa-solid fa-circle-check",
        text: "View Members Directory",
      },
      {
        iconName: "fa-solid fa-circle-check",
        text: "View Members Profile",
      },
      {
        iconName: "fa-solid fa-circle-check",
        text: "Send Private Messages",
      },
      {
        iconName: "fa-solid fa-circle-check",
        text: "Add Media To Your Profile",
      },
    ],
  },
];

let coinsPlan = [
  {
    daycount: "Choose you best coin plan",
    perMonth: "Elevate connections with our premier Best Coin Plan!",
    price: "Free",
    btnText: "Select Plan",
    faciList: [
      {
        iconName: "fa-solid fa-circle-check",
        text: "5 coins $8.99",
        offer: "save 45%",
      },
      {
        iconName: "fa-solid fa-circle-check",
        text: "30 coins $37.99",
        offer: "best value",
      },
      {
        iconName: "fa-solid fa-circle-check",
        text: "15 coins $22.99",
        offer: "save 48%",
      },
      {
        iconName: "fa-solid fa-circle-check",
        text: "2 coins $2.99",
        offer: "small plan",
      },
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
    // Get userId from localStorage, Redux store, or wherever you store user data
    // This is a placeholder - adjust according to your auth implementation
    const userId = JSON.parse(localStorage.getItem("userData"))?.data?._id;
    this.setState({ userId });
    console.log("Metrimonial Membership Page Loaded - User ID:", userId);
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
    
    console.log("Subscription clicked:", planName);
    console.log("User ID:", userId);
    
    if (!userId) {
      toast.error("Please login to subscribe");
      return;
    }

    console.log("Opening payment modal for:", planName.toLowerCase());
    
    this.setState({
      isPaymentModalOpen: true,
      selectedPlan: planName.toLowerCase(),
    }, () => {
      console.log("Modal state updated:", this.state.isPaymentModalOpen);
      console.log("Selected plan:", this.state.selectedPlan);
    });
  };

  handlePaymentModalClose = (success, confirmationData) => {
    console.log("Payment modal closing - Success:", success);
    console.log("Confirmation data:", confirmationData);
    
    this.setState({ isPaymentModalOpen: false, selectedPlan: null });
    
    if (success && confirmationData) {
      const { payment, coinsAwarded, newBalance } = confirmationData;
      
      // Show detailed success message
      toast.success(
        `🎉 Welcome to ${payment.subscriptionPlan.toUpperCase()} plan!\n` +
        `💰 ${coinsAwarded} coins added to your account\n` +
        `📊 New balance: ${newBalance} coins\n` +
        `📅 Valid until: ${new Date(payment.subscriptionEndDate).toLocaleDateString()}`,
        { duration: 8000 }
      );
      
      // You can add additional logic here like:
      // - Redirect to profile page
      // - Update user subscription in Redux/Context
      // - Refresh user data
      // - Show a welcome modal with subscription details
      
      console.log("Subscription Details:", {
        plan: payment.subscriptionPlan,
        amount: payment.amount,
        coinsAwarded,
        newBalance,
        startDate: payment.subscriptionStartDate,
        endDate: payment.subscriptionEndDate
      });
    } else if (success) {
      toast.success("Payment successful! Your subscription has been activated.");
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
  <div className="container" style={{maxWidth:'1358px'}}>
    <div className="section__header style-2 text-center">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
    <div className="section__wrapper">
              <div className="row g-4 justify-content-center row-cols-xl-4 row-cols-lg-3 row-cols-sm-2 row-cols-1">
                {coinsPlan.map((val, i) => (
                  <div
                    className={`col ${
                      selectedCoinPlan === i ? "selected-coin-plan" : ""
                    }`}
                    key={i}
                    //    style={{ width: '35%' }}
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
                            {val.faciList.map((val, i) => (
                              <li key={i} className="pointer" style={{paddingTop:'21px',paddingBottom:'21px'}}>
                                <i className={val.iconName} ></i>
                                <span className="px-2">{val.text}</span>
                                <span className="px-2">{val.offer}</span>
                                <img
                                  src="https://png.pngtree.com/png-clipart/20220823/original/pngtree-flying-gold-coin-png-png-image_8447452.png"
                                  alt=""
                                  style={{ width: "90px", height: "45px" }}
                                />
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="membership__footer">
                          <button 
                            type="button"
                            className="default-btn reverse" 
                            style={{ border: 'none', width: '100%', cursor: 'pointer' }}
                            onClick={() => toast.info("Coin plans coming soon!")}
                          >
                            <span>{val.btnText}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
                            {val.faciList.map((val, i) => (
                              <li key={i}>
                                <i className={val.iconName}></i>{" "}
                                <span>{val.text}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="membership__footer">
                          <button 
                            type="button"
                            className="default-btn reverse" 
                            style={{ border: 'none', width: '100%', cursor: 'pointer' }}
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

<div className="purchase_history_wrap">
  
</div>

</div>

        <FooterFour />
      </Fragment>
    );
  }
}

export default MembershipPage;
