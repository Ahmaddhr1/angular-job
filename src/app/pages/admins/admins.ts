import { ChangeDetectorRef,Component } from '@angular/core';
import { AdminObj } from '../../../utils/AdminObj';
import { environment } from '../../../enviroment';
import { HttpClient } from '@angular/common/http';
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

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, public auth: Auth,private cdr:ChangeDetectorRef) {
    this.admin$ = this.auth.admin$;
    this.fetchAdmins();
  }

  fetchAdmins() {
    this.loading = true;
    this.error = '';

    this.http.get<AdminsResponse>(`${this.baseUrl}/admins`).pipe(
      finalize(()=>{
        this.loading=false;
        this.cdr.detectChanges()
      })
    ).subscribe({
      next: (res) => {
        this.admins = res.data || [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.error || 'Failed to load admins';
      },
    });
  }
}
