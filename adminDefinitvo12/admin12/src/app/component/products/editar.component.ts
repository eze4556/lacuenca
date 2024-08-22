import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/producto.service';
import { Producto } from 'src/app/models/producto';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
})
export class EditarProductoComponent implements OnInit {
  productoForm: FormGroup;
  titulo = 'Editar Producto';
  id: string | null;

  constructor(private fb: FormBuilder,
              private router: Router,
              private alertCtrl: AlertController,
              private productService: ProductService,
              private activatedRoute: ActivatedRoute) {

    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      precio: ['', Validators.required],
      descripcion: [''],
      descuento: [''],
      precioFinal: [''],
      imagen: [''], // Agregado para manejar la edición de imágenes
      categorias: [[]] // Agregado para manejar la edición de categorías
    });
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.editarProducto();


this.subscribeToPriceChanges();

  }


  private subscribeToPriceChanges(): void {
    this.productoForm.get('precio')?.valueChanges.subscribe((precio: number) => {
      const descuento = this.productoForm.get('descuento')?.value || 0;
      const precioFinal = precio - descuento;
      this.productoForm.patchValue({ precioFinal });
    });

    this.productoForm.get('descuento')?.valueChanges.subscribe((descuento: number) => {
      const precio = this.productoForm.get('precio')?.value || 0;
      const precioFinal = precio - descuento;
      this.productoForm.patchValue({ precioFinal });
    });
  }

  goBack() {
    window.history.back();
  }

editarProducto(): void {
  const id = this.id;
  if (id) {
    this.productService.getProductoById(id).subscribe({
      next: (producto) => {
        this.productoForm.patchValue({
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: producto.precio,
          descuento: producto.descuento || 0,
          precioFinal: producto.precio - (producto.descuento || 0),
          imagen: producto.imagen ? producto.imagen : '',
          categorias: producto.categorias
        });
        this.titulo = 'Editar Producto';
      },
      error: (err) => {
        console.error('Error al obtener los datos del producto:', err);
      }
    });
  }
}

guardarCambios(): void {
  const nombre = this.productoForm.get('nombre')?.value;
  const descripcion = this.productoForm.get('descripcion')?.value;
  const precio = this.productoForm.get('precio')?.value;
  const descuento = this.productoForm.get('descuento')?.value;
  const precioFinal = this.productoForm.get('precioFinal')?.value;
  const imagen = this.productoForm.get('imagen')?.value; // Obtener la imagen del formulario
  const categorias = this.productoForm.get('categorias')?.value;

  if (!isNaN(precio)) {
    let precioFinalValue: number;

    if (!isNaN(descuento)) {
      precioFinalValue = precio - descuento;
    } else {
      precioFinalValue = precio;
    }

    this.productoForm.patchValue({ precioFinal: precioFinalValue });

    if (nombre && !isNaN(precioFinalValue)) {
      const data = { nombre, descripcion, precio, descuento, precioFinal, imagen, categorias }; // Crear objeto con los datos del formulario

      if (this.id) {
        this.productService.editarProducto(this.id, data).subscribe({
          next: (response) => {
            console.log('Respuesta del backend:', response);
            console.log('Producto actualizado correctamente:', response);
            // this.mostrarAlerta();
            this.router.navigate(['/product']);
          },
          error: (err) => {
            console.error('Error al actualizar el producto:', err);
          }
        });
      }
    }
  }
}
}
