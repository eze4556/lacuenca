import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/producto.service';
import { AlertController } from '@ionic/angular';
import { Producto } from 'src/app/models/producto';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
handleError($event: ErrorEvent) {
throw new Error('Method not implemented.');
}
  listProductos: any; // Declara la variable como un array de Productos

  productos: any[]= [];

  filteredProducts: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;


  constructor(private router: Router, private productService: ProductService,
    private alertCtrl: AlertController, private http: HttpClient) {}

     apiUrl: string = environment.apiUrl;



  ngOnInit(): void {
    this.obtenerProductos();
    this.getProductos();
  }

  obtenerProductos() {
    this.productService.getAllProductos().subscribe(data => {
      console.log(data);
      this.listProductos = data;
    });
  }


  //Productos
// getProductos(){
//  this.http.get<any[]>(`${environment.apiUrl}/producto`).subscribe(
//       (response) => {
//         this.productos = response;
//         console.log('=>',response)
//       },
//       (error) => {
//         console.error('Error al obtener los productos:', error);
//       }
//     );
// }

getProductos() {
    this.http.get<any[]>(`${environment.apiUrl}/producto`).subscribe(
      (response) => {
        this.productos = response;
        this.filteredProducts = response;
        this.totalPages = Math.ceil(this.filteredProducts.length / this.pageSize);
        console.log('=>', response);
      },
      (error) => {
        console.error('Error al obtener los productos:', error);
      }
    );
  }

   filterProducts() {
    this.filteredProducts = this.productos.filter(producto =>
      producto.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      producto.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredProducts.length / this.pageSize);
  }

  paginatedProducts() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredProducts.slice(start, end);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }





  eliminarProducto(id: string) {
    this.productService.deleteProducto(id).subscribe(() => {
      this.obtenerProductos();
      this.mostrarAlerta();
    });
  }



  async mostrarAlerta() {
    const alert = await this.alertCtrl.create({
      header: 'Eliminado correctamente',
      message: 'El producto ha sido eliminado exitosamente.',
      buttons: ['OK']
    });

    await alert.present();
  }

  goBack() {
    window.history.back();
  }

  navigateToPage1() {
    this.router.navigate(['/home']); //
  }

  navigateToPage3() {
    this.router.navigate(['/lotery']); //
  }

  navigateToPage4() {
    this.router.navigate(['/productoNuevo']); //
  }

  navigateToPage5() {
    this.router.navigate(['/qSomo']); //
  }
  navigateToPage6() {
    this.router.navigate(['/event']); //
  }
  navigateToPage7() {
    this.router.navigate(['/categoria']); //
  }
  navigateToPage8() {
    this.router.navigate(['/products']); //
  }




}
