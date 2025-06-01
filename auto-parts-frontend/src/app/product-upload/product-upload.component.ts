import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Product } from '../services/product.service'; // Adjust the import path as necessary

@Component({
  selector: 'app-product-upload',
  templateUrl: './product-upload.component.html',
  styleUrls: ['./product-upload.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ProductUploadComponent {
  products: Product[] = [];
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const csvData = e.target.result;
        this.parseCSV(csvData);
      };
      reader.readAsText(file);
    } else {
      this.errorMessage = 'Please upload a valid CSV file.';
    }
  }

  // src/app/product-upload/product-upload.component.ts
parseCSV(csvData: string) {
  const lines = csvData.split('\n');
  this.products = lines.map(line => {
      const [
          product_name,
          vehicle_group,
          product_brand,
          model,
          engine,
          year,
          product_description_eng,
          product_description_fr,
          bsg_sub_category,
          product_origin_country,
          package_qty,
          oe,
          product_description_2_eng,
          product_description_2_fr,
          product_sub_category,
          product_category
      ] = line.split(',');

      return {
        id: '',
          productName: product_name,
          vehicleGroup: vehicle_group,
          productBrand: product_brand,
          model: model,
          engine: engine,
          year: year,
          descriptionEng: product_description_eng,
          descriptionFr: product_description_fr,
          bsgSubCategory: bsg_sub_category,
          originCountry: product_origin_country,
          packageQty: package_qty,
          oe: oe,
          description2Eng: product_description_2_eng,
          description2Fr: product_description_2_fr,
          productSubCategory: product_sub_category,
          productCategory: product_category
      } as Product;
  });
}

  uploadProducts() {
    this.http.post('http://localhost:3000/api/products', this.products)
      .subscribe({
        next: () => {
          alert('Products uploaded successfully!');
          this.products = [];
        },
        error: (error) => {
          this.errorMessage = 'Error uploading products: ' + error.message;
        }
      });
  }
}