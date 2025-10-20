import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import * as jwt from 'jsonwebtoken';

// Check if using JWT mode (no API calls, works without permissions)
const isJWTMode = process.env.GOOGLE_WALLET_MODE === 'jwt';

function getCredentials() {
  const privateKey = process.env.GOOGLE_WALLET_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!privateKey) {
    throw new Error('GOOGLE_WALLET_PRIVATE_KEY is not set in environment variables');
  }

  if (!process.env.GOOGLE_CLIENT_EMAIL) {
    throw new Error('GOOGLE_CLIENT_EMAIL is not set in environment variables');
  }

  return {
    type: 'service_account',
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key: privateKey,
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
  };
}

function getHttpClient() {
  const credentials = getCredentials();
  return new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/wallet_object.issuer'],
  });
}

const baseUrl = 'https://walletobjects.googleapis.com/walletobjects/v1';

interface PassData {
  userId: string;
  fullName: string;
  email: string;
  dateOfBirth: string;
  expirationDate: string;
  services: {
    mobilityAid: boolean;
    supportPerson: boolean;
    serviceAnimal: boolean;
  };
}

export async function createOrUpdatePassClass() {
  // Skip API call in JWT mode - class is embedded in the token
  if (isJWTMode) {
    console.log('🎫 JWT Mode: Skipping pass class creation (embedded in token)');
    return;
  }

  const httpClient = getHttpClient();
  const classId = process.env.GOOGLE_WALLET_CLASS_ID!;
  const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID!;
  const classResourceId = `${issuerId}.${classId}`;

  const genericClass = {
    id: classResourceId,
    classTemplateInfo: {
      cardTemplateOverride: {
        cardRowTemplateInfos: [
          {
            twoItems: {
              startItem: {
                firstValue: {
                  fields: [
                    {
                      fieldPath: "object.textModulesData['name']",
                    },
                  ],
                },
              },
              endItem: {
                firstValue: {
                  fields: [
                    {
                      fieldPath: "object.textModulesData['expiration']",
                    },
                  ],
                },
              },
            },
          },
          {
            oneItem: {
              item: {
                firstValue: {
                  fields: [
                    {
                      fieldPath: "object.textModulesData['services']",
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    },
  };

  try {
    // Try to get the class
    const url = `${baseUrl}/genericClass/${classResourceId}`;
    await httpClient.request({ url });
    console.log('Pass class already exists');
  } catch (err: unknown) {
    const error = err as { response?: { status: number } };
    if (error.response?.status === 404) {
      // Class doesn't exist, create it
      const url = `${baseUrl}/genericClass`;
      await httpClient.request({
        url,
        method: 'POST',
        data: genericClass,
      });
      console.log('Pass class created successfully');
    } else {
      throw err;
    }
  }
}

export async function createWalletPass(data: PassData): Promise<string> {
  const credentials = getCredentials();
  const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID!;
  const classId = process.env.GOOGLE_WALLET_CLASS_ID!;
  const objectId = `${issuerId}.${data.userId.replace(/-/g, '_')}`;

  // Create services description
  const services = [];
  if (data.services.mobilityAid) services.push('Mobility Aid Access');
  if (data.services.supportPerson) services.push('Support Person Access');
  if (data.services.serviceAnimal) services.push('Service Animal Access');
  const servicesText = services.join(', ');

  const genericObject = {
    id: objectId,
    classId: `${issuerId}.${classId}`,
    state: 'ACTIVE',
    heroImage: {
      sourceUri: {
        uri: 'https://cartecanadiennebucket.s3.us-east-2.amazonaws.com/card-hero.png',
      },
      contentDescription: {
        defaultValue: {
          language: 'en-US',
          value: 'Canadian Accessibility Card',
        },
      },
    },
    logo: {
      sourceUri: {
        uri: 'https://cartecanadiennebucket.s3.us-east-2.amazonaws.com/card-logo.png',
      },
      contentDescription: {
        defaultValue: {
          language: 'en-US',
          value: 'Accessibility Card Logo',
        },
      },
    },
    cardTitle: {
      defaultValue: {
        language: 'en-US',
        value: 'Canadian Accessibility Card',
      },
    },
    header: {
      defaultValue: {
        language: 'en-US',
        value: 'ACCESSIBILITY CARD',
      },
    },
    textModulesData: [
      {
        id: 'name',
        header: 'Cardholder Name',
        body: data.fullName,
      },
      {
        id: 'expiration',
        header: 'Valid Until',
        body: new Date(data.expirationDate).toLocaleDateString('en-CA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      },
      {
        id: 'services',
        header: 'Authorized Services',
        body: servicesText,
      },
      {
        id: 'card_id',
        header: 'Card ID',
        body: data.userId.substring(0, 8).toUpperCase(),
      },
    ],
    hexBackgroundColor: '#0f766e', // Teal color
  };

  // JWT MODE: Create pass directly without API calls
  if (isJWTMode) {
    console.log('🎫 JWT Mode: Creating pass with embedded class definition');
    
    // Format expiration date nicely
    const expirationFormatted = new Date(data.expirationDate).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    
    // Define the pass class with full styling
    const passClass = {
      id: `${issuerId}.${classId}`,
      classTemplateInfo: {
        cardTemplateOverride: {
          cardRowTemplateInfos: [
            {
              twoItems: {
                startItem: {
                  firstValue: {
                    fields: [
                      {
                        fieldPath: "object.textModulesData['name']",
                      },
                    ],
                  },
                },
                endItem: {
                  firstValue: {
                    fields: [
                      {
                        fieldPath: "object.textModulesData['expires']",
                      },
                    ],
                  },
                },
              },
            },
            {
              oneItem: {
                item: {
                  firstValue: {
                    fields: [
                      {
                        fieldPath: "object.textModulesData['services']",
                      },
                    ],
                  },
                },
              },
            },
            {
              oneItem: {
                item: {
                  firstValue: {
                    fields: [
                      {
                        fieldPath: "object.textModulesData['card_id']",
                      },
                    ],
                  },
                },
              },
            },
          ],
        },
      },
      hexBackgroundColor: '#0f766e', // Teal/turquoise color
      enableSmartTap: false,
    };
    
    // Enhanced object with logo and all information
    const passObject = {
      id: objectId,
      classId: `${issuerId}.${classId}`,
      state: 'ACTIVE',
      logo: {
        sourceUri: {
          uri: 'https://cartecanadiennebucket.s3.us-east-2.amazonaws.com/card-logo.png',
        },
        contentDescription: {
          defaultValue: {
            language: 'en-US',
            value: 'Canadian Accessibility Card',
          },
        },
      },
      cardTitle: {
        defaultValue: {
          language: 'en-US',
          value: 'Canadian Accessibility Card',
        },
      },
      header: {
        defaultValue: {
          language: 'en-US',
          value: 'ACCESSIBILITY CARD',
        },
      },
      textModulesData: [
        {
          id: 'name',
          header: 'Cardholder Name',
          body: data.fullName,
        },
        {
          id: 'expires',
          header: 'Valid Until',
          body: expirationFormatted,
        },
        {
          id: 'services',
          header: 'Authorized Services',
          body: servicesText,
        },
        {
          id: 'card_id',
          header: 'Card ID',
          body: data.userId.substring(0, 8).toUpperCase(),
        },
      ],
      hexBackgroundColor: '#0f766e', // Teal/turquoise color (matching class)
    };

    // Create JWT with both class and object definitions
    const claims = {
      iss: credentials.client_email,
      aud: 'google',
      origins: [],
      typ: 'savetowallet',
      payload: {
        genericClasses: [passClass],
        genericObjects: [passObject],
      },
    };

    try {
      const token = jwt.sign(claims, credentials.private_key, { algorithm: 'RS256' });
      const saveUrl = `https://pay.google.com/gp/v/save/${token}`;

      console.log('✅ JWT pass created successfully (no API calls)');
      console.log('🔗 Wallet URL:', saveUrl);
      console.log('📋 Object ID:', objectId);
      console.log('📋 Services:', servicesText);
      return saveUrl;
    } catch (error) {
      console.error('❌ Error creating JWT token:', error);
      throw new Error(`Failed to create JWT token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // API MODE: Create pass using Google Wallet API (requires permissions)
  const httpClient = getHttpClient();

  try {
    // Try to create the pass object
    const url = `${baseUrl}/genericObject`;
    await httpClient.request({
      url,
      method: 'POST',
      data: genericObject,
    });
    console.log('Pass object created successfully');
  } catch (err: unknown) {
    const error = err as { response?: { status: number; data?: unknown } };
    if (error.response?.status === 409) {
      // Object already exists, update it
      const url = `${baseUrl}/genericObject/${objectId}`;
      await httpClient.request({
        url,
        method: 'PUT',
        data: genericObject,
      });
      console.log('Pass object updated successfully');
    } else {
      console.error('Error creating pass:', error.response?.data);
      throw err;
    }
  }

  // Generate the "Add to Google Wallet" link
  const claims = {
    iss: credentials.client_email,
    aud: 'google',
    origins: [],
    typ: 'savetowallet',
    payload: {
      genericObjects: [
        {
          id: objectId,
        },
      ],
    },
  };

  // Sign the JWT token
  const token = jwt.sign(claims, credentials.private_key, { algorithm: 'RS256' });
  const saveUrl = `https://pay.google.com/gp/v/save/${token}`;

  return saveUrl;
}

export async function updatePassExpiration(userId: string, newExpirationDate: string) {
  const httpClient = getHttpClient();
  const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID!;
  const objectId = `${issuerId}.${userId.replace(/-/g, '_')}`;

  const patch = {
    textModulesData: [
      {
        id: 'expiration',
        header: 'Expires',
        body: new Date(newExpirationDate).toLocaleDateString('en-CA'),
      },
    ],
  };

  try {
    const url = `${baseUrl}/genericObject/${objectId}`;
    await httpClient.request({
      url,
      method: 'PATCH',
      data: patch,
    });
    console.log('Pass expiration updated successfully');
  } catch (err) {
    console.error('Error updating pass:', err);
    throw err;
  }
}

export async function revokePass(userId: string) {
  const httpClient = getHttpClient();
  const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID!;
  const objectId = `${issuerId}.${userId.replace(/-/g, '_')}`;

  try {
    const url = `${baseUrl}/genericObject/${objectId}`;
    await httpClient.request({
      url,
      method: 'PATCH',
      data: { state: 'INACTIVE' },
    });
    console.log('Pass revoked successfully');
  } catch (err) {
    console.error('Error revoking pass:', err);
    throw err;
  }
}
