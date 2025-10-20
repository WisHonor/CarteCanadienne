import { NextResponse } from 'next/server';
import { createWalletPass } from '@/lib/googleWallet';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { applicationId } = await request.json();

    if (!applicationId) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      );
    }

    // Fetch the application from database
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    if (application.status !== 'APPROVED') {
      return NextResponse.json(
        { error: 'Application is not approved' },
        { status: 400 }
      );
    }

    // Calculate expiration date (5 years from approval)
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 5);

    // Parse services from the application data
    const appData = application.data as any;
    const services = {
      mobilityAid: appData.step2?.mobilityAid === 'yes' || false,
      supportPerson: appData.step2?.supportPerson === 'yes' || false,
      serviceAnimal: appData.step2?.serviceAnimal === 'yes' || false,
    };

    // Create the Google Wallet pass
    const walletLink = await createWalletPass({
      userId: application.id,
      fullName: `${appData.step1?.firstName || ''} ${appData.step1?.lastName || ''}`.trim(),
      email: application.email,
      dateOfBirth: appData.step1?.dateOfBirth || '',
      expirationDate: expirationDate.toISOString(),
      services,
    });

    return NextResponse.json({ walletLink });
  } catch (error) {
    console.error('Error generating wallet link:', error);
    return NextResponse.json(
      { error: 'Failed to generate wallet link' },
      { status: 500 }
    );
  }
}
