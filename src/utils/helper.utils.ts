export const extractYearMonthDay = (date: Date):string => {

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