export interface userToVerify {
  email: string,
  password: string
}

export interface userToRegister {
  username: string,
  password: string,
  email: string,
  phone?: string,
  direction?: string
}

export interface LoginResponse {
  data: {
    message: string;
    token: string;
    username: string;
    tipo_user: string;
    user_id: string
  };
  status: number;
  statusText: string;
  headers: {
    "content-length": string;
    "content-type": string;
  };
}

export interface RegisterResponse {
  data: {
    message: string;
    token: string;
    username: string;
    tipo_user: string;
    user_id: string
  };
  status: number;
  statusText: string;
  headers: {
    "content-length": string;
    "content-type": string;
  };
}

export interface RecoverPassword {
  email: string
}

export interface RecoverResponde {
  data: {
    message: string;
  };
  status: number;
  statusText: string;
  headers: {
    "content-length": string;
    "content-type": string;
  };
}

export interface Token {
  token: string
}

export interface TokenResponse {
  data: {
    message: string;
    valid: boolean;
  };
  status: number;
  statusText: string;
  headers: {
    "content-length": string;
    "content-type": string;
  };
}

export interface NewPassword {
  newPassword: string,
  repeatNewPassword?: string
}

export interface UpdatePassword {
  password: string,
  token: string
}

export interface NewPasswordResponse {
  data: {
    message: string;
  };
  status: number;
  statusText: string;
  headers: {
    "content-length": string;
    "content-type": string;
  };
}

export interface NewService {
  nombre: string;
  precio: number;
  descripcion: string;
  imagen: string;
}

export interface NewGallery {
  id_servicios: string;
  imagen_link: string;
}

export interface GetServicesResponse {
  data: Services[];
  status: number;
  statusText: string;
  headers: {
    "content-length": string;
    "content-type": string;
  };
}

export interface GetGalleryResponse {
  data: GalleryData[];
  status: number;
  statusText: string;
  headers: {
    "content-length": string;
    "content-type": string;
  };
}

export interface GalleryData {
  id_imagen: string;
  id_servicios: string;
  imagen_link: string;
}

export interface Services {
  nombre: string;
  precio: number;
  descripcion: string;
  id_servicios: string;
  imagen_link: string;
}

export interface updateServices {
  nombre?: string;
  precio?: number;
  descripcion?: string;
  imagen_link?: string;
}

export interface ServicesShoppingCart {
  nombre: string;
  precio: number;
  descripcion: string;
  id_servicios: string;
  imagen_link: string;
  id_shopping_cart: string;
}

export interface ApiResponse {
  data: {
    message: string;
    id?: string
  };
  status: number;
}

export interface ShoppingCart {
  id_shopping_cart: string,
  id_usuario: string,
  valor_total: string,
  id_servicios: string
}
export interface CreateShoppingCart {
  id_usuario: string,
  valor_total: number,
  id_servicios: string
}

export interface GetShoppingCartResponse {
  data: ShoppingCart[];
  status: number;
  statusText: string;
  headers: {
    "content-length": string;
    "content-type": string;
  };
}

export interface UpdateShoppingCart {
  id_usuario?: string,
  valor_total?: number,
  id_servicios?: string
}

export interface CreateEquipment {
  nombre_equipo: string,
  tipo_equipo: string,
  id_servicios: string
}

export interface UpdateEquipment {
  nombre_equipo?: string,
  tipo_equipo?: string
}

export interface Equipment {
  id_equipo?: string,
  nombre_equipo: string,
  tipo_equipo: string,
  id_servicios: string
}

export interface GetEquipmentResponse {
  data: Equipment[];
  status: number;
  statusText: string;
  headers: {
    "content-length": string;
    "content-type": string;
  };
}

export interface MetricsService {
  total_compra: number;
  id_servicios: string;
  fecha_compra: string;
  nombre: string;
  precio: number;
}

export interface GetMetricsServiceResponse {
  data: MetricsService[];
  status: number;
}

export const periods = {
  lastMonth: 'Último mes',
  last3Months: 'Últimos 3 meses',
  last6Months: 'Últimos 6 meses',
  allTime: 'Desde siempre',
};
export interface Messages {
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  mensaje: string;
}

export interface GetMessagesResponse {
  data: Messages[];
  status: number;
}
export interface Colaborations {
  nombre_empresa: string,
  id_servicios: string,
  imagen_link: string,
  id_collaboration?: string
}

export interface GetColaborationsReponse {
  data: Colaborations[];
  status: number;
    statusText: string;
    headers: {
    "content-length": string;
    "content-type": string;
}
}
export interface CreateColaborations {
  nombre_empresa: string,
  id_servicios: string,
  imagen_link: string
}

export interface UpdateColaborations {
  nombre_empresa?: string,
  fecha_colaboracion?: string,
  id_servicios?: string,
  imagen_link?: string,
  id_collaboration?: string
}
