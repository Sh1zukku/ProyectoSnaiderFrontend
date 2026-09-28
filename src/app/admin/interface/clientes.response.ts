export interface Clientes {
    count:   number;
    results: Result[];
}

export interface Result {
    id:         number;
    dni_cuit:   string;
    name:       string;
    created_at: Date;
    updated_at: Date;
}
