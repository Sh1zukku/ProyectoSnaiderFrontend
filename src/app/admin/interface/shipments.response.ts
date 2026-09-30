export interface Shipments {
    count:   number;
    results: Result[];
}

export interface Result {
    id:                number;
    remito_number:     string;
    sender:            string;
    recipient:         Recipient;
    deposit_number:    string;
    logistics_id:      string;
    packages:          number;
    weight_kg:         string;
    declared_value:    string;
    value_type:        ValueType;
    received_datetime: Date;
    observations:      Observations;
    created_at:        Date;
    updated_at:        Date;
}

export const Observations = {
    N: "N",
    OFleteOrígen: "O-Flete Orígen",
    XCargaPeligrosa: "X-Carga Peligrosa",
} as const;

export type Observations = typeof Observations[keyof typeof Observations];

export interface Recipient {
    dni_cuit: string;
    name:     string;
}

export const ValueType = {
    N: "N",
    OFlete: "O-Flete",
    XCarga: "X-Carga",
} as const;

export type ValueType = typeof ValueType[keyof typeof ValueType];

export interface ManualDeleteResponse {
    message:       string;
    days:          number;
    cutoff:        string;
    deleted_count: number;
}
