// lib/session.ts
import { auth } from './auth';
import { headers, cookies } from 'next/headers';

export async function getServerSession() {
  try {
    const headersList = await headers();
    const cookieStore = await cookies();
    
    // Try multiple cookie names that Better Auth might use
    const sessionToken = cookieStore.get('better-auth.session.token')?.value ||
                        cookieStore.get('better-auth.session')?.value ||
                        cookieStore.get('better-auth.session_token')?.value;

    if (!sessionToken) {
      console.log('No session token found in cookies');
      return null;
    }

    const session = await auth.api.getSession({
      headers: headersList,
    });

    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}