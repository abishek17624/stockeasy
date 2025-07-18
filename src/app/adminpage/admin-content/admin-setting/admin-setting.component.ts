import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-setting',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-setting.component.html',
  styleUrl: './admin-setting.component.css'
})
export class AdminSettingComponent {

  activeTab: 'theme' | 'credential' = 'theme';
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' | 'warning' = 'success';
  showConfirmationDialog = false;

  // Theme settings
  themePreference: 'light' | 'dark' | 'system' = 'light';

  // Credential settings
  firstName = 'Gokul';
  lastName = 'Kumar';
  email = 'admin@stockeasy.com';
  newPassword = '';
  confirmPassword = '';
  passwordStrength = 0;
  passwordStrengthText = 'Very Weak';
  isEditingPassword = false;

  ngOnInit() {
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system';
    if (savedTheme) {
      this.themePreference = savedTheme;
    }
  }

  showSection(section: 'theme' | 'credential') {
    this.activeTab = section;
  }

  saveThemeSettings() {
    localStorage.setItem('theme', this.themePreference);
    this.showToastMessage('Theme settings saved successfully!', 'success');
  }

  togglePasswordVisibility(field: HTMLInputElement) {
    field.type = field.type === 'password' ? 'text' : 'password';
  }

  checkPasswordStrength() {
    const password = this.newPassword;
    let strength = 0;

    if (password.length === 0) {
      this.passwordStrength = 0;
      this.passwordStrengthText = 'Very Weak';
      return;
    }

    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    this.passwordStrength = strength;
    const texts = ['Very Weak', 'Weak', 'Moderate', 'Strong', 'Very Strong'];
    this.passwordStrengthText = texts[strength];
  }

  enablePasswordEditing() {
    this.isEditingPassword = true;
    this.newPassword = '';
    this.confirmPassword = '';
    this.passwordStrength = 0;
    this.passwordStrengthText = 'Very Weak';
  }

  cancelEdit() {
    this.isEditingPassword = false;
    this.newPassword = '';
    this.confirmPassword = '';
    this.passwordStrength = 0;
    this.passwordStrengthText = 'Very Weak';
  }

  validateBeforeUpdate() {
    if (this.isEditingPassword) {
      if (this.newPassword.length < 8) {
        this.showToastMessage('Password must be at least 8 characters long', 'error');
        return;
      }

      if (this.newPassword !== this.confirmPassword) {
        this.showToastMessage('Passwords do not match', 'error');
        return;
      }
      
      // Show confirmation dialog for password update
      this.showConfirmationDialog = true;
    } else {
      this.updateCredentials();
    }
  }

  confirmUpdate() {
    this.showConfirmationDialog = false;
    this.updateCredentials();
  }

  cancelUpdate() {
    this.showConfirmationDialog = false;
  }

  updateCredentials() {
    // In a real app, this would call an API
    if (this.isEditingPassword) {
      this.showToastMessage('Password updated successfully!', 'success');
      this.isEditingPassword = false;
      this.newPassword = '';
      this.confirmPassword = '';
    } else {
      this.showToastMessage('Credentials updated successfully!', 'success');
    }
  }

  private showToastMessage(message: string, type: 'success' | 'error' | 'warning') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  private validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

}
