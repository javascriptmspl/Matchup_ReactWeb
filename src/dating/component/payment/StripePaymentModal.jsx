import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { createPaymentIntent, confirmPayment } from "../../../service/MANAGE_API/paymentService";
import toast from "react-hot-toast";
import "./StripePaymentModal.css";

// Initialize Stripe with your publishable key
const stripePublishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;

console.log("Stripe Key Check:", stripePublishableKey ? "✓ Key Found" : "✗ Key Missing");

if (!stripePublishableKey) { 
  console.error("STRIPE KEY ERROR: REACT_APP_STRIPE_PUBLISHABLE_KEY is not defined in .env file");
  console.error("Make sure to restart the development server after adding .env file");
}

const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

const CheckoutForm = ({ clientSecret, amount, onSuccess, onCancel, userId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/payment-success",
        },
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message);
        toast.error(error.message);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        console.log("Payment succeeded, confirming with backend...");
        
        // Call confirm payment endpoint to award coins and activate subscription
        try {
          const confirmResponse = await confirmPayment(paymentIntent.id, userId);
          
          if (confirmResponse.isSuccess) {
            const { payment, coinsAwarded, newBalance } = confirmResponse.data;
            
     
            onSuccess(paymentIntent, confirmResponse.data);
          } else {
            toast.error("Payment processed but failed to activate subscription. Please contact support.");
            onSuccess(paymentIntent, null);
          }
        } catch (confirmError) {
          console.error("Failed to confirm payment:", confirmError);
          toast.error("Payment successful but failed to activate subscription. Please contact support.");
          onSuccess(paymentIntent, null);
        }
      }
    } catch (err) {
      setErrorMessage("An unexpected error occurred.");
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-payment-form">
      <div className="payment-amount">
        <h3>Payment Amount: ${amount}</h3>
      </div>

      <PaymentElement />

      {errorMessage && (
        <div className="error-message" style={{ color: "red", marginTop: "10px" }}>
          {errorMessage}
        </div>
      )}

      <div className="payment-buttons">
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="btn-pay"
        >
          {isProcessing ? "Processing..." : `Pay $${amount}`}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn-cancel"
          disabled={isProcessing}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const StripePaymentModal = ({ isOpen, onClose, subscriptionPlan, userId }) => {
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    
    if (isOpen && subscriptionPlan && userId) {
      console.log("Initializing payment...");
      initializePayment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, subscriptionPlan, userId]);

  const initializePayment = async () => {
    setLoading(true);
    
    try {
      const response = await createPaymentIntent(userId, subscriptionPlan);
      
      if (response.isSuccess) {
        setClientSecret(response.data.clientSecret);
        setPaymentData(response.data);
        console.log("Payment initialized successfully");
      } else {
        console.error("Payment initialization failed:", response);
        toast.error("Failed to initialize payment");
      }
    } catch (error) {
      toast.error("Error initializing payment. Please try again.");
      console.error("Payment initialization error:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleSuccess = (paymentIntent, confirmationData) => {
    console.log("Payment successful:", paymentIntent);
    console.log("Confirmation data:", confirmationData);
    
    setTimeout(() => {
      onClose(true, confirmationData); // Pass success and confirmation data
    }, 2000);
  };

  const handleCancel = () => {
    onClose(false);
  };

  if (!isOpen) {
    console.log("Modal is closed, not rendering");
    return null;
  }

  console.log("Rendering payment modal");

  if (!stripePublishableKey) {
    return (
      <div className="payment-modal-overlay">
        <div className="payment-modal">
          <div className="payment-modal-header">
            <h2>Configuration Error</h2>
            <button className="close-btn" onClick={handleCancel}>
              &times;
            </button>
          </div>
          <div className="payment-modal-body">
            <div className="error-state">
              <p style={{ color: 'red' }}>Stripe is not configured properly. Please contact support.</p>
              <p style={{ fontSize: '14px', color: '#666' }}>
                Developer: Add REACT_APP_STRIPE_PUBLISHABLE_KEY to .env file and restart the server.
              </p>
              <button onClick={handleCancel} className="btn-cancel">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#0570de",
        colorBackground: "#ffffff",
        colorText: "#30313d",
        colorDanger: "#df1b41",
        fontFamily: "system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "8px",
      },
    },
  };

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <div className="payment-modal-header">
          <h2>Complete Your Payment</h2>
          <button className="close-btn" onClick={handleCancel}>
            &times;
          </button>
        </div>

        <div className="payment-modal-body">
          {loading && (
            <div className="loading-spinner">
              <p>Initializing payment...</p>
            </div>
          )}

          {!loading && clientSecret && (
            <Elements stripe={stripePromise} options={options}>
              <CheckoutForm
                clientSecret={clientSecret}
                amount={paymentData?.amount || 0}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
                userId={userId}
              />
            </Elements>
          )}

          {!loading && !clientSecret && (
            <div className="error-state">
              <p>Unable to initialize payment. Please try again.</p>
              <button onClick={handleCancel} className="btn-cancel">
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StripePaymentModal;

