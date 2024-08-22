import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SomosService } from 'src/app/services/quienesSomos.service';
import { somos } from 'src/app/models/quienesSomos';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-quienesSomo',
  templateUrl: './quienesSomos.component.html',
  styleUrls: ['./quienesSomos.component.scss'],
})
export class SomosComponent implements OnInit {
  somosForm: FormGroup;
  titulo = 'Crear Banner Publicidad';
  id: string | null;
  fotoPerfil: File | null = null;
  constructor(private fb: FormBuilder,
              private router: Router,
              private quienesSomosService: SomosService,
               private alertCtrl: AlertController,
              private activatedRoute: ActivatedRoute) {
    this.somosForm = this.fb.group({
      imagen: ['', Validators.required],
      descripcion: ['', Validators.required]
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
  agregarSomos(): void {
    const descripcion = this.somosForm.get('descripcion')?.value;

    if (descripcion && this.fotoPerfil) {
      const formData = new FormData();
      formData.append('descripcion', descripcion);
      formData.append('imagen', this.fotoPerfil);

        console.log('FormData:', formData);
        console.log(formData)

      this.quienesSomosService.createSomosWithImage(formData).subscribe({
        next: (response) => {
          console.log('Quienes Somos creada correctamente:', response);
          this.mostrarAlerta();
          this.router.navigate(['/qSomo']);
        },
        error: (err) => {
          console.error('Error al crear Quienes Somos:', err);
          // Manejar el error según sea necesario
        }
      });
    }
  }

   async mostrarAlerta() {
    const alert = await this.alertCtrl.create({
      header: 'Agregado correctamente',
      message: 'Agregado exitosamente.',
      buttons: ['OK']
    });

    await alert.present();
  }


  esEditar() {
    if (this.id !== null) {
      this.titulo = 'Editar Quienes Somos';
      this.quienesSomosService.obtenerSomos(this.id).subscribe(data => {
        this.somosForm.setValue({
          imagen: data.imagen,
          descripcion: data.descripcion,
        });
      });
    }
  }
}
