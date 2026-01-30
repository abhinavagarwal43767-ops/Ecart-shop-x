import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // <-- Important
import { CartService } from '../../service/cart.service';
import { ToastrService } from 'ngx-toastr';
import { decrypt } from '../../crypto.util';
declare var Razorpay: any;

@Component({
  selector: 'app-cart',
  standalone: true,              // <-- mark as standalone
  imports: [CommonModule],        // <-- import CommonModule here
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: any[] = [];

  constructor(private cartService: CartService, private tostreService: ToastrService) { }

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().subscribe((res: any) => {
      // The API returns { _id, userId, products: [...] }, so map it to cart array
      this.cart = res.products || [];
    });
  }

  remove(productId: string) {
    this.cartService.removeFromCart(productId).subscribe({
      next: () => {
        this.loadCart(); // Reload cart after removal
        this.tostreService.success('Product removed from cart successfully!', 'Success');
      },
      error: (err) => {
        console.error(err);
        this.tostreService.error('Failed to remove product from cart', 'Error');
      }
    });
  }

  getTotal(): number {
    return this.cart.reduce((acc, c) => acc + c.productId.price * c.qty, 0);
  }


  payWithRazorpay() {
    const encryptedEmail = sessionStorage.getItem('userEmail');
    const email = encryptedEmail ? decrypt(encryptedEmail) : '';

    if (!email) {
      this.tostreService.error('User email not found. Please login again.');
      return;
    }

    const orderData = {
      email,
      items: this.cart.map(c => ({
        name: c.productId.name,
        price: c.productId.price,
        qty: c.qty
      })),
      total: this.getTotal()
    };

    this.cartService.sendOrderConfirmation(orderData).subscribe({
      next: () => {
        this.tostreService.success('Order confirmed! Receipt sent to your email.');
      },
      error: () => {
        this.tostreService.error('Failed to place order');
      }
    });
  }

}
