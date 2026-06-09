import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product';
import { Product } from '../../../interfaces/IProduct';

@Component({
  selector: 'app-admin-products',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.css'
})
export class AdminProducts implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];

  productForm: FormGroup;
  isLoading = false;
  isSubmitting = false;
  showModal = false;
  isEditMode = false;
  editingId: number | null = null;

  successMessage = '';
  errorMessage = '';
  searchTerm = '';
  selectedCategory = '';
  categories: string[] = [];

  deleteConfirmId: number | null = null;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required]],
      category: ['', [Validators.required]],
      make: [''],
      price: ['', [Validators.required, Validators.min(0.01)]],
      quantity: ['', [Validators.required, Validators.min(0)]],
      uom: ['unit'],
      rating: [0, [Validators.min(0), Validators.max(5)]],
      imageUrl: ['']
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.categories = [...new Set(data.map(p => p.category ?? '').filter(c => c !== ''))];
        this.applyFilter();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load products. Ensure the backend is running.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase().trim();
    const cat = this.selectedCategory.toLowerCase();
    this.filteredProducts = this.products.filter(p => {
      const matchesTerm = !term ||
        p.name.toLowerCase().includes(term) ||
        (p.category ?? '').toLowerCase().includes(term) ||
        (p.make ?? '').toLowerCase().includes(term) ||
        (p.description ?? '').toLowerCase().includes(term);
      const matchesCat = !cat || (p.category ?? '').toLowerCase() === cat;
      return matchesTerm && matchesCat;
    });
    this.cdr.detectChanges();
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applyFilter();
  }

  onCategoryFilter(event: Event): void {
    this.selectedCategory = (event.target as HTMLSelectElement).value;
    this.applyFilter();
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.editingId = null;
    this.productForm.reset({ uom: 'unit', rating: 0 });
    this.showModal = true;
    this.successMessage = '';
    this.errorMessage = '';
    this.cdr.detectChanges();
  }

  openEditModal(product: Product): void {
    this.isEditMode = true;
    this.editingId = product.productId ?? null;
    this.productForm.setValue({
      name: product.name,
      description: product.description,
      category: product.category ?? '',
      make: product.make ?? '',
      price: product.price,
      quantity: product.quantity,
      uom: product.uom ?? 'unit',
      rating: product.rating ?? 0,
      imageUrl: product.imageUrl ?? ''
    });
    this.showModal = true;
    this.successMessage = '';
    this.errorMessage = '';
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.showModal = false;
    this.productForm.reset({ uom: 'unit', rating: 0 });
    this.cdr.detectChanges();
  }

  submitForm(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formValue = this.productForm.value;
    const apiRequest = this.productService.toApiRequest({
      name: formValue.name,
      description: formValue.description,
      category: formValue.category,
      make: formValue.make,
      price: +formValue.price,
      quantity: +formValue.quantity,
      uom: formValue.uom,
      rating: +formValue.rating,
      imageUrl: formValue.imageUrl
    });

    if (this.isEditMode && this.editingId !== null) {
      this.productService.updateProduct(this.editingId, apiRequest).subscribe({
        next: () => {
          this.successMessage = 'Product updated successfully!';
          this.isSubmitting = false;
          this.closeModal();
          this.loadProducts();
          this.autoHideSuccess();
          this.cdr.detectChanges();
        },
        error: () => {
          this.errorMessage = 'Failed to update product.';
          this.isSubmitting = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.productService.addProduct(apiRequest).subscribe({
        next: () => {
          this.successMessage = 'Product added successfully!';
          this.isSubmitting = false;
          this.closeModal();
          this.loadProducts();
          this.autoHideSuccess();
          this.cdr.detectChanges();
        },
        error: () => {
          this.errorMessage = 'Failed to add product.';
          this.isSubmitting = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  confirmDelete(id: number): void {
    this.deleteConfirmId = id;
    this.cdr.detectChanges();
  }

  cancelDelete(): void {
    this.deleteConfirmId = null;
    this.cdr.detectChanges();
  }

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.successMessage = 'Product deleted successfully!';
        this.deleteConfirmId = null;
        this.loadProducts();
        this.autoHideSuccess();
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to delete product.';
        this.deleteConfirmId = null;
        this.cdr.detectChanges();
      }
    });
  }

  private autoHideSuccess(): void {
    setTimeout(() => {
      this.successMessage = '';
      this.cdr.detectChanges();
    }, 3000);
  }

  hasError(field: string, error: string): boolean {
    const control = this.productForm.get(field);
    return !!(control && control.hasError(error) && control.touched);
  }
}
