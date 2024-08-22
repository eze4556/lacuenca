import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/producto.service';1
import { Producto } from 'src/app/models/producto';
import { CategoriaService } from 'src/app/services/categoria.service';
import { Categoria } from 'src/app/models/categoria';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  productoForm: FormGroup;
  titulo = 'Crear Producto';
  id: string | null;
  fotoPerfil: File | null = null;
   categorias: Categoria[] = [];

     apiUrl: string = environment.apiUrl;

// original

  constructor(private fb: FormBuilder,
              private router: Router,
              private alertCtrl: AlertController,
              private productService: ProductService,
              private activatedRoute: ActivatedRoute, private categoriaService: CategoriaService  ) {

    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      imagen: ['', Validators.required],
      precio: ['', Validators.required],
      descripcion: [''],
      descuento: [''],
      precioFinal: [''],
      categorias: [[]],
      precioDistribuidor: [''],
      etiqueta: [''],
    });
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {

this.editarProducto();


    this.obtenerCategorias();


  // Escuchar cambios en el campo de precio y calcular precio final
    this.productoForm.get('precio')?.valueChanges.pipe(
      debounceTime(300), // Esperar 300ms después de la última pulsación
      distinctUntilChanged() // Emitir solo si el valor cambió
    ).subscribe(precio => {
      const descuento = this.productoForm.get('descuento')?.value || 0;
      const precioFinal = precio - descuento;
      this.productoForm.patchValue({ precioFinal: precioFinal });
    });

    // Escuchar cambios en el campo de descuento y calcular precio final
    this.productoForm.get('descuento')?.valueChanges.pipe(
      debounceTime(300), // Esperar 300ms después de la última pulsación
      distinctUntilChanged() // Emitir solo si el valor cambió
    ).subscribe(descuento => {
      const precio = this.productoForm.get('precio')?.value || 0;
      const precioFinal = precio - descuento;
      this.productoForm.patchValue({ precioFinal: precioFinal });
    });
  }


imagenUrl: string | null = null;



  goBack() {
    window.history.back();
  }

  onFileSelected(event: any): void {
    this.fotoPerfil = event.target.files[0] as File;
  }




  agregarProducto(): void {






    const nombre = this.productoForm.get('nombre')?.value;
    const descripcion = this.productoForm.get('descripcion')?.value;
    const precio = this.productoForm.get('precio')?.value;
    const descuento = this.productoForm.get('descuento')?.value;
    const precioFinal = this.productoForm.get('precioFinal')?.value;
const precioDistribuidor = this.productoForm.get('precioDistribuidor')?.value;
const etiqueta = this.productoForm.get('etiqueta')?.value;



    if (!isNaN(precio)) {
      let precioFinal: number;

      if (!isNaN(descuento)) {
        // Si se ingresó un descuento, calcular el precio final
        precioFinal = precio - descuento;
      } else {
        // Si no se ingresó un descuento, el precio final es igual al precio
        precioFinal = precio;
      }

      this.productoForm.patchValue({ precioFinal: precioFinal });

      console.log('Datos del formulario:', this.productoForm.value);

      if (nombre && this.fotoPerfil && !isNaN(precioFinal)) {
        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('descripcion', descripcion);
        formData.append('imagen', this.fotoPerfil);
        formData.append('precio', precio.toString());
        formData.append('descuento', descuento.toString());
        formData.append('precioFinal', precioFinal.toString());
        formData.append('precioDistribuidor', precioDistribuidor.toString());
        formData.append('etiqueta', etiqueta.toString());



// Obtener las categorías seleccionadas del formulario
      const categoriasSeleccionadas = this.productoForm.get('categorias')?.value;


      // Log de las categorías seleccionadas
      console.log('Categorías seleccionadas:', categoriasSeleccionadas);


      if (categoriasSeleccionadas) {
        categoriasSeleccionadas.forEach((categoria: string) => {
          formData.append('categorias[]', categoria); // Agregar categorías al FormData
        });
      }




      this.productService.createProductoWithImage(formData).subscribe({
        next: (response) => {
          console.log('Producto creada correctamente:', response);
          this.mostrarAlerta();
          this.router.navigate(['/product']);
        },
        error: (err) => {
          console.error('Error al crear el evento:', err);
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


// editarProducto(): void {
//   const id = this.id;
//   if (id) {
//     this.productService.getProductoById(id).subscribe({
//       next: (producto) => {
//         // Una vez que se reciban los datos del producto, establecer los valores del formulario
//         this.productoForm.patchValue({
//           nombre: producto.nombre,
//           descripcion: producto.descripcion,
//           precio: producto.precio,
//           descuento: producto.descuento,
//           precioFinal: producto.precioFinal,
//           categorias: producto.categorias // Asegúrate de que las categorías estén correctamente formateadas
//         });


//       this.titulo = 'Editar Producto';





//             if (producto.imagen && !this.fotoPerfil) {

//           this.imagenUrl = `${this.apiUrl}/uploads/${producto.imagen}`;
//         }




//         // Resto del código para actualizar el producto después de editar
//         const nombre = this.productoForm.get('nombre')?.value;
//         const descripcion = this.productoForm.get('descripcion')?.value;
//         const precio = this.productoForm.get('precio')?.value;
//         const descuento = this.productoForm.get('descuento')?.value;
//         const precioFinal = this.productoForm.get('precioFinal')?.value;

//         if (!isNaN(precio)) {
//           let precioFinal: number;

//           if (!isNaN(descuento)) {
//             // Si se ingresó un descuento, calcular el precio final
//             precioFinal = precio - descuento;
//           } else {
//             // Si no se ingresó un descuento, el precio final es igual al precio
//             precioFinal = precio;
//           }

//           this.productoForm.patchValue({ precioFinal: precioFinal });

//           console.log('Datos del formulario:', this.productoForm.value);

//           if (nombre && !isNaN(precioFinal)) {
//             const formData = new FormData();
//             formData.append('nombre', nombre);
//             formData.append('descripcion', descripcion);
//             if (this.fotoPerfil) {
//               formData.append('imagen', this.fotoPerfil);
//             }
//             formData.append('precio', precio.toString());
//             formData.append('descuento', descuento.toString());
//             formData.append('precioFinal', precioFinal.toString());

//             // Obtener las categorías seleccionadas del formulario
//             const categoriasSeleccionadas = this.productoForm.get('categorias')?.value;

//             if (categoriasSeleccionadas) {
//               categoriasSeleccionadas.forEach((categoria: string) => {
//                 formData.append('categorias[]', categoria); // Agregar categorías al FormData
//               });
//             }

//             // Llamar al servicio para actualizar el producto
//             this.productService.updateProductoWithImage(id, formData).subscribe({
//               next: (response) => {
//                 console.log('Producto actualizado correctamente:', response);

//               },
//               error: (err) => {
//                 console.error('Error al actualizar el producto:', err);
//                 // Manejar el error según sea necesario
//               }
//             });
//           }
//         }
//       },
//       error: (err) => {
//         console.error('Error al obtener los datos del producto:', err);
//         // Manejar el error según sea necesario
//       }
//     });
//   }
// }


editarProducto(): void {
  const id = this.id;
  if (id) {
    this.productService.getProductoById(id).subscribe({
      next: (producto) => {
        // Una vez que se reciban los datos del producto, establecer los valores del formulario
        this.productoForm.patchValue({
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: producto.precio,
          descuento: producto.descuento,
          precioFinal: producto.precioFinal,
          precioDistribuidor: producto.precioDistribuidor,
          etiqueta: producto.etiqueta,
          categorias: producto.categorias // Asegúrate de que las categorías estén correctamente formateadas
        });

        this.titulo = 'Editar Producto'; // Actualizar el título

        if (producto.imagen && !this.fotoPerfil) {
          // Si hay una imagen existente pero no se ha seleccionado una nueva,
          // simplemente utilizar la imagen existente
          this.imagenUrl = `${this.apiUrl}/uploads/${producto.imagen}`;
        }

        // Verificar si hay una imagen seleccionada y si no, actualizar la imagen en el formulario
        if (!this.fotoPerfil && this.productoForm.get('imagen')?.value === '') {
          this.productoForm.patchValue({ imagen: producto.imagen });
        }

        // Resto del código para actualizar el producto después de editar
        const nombre = this.productoForm.get('nombre')?.value;
        const descripcion = this.productoForm.get('descripcion')?.value;
        const precio = this.productoForm.get('precio')?.value;
        const descuento = this.productoForm.get('descuento')?.value;
        const precioFinal = this.productoForm.get('precioFinal')?.value;
        const precioDistribuidor = this.productoForm.get('precioDistribuidor')?.value;
        const etiqueta = this.productoForm.get('etiqueta')?.value;


        if (!isNaN(precio)) {
          let precioFinalCalculated: number;

          if (!isNaN(descuento)) {
            // Si se ingresó un descuento, calcular el precio final
            precioFinalCalculated = precio - descuento;
          } else {
            // Si no se ingresó un descuento, el precio final es igual al precio
            precioFinalCalculated = precio;
          }

          if (precioFinalCalculated !== precioFinal) {
            // Actualizar el precio final en el formulario si es diferente
            this.productoForm.patchValue({ precioFinal: precioFinalCalculated });
          }

          // Verificar que los campos requeridos no estén vacíos antes de actualizar
          if (nombre && precio && precioFinalCalculated >= 0) {
            const formData = new FormData();
            formData.append('nombre', nombre);
            formData.append('descripcion', descripcion);
            if (this.fotoPerfil) {
              formData.append('imagen', this.fotoPerfil);
            }
            formData.append('precio', precio.toString());
            formData.append('descuento', descuento.toString());
            formData.append('precioFinal', precioFinalCalculated.toString());
            formData.append('precioDistribuidor', precioDistribuidor.toString());
            formData.append('etiqueta', etiqueta.toString());


            // Obtener las categorías seleccionadas del formulario
            const categoriasSeleccionadas = this.productoForm.get('categorias')?.value;

            if (categoriasSeleccionadas) {
              categoriasSeleccionadas.forEach((categoria: string) => {
                formData.append('categorias[]', categoria); // Agregar categorías al FormData
              });
            }

            // Llamar al servicio para actualizar el producto
            this.productService.editarProducto(id, formData).subscribe({
              next: (response) => {
                console.log('Producto actualizado correctamente:', response);
                // this.router.navigate(['/product']);
              },
              error: (err) => {
                console.error('Error al actualizar el producto:', err);
                // Manejar el error según sea necesario
              }
            });
          }
        }
      },
      error: (err) => {
        console.error('Error al obtener los datos del producto:', err);
        // Manejar el error según sea necesario
      }
    });
  }
}




}
