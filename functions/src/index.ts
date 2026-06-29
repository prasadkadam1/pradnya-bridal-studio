import admin from 'firebase-admin';
import { onDocumentCreated, onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { logger } from 'firebase-functions';

admin.initializeApp();

type InquiryDocument = {
  name?: string;
  phone?: string;
  whatsappNumber?: string;
  email?: string;
  eventType?: string;
  eventDate?: string;
  location?: string;
  message?: string;
  status?: string;
  nextFollowUpDate?: string;
  reminderNotes?: string;
  internalNotes?: string;
  preferredContactChannel?: string;
  lastContactedAt?: string;
  lastContactMessage?: string;
  createdAt?: string;
};

const studioEmail = process.env.STUDIO_EMAIL || process.env.NOTIFICATION_EMAIL;
const emailWebhookUrl = process.env.EMAIL_WEBHOOK_URL;
const whatsappWebhookUrl = process.env.WHATSAPP_WEBHOOK_URL;

const formatDate = (dateValue?: string) => {
  if (!dateValue) return 'Not set';
  const parsedDate = new Date(dateValue);
  return Number.isNaN(parsedDate.getTime()) ? dateValue : parsedDate.toLocaleDateString('en-IN');
};

const buildLeadSummary = (data: InquiryDocument) => {
  return [
    `New inquiry from ${data.name || 'Unknown bride'}`,
    `Event type: ${data.eventType || 'Not specified'}`,
    `Event date: ${formatDate(data.eventDate)}`,
    `Location: ${data.location || 'Not specified'}`,
    `Phone: ${data.phone || data.whatsappNumber || 'Not specified'}`,
    `Email: ${data.email || 'Not specified'}`,
    `Message: ${data.message || 'No message provided'}`,
  ].join('\n');
};

const postWebhook = async (url: string, payload: Record<string, unknown>) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Webhook request failed with ${response.status}`);
  }
};

export const notifyOnNewInquiry = onDocumentCreated('inquiries/{inquiryId}', async (event) => {
  const data = event.data?.data() as InquiryDocument | undefined;
  if (!data) return;

  logger.info('New inquiry received', { inquiryId: event.params.inquiryId, name: data.name });

  if (whatsappWebhookUrl) {
    await postWebhook(whatsappWebhookUrl, {
      channel: 'whatsapp',
      to: data.whatsappNumber || data.phone,
      message: `New bridal inquiry from ${data.name || 'Unknown bride'}. Event date: ${formatDate(data.eventDate)}.`,
      payload: data,
    });
  }

  if (emailWebhookUrl && studioEmail) {
    await postWebhook(emailWebhookUrl, {
      channel: 'email',
      to: studioEmail,
      subject: `New Bridal Inquiry from ${data.name || 'Website lead'}`,
      body: buildLeadSummary(data),
      payload: data,
    });
  }
});

export const notifyOnLeadUpdate = onDocumentUpdated('inquiries/{inquiryId}', async (event) => {
  const before = event.data?.before.data() as InquiryDocument | undefined;
  const after = event.data?.after.data() as InquiryDocument | undefined;
  if (!before || !after) return;

  if (before.status === after.status && before.nextFollowUpDate === after.nextFollowUpDate) {
    return;
  }

  logger.info('Inquiry updated', {
    inquiryId: event.params.inquiryId,
    statusBefore: before.status,
    statusAfter: after.status,
  });

  if (whatsappWebhookUrl && after.whatsappNumber) {
    const reminderMessage =
      after.lastContactMessage ||
      `Hi ${after.name || 'Bride'}, this is a follow-up from Pradnya Bridal Studio regarding your inquiry.`;

    await postWebhook(whatsappWebhookUrl, {
      channel: 'whatsapp',
      to: after.whatsappNumber,
      message: reminderMessage,
      payload: after,
    });
  }
});

export const sendFollowUpReminders = onSchedule('every day 09:00', async () => {
  const snapshot = await admin.firestore().collection('inquiries').get();
  const today = new Date();
  const todayIso = today.toISOString().slice(0, 10);

  const reminders = snapshot.docs
    .map((document) => ({ id: document.id, ...(document.data() as InquiryDocument) }))
    .filter((inquiry) => inquiry.nextFollowUpDate === todayIso);

  logger.info('Daily reminder sweep completed', {
    reminderCount: reminders.length,
    today: todayIso,
  });

  if (whatsappWebhookUrl) {
    await Promise.all(
      reminders.map((inquiry) =>
        postWebhook(whatsappWebhookUrl, {
          channel: 'whatsapp',
          to: inquiry.whatsappNumber || inquiry.phone,
          message: `Reminder: follow up with ${inquiry.name || 'lead'} today.`,
          payload: inquiry,
        })
      )
    );
  }
});
