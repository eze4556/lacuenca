import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular'; 
import { SorteoService } from 'src/app/services/sorteo.service'; // Importa el servicio
import { sorteo } from 'src/app/models/sorteo';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-lotery',
  templateUrl: './lotery.component.html',
  styleUrls: ['./lotery.component.scss'],
})
export class SorteoComponent implements OnInit {

  listSorteo: any;


sorteos: any[]= []; 

       apiUrl: string = environment.apiUrl;

  constructor(private router: Router, private _sorteoService: SorteoService, private alertCtrl: AlertController) {}

  ngOnInit() {
    this.obtenerSorteo();
  }

  
  obtenerSorteo() {
    this._sorteoService.getSorteo().subscribe(data => {
      console.log(data);
      this.listSorteo = data;
    })
  }

  eliminarSorteo(id: any) {
    this._sorteoService.eliminarSorteo(id).subscribe(data => {
    this.obtenerSorteo();
    this.mostrarAlerta();
    })
  }

    async mostrarAlerta() {
    const alert = await this.alertCtrl.create({
      header: 'Eliminado correctamente',
      message: 'El sorteo ha sido eliminada exitosamente.',
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
    this.router.navigate(['/event']); //
  }
  navigateToPage7() {
    this.router.navigate(['/categoria']); //
  }
  navigateToPage8() {
    this.router.navigate(['/loteryes']); //
  }
}
