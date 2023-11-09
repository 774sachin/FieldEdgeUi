import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer.model';
import { environment } from '../../environments/environment';
const baseUrl = 'https://localhost:7270/';


@Injectable({
  providedIn: 'root'
})
export class CustsomerService {

  baseUrl:string="";
  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiEndPoint;
  }
  getAll(): Observable<any> {
    return this.http.get<any>(baseUrl + "Customer/customerlist");
  }

  get(id: any): Observable<Customer> {
    return this.http.get<Customer>(`${baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(`${baseUrl + 'Customer/add'}`, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.post(`${baseUrl + 'Customer/update?id=' + id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl + 'Customer/delete?id='}${id}`);
  }

  createNewCustomerList(): Observable<any> {
    return this.http.get<Customer>(`${baseUrl + 'Customer/createcustomerlist'}`);
  }

}
