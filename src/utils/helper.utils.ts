import moment from 'moment';
import { IValidarFrecuenciaCardiaca } from './utils.interface';

export const extractYearMonthDay = (date: Date): string => {

    const año = date.getFullYear(); // Obtener el año (YYYY)
    const mes = date.getMonth() + 1; // Obtener el mes (MM); +1 porque los meses en JavaScript van de 0 a 11
    const dia = date.getDate() + 1; // Obtener el día (DD)

    // Formatear el mes y el día para que tengan siempre dos dígitos (agregar un 0 si es necesario)
    const mesFormateado = mes.toString().padStart(2, '0');
    const diaFormateado = dia.toString().padStart(2, '0');

    // Crear la cadena en formato YYYY-MM-DD
    const fechaFormateada = `${año}-${mesFormateado}-${diaFormateado}`;

    return fechaFormateada;

}

export const getDatesOfWeekStartingFromMonday = (): [string, string] => {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();

    const daysUntilMonday = (currentDay + 6) % 7;
    currentDate.setDate(currentDate.getDate() - daysUntilMonday);

    const datesOfWeek = [];

    for (let i = 0; i < 7; i++) {
        const formattedDate = currentDate.toISOString().split('T')[0];
        datesOfWeek.push(formattedDate);
        currentDate.setDate(currentDate.getDate() + 1);
    }


    const lunesDeLaSemana = datesOfWeek[0];
    const fechaActual = new Date().toISOString().split('T')[0];

    return [lunesDeLaSemana, fechaActual];

}

export const getDatesFromMondayToToday = (): string[] => {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();

    // Restar los días transcurridos desde el lunes (1) para llegar al lunes de la semana actual
    const daysUntilMonday = (currentDay + 6) % 7; // 0 (Lunes) a 6 (Domingo)
    currentDate.setDate(currentDate.getDate() - daysUntilMonday);

    const datesOfWeek: string[] = [];

    while (currentDate <= new Date()) {
        const formattedDate = currentDate.toISOString().split('T')[0];
        datesOfWeek.push(formattedDate);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return datesOfWeek;
};


export const calcularEdad = (fechaNacimiento: Date): number => {
    const fechaActual = new Date();
    const diferencia = fechaActual.getTime() - fechaNacimiento.getTime();
    const edad = Math.floor(diferencia / (1000 * 60 * 60 * 24 * 365.25));
    return edad;
}


export const validarFrecuenciaCardiaca = (edad: number, frec: number): IValidarFrecuenciaCardiaca => {

    if (edad >= 6 && edad <= 13) {
        if (frec >= 100) {
            return { edad, frec, alert: true }
        } else if(frec <= 60){
            return { edad, frec, alert: true }
        }
        else {
            return { edad, frec, alert: false }
        }
    } else if (edad >= 14 && edad <= 16) {
        if (frec >= 100) {
            return { edad, frec, alert: true }
        } else if(frec <= 60){
            return { edad, frec, alert: true }
        }
        else {
            return { edad, frec, alert: false }
        }
    } else if (edad >= 16 && edad <= 150) {
        if (frec >= 100) {
            return { edad, frec, alert: true }
        } else if(frec <= 60){
            return { edad, frec, alert: true }
        }
        else {
            return { edad, frec, alert: false }
        }
    }

}