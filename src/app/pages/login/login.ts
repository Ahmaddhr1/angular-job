import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loading = false;
  error = "";
  form : any;

  constructor(private fb: FormBuilder, private auth: Auth, private router: Router,private cdr:ChangeDetectorRef) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['',[Validators.required]]
    })
  }



  submit() {
    if (this.form.invalid) return;

    this.loading = true;
    const { email, password } = this.form.value;
    if(!email || !password) {
      this.error="Email and Password are required !"
    }

    this.auth.login(email!, password!).pipe(
      finalize(()=>{
        this.loading=false;
        this.cdr.detectChanges()
      })
    )
    .subscribe({
      next:(res)=>{
        this.loading=false;
        this.router.navigate(["/admins"])
      },
      error:(res)=>{
        this.loading=false;
        this.error= res.error.error || "Login Failed";
      }
    })
  }


}
