import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Customer } from 'src/app/models/customer.model';
import { CustsomerService } from 'src/app/services/custsomer.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.css'],
})
export class CustomersListComponent implements AfterViewInit {
  customers?: any;
  dataSource = new MatTableDataSource<Customer>();
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  durationInSeconds = 1;
  clickedRows = new Set<Customer>();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  displayedColumns: string[] = ['Id', 'firstname', 'lastname', 'Email', 'PhoneNumber', 'CountryCode', 'Gender', 'Balance', 'actions'];


  constructor(private customerService: CustsomerService, public dialog: MatDialog, private _snackBar: MatSnackBar, public router: Router) {

  }


  ngOnInit(): void {
    this.getCustomers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, cell: any): void {
    var dialogRef = this.dialog.open(DialogComponent, { width: '250px', enterAnimationDuration, exitAnimationDuration, data: false });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.removeCustomer(cell)
      }
    });
  }
  removeCustomer(cell: Customer): void {
    this.customerService.delete(cell.id).subscribe({
      next: (data: { statusCode: number, statusMessage: string, data: Customer[] }) => {
        this._snackBar.open(data.statusMessage, '', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: this.durationInSeconds * 1000,
        });
        this.getCustomers();
      },
      error: (e) => console.error(e)
    });
  }

  getCustomers(): void {
    this.customerService.getAll()
      .subscribe({
        next: (data: { statusCode: number, statusMessage: string, data: Customer[] }) => {
          var response = data.statusCode == 200 ? data.data as any : [];
          this.dataSource = new MatTableDataSource<Customer>(response);
          this.dataSource.paginator = this.paginator;
        },
        error: (e) => console.error(e)
      });
  }

  editClick(customer: Customer): void {
    this.router.navigateByUrl('/customer/1', { state: { customer: customer } });
  }

  addClick(): void {
    var newCustomer = new Customer();
    newCustomer.id = '0';
    newCustomer.salutation = '';
    newCustomer.initials = '';
    newCustomer.firstname = '';
    newCustomer.firstnameAscii = '';
    newCustomer.firstnameCountryRank = '';
    newCustomer.firstnameCountryFrequency = '';
    newCustomer.lastname = '';
    newCustomer.lastnameAscii = '';
    newCustomer.lastnameCountryRank = '';
    newCustomer.lastnameCountryFrequency = '';
    newCustomer.email = '';
    newCustomer.password = '';
    newCustomer.countryCode = '';
    newCustomer.countryCodeAlpha = '';
    newCustomer.countryName = '';
    newCustomer.primaryLanguageCode = '';
    newCustomer.primaryLanguage = '';
    newCustomer.balance = 0;
    newCustomer.phoneNumber = '';
    newCustomer.currency = '';
    this.router.navigateByUrl('/customer/0', { state: { customer: newCustomer } });
  }
  recreateCustomers(): void {
    this.customerService.createNewCustomerList()
      .subscribe({
        next: (data: { statusCode: number, statusMessage: string, data: Customer[] }) => {
          if (data.statusCode === 204 || data.statusCode === 200) {
            this._snackBar.open(data.statusMessage, '', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
              duration: this.durationInSeconds * 1000,
            });
            this.getCustomers();
          }
          else {
            this._snackBar.open('failed to recreate customers', '', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
              duration: this.durationInSeconds * 1000,
            });
          }
        },
        error: (e) => console.error(e)
      });
  }
}
