import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NuevoProductoService } from 'src/app/services/productoNuevo.service';
import { NuevoProducto } from 'src/app/models/pNuevo';
import { CategoriaService } from 'src/app/services/categoria.service';
import { Categoria } from 'src/app/models/categoria';
import { AlertController } from '@ionic/angular'; 
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';



@Component({
  selector: 'app-products',
  templateUrl: './productosNuevos.component.html',
  styleUrls: ['./productosNuevos.component.scss'],
})
export class NuevosProductsComponent implements OnInit {
  nuevosProductosForm: FormGroup;
  titulo = 'Crear Nuevo Producto';
  id: string | null;
   fotoPerfil: File | null = null; 
   categorias: Categoria[] = [];

  constructor(private fb: FormBuilder,
              private router: Router,
              private alertCtrl: AlertController,
              private nuevoProductoService: NuevoProductoService,
              private activatedRoute: ActivatedRoute, private categoriaService: CategoriaService) {
    this.nuevosProductosForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      imagen: ['', Validators.required],
      precio: ['', Validators.required],
      descuento: [''],
      precioFinal: [''],
      categorias: [[]] 
      
    });
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
  }


  ngOnInit(): void {
    this.esEditar();
    this.obtenerCategorias();


  // Escuchar cambios en el campo de precio y calcular precio final
    this.nuevosProductosForm.get('precio')?.valueChanges.pipe(
      debounceTime(300), // Esperar 300ms después de la última pulsación
      distinctUntilChanged() // Emitir solo si el valor cambió
    ).subscribe(precio => {
      const descuento = this.nuevosProductosForm.get('descuento')?.value || 0;
      const precioFinal = precio - descuento;
      this.nuevosProductosForm.patchValue({ precioFinal: precioFinal });
    });

    // Escuchar cambios en el campo de descuento y calcular precio final
    this.nuevosProductosForm.get('descuento')?.valueChanges.pipe(
      debounceTime(300), // Esperar 300ms después de la última pulsación
      distinctUntilChanged() // Emitir solo si el valor cambió
    ).subscribe(descuento => {
      const precio = this.nuevosProductosForm.get('precio')?.value || 0;
      const precioFinal = precio - descuento;
      this.nuevosProductosForm.patchValue({ precioFinal: precioFinal });
    });
  }

  goBack() {
    window.history.back();
  }

  onFileSelected(event: any): void {
    this.fotoPerfil = event.target.files[0] as File;
  }
  
  // agregarProductoNuevo(): void {
  //   const nombre = this.nuevosProductosForm.get('nombre')?.value;
  //   const precio = this.nuevosProductosForm.get('precio')?.value;
  //   const descuento = this.nuevosProductosForm.get('descuento')?.value;
  //   const precioFinal = this.nuevosProductosForm.get('precioFinal')?.value;

  //   if (nombre && this.fotoPerfil && precio && descuento && precioFinal) {
  //     const formData = new FormData();
  //     formData.append('nombre', nombre);
  //     formData.append('imagen', this.fotoPerfil);
  //     formData.append('precio', precio);
  //     formData.append('descuento', descuento);
  //     formData.append('precioFinal', precioFinal);
  
  //     this.nuevoProductoService.createNewProductoWithImage(formData).subscribe({
  //       next: (response) => {
  //         console.log('Evento creada correctamente:', response);
  //         this.router.navigate(['/productoNuevo']);
  //       },
  //       error: (err) => {
  //         console.error('Error al crear el evento:', err);
  //         // Manejar el error según sea necesario
  //       }
  //     });
  //   }
  // }


agregarProductoNuevo(): void {
    const nombre = this.nuevosProductosForm.get('nombre')?.value;
    const descripcion = this.nuevosProductosForm.get('descripcion')?.value;
    const precio = this.nuevosProductosForm.get('precio')?.value;
    const descuento = this.nuevosProductosForm.get('descuento')?.value;
    const precioFinal = this.nuevosProductosForm.get('precioFinal')?.value;
    


    if (!isNaN(precio)) {
      let precioFinal: number;

      if (!isNaN(descuento)) {
        // Si se ingresó un descuento, calcular el precio final
        precioFinal = precio - descuento;
      } else {
        // Si no se ingresó un descuento, el precio final es igual al precio
        precioFinal = precio;
      }

      this.nuevosProductosForm.patchValue({ precioFinal: precioFinal });

      console.log('Datos del formulario:', this.nuevosProductosForm.value);

      if (nombre && this.fotoPerfil && !isNaN(precioFinal)) {
        const formData = new FormData();
        formData.append('nombre', nombre);
         formData.append('descripcion', descripcion);
        formData.append('imagen', this.fotoPerfil);
        formData.append('precio', precio.toString());
        formData.append('descuento', descuento.toString());
        formData.append('precioFinal', precioFinal.toString());

// Obtener las categorías seleccionadas del formulario
      const categoriasSeleccionadas = this.nuevosProductosForm.get('categorias')?.value;


      // Log de las categorías seleccionadas
      console.log('Categorías seleccionadas:', categoriasSeleccionadas);

      
      if (categoriasSeleccionadas) {
        categoriasSeleccionadas.forEach((categoria: string) => {
          formData.append('categorias[]', categoria); // Agregar categorías al FormData
        });
      }

  
      this.nuevoProductoService.createNewProductoWithImage(formData).subscribe({
        next: (response) => {
          console.log('Producto creada correctamente:', response);
          this.mostrarAlerta() 
          this.router.navigate(['/productoNuevo']);
        },
        error: (err) => {
          console.error('Error al crear el nuevo producto:', err);
          // Manejar el error según sea necesario
        }
      });
    }
    }

  }

    async mostrarAlerta() {
    const alert = await this.alertCtrl.create({
      header: 'Agregado correctamente',
      message: 'El producto ha sido agregado exitosamente.',
      buttons: ['OK']
    });

    await alert.present();
  }


   obtenerCategorias() {
    this.categoriaService.getAllCategorias().subscribe(categorias => {
      this.categorias = categorias;
    });
  }






  esEditar() {
    if (this.id !== null) {
      this.titulo = 'Editar Producto';
      this.nuevoProductoService.getProductoNuevoById(this.id).subscribe(data => {
        this.nuevosProductosForm.setValue({
          nombre: data.nombre,
          imagen: data.imagen,
          precio: data.precio,
          descuento: data.descuento,
          precioFinal: data.precioFinal,
        });
      });
    }
  }
}
