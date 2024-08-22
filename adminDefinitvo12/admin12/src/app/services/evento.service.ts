import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError} from 'rxjs/operators';
import { throwError } from 'rxjs';
import { event } from 'src/app/models/evento'
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private apiUrl = `${environment.apiUrl}/evento`;

  constructor(private http: HttpClient) { }

  getEvento(): Observable<event> {
    return this.http.get<event>(this.apiUrl);
  }

  eliminarEvento(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // guardarEvento(evento: event): Observable<event> {
  //   return this.http.post<event>(this.apiUrl, evento)
  //     .pipe(
  //       catchError((error: any) => {
  //         console.error('Error al guardar el evento:', error);
  //         return throwError(error);
  //       })
  //     );
  // }
  createEventoWithImage(formData: FormData): Observable<event> {
    const titulo = formData.get('titulo') as string;
    const imagen = formData.get('imagen') as File;
    const fechaString = formData.get('fecha') as string;  // Obtener la fecha como string
    const fecha = new Date(fechaString); // Convertir el string a Date
    const descripcion = formData.get('descripcion') as string;

    // Verificar que se haya obtenido el nombre y la imagen
    if (!titulo || !imagen || !fecha || !descripcion) {
      throw new Error('El nombre y la imagen son requeridos para crear un evento.');
    }


    const formDataClone = new FormData();
    formData.forEach((value, key) => {
      formDataClone.append(key, value);
    });

    // Realizar la solicitud POST al backend con el FormData clonado
    return this.http.post<event>(this.apiUrl, formDataClone);
  }



  obtenerEvento(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  editarEvento(id: string, evento: event): Observable<any>{
    return this.http.put(`${this.apiUrl}/${id}`, evento);
  }
}
