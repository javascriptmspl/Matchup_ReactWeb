import React, { useState, useEffect } from 'react';
import HeaderFour from "../component/layout/HeaderFour";
import FooterFour from "../component/layout/footerFour";
import { getPaymentHistory } from '../../service/MANAGE_API/paymentService';
import toast from 'react-hot-toast';

const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    pageSize: 10
  });
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    fetchPurchaseHistory(1);
  }, []);

  const fetchPurchaseHistory = async (pageNo = 1) => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const userId = userData?.data?._id;

      if (!userId) {
        toast.error("Please login to view purchase history");
        setLoading(false);
        return;
      }

      // Call your backend API to get purchase history with pagination
      const response = await getPaymentHistory(userId, pageNo, pagination.pageSize);


      if (response.isSuccess && response.data) {
        const payments = response.data.payments || [];
        setPurchases(payments);
        
        // Set user info from first payment if available
        if (payments.length > 0 && payments[0].userId) {
          setUserInfo(payments[0].userId);
        }
        
        // Update pagination info
        setPagination({
          currentPage: response.data.page || 1,
          totalPages: response.data.pages || 1,
          total: response.data.total || 0,
          pageSize: pagination.pageSize
        });
      } else {
        console.log("No purchase history found");
        setPurchases([]);
      }
    } catch (error) {
      console.error("Error fetching purchase history:", error);
      toast.error("Failed to load purchase history");
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const getStatusClass = (status) => {
    if (!status) return '';
    const statusLower = status.toLowerCase();
    if (statusLower === 'succeeded' || statusLower === 'active') return 'active';
    if (statusLower === 'pending') return 'pending';
    if (statusLower === 'failed' || statusLower === 'expired') return 'expired';
    return '';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchPurchaseHistory(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div>
      <HeaderFour />
      <div className="main_h1 text-center" style={{ paddingTop: '100px', paddingBottom: '30px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#333' }}>Purchase History</h1>
        {userInfo && (
          <p style={{ fontSize: '16px', color: '#666', marginTop: '10px' }}>
            <strong>{userInfo.name}</strong> ({userInfo.email})
          </p>
        )}
      </div>
      <div className="purchase-history container" style={{ paddingBottom: '50px' }}>
        <div className="summary" style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '30px'
        }}>
          <p style={{ margin: 0, fontSize: '16px', color: '#666' }}>
            Welcome back! Here is a detailed history of your subscriptions and purchases. 
            You can review your past transactions, check their statuses, and more.
            {pagination.total > 0 && (
              <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                Total Purchases: {pagination.total}
              </span>
            )}
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p style={{ marginTop: '20px', color: '#666' }}>Loading purchase history...</p>
          </div>
        ) : purchases.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '10px'
          }}>
            <i className="fa fa-shopping-cart" style={{ fontSize: '64px', color: '#ddd', marginBottom: '20px' }}></i>
            <h3 style={{ color: '#666', marginBottom: '10px' }}>No Purchase History</h3>
            <p style={{ color: '#999' }}>You haven't made any purchases yet.</p>
            <a href="/metrimonial/membership" className="btn btn-primary" style={{ marginTop: '20px' }}>
              View Subscription Plans
            </a>
          </div>
        ) : (
          <>
            <div className="table-container" style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                backgroundColor: 'white',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                borderRadius: '10px',
                overflow: 'hidden'
              }}>
                <thead style={{ backgroundColor: '#007bff', color: 'white' }}>
                  <tr>
                    <th style={{ padding: '15px', textAlign: 'left' }}>Plan</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>Date</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>Amount</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>Coins</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>Valid Until</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((purchase, index) => (
                    <React.Fragment key={purchase._id || index}>
                      <tr
                        onClick={() => handleRowClick(purchase._id || index)}
                        style={{
                          cursor: 'pointer',
                          borderBottom: '1px solid #eee',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                      >
                        <td style={{ padding: '15px', textTransform: 'capitalize', fontWeight: '600' }}>
                          {purchase.subscriptionPlan || purchase.metadata?.planName || 'N/A'}
                        </td>
                        <td style={{ padding: '15px' }}>{formatDate(purchase.createdAt)}</td>
                        <td style={{ padding: '15px', fontWeight: 'bold', color: '#28a745' }}>
                          ${purchase.amount?.toFixed(2) || '0.00'}
                        </td>
                        <td style={{ padding: '15px' }}>
                          <span style={{
                            backgroundColor: '#ffc107',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '14px',
                            fontWeight: 'bold'
                          }}>
                            {purchase.coinsAwarded || 0} coins
                          </span>
                        </td>
                        <td style={{ padding: '15px' }}>
                          <span className={`status ${getStatusClass(purchase.paymentStatus)}`} style={{
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '13px',
                            fontWeight: '600',
                            textTransform: 'capitalize',
                            display: 'inline-block'
                          }}>
                            {purchase.paymentStatus || 'N/A'}
                          </span>
                        </td>
                        <td style={{ padding: '15px' }}>
                          {formatDate(purchase.subscriptionEndDate) || 'N/A'}
                        </td>
                      </tr>
                      {expandedRow === (purchase._id || index) && (
                        <tr style={{ backgroundColor: '#f8f9fa' }}>
                          <td colSpan="6" style={{ padding: '20px' }}>
                            <div style={{
                              backgroundColor: 'white',
                              padding: '20px',
                              borderRadius: '8px',
                              boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                            }}>
                              <h5 style={{ marginBottom: '15px', color: '#333' }}>Transaction Details</h5>
                              {purchase.userId && (
                                <div style={{ 
                                  backgroundColor: '#f8f9fa', 
                                  padding: '15px', 
                                  borderRadius: '6px', 
                                  marginBottom: '15px' 
                                }}>
                                  <p style={{ marginBottom: '5px' }}><strong>User:</strong> {purchase.userId.name || 'N/A'}</p>
                                  <p style={{ marginBottom: '5px' }}><strong>Email:</strong> {purchase.userId.email || 'N/A'}</p>
                                  <p style={{ marginBottom: '0' }}><strong>Username:</strong> {purchase.userId.userName || 'N/A'}</p>
                                </div>
                              )}
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                                <p><strong>Plan:</strong> <span style={{ textTransform: 'capitalize', color: '#007bff', fontWeight: '600' }}>{purchase.subscriptionPlan || 'N/A'}</span></p>
                                <p><strong>Amount:</strong> <span style={{ color: '#28a745', fontWeight: 'bold' }}>${purchase.amount?.toFixed(2) || '0.00'}</span> {purchase.currency?.toUpperCase() || 'USD'}</p>
                                <p><strong>Coins Awarded:</strong> <span style={{ color: '#ffc107', fontWeight: 'bold' }}>{purchase.coinsAwarded || 0} coins</span></p>
                                <p><strong>Status:</strong> <span className={`status ${getStatusClass(purchase.paymentStatus)}`} style={{ textTransform: 'capitalize' }}>{purchase.paymentStatus}</span></p>
                                <p><strong>Transaction ID:</strong> <span style={{ fontFamily: 'monospace', fontSize: '13px' }}>{purchase.stripePaymentIntentId || 'N/A'}</span></p>
                                <p><strong>Customer ID:</strong> <span style={{ fontFamily: 'monospace', fontSize: '13px' }}>{purchase.stripeCustomerId || 'N/A'}</span></p>
                                <p><strong>Purchase Date:</strong> {formatDate(purchase.createdAt)}</p>
                                <p><strong>Start Date:</strong> {formatDate(purchase.subscriptionStartDate) || 'N/A'}</p>
                                <p><strong>End Date:</strong> {formatDate(purchase.subscriptionEndDate) || 'N/A'}</p>
                                {purchase.metadata?.planName && (
                                  <p><strong>Plan Name:</strong> {purchase.metadata.planName}</p>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="pagination-container" style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                marginTop: '30px',
                gap: '10px'
              }}>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  style={{ minWidth: '100px' }}
                >
                  <i className="fa fa-chevron-left"></i> Previous
                </button>
                
                <div style={{ display: 'flex', gap: '5px' }}>
                  {[...Array(pagination.totalPages)].map((_, index) => {
                    const pageNum = index + 1;
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
                          style={{ minWidth: '40px' }}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      pageNum === pagination.currentPage - 2 ||
                      pageNum === pagination.currentPage + 2
                    ) {
                      return <span key={pageNum} style={{ padding: '8px' }}>...</span>;
                    }
                    return null;
                  })}
                </div>
                
                <button
                  className="btn btn-outline-primary"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  style={{ minWidth: '100px' }}
                >
                  Next <i className="fa fa-chevron-right"></i>
                </button>
              </div>
            )}

            <div className="actions" style={{ marginTop: '30px', textAlign: 'center' }}>
              <button
                className="btn btn-primary"
                style={{ marginRight: '10px' }}
                onClick={() => toast.info('Export feature coming soon!')}
              >
                <i className="fa fa-download"></i> Export to CSV
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => window.location.href = '/metrimonial/help&support'}
              >
                <i className="fa fa-headphones"></i> Contact Support
              </button>
            </div>
          </>
        )}
      </div>
      <FooterFour />

      <style jsx>{`
        .status.active {
          background-color: #28a745;
          color: white;
        }
        .status.pending {
          background-color: #ffc107;
          color: white;
        }
        .status.expired,
        .status.failed {
          background-color: #dc3545;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default PurchaseHistory;
