
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NuevoProducto } from '../models/pNuevo';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NuevoProductoService {
 private apiUrl = `${environment.apiUrl}/nuevoProducto`;

  constructor(private http: HttpClient) { }



  // ok funciona

   getProductoNuevoById(id: string): Observable<NuevoProducto> {
    return this.http.get<NuevoProducto>(`${this.apiUrl}/${id}`);
  }

 createNewProductoWithImage(formData: FormData): Observable<NuevoProducto> {
    const nombre = formData.get('nombre') as string; 
    const descripcion = formData.get('descripcion') as string; 
    const imagen = formData.get('imagen') as File; 
    const precioString = formData.get('precio');
    const descuentoString = formData.get('descuento');
    const precioFinalString = formData.get('precioFinal');

    if (!nombre || !imagen || precioString === null || descuentoString === null || precioFinalString === null) {
      throw new Error('El nombre, la imagen, el precio, el descuento y el precio final son requeridos para crear un producto.');
    }

    const precio = +precioString;
    const descuento = +descuentoString;
    const precioFinal = +precioFinalString;

    // Verificar que los valores numéricos sean válidos
    if (isNaN(precio) || isNaN(descuento) || isNaN(precioFinal)) {
      throw new Error('Los valores de precio, descuento y precio final deben ser numéricos.');
    }
  
    const formDataClone = new FormData();
    formData.forEach((value, key) => {
      formDataClone.append(key, value);
    });

    
  
    // Realizar la solicitud POST al backend con el FormData clonado
    return this.http.post<NuevoProducto>(this.apiUrl, formDataClone);
  }

  // updateProductoNuevo(id: string, nuevoProducto: NuevoProducto): Observable<NuevoProducto> {
  //   return this.http.put<NuevoProducto>(`${this.apiUrl}/${id}`, nuevoProducto);
  // }

  deleteProductoNuevo(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

 

  

  editarProductoNuevo(id: string, data: any): Observable<NuevoProducto> {
    return this.http.put<NuevoProducto>(`${this.apiUrl}/${id}`, data);
  }

  getAllProductoNuevo(): Observable<NuevoProducto[]> {
    return this.http.get<NuevoProducto[]>(this.apiUrl);
  }
  
}