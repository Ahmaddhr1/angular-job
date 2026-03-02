import { ChangeDetectorRef, Component } from '@angular/core';
import { environment } from '../../../enviroment';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';

type BuildingObj = {
  id: number;
  name: string;

  complex_id: number;
  complex_name: string | null;

  admin_id: number | null;
  admin_name: string | null;
};

type BuildingsResponse = {
  data: BuildingObj[];
};

type ComplexSimple = {
  id: number;
  name: string;
};

@Component({
  selector: 'app-buildings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './buildings.html',
  styleUrl: './buildings.css',
})
export class Buildings {
  loading = false;
  error = '';
  buildings: BuildingObj[] = [];
  allBuildings: BuildingObj[] = [];
  complexes: ComplexSimple[] = [];
  selectedComplexId: number | null = null;

  admin$;
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    public auth: Auth,
    private cdr: ChangeDetectorRef
  ) {
    this.admin$ = this.auth.admin$;
    this.fetchBuildings();
    this.fetchComplexes();
  }

  fetchComplexes() {
    this.http
      .get<{ data: ComplexSimple[] }>(`${this.baseUrl}/complexes/simplified`)
      .subscribe({
        next: (res) => {
          this.complexes = res.data || [];
        }
      });
  }

  fetchBuildings() {
    this.loading = true;
    this.error = '';

    this.http
      .get<BuildingsResponse>(`${this.baseUrl}/buildings`)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (res) => {
          this.allBuildings = res.data || [];
          this.buildings = this.allBuildings;
          if (this.selectedComplexId !== null) {
            this.applyComplexFilter(this.selectedComplexId);
          }
        },
        error: (err) => {
          this.error = err?.error?.error || 'Failed to load buildings';
        },
      });
  }

  applyComplexFilter(complexId: number | null) {
    this.selectedComplexId = complexId;

    if (complexId === null) {
      this.buildings = this.allBuildings;
      return;
    }

    this.buildings = this.allBuildings.filter(
      (b) => b.complex_id === complexId
    );
  }


  deleteBuilding(id: number) {
    if (!confirm('Delete this building?')) return;

    this.loading = true;
    this.error = '';

    this.http
      .delete(`${this.baseUrl}/buildings/${id}`)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: () => {
          this.buildings = this.buildings.filter((b) => b.id !== id);
        },
        error: (err) => {
          this.error = err?.error?.error || 'Failed to delete building';
        },
      });
  }
}