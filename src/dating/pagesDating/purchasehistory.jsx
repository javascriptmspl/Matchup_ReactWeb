
import React, { useState, useEffect } from 'react';
import HeaderFour from "../../component/layout/HeaderFour";
import FooterFour from "../../component/layout/footerFour";
import { getPaymentHistory } from '../../service/MANAGE_API/paymentService';
import { getUserCoins } from '../../service/MANAGE_API/gift-API';
import toast from 'react-hot-toast';
import { FaCoins } from "react-icons/fa";

const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coinBalance, setCoinBalance] = useState(0);

  useEffect(() => {
    fetchPurchaseHistory();
    fetchCurrentCoinBalance();
  }, []);

  const fetchPurchaseHistory = async () => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const userId = userData?.data?._id;
      if (!userId) return toast.error("Please login to view purchase history");

      const response = await getPaymentHistory(userId);
      if (response.isSuccess && response.data) {
        const payments = (response.data.payments || []).filter(
          (p) => ["succeeded", "active"].includes((p.paymentStatus || "").toLowerCase())
        );
        setPurchases(payments);
      } else {
        setPurchases([]);
      }
    } catch (err) {
      toast.error("Failed to load purchase history");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentCoinBalance = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const userId = userData?.data?._id;
      if (!userId) return;

      const res = await getUserCoins(userId);
      if (res.isSuccess && res.data?.coins != null) {
        setCoinBalance(res.data.coins);
      } else {
        setCoinBalance(0);
      }
    } catch (error) {
      console.error("Error fetching current coins:", error);
    }
  };

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      : 'N/A';

  return (
    <div className="purchase-history-page">
      <HeaderFour />
      <section className="container py-5">
        <div className="text-center mb-5 fade-in">
          <h1 className="fw-bold" style={{ color: '#ff5f7d' }}>Purchase History</h1>
          <p className="text-muted">Your successfully completed transactions</p>
        </div>

        {/* ✅ Animated Balance Card */}
        <div className="balance-card mb-5 shimmer">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div>
              <h5 className="fw-semibold mb-1 text-white">Current Coin Balance</h5>
              <p className="text-light opacity-75 mb-0">Your remaining available coins</p>
            </div>
            <div className="balance-display d-flex align-items-center">
              <FaCoins size={26} color="#FFD700" className="me-2 coin-spin" />
              <span className="balance-coins">{coinBalance} Coins</span>
            </div>
          </div>
        </div>

        {/* ✅ Purchase Cards */}
        {loading ? (
          <div className="text-center py-5 fade-in">
            <div className="spinner-border" style={{ color: '#ff5f7d' }}></div>
            <p className="text-muted mt-3">Loading purchases...</p>
          </div>
        ) : purchases.length === 0 ? (
          <div className="no-data text-center p-5 rounded fade-in">
            <i className="fa fa-shopping-cart mb-3" style={{ fontSize: 60, color: "#ccc" }}></i>
            <h5>No Successful Purchases Yet</h5>
            <p className="text-muted mb-4">You don’t have any completed transactions yet.</p>
            <a href="/dating/membership" className="btn btn-theme">Explore Plans</a>
          </div>
        ) : (
          <div className="row g-4 fade-up">
            {purchases.map((purchase, index) => (
              <div className="col-md-6 col-lg-4" key={index}>
                <div className="purchase-card">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="fw-bold text-dark mb-0">{purchase.subscriptionPlan}</h5>
                    <span className="badge status-success">Succeeded</span>
                  </div>
                  <ul className="list-unstyled text-muted small mb-0">
                    <li><strong>Amount:</strong> ${purchase.amount?.toFixed(2)}</li>
                    <li className="d-flex align-items-center">
                      <strong>Coins:&nbsp;</strong>
                      <FaCoins size={15} color="#FFD700" className="me-1 coin-bounce" />
                      {purchase.coinsAwarded}
                    </li>
                    <li><strong>Valid Till:</strong> {formatDate(purchase.subscriptionEndDate)}</li>
                  </ul>
                  <div className="shine"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <FooterFour />

      {/* ✅ Enhanced Styling */}
      <style jsx>{`
        .balance-card {
          background: linear-gradient(135deg, #ff5f7d 0%, #ff7e9a 100%);
          border-radius: 16px;
          padding: 25px 30px;
          color: #fff;
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(255, 95, 125, 0.35);
          animation: floatCard 3s ease-in-out infinite;
        }

        @keyframes floatCard {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        .balance-coins {
          background: #fff;
          color: #ff5f7d;
          padding: 8px 18px;
          border-radius: 25px;
          font-weight: bold;
          min-width: 100px;
          text-align: center;
        }

        .coin-spin {
          animation: spinCoin 3s linear infinite;
        }

        @keyframes spinCoin {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }

        .coin-bounce {
          animation: bounceCoin 2.5s ease-in-out infinite;
        }

        @keyframes bounceCoin {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        .purchase-card {
          background: #fff;
          border-radius: 14px;
          padding: 22px;
          border: 1px solid #f1f1f1;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }

        .purchase-card:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 10px 25px rgba(255, 95, 125, 0.3);
          border-color: #ff5f7d;
        }

        .shine {
          position: absolute;
          top: 0;
          left: -75%;
          width: 50%;
          height: 100%;
          background: linear-gradient(120deg, rgba(255,255,255,0.1), rgba(255,255,255,0.4), rgba(255,255,255,0.1));
          transform: skewX(-25deg);
          transition: all 0.7s ease;
        }

        .purchase-card:hover .shine {
          left: 125%;
        }

        .status-success {
          background-color: #d1f7e1;
          color: #198754;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.8rem;
        }

        .btn-theme {
          background: #ff5f7d;
          color: #fff;
          border-radius: 10px;
          padding: 10px 22px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .btn-theme:hover {
          background: #ff466c;
          transform: translateY(-2px);
        }

        .fade-in {
          animation: fadeIn 0.8s ease-in;
        }

        .fade-up {
          animation: fadeUp 1s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .shimmer::before {
          content: '';
          position: absolute;
          top: 0;
          left: -150%;
          width: 100%;
          height: 100%;
          background: linear-gradient(120deg, rgba(255,255,255,0.2), rgba(255,255,255,0.5), rgba(255,255,255,0.2));
          animation: shimmerMove 3s infinite;
        }

        @keyframes shimmerMove {
          0% { left: -150%; }
          100% { left: 150%; }
        }

        .no-data {
          background: #fff;
          border: 1px solid #f0f0f0;
          box-shadow: 0 6px 15px rgba(0,0,0,0.05);
        }
      `}</style>
    </div>
  );
};

export default PurchaseHistory;
