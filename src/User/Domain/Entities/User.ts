export type UserRole = "caregiver" | "patient";

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: UserRole;
}