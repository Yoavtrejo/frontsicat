export const MATERIALES_DICT = {
    "CO": "Concreto, Losa",
    "TE": "Teja",
    "LA": "Lámina Galvanizada",
    "PA": "Palma",
    "LO": "Velaria / Lonas Negras",
    "PE": "Pérgola",
    "AS": "Asbesto",
    "DO": "Domo",
    "EC": "En Construcción",
    "VO": "Volado" 
};

export const getMaterialNombre = (abreviatura) => {
    return MATERIALES_DICT[abreviatura] || "Material no especificado";
};