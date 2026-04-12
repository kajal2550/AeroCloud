const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay instance
// For test mode, you would provide the test keys in your .env
// If not provided, we use a generic placeholder which causes razorpay auth error if actually hit,
// but fine for simulating locally or if the user adds their own keys.
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder',
});

// @desc    Create Razorpay Order
// @route   POST /api/payments/order
// @access  Public
exports.createOrder = async (req, res, next) => {
  try {
    const { amount, currency = 'USD' } = req.body;
    
    // Razorpay expects amount in paise/cents. e.g., $100 = 10000 cents
    const options = {
      amount: Math.round(amount * 100), 
      currency,
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpayInstance.orders.create(options);
    
    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Payment initialization failed', details: error.message });
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payments/verify
// @access  Public
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder')
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      res.status(200).json({
        success: true,
        message: 'Payment verified successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Payment verification failed', details: error.message });
  }
};
