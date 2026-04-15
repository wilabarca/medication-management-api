import { getMessaging } from './FirebaseAdmin';
import { Medication } from '../../Medication/Domain/Entities/Medication';

type MedicationEventType =
  | 'medication_created_remote'
  | 'medication_updated_remote';

function buildNotificationContent(
  medication: Medication,
  type: MedicationEventType
) {
  if (type === 'medication_updated_remote') {
    return {
      title: 'Tratamiento actualizado',
      body: `Se actualizó ${medication.name} en otro dispositivo`,
    };
  }

  return {
    title: 'Tratamiento actualizado',
    body: `Se agregó ${medication.name} en otro dispositivo`,
  };
}

export async function sendMedicationNotificationToTokens(
  medication: Medication,
  tokens: string[],
  type: MedicationEventType
): Promise<void> {
  if (!tokens.length) return;

  const { title, body } = buildNotificationContent(medication, type);

  await getMessaging().sendEachForMulticast({
    tokens,
    notification: {
      title,
      body,
    },
    data: {
      type,
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
}