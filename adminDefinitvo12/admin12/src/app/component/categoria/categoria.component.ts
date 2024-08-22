import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoriaService } from 'src/app/services/categoria.service';
import { Categoria } from 'src/app/models/categoria';
import { AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss'],
})
export class CategoriaComponent implements OnInit {
  categorias: any[]=[];
       apiUrl: string = environment.apiUrl;


  // apiUrl: string=environment.apiUrl;
  // listCategorias: any[]= []; // Declara la variable como un array de Productos
  constructor(private router: Router, private categoriaService: CategoriaService,
  private alertCtrl: AlertController, private http: HttpClient ) {}

  ngOnInit(): void {
    this.obtenerCategoria();
  }

  actualizarCambios() {
    this.obtenerCategoria();  // Volver a cargar las categorías
  }


  obtenerCategoria() {
    this.http.get<any[]>(`${environment.apiUrl}/categoria`).subscribe({
      next: (response) => {
        this.categorias = response;
        console.log('=>', response);
      },
      error: (error) => {
        console.error('Error al obtener productos:', error);
      }
    });
}


  eliminarCategoria(id: string) {
    this.categoriaService.deleteCategoria(id).subscribe(() => {
      this.obtenerCategoria();
      this.mostrarAlerta();
    });
  }


  async mostrarAlerta() {
    const alert = await this.alertCtrl.create({
      header: 'Eliminado correctamente',
      message: 'La categoría ha sido eliminada exitosamente.',
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
    this.router.navigate(['/product']); //
  }

  navigateToPage4() {
    this.router.navigate(['/productoNuevo']); //
  }

  navigateToPage5() {
    this.router.navigate(['/event']); //
  }
  navigateToPage6() {
    this.router.navigate(['/lotery']); //
  }
  navigateToPage7() {
    this.router.navigate(['/qSomo']); //
  }

  navigateToPage8() {
    this.router.navigate(['/categorias']); //
  }

// async verDetalles2(id: string) {
//   const categoriaSeleccionada = this.listCategorias.find(cat => cat._id === id);

//   const alert = await this.alertCtrl.create({
//     header: categoriaSeleccionada.nombre,
//     message: `
//       <ion-img src="${categoriaSeleccionada.imagen}" alt="${categoriaSeleccionada.nombre}"></ion-img>
//     `,
//     buttons: ['OK']
//   });

//   await alert.present();
// }
}
