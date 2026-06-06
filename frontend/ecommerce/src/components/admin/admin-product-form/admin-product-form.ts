import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product';


@Component({
  selector: 'app-admin-product-form',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './admin-product-form.html',
  styleUrl: './admin-product-form.css',
})
export class AdminProductForm implements OnInit {
  productForm: FormGroup;
  isEditMode: boolean = false; 
  productId: number = 0;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute 
  ) {
   
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1)]],
      quantity: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (idParam) {
      this.isEditMode = true;
      this.productId = Number(idParam);
      
      this.productService.getProductById(this.productId).subscribe({
        next: (product) => {
          this.productForm.patchValue(product);
        },
        error: (err) => this.errorMessage = 'Failed to load product details.'
      });
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      if (this.isEditMode) {

        this.productService.updateProduct(this.productId, this.productForm.value).subscribe({
          next: () => this.router.navigate(['/admin/products']),
          error: (err) => this.errorMessage = 'Failed to update product.'
        });
      } else {
        this.productService.addProduct(this.productForm.value).subscribe({
          next: () => this.router.navigate(['/admin/products']), 
          error: (err) => this.errorMessage = 'Failed to add product.'
        });
      }
    } else {
      this.productForm.markAllAsTouched(); 
    }
  }
}
