import React, { useState, useEffect } from 'react';
import HeaderFour from "../component/layout/HeaderFour";
import FooterFour from "../component/layout/footerFour";
import { getPaymentHistory } from '../../service/MANAGE_API/paymentService';
import { getUserCoins } from '../../service/MANAGE_API/gift-API';
import toast from 'react-hot-toast';
import { FaCoins } from "react-icons/fa";

const PAGE_SIZE = 15; 

const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    pageSize: PAGE_SIZE
  });
  const [userInfo, setUserInfo] = useState(null);
  const [coinBalance, setCoinBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(false);

  useEffect(() => {
    fetchPurchaseHistory(1);

    const handleCoinBalanceUpdate = (event) => {
      const { newBalance } = event.detail || {};
      if (typeof newBalance === 'number') {
        setCoinBalance(newBalance);
      }
    };

    window.addEventListener('coinBalanceUpdated', handleCoinBalanceUpdate);
    return () => window.removeEventListener('coinBalanceUpdated', handleCoinBalanceUpdate);
  
  }, []);

  const fetchCurrentCoinBalance = async () => {
    setLoadingBalance(true);
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const userId = userData?.data?._id;
      if (!userId) return;
      const response = await getUserCoins(userId);
      if (response.isSuccess) {
        const coins = response.data?.coins ?? response.data?.balance ?? 0;
        setCoinBalance(coins);
      } else {
      
        calculateBalanceFromPurchases();
      }
    } catch {
      calculateBalanceFromPurchases();
    } finally {
      setLoadingBalance(false);
    }
  };

  const calculateBalanceFromPurchases = () => {
    const totalCoins = purchases.reduce((sum, purchase) => {
      const status = (purchase.paymentStatus || '').toLowerCase();
      const credited = status === 'succeeded' || status === 'active';
      const coins = credited ? (purchase.coinsAwarded || 0) : 0;
      return sum + coins;
    }, 0);
    setCoinBalance(totalCoins);
  };

  const fetchPurchaseHistory = async (pageNo = 1) => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const userId = userData?.data?._id;

      if (!userId) {
        toast.error("Please login to view purchase history", { duration: 2000, position: "top-center" });
        setLoading(false);
        return;
      }

      const response = await getPaymentHistory(userId, pageNo, PAGE_SIZE);
      if (response.isSuccess && response.data) {
        const payments = (response.data.payments || []).filter(
          (p) => ["succeeded", "active"].includes((p.paymentStatus || "").toLowerCase())
        );
        setPurchases(payments);

        if (payments.length > 0 && payments[0].userId) {
          setUserInfo(payments[0].userId);
        }

        setPagination({
          currentPage: response.data.page || pageNo || 1,
          totalPages: response.data.pages || 1,
          total: response.data.total || (payments.length),
          pageSize: PAGE_SIZE
        });

        calculateBalanceFromPurchases();
        setTimeout(fetchCurrentCoinBalance, 400);
      } else {
        setPurchases([]);
        setPagination(prev => ({ ...prev, totalPages: 1, total: 0, currentPage: 1 }));
      }
    } catch {
      toast.error("Failed to load purchase history", { duration: 2000, position: "top-center" });
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    if (!status) return '';
    const s = status.toLowerCase();
    if (s === 'succeeded' || s === 'active') return 'status-success';
    if (s === 'pending') return 'status-pending';
    if (s === 'failed' || s === 'expired') return 'status-failed';
    return '';
  };

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchPurchaseHistory(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="purchase-history-page">
      <HeaderFour />
      <section className="container py-5">
        <div className="text-center mb-4 fade-in">
          <h1 className="fw-bold" style={{ color: '#ff5f7d' }}>Purchase History</h1>
          <p className="text-muted">Your successfully completed transactions</p>
        </div>

        <div className="balance-card mb-5 shimmer">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div>
              <h5 className="fw-semibold mb-1 text-white">Current Coin Balance</h5>
              <p className="text-light opacity-75 mb-0">Your remaining available coins</p>
            </div>
            <div className="balance-display d-flex align-items-center">
              <FaCoins size={26} color="#FFD700" className="me-2 coin-spin" />
              <span className="balance-coins">{loadingBalance ? 'Loading...' : `${coinBalance} Coins`}</span>
            </div>
          </div>
        </div>

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
            <a href="/metrimonial/membership" className="btn btn-theme">Explore Plans</a>
          </div>
        ) : (
          <>
            <div className="row g-4 fade-up">
              {purchases.map((purchase, idx) => (
                <div className="col-md-6 col-lg-4" key={purchase._id || idx}>
                  <div className="purchase-card">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="fw-bold text-dark mb-1" style={{ textTransform: 'capitalize' }}>
                          {purchase.subscriptionPlan || purchase.metadata?.planName || 'Plan'}
                        </h5>
                        <div className="muted small">{formatDate(purchase.createdAt)}</div>
                      </div>
                      <span className={`badge ${getStatusClass(purchase.paymentStatus)}`.replace('status-','')}>Succeeded</span>
                    </div>

                    <ul className="list-unstyled text-muted small mb-3">
                      <li><strong>Amount:</strong> <span style={{ color: '#28a745' }}>${(purchase.amount ?? 0).toFixed(2)}</span></li>
                      <li className="d-flex align-items-center">
                        <strong>Coins:&nbsp;</strong>
                        <FaCoins size={15} color="#FFD700" className="me-2 coin-bounce" />
                        <span style={{ fontWeight: 700 }}>{purchase.coinsAwarded || 0}</span>
                      </li>
                      <li><strong>Valid Till:</strong> {formatDate(purchase.subscriptionEndDate)}</li>
                    </ul>

                    <div className="card-footer d-flex justify-content-between align-items-center">
                      <div style={{ fontSize: 12, color: '#777' }}>{purchase.currency?.toUpperCase() || 'USD'}</div>
                      <div>
                        
                        <button className="btn btn-sm btn-theme" onClick={() => window.location.href = '/metrimonial/help&support'}>Help</button>
                      </div>
                    </div>

                    <div className="shine"></div>
                  </div>
                </div>
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="pagination-container" style={{ marginTop: 30, display: 'flex', justifyContent: 'center', gap: 10 }}>
                <button className="btn btn-outline-primary" onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={pagination.currentPage === 1}>
                  <i className="fa fa-chevron-left"></i> Previous
                </button>

                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {[...Array(pagination.totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    if (
                      pageNum === 1 ||
                      pageNum === pagination.totalPages ||
                      (pageNum >= pagination.currentPage - 1 && pageNum <= pagination.currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          className={`btn ${pageNum === pagination.currentPage ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => handlePageChange(pageNum)}
                          style={{ minWidth: 42 }}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      pageNum === pagination.currentPage - 2 ||
                      pageNum === pagination.currentPage + 2
                    ) {
                      return <span key={pageNum} style={{ padding: '8px 6px' }}>...</span>;
                    }
                    return null;
                  })}
                </div>

                <button className="btn btn-outline-primary" onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={pagination.currentPage === pagination.totalPages}>
                  Next <i className="fa fa-chevron-right"></i>
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <FooterFour />

      <style jsx>{`
        .balance-card {
          background: linear-gradient(135deg, #ff5f7d 0%, #ff7e9a 100%);
          border-radius: 16px;
          padding: 22px 26px;
          color: #fff;
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(255, 95, 125, 0.28);
          animation: floatCard 3s ease-in-out infinite;
        }

        @keyframes floatCard {
          0%,100%{ transform: translateY(0); }
          50%{ transform: translateY(-4px); }
        }

        .balance-coins {
          background: #fff;
          color: #ff5f7d;
          padding: 8px 16px;
          border-radius: 25px;
          font-weight: 700;
          min-width: 100px;
          text-align: center;
        }

        .coin-spin { animation: spinCoin 3s linear infinite; }
        @keyframes spinCoin { 0%{ transform: rotateY(0deg); } 100%{ transform: rotateY(360deg); } }

        .coin-bounce { animation: bounceCoin 2.5s ease-in-out infinite; }
        @keyframes bounceCoin { 0%,100%{ transform: translateY(0); } 50%{ transform: translateY(-3px); } }

        .purchase-card {
          background: #fff;
          border-radius: 14px;
          padding: 20px;
          border: 1px solid #f1f1f1;
          transition: all 0.35s ease;
          position: relative;
          overflow: hidden;
          min-height: 150px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .purchase-card:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 12px 30px rgba(255, 95, 125, 0.18);
          border-color: #ff5f7d;
        }

        .shine {
          position: absolute;
          top: 0;
          left: -75%;
          width: 52%;
          height: 100%;
          background: linear-gradient(120deg, rgba(255,255,255,0.08), rgba(255,255,255,0.32), rgba(255,255,255,0.08));
          transform: skewX(-25deg);
          transition: all 0.7s ease;
        }

        .purchase-card:hover .shine { left: 125%; }

        .badge {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 6px 10px;
          border-radius: 8px;
          display: inline-block;
        }

        .status-success { background-color: #d1f7e1; color: #198754; }
        .status-pending { background-color: #fff3cd; color: #856404; }
        .status-failed { background-color: #f8d7da; color: #842029; }

        .btn-theme {
          background: #ff5f7d;
          color: #fff;
          border-radius: 8px;
          padding: 6px 12px;
          font-weight: 600;
        }

        .btn-theme:hover { background: #ff466c; }

        .fade-in { animation: fadeIn 0.75s ease-in; }
        .fade-up { animation: fadeUp 0.9s ease; }

        @keyframes fadeIn { from{ opacity: 0; } to{ opacity: 1; } }
        @keyframes fadeUp { from{ opacity: 0; transform: translateY(12px); } to{ opacity: 1; transform: translateY(0); } }

        .card-footer { margin-top: 12px; display:flex; align-items:center; justify-content:space-between; gap:10px; }
      `}</style>
    </div>
  );
};

export default PurchaseHistory;
