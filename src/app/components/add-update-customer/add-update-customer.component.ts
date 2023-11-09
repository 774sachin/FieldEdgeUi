import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { countries, gender } from 'src/app/helpers/data-store';
import { Customer } from 'src/app/models/customer.model';
import { CustsomerService } from 'src/app/services/custsomer.service';

@Component({
  selector: 'app-add-update-customer',
  templateUrl: './add-update-customer.component.html',
  styleUrls: ['./add-update-customer.component.css']
})
export class AddUpdateCustomerComponent {
  customer: Customer;
  customerForm: FormGroup;
  errors = { 'email': '', 'password': '', 'firstname': '', 'lastname': '' };
  title = 'Add';
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  durationInSeconds = 1;
  public countries: any = countries
  public genders: any = gender;
  constructor(private customerService: CustsomerService, private _snackBar: MatSnackBar, private router: Router, private formBuilder: FormBuilder) {
    this.customer = this.router.getCurrentNavigation()?.extras.state!['customer'] as Customer
    this.title = this.customer.id == "0" ? 'Add' : 'Update';
  }

  ngOnInit(): void {

    this.customerForm = this.formBuilder.group({
      id: new FormControl(this.customer.id, []),
      salutation: new FormControl(this.customer.salutation, []),
      initials: new FormControl(this.customer.initials, []),
      firstname: this.formBuilder.control(this.customer.firstname, { validators: [Validators.minLength(3), Validators.maxLength(20)] }),
      firstnameAscii: new FormControl(this.customer.firstnameAscii, []),
      firstnameCountryRank: new FormControl(this.customer.firstnameCountryRank, []),
      firstnameCountryFrequency: new FormControl(this.customer.firstnameCountryFrequency, []),
      lastname: new FormControl(this.customer.lastname, [Validators.minLength(3), Validators.maxLength(20)]),
      lastnameAscii: new FormControl(this.customer.lastnameAscii, []),
      lastnameCountryRank: new FormControl(this.customer.lastnameCountryRank, []),
      lastnameCountryFrequency: new FormControl(this.customer.lastnameCountryFrequency, []),
      email: this.formBuilder.control(this.customer.email, [Validators.required, Validators.email]),
      password: new FormControl(this.customer.password, [Validators.minLength(6), Validators.maxLength(20)]),
      countryCode: new FormControl(this.customer.countryCode, []),
      countryCodeAlpha: new FormControl(this.customer.countryCodeAlpha, []),
      countryName: new FormControl(this.customer.countryName, []),
      primaryLanguageCode: new FormControl(this.customer.primaryLanguageCode, []),
      primaryLanguage: new FormControl(this.customer.primaryLanguage, []),
      balance: new FormControl(this.customer.balance, []),
      phoneNumber: new FormControl(this.customer.phoneNumber, []),
      currency: new FormControl(this.customer.currency, []),
      gender: new FormControl(this.customer.gender, []),
    });
  }

  getErrorMessage() {
    if (this.customerForm.controls['email']) {
      this.errors['email'] = '';
      if (this.customerForm.controls['email'].hasError('required')) {
        this.errors['email'] = 'Email is required';
      }
      else if (this.customerForm.controls['email'].hasError('email')) {
        this.errors['email'] = 'Not a valid email';
      }
    }

    if (this.customerForm.controls['firstname']) {
      this.errors['firstname'] = '';
      if (this.customerForm.controls['firstname'].hasError('maxlength')) {
        this.errors['firstname'] = 'Max 20 char allowed';
      }
      if (this.customerForm.controls['firstname'].hasError('minlength')) {
        this.errors['firstname'] = 'Min 10 char allowed';
      }
    }
    if (this.customerForm.controls['lastname']) {
      this.errors['lastname'] = '';
      if (this.customerForm.controls['lastname'].hasError('maxlength')) {
        this.errors['lastname'] = 'Max 20 char allowed';
      }
      if (this.customerForm.controls['lastname'].hasError('minlength')) {
        this.errors['lastname'] = 'Min 10 char allowed';
      }
    }
  }
  submit(): void {
    console.log(this.customerForm.value);
    if (this.customerForm.valid) {
      if (this.customer.id == "0") {
        this.add(this.customerForm.value)
      }
      else {
        this.update(this.customerForm.value);
      }
    }
  }

  add(data: any): void {
    data.id = Math.random().toString().slice(9, 11);
    this.customerService.create(data).subscribe({
      next: (data: { statusCode: number, statusMessage: string, data: Customer[] }) => {
        if (data.statusCode == 200 || data.statusCode == 201) {
          this._snackBar.open(data.statusMessage, '', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: this.durationInSeconds * 1000,
          });
          this.router.navigateByUrl('/customers');
        }
        else {
          this._snackBar.open(data.statusMessage, '', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: this.durationInSeconds * 1000,
          });
        }
      },
      error: (e) => {
        this._snackBar.open('failed to create customer', '', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: this.durationInSeconds * 1000,
        });
      }
    });
  }

  update(data: any): void {
    this.customerService.update(data.id, data).subscribe({
      next: (data: { statusCode: number, statusMessage: string, data: Customer[] }) => {
        if (data.statusCode == 200 || data.statusCode == 202) {
          this._snackBar.open(data.statusMessage, '', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: this.durationInSeconds * 1000,
          });
          this.router.navigateByUrl('/customers');
        }
        else {
          this._snackBar.open(data.statusMessage, '', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: this.durationInSeconds * 1000,
          });
        }
      },
      error: (e) => {
        this._snackBar.open('failed to update customer', '', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: this.durationInSeconds * 1000,
        });
      }
    });
  }
}
