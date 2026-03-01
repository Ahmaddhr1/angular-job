import { ChangeDetectorRef, Component } from '@angular/core';
import { environment } from '../../../enviroment';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AdminObj } from '../../../utils/AdminObj';
import { ComplexObj } from '../../../utils/ComplexObj';


type ComplexesResponse = {
  data: ComplexObj[];
};

@Component({
  selector: 'app-complexes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './complexes.html',
  styleUrl: './complexes.css',
})
export class Complexes {
  loading = false;
  error = '';
  complexes: ComplexObj[] = [];

  admin$;

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    public auth: Auth,
    private cdr: ChangeDetectorRef
  ) {
    this.admin$ = this.auth.admin$;
    this.fetchComplexes();
  }

  fetchComplexes() {
    this.loading = true;
    this.error = '';

    this.http
      .get<ComplexesResponse>(`${this.baseUrl}/complexes`)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (res) => {
          this.complexes = res.data || [];
        },
        error: (err) => {
          this.error = err?.error?.error || 'Failed to load complexes';
        },
      });
  }
}