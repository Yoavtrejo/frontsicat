const BASE_URL =
    "https://www.inegi.org.mx/app/api/indicadores/desarrolladores/jsonxml";

const TOKEN = process.env.NEXT_PUBLIC_INEGI_TOKEN;

export async function getIndicadorINEGI(
    indicador: string,
    estado: string
) {
    if (!TOKEN) {
        console.warn('NEXT_PUBLIC_INEGI_TOKEN no configurado, retornando datos mock');
        return { Series: [{ OBSERVATIONS: [] }] };
    }

    const url = `${BASE_URL}/INDICATOR/${indicador}/es/${estado}/true/BISE/2.0/${TOKEN}?type=json`;

    const res = await fetch(url);

    if (!res.ok) {
        throw new Error("Error al consultar la API de INEGI");
    }

    return res.json();
}
