import { Component, OnInit } from '@angular/core';
import {environment} from '../../../environments/environment'
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular'; 
import { ComentarioService } from 'src/app/services/comentario.service';


@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.scss'],
})
export class ComentariosComponent  implements OnInit {

   comentarios: any[]=[];
   apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router, private comentarioService  : ComentarioService ,  private alertCtrl: AlertController) { }

  ngOnInit() { this.getComentarios(); }



  //COMENTARIOS
getComentarios(){
  this.http.get<any[]>(`${environment.apiUrl}/comentario`).subscribe(
        (response) => {
          this.comentarios = response;
          console.log('=>',response)
        },
        (error) => {
          console.error('Error al obtener los comentarios:', error);
        }
      );
  }

  eliminarComentario(id: string) {
    this.comentarioService.deleteComentario(id).subscribe(() => {
      this.getComentarios();
      this.mostrarAlerta();
    });
  }
  
    async mostrarAlerta() {
    const alert = await this.alertCtrl.create({
      header: 'Eliminado correctamente',
      message: 'El comentario ha sido eliminado exitosamente.',
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


}
