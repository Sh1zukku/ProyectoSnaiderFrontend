export interface UserInfo {
    count:   number;
    results: Result[];
}

export interface Result {
    remito_number:     string;
    sender:            string;
    recipient:         Recipient;
    deposit_number:    string;
    packages:          number;
    weight_kg:         string;
    declared_value:    string;
    received_datetime: Date;
    observations:      string;
}

export interface Recipient {
    dni_cuit: string;
    name:     string;
}
