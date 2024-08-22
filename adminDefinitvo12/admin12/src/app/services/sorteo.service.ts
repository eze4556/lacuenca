import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError} from 'rxjs';
import { catchError} from 'rxjs/operators';
import { sorteo } from 'src/app/models/sorteo'
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SorteoService {
  private apiUrl = `${environment.apiUrl}/sorteo`;

  constructor(private http: HttpClient) { }

  getSorteo(): Observable<sorteo> {
    return this.http.get<sorteo>(this.apiUrl);
  }

  eliminarSorteo(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // guardarSorteo(sorteo: sorteo): Observable<any> {
  //   return this.http.post(this.apiUrl,sorteo)
  //     .pipe(
  //       catchError((error: any) => {
  //         console.error('Error al guardar el sorteo:', error);
  //         return throwError(error);
  //       })
  //     );
  // }

  createSorteoWithImage(formData: FormData): Observable<sorteo> {
    const titulo = formData.get('titulo') as string; 
    const nombre = formData.get('nombre') as string; 
    const imagen = formData.get('imagen') as File; 
    const fechaString = formData.get('fecha') as string;  // Obtener la fecha como string
    const fecha = new Date(fechaString); // Convertir el string a Date
    const descripcion = formData.get('descripcion') as string; 
    // Verificar que se haya obtenido el nombre y la imagen
    if (!nombre || !titulo || !imagen || !fecha || !descripcion) {
      throw new Error('El nombre y la imagen son requeridos para crear una categoría.');
    }
  
    
    const formDataClone = new FormData();
    formData.forEach((value, key) => {
      formDataClone.append(key, value);
    });
  
    // Realizar la solicitud POST al backend con el FormData clonado
    return this.http.post<sorteo>(this.apiUrl, formDataClone);
  }
  
  

  obtenerSorteo(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  editarSorteo(id: string, sorteo: sorteo): Observable<any>{
    return this.http.put(`${this.apiUrl}/${id}` , sorteo);
  }
}