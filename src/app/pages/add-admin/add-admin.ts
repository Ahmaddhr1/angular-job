import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { environment } from '../../../enviroment';

type CreateAdminPayload = {
  civility: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  password: string;
};

@Component({
  selector: 'app-add-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-admin.html',
  styleUrl: './add-admin.css',
})
export class AddAdmin {
  loading = false;
  error = '';
  success = '';

  private baseUrl = environment.apiUrl;

  form;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      civility: ['Mr', Validators.required],
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      role: ['Admin', Validators.required],
      status: ['active', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  submit() {
    this.error = '';
    this.success = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const payload: CreateAdminPayload = this.form.value as any;

    this.http
      .post(`${this.baseUrl}/admins`, payload)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: () => {
          this.success = 'Admin created successfully';
          setTimeout(() => this.router.navigate(['/admins']), 400);
        },
        error: (err) => {
          this.error = err?.error?.error || 'Failed to create admin';
        },
      });
  }
}