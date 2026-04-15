export interface Medication {
    id: string;
    userId: string;
    name: string;
    dosage: string;
    form: string;
    instructions?: string;
    notes?: string;
    quantity: number;   // unidades disponibles en casa
    price?: number;     // costo estimado o costo de compra
    isActive: boolean;
}