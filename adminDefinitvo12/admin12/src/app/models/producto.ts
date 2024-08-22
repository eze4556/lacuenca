export interface Producto {
  _id?: string; // Podrías tener un identificador único en el frontend si lo necesitas
  nombre: string;
  descripcion: string;
  imagen?: string;
  precio: number;
  descuento?: number;
  precioFinal: number;
  precioDistribuidor?: number;
  etiqueta?: string;
  categorias: string[];
}


// export interface Producto {
//   _id?: string; // Podrías tener un identificador único en el frontend si lo necesitas
//   titulo: string;
//   descripcion?: string;
//   media?: string; // Puede ser una imagen o video
//   categorias: string[]; // IDs de las categorías
//   fecha?: Date; // Fecha del producto, opcional
// }
