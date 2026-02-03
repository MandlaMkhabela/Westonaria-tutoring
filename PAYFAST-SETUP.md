# PayFast Integration Setup Guide

## 🎯 What You Have Now

Your website now has **complete payment integration** with:
- PayFast payment buttons on all pricing cards
- Secure online payments (cards, EFT, SnapScan, Zapper)
- Payment success and cancellation pages
- Fallback option for bank transfers

## 📋 Before You Start

You need:
1. A South African ID or registered business
2. A bank account
3. Your website must be live (use GitHub Pages or Netlify first)

## 🚀 Step-by-Step PayFast Setup

### Step 1: Create PayFast Account

1. Go to **https://www.payfast.co.za**
2. Click **"Sign Up"** → Choose **"Receive Payments"**
3. Fill in your details:
   - Personal/Business information
   - ID number
   - Bank account details (where you'll receive money)
   - Contact information
4. Verify your email address

### Step 2: Get Your Credentials

1. Log into your PayFast dashboard
2. Go to **Settings** → **Integration**
3. You'll see two important codes:
   - **Merchant ID** (10 digits)
   - **Merchant Key** (long string of letters/numbers)
4. **COPY THESE** - you'll need them next

### Step 3: Update Your Website

Open `script.js` in a text editor and find these lines (around line 10):

```javascript
const MERCHANT_ID = 'YOUR_MERCHANT_ID';
const MERCHANT_KEY = 'YOUR_MERCHANT_KEY';
```

Replace with your actual credentials:

```javascript
const MERCHANT_ID = '10000100';  // Your actual Merchant ID
const MERCHANT_KEY = 'q1w2e3r4t5y6u7i8o9p0';  // Your actual Merchant Key
```

**IMPORTANT:** Keep these credentials PRIVATE. Don't share them publicly.

### Step 4: Test in Sandbox Mode (Recommended)

Before going live, test with PayFast's sandbox (fake payments):

1. In PayFast dashboard, switch to **"Sandbox Mode"**
2. Get your sandbox credentials
3. In `script.js`, find this line (around line 45):

```javascript
form.action = 'https://www.payfast.co.za/eng/process';
```

Change it temporarily to:

```javascript
form.action = 'https://sandbox.payfast.co.za/eng/process';
```

4. Use these **test card details** to simulate payments:
   - Card Number: `4000 0000 0000 0002`
   - CVV: Any 3 digits
   - Expiry: Any future date

5. Test all three payment buttons (Individual, Monthly, Group)

### Step 5: Go Live

Once testing works:

1. Switch back to **Live Mode** in PayFast
2. Update `script.js` with your **live credentials**
3. Change the form.action back to:
   ```javascript
   form.action = 'https://www.payfast.co.za/eng/process';
   ```
4. Upload all files to your hosting
5. Test with a real R5 payment to yourself

### Step 6: Configure Return URLs

In `script.js`, find these lines (around line 30):

```javascript
return_url: window.location.origin + '/payment-success.html',
cancel_url: window.location.origin + '/payment-cancelled.html',
```

These should automatically work, but verify after deployment. If you have custom domains:

```javascript
return_url: 'https://yourwebsite.com/payment-success.html',
cancel_url: 'https://yourwebsite.com/payment-cancelled.html',
```

### Step 7: Update Other Details

**WhatsApp Numbers** - Update in these files:
- `index.html` (search for `27XXXXXXXXX`)
- `payment-success.html`
- `payment-cancelled.html`
- `script.js` (in the showBankDetails function)

Replace ALL instances with your number in format: `27821234567`

**Bank Transfer Details** - In `script.js`, find the `showBankDetails()` function and update:

```javascript
alert(`Bank Transfer Details:

Bank: FNB  // Your bank name
Account Name: John Doe  // Your name
Account Number: 1234567890  // Your account number
Branch Code: 250655  // Your branch code
Reference: Your Name + TUT

Please WhatsApp proof of payment to confirm your booking.`);
```

## 💰 Understanding PayFast Fees

PayFast charges:
- **2.9% + R2** per successful transaction

Examples:
- R250 session = You receive R243.75 (PayFast takes R6.25)
- R900 package = You receive R871.90 (PayFast takes R28.10)
- R150 group = You receive R144.65 (PayFast takes R5.35)

These fees are **industry standard** and worth it for convenience and security.

## 🔒 Security Best Practices

1. **Never share** your Merchant Key publicly
2. **Don't commit** credentials to GitHub (use environment variables if possible)
3. **Always test** in sandbox before going live
4. **Monitor** your PayFast dashboard for suspicious activity
5. **Enable** two-factor authentication on PayFast account

## 📧 Email Notifications

PayFast automatically sends:
- Payment confirmation to customer
- Payment notification to you
- Failed payment alerts

Configure these in: **PayFast Dashboard → Settings → Notifications**

## 🛠️ Troubleshooting

### "Payment system is being configured" alert appears
- You haven't updated the MERCHANT_ID and MERCHANT_KEY yet
- Solution: Complete Step 3 above

### Payment button doesn't work
- Check browser console (F12) for errors
- Verify credentials are correct
- Ensure website is using HTTPS (required for payments)

### Return URLs not working
- Make sure payment-success.html and payment-cancelled.html are uploaded
- Check the files are in the same directory as index.html
- Verify URLs in PayFast dashboard match your site

### No payment confirmation email
- Check PayFast notification settings
- Verify email address in PayFast account
- Check spam folder

## 🎨 Customization Options

### Change Payment Button Colors

In `styles.css`, find `.pay-button`:

```css
.pay-button {
    background: #25D366;  /* Change this color */
    border-color: #25D366;
}
```

### Add Payment Logos

Download PayFast badge from their website and add to your site:

```html
<img src="payfast-badge.png" alt="Secured by PayFast">
```

### Customize Success Page

Edit `payment-success.html` to match your branding, add your logo, or include special offers.

## 📱 Mobile Money Options

PayFast supports:
- SnapScan
- Zapper
- Masterpass
- Samsung Pay

These are automatically available - no extra setup needed!

## 💡 Advanced Features (Optional)

### Recurring Payments (Subscriptions)

For monthly packages, you can set up subscriptions:

1. Enable in PayFast dashboard
2. Modify the payment data to include:
   ```javascript
   subscription_type: '1',
   billing_date: '2026-03-01',
   recurring_amount: '900.00',
   frequency: '3',  // Monthly
   cycles: '0'  // Infinite
   ```

### Payment Notifications (IPN)

Get real-time notifications when payments complete:

1. Set up a server endpoint (requires backend coding)
2. Configure in PayFast: Settings → Integration → ITN

### Discount Codes

Add promo code functionality:

```javascript
function applyDiscount(amount, code) {
    if (code === 'FIRST50') return amount * 0.5;
    if (code === 'FRIEND10') return amount * 0.9;
    return amount;
}
```

## ✅ Pre-Launch Checklist

Before announcing your website:

- [ ] PayFast account approved and verified
- [ ] Test payments work in sandbox
- [ ] Live credentials added to script.js
- [ ] All WhatsApp numbers updated
- [ ] Bank transfer details updated
- [ ] Success/cancel pages tested
- [ ] Mobile payment buttons work
- [ ] Email notifications configured
- [ ] Terms and conditions added (optional but recommended)
- [ ] Refund policy clear (required by PayFast)

## 🎓 Accepting Your First Payment

When a student clicks "Pay Now":

1. They're redirected to PayFast's secure page
2. They choose payment method (card/EFT/mobile)
3. They complete payment
4. PayFast processes it (instant for cards, 1-3 days for EFT)
5. Money arrives in your bank account
6. Student gets redirected to success page
7. You both receive email confirmations
8. You contact them to schedule the session!

## 💼 Alternative: Manual Payments

Not ready for PayFast yet? No problem! Students can click "Contact First" buttons and arrange:

- Bank transfer (update details in script.js)
- Cash (for in-person sessions)
- Mobile money transfer

## 📞 Need Help?

**PayFast Support:**
- Email: support@payfast.co.za
- Phone: 087 820 7286
- Help Center: https://www.payfast.co.za/help/

**Your Options:**
- Test thoroughly before going live
- Start with manual payments and add PayFast later
- Offer both online and manual payment options

## 🚀 You're Ready!

You now have a **professional payment system** that will:
- Build trust with professional payment options
- Save time (no manual payment tracking)
- Increase conversions (easy checkout)
- Look legitimate and established

Good luck with your tutoring business! 💰📚

---

**Quick Reference:**

- PayFast Dashboard: https://www.payfast.co.za/login
- Sandbox Testing: https://sandbox.payfast.co.za
- Documentation: https://developers.payfast.co.za
- Your Merchant ID location: Settings → Integration
- Your credentials location: script.js lines 10-11
