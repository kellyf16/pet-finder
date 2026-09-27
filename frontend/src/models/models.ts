export enum AnimalType {
    "Dog", "Cat", "Bird", "Rabbit", "Other",
}

export enum ReportStatus {
    "Lost", "Found",
}

export interface Coordinates {
    lat: number;
    long: number;
}

export interface AnimalReport {
    id: string;
    name: string;
    type: AnimalType;
    photo_url: string;
    description: string;
    phone_number: string;
    last_seen: Coordinates;
    address: string;
    password: string;
    status: ReportStatus;
    date_posted: string;
}

export interface ReportDraft {
    name: string;
    type: AnimalType;
    image_file: File | null;
    description: string;
    phone_number: string;
    last_seen: Coordinates | null;
    password: string;
}