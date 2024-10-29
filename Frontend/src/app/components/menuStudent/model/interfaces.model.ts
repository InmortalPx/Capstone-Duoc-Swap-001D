import { Buffer } from 'buffer';

// Interfaz para Estudiante - Mapea la tabla 'Estudiante' de la base de datos
export interface IEstudiante {
    idEstudiante: string;         // Clave primaria, identificador único del estudiante
    nombreCompleto: string;        // Nombre completo del estudiante
    correo: string;               // Correo electrónico institucional
    correoConfirmado: boolean;     // Indica si el correo ha sido verificado
    tokenConfirmacion?: string;    // Token para verificación de correo (opcional, por eso lleva ?)
    contrasena?: string;
    confirmarContrasena?: string;
}

// Interfaz para Material - Mapea la tabla 'Material'
export interface IMaterial {
    serie: string;                // Número de serie único del material
    tipo: string;
    marca: string;
    modelo: string;
    categoria: string;
    descripcion: string;
    cantidades: number;           // Cantidad disponible del material
    portada?: Buffer;             // Imagen del material (opcional, en formato Buffer)
}

// Interfaz para Intercambio - Mapea la tabla 'Intercambio'
export interface IIntercambio {
    idIntercambio?: number;       // ID autoincremental
    idEstudianteOfrece: string;   // Estudiante que ofrece el material
    idEstudianteRecibe: string;   // Estudiante que recibe el material
    serie: string;                // Serie del material a intercambiar
    fechaIntercambio: Date;       // Fecha acordada para el intercambio
    fechaDevolucion?: Date;       // Fecha de devolución (opcional)
    estado: 'Pendiente' | 'Incumplido' | 'Completado' | 'Cancelado';  // Estados posibles del intercambio
}

// Interfaz para Publicaciones - Mapea la tabla 'Publicaciones'
export interface IPublicacion {
    idPublicacion?: number;       // ID autoincremental
    idEstudiante: string;        // Estudiante que realiza la publicación
    titulo: string;
    descripcion: string;
    fechaPublicacion?: Date;      // Se establece automáticamente
    estado: 'Disponible' | 'No disponible';  // Estado de la publicación
}

// Interfaz para Mensajes - Mapea la tabla 'Mensajes'
export interface IMensaje {
    idMensaje?: number;           // ID autoincremental
    emisorId: string;             // Estudiante que envía el mensaje
    receptorId: string;           // Estudiante que recibe el mensaje
    contenido: string;
    fechaEnvio?: Date;            // Se establece automáticamente
    leido: boolean;               // Indica si el mensaje fue leído
}

// Interfaz para MatchEvent - Mapea la tabla 'MatchEvent'
export interface IMatchEvent {
    idMatch?: number;             // ID autoincremental
    user1Id: string;              // Primer estudiante en el match
    user2Id: string;              // Segundo estudiante en el match
    serie: string;                // Material involucrado en el match
    fechaMatch?: Date;            // Fecha automática del match
}

// Interfaz para Sanciones - Mapea la tabla 'Sanciones'
export interface ISancion {
    idSancion?: number;           // ID autoincremental
    idEstudiante: string;         // Estudiante sancionado
    descripcion: string;
    fechaInicio: Date;
    estatus: 'Activa' | 'Levantada';  // Estado de la sanción
    idIntercambio?: number;       // Referencia al intercambio que causó la sanción
}

// DTOs (Data Transfer Objects) - Objetos para transferir datos entre capas
export interface ILoginDTO {
    nombreUsuario: string;        // DTO para el login
    contrasena: string;
}

export interface IRegistroEstudianteDTO {
    idEstudiante: string;        // DTO para registro de estudiantes
    nombreCompleto: string;
    correo: string;
}

export interface ICrearIntercambioDTO {
    idEstudianteOfrece: string;  // DTO para crear nuevos intercambios
    idEstudianteRecibe: string;
    serie: string;
    fechaIntercambio: Date;
}

// Interfaz genérica para respuestas de API
export interface IApiResponse<T> {
    success: boolean;             // Indica si la operación fue exitosa
    data?: T;                     // Datos devueltos (opcional)
    error?: string;               // Mensaje de error (opcional)
    message?: string;             // Mensaje de éxito o información adicional
}