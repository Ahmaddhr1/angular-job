import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { environment } from '../../../enviroment';
import { AvailableAdmin } from '../../../utils/AvailableAdmin';
import { CreateComplexPayload } from '../../../utils/CreateComplexPayload';



type AvailableAdminsResponse = {
  data: AvailableAdmin[];
};

@Component({
  selector: 'app-add-complex',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-complex.html',
  styleUrl: './add-complex.css',
})
export class AddComplex {
  loading = false;
  error = '';
  success = '';

  admins: AvailableAdmin[] = [];

  private baseUrl = environment.apiUrl;

  form;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      address: ['', [Validators.required, Validators.minLength(2)]],
      campaign_info: ['', [Validators.required, Validators.minLength(5)]],
      admin_id: [''],
    });

    this.fetchAvailableAdmins();
  }

  fetchAvailableAdmins() {
    this.http.get<AvailableAdminsResponse>(`${this.baseUrl}/admins/available`).subscribe({
      next: (res) => {
        this.admins = res.data || [];
        this.cdr.detectChanges();
      },
      error: () => {
        this.admins = [];
      },
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

    const data = this.form.value as any;

    const payload: CreateComplexPayload = {
      name: data.name,
      address: data.address,
      campaign_info: data.campaign_info,
    };
    if (data.admin_id) payload.admin_id = Number(data.admin_id);

    this.http
      .post(`${this.baseUrl}/complexes`, payload)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: () => {
          this.success = 'Complex created successfully';
          setTimeout(() => this.router.navigate(['/complexes']), 400);
        },
        error: (err) => {
          this.error = err?.error?.error || 'Failed to create complex';
        },
      });
  }

  adminLabel(a: AvailableAdmin) {
    return `${a.first_name} ${a.last_name} (${a.email})`;
  }
}