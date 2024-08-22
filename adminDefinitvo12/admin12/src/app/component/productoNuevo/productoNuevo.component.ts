import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NuevoProductoService } from 'src/app/services/productoNuevo.service'; 
import { AlertController } from '@ionic/angular'; 
import { Producto } from 'src/app/models/producto'; 
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-productoNuevo',
  templateUrl: './productoNuevo.component.html',
  styleUrls: ['./productoNuevo.component.scss'],
})
export class ProductNuevoComponent implements OnInit {
  listProductosNew: any; // Declara la variable como un array de Productos

  productosNuevos: any[]=[];

   apiUrl: string = environment.apiUrl;

  constructor(private router: Router, private nuevosProductoService: NuevoProductoService,
    private alertCtrl: AlertController, private http: HttpClient) {}

  ngOnInit(): void {
    // this.obtenerProductosNuevos();
    this.getProductosNuevos();
  }

  obtenerProductosNuevos() {
    this.nuevosProductoService.getAllProductoNuevo().subscribe(data => {
      console.log(data);
      this.listProductosNew = data;
    });
  }

    // ProductosNuevos
getProductosNuevos(){
this.http.get<any[]>(`${environment.apiUrl}/nuevoProducto`).subscribe(
      (response) => {
        this.productosNuevos = response;
        console.log('=>',response)
      },
      (error) => {
        console.error('Error al obtener los nuevos productos:', error);
      }
  );
}

  eliminarProductoNuevo(id: string) {
    this.nuevosProductoService.deleteProductoNuevo(id).subscribe(() => {
      this.obtenerProductosNuevos();
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
    this.router.navigate(['/productosNuevo']); //
  }

// async verDetalles2(id: string) {
//   const productoSeleccionado = this.listProductosNew.find(prod => prod._id === id);

//   const alert = await this.alertCtrl.create({
//     header: productoSeleccionado.nombre,
//     message: `
//       <ion-img src="${productoSeleccionado.imagen}" alt="${productoSeleccionado.nombre}"></ion-img>
//       <p>Precio: ${productoSeleccionado.precio}</p>
//     `,
//     buttons: ['OK']
//   });

//   await alert.present();
// }
}
