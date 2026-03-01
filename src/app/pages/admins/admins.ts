import { ChangeDetectorRef, Component } from '@angular/core';
import { AdminObj } from '../../../utils/AdminObj';
import { environment } from '../../../enviroment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';



type AdminsResponse = {
  data: AdminObj[];
};

@Component({
  selector: 'app-admins',
  imports: [CommonModule, RouterModule],
  templateUrl: './admins.html',
  styleUrl: './admins.css',
})
export class Admins {

  loading = false;
  error = '';
  admins: AdminObj[] = [];

  admin$;

  page = 1;
  perPage = 3;

  hasNext = false;

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, public auth: Auth, private cdr: ChangeDetectorRef) {
    this.admin$ = this.auth.admin$;
    this.fetchAdmins(this.page);
  }

  fetchAdmins(page: number) {
    this.loading = true;
    this.error = '';

    const params = new HttpParams().set('page', page);


    this.http.get<AdminsResponse>(`${this.baseUrl}/admins`, { params }).pipe(
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges()
      })
    ).subscribe({
      next: (res) => {
        this.admins = res.data || [];
        this.loading = false;
        this.page = page;
        this.hasNext = this.admins.length === this.perPage;
      },
      error: (err) => {
        this.loading = false;
        if (err?.status === 404) {
          this.hasNext = false;      
          this.error = '';
          return;
        }
        this.error = err?.error?.error || 'Failed to load admins';
      },
    });
  }

  nextPage() {
    if (this.hasNext) this.fetchAdmins(this.page + 1);
  }
  prevPage() {
    if (this.page > 1) this.fetchAdmins(this.page - 1);
  }
}
