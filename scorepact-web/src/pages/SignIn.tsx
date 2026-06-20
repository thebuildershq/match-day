import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-canvas p-6">
            <SignIn path="/sign-in" signInUrl="/sign-up" />
        </div>
    )
}