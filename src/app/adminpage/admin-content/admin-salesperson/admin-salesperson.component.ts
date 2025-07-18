
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalesService } from '../../../services/sales.service';
import { SalesPerson } from '../../../models/sales';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-admin-salesperson',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-salesperson.component.html',
  styleUrls: ['./admin-salesperson.component.css']
})
export class AdminSalespersonComponent implements OnInit {
  currentView: 'list' | 'add' | 'view' | 'edit' = 'list';
  sortColumn = 0;
  sortDirection = 1; // 1 for ascending, -1 for descending
  searchTerm = '';
  
  allSalesPersons: SalesPerson[] = [];
  filteredSalesPersons: SalesPerson[] = [];
  selectedSalesPerson: SalesPerson | null = null;
  isEditMode = false;
  showDownloadOptions = false;
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' | 'warning' = 'success';
  showPassword = false;

  constructor(private salesService: SalesService) {}

  ngOnInit() {
    this.loadSalesPersons();
  }

  loadSalesPersons() {
    this.allSalesPersons = this.salesService.getSalesPersons();
    this.filteredSalesPersons = [...this.allSalesPersons];
  }

  filterSalesPersons() {
    if (!this.searchTerm) {
      this.filteredSalesPersons = [...this.allSalesPersons];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredSalesPersons = this.allSalesPersons.filter(salesPerson => 
        (salesPerson.id && salesPerson.id.toLowerCase().includes(term)) ||
        (salesPerson.name && salesPerson.name.toLowerCase().includes(term)) ||
        (salesPerson.contact && salesPerson.contact.includes(term)) ||
        (salesPerson.email && salesPerson.email.toLowerCase().includes(term))
      );
    }
  }

  sortTable(columnIndex: number) {
    if (this.sortColumn === columnIndex) {
      this.sortDirection *= -1;
    } else {
      this.sortColumn = columnIndex;
      this.sortDirection = 1;
    }

    this.filteredSalesPersons.sort((a, b) => {
      let valueA, valueB;
      
      switch(columnIndex) {
        case 0: valueA = a.id; valueB = b.id; break;
        case 1: valueA = a.name; valueB = b.name; break;
        case 2: valueA = a.contact; valueB = b.contact; break;
        case 3: valueA = a.currentSales; valueB = b.currentSales; break;
        case 4: valueA = a.performanceRating; valueB = b.performanceRating; break;
        default: return 0;
      }
      
      if (typeof valueA === 'string' || typeof valueB === 'string') {
        return (String(valueA ?? '')).localeCompare(String(valueB ?? '')) * this.sortDirection;
      } else {
        return ((valueA || 0) - (valueB || 0)) * this.sortDirection;
      }
    });
  }

  showViewForm(salesPerson: SalesPerson) {
    this.selectedSalesPerson = { ...salesPerson };
    this.currentView = 'view';
    this.isEditMode = false;
  }

  cancelForm() {
    this.currentView = 'list';
  }

  downloadSalesPersons(type: 'excel' | 'pdf' | 'json') {
    this.showDownloadOptions = false;
    
    if (type === 'excel') {
      this.exportToExcel();
    } else if (type === 'json') {
      this.exportToJson();
    }
  }

  private exportToExcel() {
    const headers = ["Sales ID", "Name", "Contact", "Email", "Sales Target", "Current Sales", "Performance Rating", "Date Added"];
    
    const data = this.filteredSalesPersons.map(salesPerson => [
      salesPerson.id,
      salesPerson.name,
      salesPerson.contact,
      salesPerson.email,
      `$${(salesPerson.salesTarget || 0).toFixed(2)}`,
      `$${(salesPerson.currentSales || 0).toFixed(2)}`,
      `${salesPerson.performanceRating || 0}%`,
      salesPerson.dateAdded ? new Date(salesPerson.dateAdded).toLocaleDateString() : 'N/A'
    ]);

    const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales Persons");
    XLSX.writeFile(wb, `SalesPersons_${new Date().toISOString().slice(0,10)}.xlsx`);
    
    this.showToastMessage('Excel file downloaded successfully!', 'success');
  }

  private exportToJson() {
    const dataStr = JSON.stringify(this.filteredSalesPersons, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `sales_persons_${new Date().toISOString().slice(0,10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    this.showToastMessage('JSON file downloaded successfully!', 'success');
  }

  private showToastMessage(message: string, type: 'success' | 'error' | 'warning') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    
    setTimeout(() => {
      this.showToast = false;
    }, 5000);
  }

  showAddForm() {
    this.selectedSalesPerson = {
      id: '',
      name: '',
      contact: '',
      email: '',
      password: '',
      dateAdded: new Date(),
      salesTarget: 0,
      currentSales: 0,
      performanceRating: 0
    };
    this.currentView = 'add';
    this.isEditMode = false;
    this.showPassword = true;
  }

  editSalesPerson(salesPerson: SalesPerson) {
    this.selectedSalesPerson = { ...salesPerson };
    this.currentView = 'edit';
    this.isEditMode = true;
    this.showPassword = false;
  }

  submitForm() {
    if (!this.selectedSalesPerson) return;

    // Validate form
    if (!this.selectedSalesPerson.name || 
        !this.selectedSalesPerson.contact || 
        !this.selectedSalesPerson.email || 
        (this.currentView === 'add' && !this.selectedSalesPerson.password)) {
      this.showToastMessage('Please fill all required fields', 'error');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.selectedSalesPerson.email)) {
      this.showToastMessage('Please enter a valid email address', 'error');
      return;
    }

    // Validate contact number
    if (!/^\d{10}$/.test(this.selectedSalesPerson.contact)) {
      this.showToastMessage('Contact number must be 10 digits', 'error');
      return;
    }

    if (this.currentView === 'add') {
      // Add new sales person
      const newSalesPerson = this.salesService.addSalesPerson({
        name: this.selectedSalesPerson.name,
        contact: this.selectedSalesPerson.contact,
        email: this.selectedSalesPerson.email,
        password: this.selectedSalesPerson.password,
        salesTarget: this.selectedSalesPerson.salesTarget,
        currentSales: this.selectedSalesPerson.currentSales
      });

      this.showToastMessage('Sales person added successfully!', 'success');
      this.loadSalesPersons();
      this.currentView = 'list';
    } else if (this.currentView === 'edit') {
      // Update existing sales person
      const updated = this.salesService.updateSalesPerson(this.selectedSalesPerson.id, {
        name: this.selectedSalesPerson.name,
        contact: this.selectedSalesPerson.contact,
        email: this.selectedSalesPerson.email,
        salesTarget: this.selectedSalesPerson.salesTarget,
        currentSales: this.selectedSalesPerson.currentSales
      });

      if (updated) {
        this.showToastMessage('Sales person updated successfully!', 'success');
        this.loadSalesPersons();
        this.currentView = 'list';
      } else {
        this.showToastMessage('Failed to update sales person', 'error');
      }
    }
  }

  deleteSalesPerson(id: string) {
    if (confirm('Are you sure you want to delete this sales person?')) {
      const deleted = this.salesService.deleteSalesPerson(id);
      if (deleted) {
        this.showToastMessage('Sales person deleted successfully!', 'success');
        this.loadSalesPersons();
        this.currentView = 'list';
      } else {
        this.showToastMessage('Failed to delete sales person', 'error');
      }
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}


