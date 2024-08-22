import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { EventoService } from 'src/app/services/evento.service'; // Importa el servicio
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})
export class EventComponent implements OnInit {
  listEvent: any[]=[];

  eventos: any[]= [];

       apiUrl: string = environment.apiUrl;


  constructor(private router: Router, private _eventoService: EventoService,
    private http: HttpClient,  private alertCtrl: AlertController
  ) {}

  ngOnInit(): void{
    this.obtenerEvento();
  }

  // obtenerEvento() {
  //   this._eventoService.getEvento().subscribe(data => {
  //     console.log(data);
  //     this.listEvent = data;
  //   })
  // }

    actualizarCambios() {
    this.obtenerEvento();  // Volver a cargar las categorías
  }


  obtenerEvento() {
    this.http.get<any[]>(`${environment.apiUrl}/evento`).subscribe({
      next: (response) => {
        this.listEvent = response;
        console.log('=>', response);
      },
      error: (error) => {
        console.error('Error al obtener los eventos:', error);
      }
    });
}
  eliminarEvento(id: any) {
    this._eventoService.eliminarEvento(id).subscribe(data => {
    this.obtenerEvento();
    this.mostrarAlerta();
    })
  }


    async mostrarAlerta() {
    const alert = await this.alertCtrl.create({
      header: 'Eliminado correctamente',
      message: 'El evento ha sido eliminado exitosamente.',
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
    this.router.navigate(['/qSomo']); //
  }
  navigateToPage6() {
    this.router.navigate(['/lotery']); //
  }
  navigateToPage7() {
    this.router.navigate(['/categoria']); //
  }
  navigateToPage8() {
    this.router.navigate(['/events']); //
  }
}
