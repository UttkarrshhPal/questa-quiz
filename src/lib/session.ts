// lib/session.ts
import { auth } from './auth';
import { headers, cookies } from 'next/headers';

export async function getServerSession() {
  try {
    const headersList = await headers();
    const cookieStore = await cookies();
    
    // Debug log all cookies
    const allCookies = cookieStore.getAll();
    console.log('Session check - all cookies:', allCookies.map(c => c.name));
    
    // Try multiple cookie names that Better Auth might use
    const sessionToken = 
      cookieStore.get('better-auth.session_token')?.value ||
      cookieStore.get('better-auth.session.token')?.value ||
      cookieStore.get('better-auth.session')?.value ||
      cookieStore.get('__Secure-better-auth.session_token')?.value ||
      cookieStore.get('__Host-better-auth.session_token')?.value;

    if (!sessionToken) {
      console.log('No session token found in cookies');
      return null;
    }

    console.log('Found session token, validating...');

    const session = await auth.api.getSession({
      headers: headersList,
    });

    console.log('Session validation result:', !!session);

    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}