import { Contacto } from './contacto.model';

export interface DetalleCorporativo {
    Id: number;
    Logo: string;
    NombreCorto: string;
    NombreCompleto: string;
    Url: string;
    FechaIncorporacion: any;
    Status: number;
    Contactos: Contacto[];
}
