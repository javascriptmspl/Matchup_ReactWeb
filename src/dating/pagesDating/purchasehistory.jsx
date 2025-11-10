// import React, { useState, useEffect } from 'react';
// import HeaderFour from "../../component/layout/HeaderFour";
// import FooterFour from "../../component/layout/footerFour";
// import { getPaymentHistory } from '../../service/MANAGE_API/paymentService';
// import { getUserCoins } from '../../service/MANAGE_API/gift-API';
// import toast from 'react-hot-toast';

// const PurchaseHistory = () => {
//   const [purchases, setPurchases] = useState([]);
//   const [expandedRow, setExpandedRow] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     total: 0,
//     pageSize: 10
//   });
//   const [userInfo, setUserInfo] = useState(null);
//   const [coinBalance, setCoinBalance] = useState(0);
//   const [loadingBalance, setLoadingBalance] = useState(false);

//   useEffect(() => {
//     fetchPurchaseHistory(1);
//     // Don't fetch coin balance immediately, let it be calculated from purchases
    
//     // Listen for coin balance updates from other components
//     const handleCoinBalanceUpdate = (event) => {
//       const { newBalance } = event.detail;
//       console.log('Received coin balance update:', newBalance);
//       setCoinBalance(newBalance);
//     };
    
//     window.addEventListener('coinBalanceUpdated', handleCoinBalanceUpdate);
    
//     return () => {
//       window.removeEventListener('coinBalanceUpdated', handleCoinBalanceUpdate);
//     };
//   }, []);

//   const fetchCurrentCoinBalance = async () => {
//     setLoadingBalance(true);
//     try {
//       const userData = JSON.parse(localStorage.getItem("userData"));
//       const userId = userData?.data?._id;

//       if (!userId) {
//         console.log("No user ID found for coin balance");
//         return;
//       }

//       console.log("Fetching coin balance for user:", userId);
//       const response = await getUserCoins(userId);
//       console.log("Coin balance API response:", response);
      
//       if (response.isSuccess) {
//         const coins = response.data?.coins || response.data?.balance || 0;
//         console.log("Setting coin balance to:", coins);
//         setCoinBalance(coins);
//       } else {
//         console.log("API returned unsuccessful response, trying fallback calculation");
//         // Fallback: calculate from purchase history
//         calculateBalanceFromPurchases();
//       }
//     } catch (error) {
//       console.error("Error fetching current coin balance:", error);
//       console.log("API failed, trying fallback calculation");
//       // Fallback: calculate from purchase history
//       calculateBalanceFromPurchases();
//     } finally {
//       setLoadingBalance(false);
//     }
//   };

//   const calculateBalanceFromPurchases = () => {
//     const totalCoins = purchases.reduce((sum, purchase) => {
//       const status = (purchase.paymentStatus || '').toLowerCase();
//       const credited = status === 'succeeded' || status === 'active';
//       const coins = credited ? (purchase.coinsAwarded || 0) : 0;
//       console.log(`Purchase ${purchase._id}: status=${status}, credited=${credited}, coins=${coins}`);
//       return sum + coins;
//     }, 0);
//     console.log("Calculated balance from purchases:", totalCoins);
//     setCoinBalance(totalCoins);
//   };

//   const fetchPurchaseHistory = async (pageNo = 1) => {
//     setLoading(true);
//     try {
//       const userData = JSON.parse(localStorage.getItem("userData"));
//       const userId = userData?.data?._id;

//       if (!userId) {
//         toast.error("Please login to view purchase history");
//         setLoading(false);
//         return;
//       }

//       const response = await getPaymentHistory(userId, pageNo, pagination.pageSize);

    

//       if (response.isSuccess && response.data) {
//         const payments = response.data.payments || [];
//         setPurchases(payments);
//         calculateBalanceFromPurchases();
//         setTimeout(() => {
//           fetchCurrentCoinBalance();
//         }, 500);
        
//         if (payments.length > 0 && payments[0].userId) {
//           setUserInfo(payments[0].userId);
//         }
        
//         setPagination({
//           currentPage: response.data.page || 1,
//           totalPages: response.data.pages || 1,
//           total: response.data.total || 0,
//           pageSize: pagination.pageSize
//         });
//       } else {
//         console.log("No purchase history found");
//         setPurchases([]);
//       }
//     } catch (error) {
//       console.error("Error fetching purchase history:", error);
//       toast.error("Failed to load purchase history");
//       setPurchases([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRowClick = (id) => {
//     setExpandedRow(expandedRow === id ? null : id);
//   };

//   const getStatusClass = (status) => {
//     if (!status) return '';
//     const statusLower = status.toLowerCase();
//     if (statusLower === 'succeeded' || statusLower === 'active') return 'active';
//     if (statusLower === 'pending') return 'pending';
//     if (statusLower === 'failed' || statusLower === 'expired') return 'expired';
//     return '';
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= pagination.totalPages) {
//       fetchPurchaseHistory(newPage);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   };

//   return (
//     <div>
//       <HeaderFour />
//       <div className="main_h1 text-center" style={{ paddingTop: '100px', paddingBottom: '30px' }}>
//         <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#333' }}>Purchase History</h1>
//         {userInfo && (
//           <p style={{ fontSize: '16px', color: '#666', marginTop: '10px' }}>
//             <strong>{userInfo.name}</strong> ({userInfo.email})
//           </p>
//         )}
//       </div>
//       <div className="purchase-history container" style={{ paddingBottom: '50px' }}>
//         <div className="summary" style={{
//           backgroundColor: '#f8f9fa',
//           padding: '20px',
//           borderRadius: '10px',
//           marginBottom: '30px'
//         }}>
//           <p style={{ margin: 0, fontSize: '16px', color: '#666', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
//             Welcome back! Here is a detailed history of your subscriptions and purchases. 
//             You can review your past transactions, check their statuses, and more.
//             <span style={{ fontWeight: '400', margin: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
//               Current Balance: <span style={{
//                 backgroundColor: '#ffc107',
//                 color: 'white',
//                 padding: '6px 12px',
//                 borderRadius: '20px',
//                 fontSize: '14px',
//                 fontWeight: 'bold'
//               }}>
//                 {loadingBalance ? (
//                   <i className="fa fa-spinner fa-spin"></i>
//                 ) : (
//                   `${coinBalance} coins`
//                 )}
//               </span>
//               <button 
//                 className="btn btn-sm btn-outline-primary"
//                 onClick={() => {
//                   calculateBalanceFromPurchases();
//                   fetchCurrentCoinBalance();
//                 }}
//                 disabled={loadingBalance}
//                 style={{ fontSize: '10px', padding: '2px 6px' }}
//                 title="Refresh balance"
//               >
//                 <i className={`fa ${loadingBalance ? 'fa-spinner fa-spin' : 'fa-refresh'}`}></i>
//               </button>
//             </span>
         
//           </p>
//         </div>

//         {loading ? (
//           <div style={{ textAlign: 'center', padding: '50px 0' }}>
//             <div className="spinner-border text-primary" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </div>
//             <p style={{ marginTop: '20px', color: '#666' }}>Loading purchase history...</p>
//           </div>
//         ) : purchases.length === 0 ? (
//           <div style={{
//             textAlign: 'center',
//             padding: '60px 20px',
//             backgroundColor: '#f8f9fa',
//             borderRadius: '10px'
//           }}>
//             <i className="fa fa-shopping-cart" style={{ fontSize: '64px', color: '#ddd', marginBottom: '20px' }}></i>
//             <h3 style={{ color: '#666', marginBottom: '10px' }}>No Purchase History</h3>
//             <p style={{ color: '#999' }}>You haven't made any purchases yet.</p>
//             <a href="/dating/membership" className="btn btn-primary" style={{ marginTop: '20px' }}>
//               View Subscription Plans
//             </a>
//           </div>
//         ) : (
//           <>
//             <div className="table-container" style={{ overflowX: 'auto' }}>
//               <table style={{
//                 width: '100%',
//                 borderCollapse: 'collapse',
//                 backgroundColor: 'white',
//                 boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//                 borderRadius: '10px',
//                 overflow: 'hidden'
//               }}>
//                 <thead style={{ backgroundColor: '#007bff', color: 'white' }}>
//                   <tr>
//                     <th style={{ padding: '15px', textAlign: 'left' }}>Plan</th>
//                     <th style={{ padding: '15px', textAlign: 'left' }}>Date</th>
//                     <th style={{ padding: '15px', textAlign: 'left' }}>Amount</th>
//                     <th style={{ padding: '15px', textAlign: 'left' }}>Coins</th>
//                     <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
//                     <th style={{ padding: '15px', textAlign: 'left' }}>Valid Until</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {purchases.map((purchase, index) => (
//                     <React.Fragment key={purchase._id || index}>
//                       <tr
//                         onClick={() => handleRowClick(purchase._id || index)}
//                         style={{
//                           cursor: 'pointer',
//                           borderBottom: '1px solid #eee',
//                           transition: 'background-color 0.2s'
//                         }}
//                         onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
//                         onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
//                       >
//                         <td style={{ padding: '15px', textTransform: 'capitalize', fontWeight: '600' }}>
//                           {purchase.subscriptionPlan || purchase.metadata?.planName || 'N/A'}
//                         </td>
//                         <td style={{ padding: '15px' }}>{formatDate(purchase.createdAt)}</td>
//                         <td style={{ padding: '15px', fontWeight: 'bold', color: '#28a745' }}>
//                           ${purchase.amount?.toFixed(2) || '0.00'}
//                         </td>
//                         <td style={{ padding: '15px' }}>
//                           <span style={{
//                             backgroundColor: '#ffc107',
//                             color: 'white',
//                             padding: '4px 12px',
//                             borderRadius: '20px',
//                             fontSize: '14px',
//                             fontWeight: 'bold'
//                           }}>
//                             {purchase.coinsAwarded || 0} coins
//                           </span>
//                         </td>
//                         <td style={{ padding: '15px' }}>
//                           <span className={`status ${getStatusClass(purchase.paymentStatus)}`} style={{
//                             padding: '6px 12px',
//                             borderRadius: '20px',
//                             fontSize: '13px',
//                             fontWeight: '600',
//                             textTransform: 'capitalize',
//                             display: 'inline-block',
//                             color:'black',
//                           }}>
//                             {purchase.paymentStatus || 'N/A'}
//                           </span>
//                         </td>
//                         <td style={{ padding: '15px' }}>
//                           {formatDate(purchase.subscriptionEndDate) || 'N/A'}
//                         </td>
//                       </tr>
//                       {expandedRow === (purchase._id || index) && (
//                         <tr style={{ backgroundColor: '#f8f9fa' }}>
//                           <td colSpan="6" style={{ padding: '20px' }}>
//                             <div style={{
//                               backgroundColor: 'white',
//                               padding: '20px',
//                               borderRadius: '8px',
//                               boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
//                             }}>
//                               <h5 style={{ marginBottom: '15px', color: '#333' }}>Transaction Details</h5>
//                               {purchase.userId && (
//                                 <div style={{ 
//                                   backgroundColor: '#f8f9fa', 
//                                   padding: '15px', 
//                                   borderRadius: '6px', 
//                                   marginBottom: '15px' 
//                                 }}>
//                                   <p style={{ marginBottom: '5px' }}><strong>User:</strong> {purchase.userId.name || 'N/A'}</p>
//                                   <p style={{ marginBottom: '5px' }}><strong>Email:</strong> {purchase.userId.email || 'N/A'}</p>
//                                   <p style={{ marginBottom: '0' }}><strong>Username:</strong> {purchase.userId.userName || 'N/A'}</p>
//                                 </div>
//                               )}
//                               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
//                                 <p><strong>Plan:</strong> <span style={{ textTransform: 'capitalize', color: '#007bff', fontWeight: '600' }}>{purchase.subscriptionPlan || 'N/A'}</span></p>
//                                 <p><strong>Amount:</strong> <span style={{ color: '#28a745', fontWeight: 'bold' }}>${purchase.amount?.toFixed(2) || '0.00'}</span> {purchase.currency?.toUpperCase() || 'USD'}</p>
//                                 <p><strong>Coins Awarded:</strong> <span style={{ color: '#ffc107', fontWeight: 'bold' }}>{purchase.coinsAwarded || 0} coins</span></p>
//                                 <p><strong>Status:</strong> <span className={`status ${getStatusClass(purchase.paymentStatus)}`} style={{ textTransform: 'capitalize' }}>{purchase.paymentStatus}</span></p>
//                                 <p><strong>Transaction ID:</strong> <span style={{ fontFamily: 'monospace', fontSize: '13px' }}>{purchase.stripePaymentIntentId || 'N/A'}</span></p>
//                                 <p><strong>Customer ID:</strong> <span style={{ fontFamily: 'monospace', fontSize: '13px' }}>{purchase.stripeCustomerId || 'N/A'}</span></p>
//                                 <p><strong>Purchase Date:</strong> {formatDate(purchase.createdAt)}</p>
//                                 <p><strong>Start Date:</strong> {formatDate(purchase.subscriptionStartDate) || 'N/A'}</p>
//                                 <p><strong>End Date:</strong> {formatDate(purchase.subscriptionEndDate) || 'N/A'}</p>
//                                 {purchase.metadata?.planName && (
//                                   <p><strong>Plan Name:</strong> {purchase.metadata.planName}</p>
//                                 )}
//                               </div>
//                             </div>
//                           </td>
//                         </tr>
//                       )}
//                     </React.Fragment>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination Controls */}
//             {pagination.totalPages > 1 && (
//               <div className="pagination-container" style={{ 
//                 display: 'flex', 
//                 justifyContent: 'center', 
//                 alignItems: 'center',
//                 marginTop: '30px',
//                 gap: '10px'
//               }}>
//                 <button
//                   className="btn btn-outline-primary"
//                   onClick={() => handlePageChange(pagination.currentPage - 1)}
//                   disabled={pagination.currentPage === 1}
//                   style={{ minWidth: '100px' }}
//                 >
//                   <i className="fa fa-chevron-left"></i> Previous
//                 </button>
                
//                 <div style={{ display: 'flex', gap: '5px' }}>
//                   {[...Array(pagination.totalPages)].map((_, index) => {
//                     const pageNum = index + 1;
//                     // Show first page, last page, current page, and pages around current
//                     if (
//                       pageNum === 1 ||
//                       pageNum === pagination.totalPages ||
//                       (pageNum >= pagination.currentPage - 1 && pageNum <= pagination.currentPage + 1)
//                     ) {
//                       return (
//                         <button
//                           key={pageNum}
//                           className={`btn ${pageNum === pagination.currentPage ? 'btn-primary' : 'btn-outline-primary'}`}
//                           onClick={() => handlePageChange(pageNum)}
//                           style={{ minWidth: '40px' }}
//                         >
//                           {pageNum}
//                         </button>
//                       );
//                     } else if (
//                       pageNum === pagination.currentPage - 2 ||
//                       pageNum === pagination.currentPage + 2
//                     ) {
//                       return <span key={pageNum} style={{ padding: '8px' }}>...</span>;
//                     }
//                     return null;
//                   })}
//                 </div>
                
//                 <button
//                   className="btn btn-outline-primary"
//                   onClick={() => handlePageChange(pagination.currentPage + 1)}
//                   disabled={pagination.currentPage === pagination.totalPages}
//                   style={{ minWidth: '100px' }}
//                 >
//                   Next <i className="fa fa-chevron-right"></i>
//                 </button>
//               </div>
//             )}

//             <div className="actions" style={{ marginTop: '30px', textAlign: 'center' }}>
//               <button
//                 className="btn btn-primary"
//                 style={{ marginRight: '10px' }}
//                 onClick={() => toast.info('Export feature coming soon!')}
//               >
//                 <i className="fa fa-download"></i> Export to CSV
//               </button>
//               <button
//                 className="btn btn-secondary"
//                 onClick={() => window.location.href = '/dating/help&support'}
//               >
//                 <i className="fa fa-headphones"></i> Contact Support
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//       <FooterFour />

//       <style jsx>{`
//         .status.active {
//           background-color: #28a745;
//           color: #333;
//         }
//         .status.pending {
//           background-color: #ffc107;
//           color: #333;
//         }
//         .status.expired,
//         .status.failed {
//           background-color: #dc3545;
//           color: white;
//         }
//       `}</style>
//     </div>
//   );
// };

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
