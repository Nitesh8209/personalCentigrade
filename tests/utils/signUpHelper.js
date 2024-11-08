import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

// securely load credentials from environment variables
// const clientID = process.env.CLIENT_ID;
// const clientSecret = process.env.CLIENT_SECRET;
// const refreshToken = process.env.REFRESH_TOKEN;

const clientID = "386197563960-msd1cg1e0jflkt9uoelqfb8tjkqrvfle.apps.googleusercontent.com";
const clientSecret = "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";
const refreshToken = '1//048AJq2ZYuJkFCgYIARAAGAQSNwF-L9IrTl1yC0-G65pL48Ken8vSpkxxxJCo973C4LqFVfV73LSJ8PkOfEEe3KxPXPSqg-FbIIQ';

// Initialize OAuth2 client with provided client credentials
const oauth2Client = new OAuth2Client(clientID, clientSecret);
oauth2Client.setCredentials({ refresh_token: refreshToken });

// Initialize the Gmail API with OAuth2 client authentication
const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

// Function to retrieve Gmail messages
export async function getGmailMessages(to='') {

  // Adding delay to ensure the email arrives before attempting to fetch it
  await new Promise(resolve => setTimeout(resolve, 5000));
  try {

    let query = 'from:no-reply@centigrade.earth';
    if (to) {
      query += ` to:${to}`;
    }
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 1,
      q: query
    });
    const messages = response.data.messages || [];

    // Check if no messages were found from the specified sender
    if (messages.length === 0) {
      throw new Error('No messages found from no-reply@centigrade.earth');
    }

    // Retrieve details for the first message
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

// Utility function to generate unique test email addresses with timestamp
export function generateTestEmail() {
  const newEmail = `nitesh.agarwalautomation+test${Date.now()}@gmail.com`;
  return newEmail;
}