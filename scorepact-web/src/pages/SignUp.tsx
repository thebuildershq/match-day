import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-canvas p-6">
            <SignUp path="/sign-up" signInUrl="/sign-in" />
        </div>
    )
}