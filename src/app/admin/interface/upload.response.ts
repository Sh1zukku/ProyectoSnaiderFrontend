export interface NewAccount {
    dni_cuit: string;
    name:     string;
    password: string;
}

export interface UploadShipmentsDetails {
    created:            number;
    updated:            number;
    skipped_duplicates: number;
    errors:             string[];
    new_accounts:       NewAccount[];
    credentials_csv:    string;
}

export interface UploadShipmentsResponse {
    message: string;
    details: UploadShipmentsDetails;
}

export interface UploadShipmentsResult {
    message:           string;
    created:           number;
    skippedDuplicates: number;
    errors:            string[];
    newAccounts:       NewAccount[];
    credentialsCsv:    string;
}

export interface RegeneratedPasswordResponse {
    dni_cuit: string;
    name:     string;
    password: string;
}

export interface PasswordFile {
    content:  string;
    filename: string;
}