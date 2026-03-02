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
  pagination: {
    page: number;
    per_page: number;
    total: number;
    pages: number;
  };
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
  total = 0;
  pages = 1;


  search = "";



  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, public auth: Auth, private cdr: ChangeDetectorRef) {
    this.admin$ = this.auth.admin$;
    this.fetchAdmins(this.page);
  }

  fetchAdmins(page: number) {
    this.loading = true;
    this.error = '';

    let params = new HttpParams().set('page', page).set('per_page', this.perPage);
    if (this.search) params = params.set('q', this.search.trim())


    this.http.get<AdminsResponse>(`${this.baseUrl}/admins`, { params }).pipe(
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges()
      })
    ).subscribe({
      next: (res) => {
        this.admins = res.data || [];
        this.loading = false;
        this.page = res.pagination.page;
        this.perPage = res.pagination.per_page;
        this.total = res.pagination.total;
        this.pages = res.pagination.pages;
      },
      error: (err) => {
        this.loading = false;
        err?.error?.message ? this.error = err?.error?.message : this.error = err?.error?.error || "Failed fetching admins";
      },
    });
  }

  get hasNext() {
    return this.page < this.pages;
  }

  nextPage() {
    if (this.hasNext) this.fetchAdmins(this.page + 1);
  }
  prevPage() {
    if (this.page > 1) this.fetchAdmins(this.page - 1);
  }

  onSearchChange(value:string) {
    this.search=value;
    this.fetchAdmins(1)
  }
}
