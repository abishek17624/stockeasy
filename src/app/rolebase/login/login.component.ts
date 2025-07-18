import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  invalidCredentials = false;
  isLoading = false;

  // User database with roles and redirect paths
  private readonly users = [
    {
      email: 'admin@gmail.com',
      password: 'Admin@!123',
      role: 'admin',
      redirect: '/admin', // Corrected to match the route in app.route.ts
      name: 'Admin User'
    },
    {
      email: 'supplier@gmail.com',
      password: 'Supplier@!123',
      role: 'supplier',
      redirect: '/supplier',
      name: 'Supplier User'
    },
    {
      email: 'sales@gmail.com',
      password: 'Sales@!123',
      role: 'sales',
      redirect: '/sales',
      name: 'Sales Person'
    }
  ];

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [{ value: '', disabled: true }, [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      
    });

    // Enable password field only when email is valid
    this.loginForm.get('email')?.valueChanges.subscribe(() => {
      const emailCtrl = this.loginForm.get('email');
      const passwordCtrl = this.loginForm.get('password');
      
      if (emailCtrl?.valid) {
        passwordCtrl?.enable();
      } else {
        passwordCtrl?.disable();
        passwordCtrl?.reset();
      }
    });
  }

  get email() {
    return this.loginForm.get('email')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    // Mark all fields as touched to show validation messages
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.invalidCredentials = false;

    // Simulate API call with timeout
    setTimeout(() => {
      const email = this.email.value.trim();
      const password = this.password.value.trim();

      // Find user in our "database"
      const user = this.users.find(u => u.email === email && u.password === password);

      if (user) {
        // In a real app, you would:
        // 1. Store the user info in a service or state management
        // 2. Store the token in localStorage/sessionStorage
        // 3. Set up authentication guards
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userName', user.name);

        console.log(`Login successful! Welcome ${user.name} (${user.role})`);
        this.router.navigateByUrl(user.redirect); // Use navigateByUrl for more reliable navigation
      } else {
        this.invalidCredentials = true;
      }

      this.isLoading = false;
    }, 1000); // Simulate network delay
  }

  getEmailError(): string {
    if (this.email.hasError('required')) {
      return 'Email is required';
    }
    if (this.email.hasError('email')) {
      return 'Please enter a valid email';
    }
    return '';
  }

  getPasswordError(): string {
    if (this.password.hasError('required')) {
      return 'Password is required';
    }
    if (this.password.hasError('minlength')) {
      return 'Password must be at least 8 characters';
    }
    if (this.password.hasError('pattern')) {
      return 'Password must contain at least one uppercase, one lowercase, one number, and one special character';
    }
    return '';
  }
}