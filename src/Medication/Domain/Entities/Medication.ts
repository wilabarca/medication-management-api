export interface Medication {
    id: string;
    patientId: string;
    name: string;
    dosage: string;
    form: string;
    instructions?: string | null;
    notes?: string | null;
    quantity: number;
    price?: number | null;
    isActive: boolean;
    startDate?: string | null;
    endDate?: string | null;
}