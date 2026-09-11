export const PAYMENT_MODE = 'SANDBOX';

export const paymentService = {
  createOrder(amount, currency = 'INR') {
    return {
      id: `order_${Date.now()}_${Math.floor(Math.random()*1000)}`,
      amount,
      currency,
      status: 'created'
    };
  },

  initiatePayment(orderId, amount, name) {
    return new Promise((resolve, reject) => {
      // Simulate payment gateway delay
      setTimeout(() => {
        // Mock successful payment 95% of the time
        if (Math.random() > 0.05) {
          resolve({
            paymentId: `pay_${Date.now()}`,
            orderId,
            signature: 'mock_signature_hash',
            status: 'success'
          });
        } else {
          reject(new Error("Payment failed by bank"));
        }
      }, 2000);
    });
  },

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }
};
