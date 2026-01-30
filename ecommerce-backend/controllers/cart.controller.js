const Cart = require('../models/Cart');
require('dotenv').config();
const nodemailer = require('nodemailer');

// Get Cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate('products.productId');
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Add to Cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        userId: req.user.id,
        products: [{ productId, qty }]
      });
    } else {
      cart.products.push({ productId, qty });
      await cart.save();
    }

    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Remove from Cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params; // get product _id from URL
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Remove product from products array
    cart.products = cart.products.filter(p => p._id.toString() !== productId);
    await cart.save();

    // Populate product details before sending response
    await cart.populate('products.productId');

    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.sendOrderConfirmation = async (req, res) => {
  const { email, items, total } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const itemsHtml = items.map(
      i => `
        <tr>
          <td style="padding:8px 0;">${i.name}</td>
          <td style="padding:8px 0;">${i.qty}</td>
          <td style="padding:8px 0;">₹ ${i.price}</td>
          <td style="padding:8px 0;">₹ ${i.price * i.qty}</td>
        </tr>
      `
    ).join('');

    const html = `
      <div style="font-family:Segoe UI,Arial,sans-serif;">
        <p>Hi,</p>

        <p>Thank you for shopping with us! 🎉</p>

        <p>Here is your order receipt:</p>

        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          <thead>
            <tr>
              <th align="left">Product</th>
              <th align="left">Qty</th>
              <th align="left">Price</th>
              <th align="left">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <p style="margin-top:15px;">
          <strong>Grand Total: ₹ ${total}</strong>
        </p>

        <p>
          If you have any questions, just reply to this email.
        </p>

        <p>
          Thanks again,<br/>
          <strong>Abhinav Agrawal</strong>
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Abhinav Agrawal" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Order Confirmation & Receipt',
      html
    });

    res.status(200).json({ message: 'Order confirmation sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send receipt' });
  }
};
