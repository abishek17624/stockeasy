import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../../services/inventory.service';
import { SupplierService } from '../../../services/supplier.service'; // Add this import
import { Products } from '../../../models/product';
import { Supplier } from '../../../models/supplier';
import * as XLSX from 'xlsx';
// import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';

@Component({
  selector: 'app-admin-inventory-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-inventory-management.component.html',
  styleUrls: ['./admin-inventory-management.component.css']
})
export class AdminInventoryManagementComponent implements OnInit {
  products: Products[] = [];
  filteredProducts: Products[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  searchTerm = '';
  selectedCategory = '';
  selectedSubcategory = '';
  selectedStatus = '';
  startDate = '';
  endDate = '';
  selectedProduct: Products | null = null;
  productToDelete: Products | null = null;
  showProductModal = false;
  isEditing = false;
  currentProduct: Products = this.getEmptyProduct();
  toastMessage = '';
  toastClass = '';
  toastIcon = '';
  Math = Math;
  showCategoryModal = false;
  newCategory = '';
  categories: string[] = [];
  categoryToDelete: string | null = null;
  suppliers: Supplier[] = []; // Add this property
  selectedSupplierDetails: Supplier | null = null; 


  constructor(
    private inventoryService: InventoryService,
    private supplierService: SupplierService // Add this
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
    this.loadSuppliers(); // Add this

  }

  // Add this method
  loadSuppliers() {
    this.suppliers = this.supplierService.getSuppliers();
  }

  // Add this method
  onSupplierChange(selectElement: HTMLSelectElement) {
  const supplierId = selectElement.value;
  this.selectedSupplierDetails = this.supplierService.getSupplier(supplierId) || null;
  if (this.selectedSupplierDetails) {
    this.currentProduct.contact = this.selectedSupplierDetails.contact;
  }
}

  

  getEmptyProduct(): Products {
    return {
      id: '',
      name: '',
      category: '',
      subcategory: '',
      buyingPrice: 0,
      sellingPrice: 0,
      quantity: 0,
      threshold: 5,
      expiry: '',
      supplier: '',
      contact: '',
      status: 'in_stock' // Default status;
    };
  }

  loadProducts() {
    this.products = this.inventoryService.getProducts();
    this.filteredProducts = [...this.products];
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(product => {
      // Category filter
      if (this.selectedCategory && product.category !== this.selectedCategory) return false;
      
      // Status filter
      if (this.selectedStatus) {
        if (this.selectedStatus === "in_stock" && (product.quantity === 0 || product.quantity <= product.threshold)) return false;
        if (this.selectedStatus === "low_stock" && (product.quantity === 0 || product.quantity > product.threshold)) return false;
        if (this.selectedStatus === "out_of_stock" && product.quantity > 0) return false;
      }
      
      // Search term
      if (this.searchTerm && 
          !product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) && 
          !product.id.toLowerCase().includes(this.searchTerm.toLowerCase()) && 
          !product.category.toLowerCase().includes(this.searchTerm.toLowerCase())) {
        return false;
      }
      
      // Date range filter
      if (this.startDate && product.expiry && product.expiry < this.startDate) return false;
      if (this.endDate && product.expiry && product.expiry > this.endDate) return false;
      
      return true;
    });
    
    this.currentPage = 1;
  }

  get paginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  getStatusClass(product: Products) {
    if (product.quantity === 0) {
      return "bg-red-100 text-red-800";
    } else if (product.quantity <= product.threshold) {
      return "bg-yellow-100 text-yellow-800";
    } else {
      return "bg-green-100 text-green-800";
    }
  }

  getStatusText(product: Products) {
    if (product.quantity === 0) {
      return "Out of Stock";
    } else if (product.quantity <= product.threshold) {
      return "Low Stock";
    } else {
      return "In Stock";
    }
  }

  getStockColor(product: Products) {
    if (product.quantity === 0) {
      return "red";
    } else if (product.quantity <= product.threshold) {
      return "yellow";
    } else {
      return "green";
    }
  }

  formatDate(dateString: string) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  }

  viewProduct(product: Products) {
    this.selectedProduct = {...product};
  }

  closeProductView() {
    this.selectedProduct = null;
  }

  openAddProductModal() {
    this.currentProduct = this.getEmptyProduct();
    this.isEditing = false;
    this.showProductModal = true;
  }

  openEditProductModal(product: Products) {
    this.currentProduct = {...product};
    this.isEditing = true;
    this.showProductModal = true;
  }

  closeProductModal() {
    this.showProductModal = false;
  }

  submitProductForm() {
    if (this.isEditing) {
      this.inventoryService.updateProduct(this.currentProduct);
      this.showToast('Product updated successfully!', 'success');
    } else {
      this.inventoryService.addProduct(this.currentProduct);
      this.showToast('Product added successfully!', 'success');
    }
    this.loadProducts();
    this.showProductModal = false;
  }

  confirmDelete(product: Products) {
    this.productToDelete = product;
  }

  closeDeleteModal() {
    this.productToDelete = null;
  }

  deleteProduct() {
    if (!this.productToDelete) return;
    
    this.inventoryService.deleteProduct(this.productToDelete.id);
    this.loadProducts();
    this.productToDelete = null;
    this.selectedProduct = null;
    this.showToast('Product deleted successfully!', 'success');
  }

  resetFilters() {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedSubcategory = '';
    this.selectedStatus = '';
    this.startDate = '';
    this.endDate = '';
    this.filteredProducts = [...this.products];
    this.currentPage = 1;
  }

  getStockWidth(product: Products) {
    if (product.threshold <= 0) return 0;
    const percentage = (product.quantity / product.threshold) * 100;
    return Math.min(percentage, 100);
  }

  trackByProductId(index: number, product: Products): string {
    return product.id;
  }

  getUniqueCategories(): string[] {
    const categories = new Set<string>();
    this.products.forEach(product => categories.add(product.category));
    return Array.from(categories);
  }

  showToast(message: string, type: 'success' | 'error' | 'info') {
    this.toastMessage = message;
    switch(type) {
      case 'success':
        this.toastClass = 'bg-green-100 text-green-800';
        this.toastIcon = 'fas fa-check-circle text-green-500';
        break;
      case 'error':
        this.toastClass = 'bg-red-100 text-red-800';
        this.toastIcon = 'fas fa-exclamation-circle text-red-500';
        break;
      case 'info':
        this.toastClass = 'bg-blue-100 text-blue-800';
        this.toastIcon = 'fas fa-info-circle text-blue-500';
        break;
    }
    
    setTimeout(() => {
      this.toastMessage = '';
    }, 3000);
  }

  exportToExcel() {
    const data = this.filteredProducts.map(product => ({
      'Product ID': product.id,
      'Product Name': product.name,
      'Category': product.category,
      'Subcategory': product.subcategory,
      'Buying Price': product.buyingPrice,
      'Selling Price': product.sellingPrice,
      'Quantity': product.quantity,
      'Threshold': product.threshold,
      'Status': this.getStatusText(product),
      'Expiry Date': this.formatDate(product.expiry),
      'Supplier': product.supplier,
      'Contact': product.contact
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory');
    XLSX.writeFile(workbook, 'Inventory_Report.xlsx');
    this.showToast('Excel exported successfully!', 'success');
  }

  exportToPDF() {
    const doc = new jsPDF();
    const title = 'Inventory Report';
    const headers = [
      ['ID', 'Name', 'Category', 'Price', 'Stock', 'Status', 'Expiry']
    ];
    
    const data = this.filteredProducts.map(product => [
      product.id,
      product.name,
      product.category,
      '₹' + product.sellingPrice.toFixed(2),
      product.quantity,
      this.getStatusText(product),
      this.formatDate(product.expiry)
    ]);

    (doc as any).autoTable({
      head: headers,
      body: data,
      startY: 20,
      theme: 'grid',
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 30 }
    });

    doc.text(title, 14, 15);
    doc.save('Inventory_Report.pdf');
    this.showToast('PDF exported successfully!', 'success');
  }

  loadCategories() {
    this.categories = this.getUniqueCategories();
  }

  openCategoryModal() {
    this.showCategoryModal = true;
  }

  closeCategoryModal() {
    this.showCategoryModal = false;
    this.newCategory = '';
  }

  addCategory() {
    if (this.newCategory.trim() && !this.categories.includes(this.newCategory.trim())) {
      this.categories.push(this.newCategory.trim());
      this.newCategory = '';
      this.showToast('Category added successfully!', 'success');
    }
  }

  confirmDeleteCategory(category: string) {
    this.categoryToDelete = category;
  }

  deleteCategory() {
    if (!this.categoryToDelete) return;
    
    // Update products that have this category
    const products = this.inventoryService.getProducts();
    const updatedProducts = products.map(product => {
      if (product.category === this.categoryToDelete) {
        return { ...product, category: 'Uncategorized' };
      }
      return product;
    });
    
    this.inventoryService.saveProducts(updatedProducts);
    
    // Remove the category from the list
    this.categories = this.categories.filter(c => c !== this.categoryToDelete);
    
    this.showToast('Category deleted successfully!', 'success');
    this.categoryToDelete = null;
    this.loadProducts();
    this.filterProducts();
  }

}

declare const jsPDF: any;
declare const autoTable: any;