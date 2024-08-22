import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError} from 'rxjs/operators';
import { throwError } from 'rxjs';
import { somos } from 'src/app/models/quienesSomos'
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SomosService {
  private apiUrl = `${environment.apiUrl}/quienesSomos`;

  constructor(private http: HttpClient) { }

  getSomos(): Observable<somos> {
    return this.http.get<somos>(this.apiUrl);
  }

  eliminarSomos(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // guardarSomos(somos: somos): Observable<somos> {
  //   return this.http.post<somos>(this.apiUrl, somos)
  // }

  createSomosWithImage(formData: FormData): Observable<somos> {
    const imagen = formData.get('imagen') as File;
    const descripcion = formData.get('descripcion') as string;

    // Verificar que se haya obtenido el nombre y la imagen
    if (!descripcion || !imagen) {
      throw new Error('El nombre y la imagen son requeridos para crear una categoría.');
    }


    const formDataClone = new FormData();
    formData.forEach((value, key) => {
      formDataClone.append(key, value);
    });

    // Realizar la solicitud POST al backend con el FormData clonado
    return this.http.post<somos>(this.apiUrl, formDataClone);
  }



  obtenerSomos(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  editarSomos(id: string, somos: somos): Observable<any>{
    return this.http.put(`${this.apiUrl}/${id}`, somos);
  }
}
