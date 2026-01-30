import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../service/cart.service';
import { CategoryService } from '../../service/categories.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductComponent implements OnInit {
  categories: any[] = [];
  products: any[] = [];
  selectedCategory: string = '';
  searchText: string = '';

  constructor(
    private categoryService: CategoryService,
    private cartService: CartService,
    private toasterService : ToastrService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.categoryService.getCategories().subscribe(res => {
      this.categories = res;

      this.route.paramMap.subscribe(params => {
        const categoryId = params.get('categoryId');

        if (categoryId) {
          this.selectCategory(categoryId);
        } else if (res.length) {
          this.selectCategory(res[0]._id);
        }
      });
    });
  }

  selectCategory(id: string) {
    this.selectedCategory = id;

    this.router.navigate(['/products', id], { replaceUrl: true });

    this.categoryService.getProductsByCategory(id).subscribe(res => {
      this.products = res;
    });
  }
  
  addToCart(id: string) {
    this.spinner.show();

    this.cartService.addToCart(id).subscribe({
      next: () => {
        this.spinner.hide();
        this.toasterService.success('added successfully !');
      },
      error: (err) => {
        this.spinner.hide();
        this.toasterService.error('Failed to add item to cart');
        console.error(err);
      }
    });
  }

  filteredProducts() {
    if (!this.searchText) return this.products;

    return this.products.filter(p =>
      p.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
}
