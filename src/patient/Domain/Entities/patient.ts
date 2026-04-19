export interface Patient {

    id: string;
    caregiverUserId: string;
    linkedUserId?: string | null;
    name: string;
    birthDate?: string | null;
    relationship?: string | null;
    notes?: string | null;
    isActive: boolean;

}