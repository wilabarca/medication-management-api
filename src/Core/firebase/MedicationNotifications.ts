import { getMessaging } from './FirebaseAdmin';
import { Medication } from '../../Medication/Domain/Entities/Medication';

export async function sendMedicationCreatedNotification(
    medication: Medication
): Promise<string> {
    const title = 'Medicamento agregado';
    const body = `Se agregó ${medication.name} a tu tratamiento`;

const response = await getMessaging().send({
    topic: 'medications',
    notification: {
        title,
        body,
    },
    data: {
        type: 'medication_created',
        medicationId: medication.id,
        medicationName: medication.name,
        title,
        body,
        userId: medication.userId,
        dosage: medication.dosage,
        form: medication.form,
        quantity: String(medication.quantity),
        price: medication.price !== undefined ? String(medication.price) : '',
        isActive: String(medication.isActive),
        instructions: medication.instructions ?? '',
        notes: medication.notes ?? '',
    },
    android: {
        priority: 'high',
        notification: {
        channelId: 'medications_channel',
    },
    },
});

    return response;
}