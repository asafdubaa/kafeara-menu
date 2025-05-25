import { NextResponse } from 'next/server';
import Cookies from 'js-cookie'; // This is a client-side library, will need a different approach for serverless function

// Note: Directly using js-cookie in a serverless function might not work as expected.
// A better approach for setting HTTP-only cookies from an API route is to use
// the `cookies().set()` method available in Next.js App Router API routes.

export async function POST(request: Request) {
  const { username, password } = await request.json();

  // Get credentials from environment variables
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  // Basic validation (replace with more secure comparison if needed)
  if (username === adminUsername && password === adminPassword) {
    // In a real application, you would generate a secure token here
    const token = 'authenticated'; // Simple token for demonstration

    const response = NextResponse.json({ success: true, message: 'Login successful' });

    // Set a secure, HTTP-only cookie
    // The `cookies()` function is available in Next.js API routes
    response.cookies.set('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookie in production
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/', // Make the cookie available on all paths
      sameSite: 'strict',
    });

    return response;
  } else {
    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
  }
} 