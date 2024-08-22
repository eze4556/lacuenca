import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductNuevoComponent } from '../productoNuevo/productoNuevo.component';
import { NuevoProductoService } from 'src/app/services/productoNuevo.service';
import { NuevoProducto } from 'src/app/models/pNuevo';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-editarNuevo',
  templateUrl: './productoEditar.component.html',
})
export class EditarNuevoComponent implements OnInit {
 nuevosProductosForm: FormGroup;
  titulo = 'Editar Producto';
  id: string | null;

  constructor(private fb: FormBuilder,
              private router: Router,
              private alertCtrl: AlertController,
              private NuevoProductoService:NuevoProductoService,
              private activatedRoute: ActivatedRoute) {

    this.nuevosProductosForm = this.fb.group({
      nombre: ['', Validators.required],
      precio: ['', Validators.required],
      descripcion: [''],
      descuento: [''],
      precioFinal: [''],
      imagen: [''], // Agregado para manejar la edición de imágenes
      categorias: [[]] // Agregado para manejar la edición de categorías
    });
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log('ID del producto:', this.id);
  }

  ngOnInit(): void {
    this.editarProducto();


this.subscribeToPriceChanges();

  }


  private subscribeToPriceChanges(): void {
    this.nuevosProductosForm.get('precio')?.valueChanges.subscribe((precio: number) => {
      const descuento = this.nuevosProductosForm.get('descuento')?.value || 0;
      const precioFinal = precio - descuento;
      this.nuevosProductosForm.patchValue({ precioFinal });
    });

    this.nuevosProductosForm.get('descuento')?.valueChanges.subscribe((descuento: number) => {
      const precio = this.nuevosProductosForm.get('precio')?.value || 0;
      const precioFinal = precio - descuento;
      this.nuevosProductosForm.patchValue({ precioFinal });
    });
  }

  goBack() {
    window.history.back();
  }

editarProducto(): void {
  const id = this.id;
  if (id) {
    this.NuevoProductoService.getProductoNuevoById(id).subscribe({
      next: (NuevoProducto) => {
        this.nuevosProductosForm.patchValue({
          nombre: NuevoProducto.nombre,
          descripcion: NuevoProducto.descripcion,
          precio: NuevoProducto.precio,
          descuento: NuevoProducto.descuento || 0,
          precioFinal: NuevoProducto.precio - (NuevoProducto.descuento || 0),
          imagen: NuevoProducto.imagen ? NuevoProducto.imagen : '',
          categorias: NuevoProducto.categorias
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
  const nombre = this.nuevosProductosForm.get('nombre')?.value;
  const descripcion = this.nuevosProductosForm.get('descripcion')?.value;
  const precio = this.nuevosProductosForm.get('precio')?.value;
  const descuento = this.nuevosProductosForm.get('descuento')?.value;
  const precioFinal = this.nuevosProductosForm.get('precioFinal')?.value;
  const imagen = this.nuevosProductosForm.get('imagen')?.value; // Obtener la imagen del formulario
  const categorias = this.nuevosProductosForm.get('categorias')?.value;

  if (!isNaN(precio)) {
    let precioFinalValue: number;

    if (!isNaN(descuento)) {
      precioFinalValue = precio - descuento;
    } else {
      precioFinalValue = precio;
    }

    this.nuevosProductosForm.patchValue({ precioFinal: precioFinalValue });

    if (nombre && !isNaN(precioFinalValue)) {
      const data = { nombre, descripcion, precio, descuento, precioFinal, imagen, categorias }; // Crear objeto con los datos del formulario

      if (this.id) {
        this.NuevoProductoService.editarProductoNuevo(this.id, data).subscribe({
          next: (response) => {
            console.log('Respuesta del backend:', response);
            console.log('Producto actualizado correctamente:', response);
            // this.mostrarAlerta();
            this.router.navigate(['/productoNuevo']);
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
