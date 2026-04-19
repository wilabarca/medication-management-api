export interface Medication {
    id: string;
    patientId: string;
    name: string;
    dosage: string;
    form: string;
    instructions?: string;
    notes?: string;
    quantity: number;
    price?: number;
    isActive: boolean;
    startDate?: string | null;
    endDate?: string | null;
}