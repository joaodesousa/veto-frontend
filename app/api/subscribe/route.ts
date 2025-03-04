import { NextRequest, NextResponse } from 'next/server';
import mailchimp from '@mailchimp/mailchimp_marketing';

interface MailchimpError {
  response?: {
    body?: {
      title?: string;
      detail?: string;
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json() as { email?: string };

    // Basic validation
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { message: 'Email inválido' }, 
        { status: 400 }
      );
    }

    // Configure Mailchimp with your API credentials
    mailchimp.setConfig({
      apiKey: process.env.MAILCHIMP_API_KEY as string,
      server: process.env.MAILCHIMP_SERVER_PREFIX as string // e.g., 'us1'
    });

    try {
      // Add the email to your Mailchimp audience list
      await mailchimp.lists.addListMember(process.env.MAILCHIMP_LIST_ID as string, {
        email_address: email,
        status: 'subscribed'
      });
      
      return NextResponse.json(
        { message: 'Email registrado com sucesso' },
        { status: 200 }
      );
    } catch (error) {
      console.error('Mailchimp error:', error);
      
      const mailchimpError = error as MailchimpError;
      
      // Handle duplicate emails
      if (mailchimpError.response?.body?.title === 'Member Exists') {
        return NextResponse.json(
          { message: 'Este email já está registrado' },
          { status: 400 }
        );
      }
      
      // Handle other Mailchimp-specific errors
      if (mailchimpError.response?.body?.detail) {
        return NextResponse.json(
          { message: mailchimpError.response.body.detail },
          { status: 400 }
        );
      }
      
      throw error;
    }
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { message: 'Erro ao processar o pedido' },
      { status: 500 }
    );
  }
}