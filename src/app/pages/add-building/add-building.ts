import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { environment } from '../../../enviroment';
import { AvailableAdmin } from '../../../utils/AvailableAdmin';
import { CreateBuildingPayload } from '../../../utils/CreateBuildingPayload';

type ComplexObj = {
  id: number;
  name: string;
};

type ComplexesResponse = {
  data: ComplexObj[];
};

type AvailableAdminsResponse = {
  data: AvailableAdmin[];
};

@Component({
  selector: 'app-add-building',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-building.html',
  styleUrl: './add-building.css',
})
export class AddBuilding {
  loading = false;
  error = '';
  success = '';

  complexes: ComplexObj[] = [];
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
      complex_id: ['', Validators.required],
      admin_id: [''],
    });

    this.fetchComplexes();
    this.fetchAvailableAdmins();
  }

  fetchComplexes() {
    this.http.get<ComplexesResponse>(`${this.baseUrl}/complexes`).subscribe({
      next: (res) => {
        this.complexes = res.data || [];
        this.cdr.detectChanges();
      },
      error: () => {
        this.complexes = [];
      },
    });
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

    const payload: CreateBuildingPayload = {
      name: data.name,
      complex_id: Number(data.complex_id),
    };

    if (data.admin_id) payload.admin_id = Number(data.admin_id);

    this.http
      .post(`${this.baseUrl}/buildings`, payload)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: () => {
          this.success = 'Building created successfully';
          setTimeout(() => this.router.navigate(['/buildings']), 400);
        },
        error: (err) => {
          this.error = err?.error?.error || 'Failed to create building';
        },
      });
  }
}