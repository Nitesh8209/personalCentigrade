import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const refreshToken = process.env.REFRESH_TOKEN;

const oauth2Client = new OAuth2Client(clientID, clientSecret);
oauth2Client.setCredentials({ refresh_token: refreshToken });

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

// Function to get Gmail messages
export async function getGmailMessages() {
  await new Promise(resolve => setTimeout(resolve, 5000));
  try {
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 1,
      q: 'from:no-reply@centigrade.earth'
    });

    const messages = response.data.messages || [];

    if (messages.length === 0) {
      throw new Error('No messages found from no-reply@centigrade.earth');
    }

    return await getMessageDetails(messages[0].id);
  } catch (error) {
    throw new Error(`Error fetching messages: ${error.message}`);
  }
}


// Function to extract the subject and body content from a message
export async function getMessageDetails(messageId) {
  try {
    const response = await gmail.users.messages.get({
      userId: 'me',
      id: messageId,
    });

    const message = response.data;
    const headers = message.payload.headers;
    const subject = headers.find(header => header.name === 'Subject')?.value || 'No Subject';

    let body = '';
    if (message.payload.parts) {
      const bodyPart = message.payload.parts.find(part => part.mimeType === 'text/plain');
      if (bodyPart && bodyPart.body.data) {
        body = Buffer.from(bodyPart.body.data, 'base64').toString('utf-8');
      }
    } else if (message.payload.body.data) {
      body = Buffer.from(message.payload.body.data, 'base64').toString('utf-8');
    }

    const verificationCodeMatch = body.match(/(\d{6})/);
    const receivedVerificationCode = verificationCodeMatch ? verificationCodeMatch[0] : 'No Code Found';

    return { subject, body, receivedVerificationCode };
  } catch (error) {
    throw new Error(`Error fetching message details: ${error.message}`);
  }
}

export function generateTestEmail() {
  const newEmail = `nitesh.agarwalautomation+test${Date.now()}@gmail.com`;
  return newEmail;
}