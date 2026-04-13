import { getMessaging } from './FirebaseAdmin';
import { Medication } from '../../Medication/Domain/Entities/Medication';

export async function sendMedicationCreatedNotification(
    medication: Medication
): Promise<string> {
    const response = await getMessaging().send({
    topic: 'medications',
    notification: {
        title: 'Medicamento registrado',
        body: `Se agregó ${medication.name}`,
    },
    data: {
        type: 'medication_created',
        medicationId: medication.id,
        medicationName: medication.name,
        title: 'Medicamento registrado',
        body: `Se agregó ${medication.name}`,
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