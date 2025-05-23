'use client';
import { useSearchParams } from 'next/navigation';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams?.get('error'); // ✅ Optional chaining

  const messages: Record<string, string> = {
    OAuthSignin: "Error creating sign-in URL.",
    OAuthCallback: "Error during Google callback.",
    OAuthCreateAccount: "Couldn't create Google account.",
    OAuthAccountNotLinked: "Account exists with different sign-in method.",
    Default: "An unexpected error occurred. Try again.",
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md text-center">
        <h1 className="text-2xl font-bold text-red-600">Authentication Error</h1>
        <p className="mt-4 text-gray-700">
          {messages[error as keyof typeof messages] || messages.Default}
        </p>
      </div>
    </div>
  );
}
