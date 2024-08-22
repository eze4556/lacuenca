import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular'; 
import { CategoriaService } from 'src/app/services/categoria.service';
import { Categoria } from 'src/app/models/categoria';


@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss'],
})
export class CategoriasComponent implements OnInit {
  categoriaForm: FormGroup ;
  titulo = 'Crear Categoria';
  id: string | null;
  fotoPerfil: File | null = null; 
  categoria: any;

  imagenURL: string | null = null;


  constructor(private fb: FormBuilder,
              private router: Router,
              private alertCtrl: AlertController,
              private categoriaService: CategoriaService,
              private activatedRoute: ActivatedRoute) {
    this.categoriaForm = this.fb.group({
      nombre: ['', Validators.required],
      imagen: ['', Validators.required],    
    });
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.esEditar();
  }

  goBack() {
    window.history.back();
  }

  onFileSelected(event: any): void {
    this.fotoPerfil = event.target.files[0] as File;
  }

  agregarCategoria(): void {
    const nombre = this.categoriaForm.get('nombre')?.value;

    if (nombre && this.fotoPerfil) {
      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('imagen', this.fotoPerfil);

        console.log('FormData:', formData);

      this.categoriaService.createCategoriaWithImage(formData).subscribe({
        next: (response) => {
          console.log('Categoría creada correctamente:', response);
          this.mostrarAlerta();
          this.router.navigate(['/categoria']);
        },
        error: (err) => {
          console.error('Error al crear la categoría:', err);
          // Manejar el error según sea necesario
        }
      });
    }
  }


  
  async mostrarAlerta() {
    const alert = await this.alertCtrl.create({
      header: 'Agregada correctamente',
      message: 'Categoria agregada exitosamente.',
      buttons: ['OK']
    });

    await alert.present();
  }

 
  
  // esEditar() {
  //   if (this.id !== null) {
  //     this.titulo = 'Editar Categoria';
  //     this.categoriaService.getCategoriaById(this.id).subscribe(data => {
  //       if (data) {
  //         this.categoria = data;
  //         this.categoriaForm.controls['nombre'].setValue(data.nombre);
  //         // Agrega la imagen solo si no estás en modo de edición
  //         if (!this.esModoEdicion()) {
  //           this.categoriaForm.controls['imagen'].setValue(data.imagen);
  //         }
  //       }
  //     });
  //   }
  // }
  esEditar() {
    if (this.id !== null) {
      this.titulo = 'Editar Categoria';
      this.categoriaService.getCategoriaById(this.id).subscribe((data) => {
        if (data) {
          this.categoria = data;
          this.categoriaForm.controls['nombre'].setValue(data.nombre);
          // Cargar la imagen en el formulario
          this.imagenURL = `/uploads/${data.imagen}`
        }
      });
    }
  }

  esModoEdicion(): boolean {
    return this.id !== null;
  }

}
