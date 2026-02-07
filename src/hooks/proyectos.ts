export interface Proyecto {
    title: string;
    image: string;
    habitantes: string;
    casas: string;
    edificios: string;
    municipios: string;
    tag: string;
    entidad: string;
}



export const PROYECTOS_DATA: Proyecto[] = [
    { 
        title: "Yucatán", 
        image: "/img/yucatan.jpg", 
        habitantes: "3,082,841", 
        casas: "857,174", 
        edificios: "12,400", 
        municipios: "84",
        tag: "Región Centro",
        entidad: "31"
    },

    { 
        title: "Hidalgo", 
        image: "/img/hidalgo.jpg", 
        habitantes: "", 
        casas: "380,000", 
        edificios: "5,200", 
        municipios: "49",
        tag: "Región Centro",
        entidad: "13"
    },

    { 
        title: "Queretaro", 
        image: "/img/queretaro.jpg", 
        habitantes: "1,420,000", 
        casas: "380,000", 
        edificios: "5,200", 
        municipios: "49",
        tag: "Región Centro", 
        entidad: "22"
    },
];
