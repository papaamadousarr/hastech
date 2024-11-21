import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class ProductService {
  private apiUrl = 'http://localhost:8080/api/users/productview'; // Remplacez par votre URL

  constructor(private http: HttpClient) {}


  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addProduct(product: any): Observable<any> {
     // Validation des champs numériques
    if (isNaN(product.rating) || product.rating < 0 || isNaN(product.price) || product.price < 0) {
      return throwError('Les valeurs des champs "rating" et "price" doivent être des nombres positifs.');
    }
        // Récupérer le token d'authentification stocké dans le localStorage
        const token = localStorage.getItem('token');

        // Si le token existe, ajoutez-le aux en-têtes de la requête
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post<any>(this.apiUrl, product, { headers });
    }

    updateProduct(id: number, product: any): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/${id}`, product);
    }

    deleteProduct(id: number): Observable<any> {
      return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
  }
