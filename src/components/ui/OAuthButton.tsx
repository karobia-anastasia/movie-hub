import { SignInButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";

interface OAuthButtonProps {
  children: React.ReactNode;
  label: string;
}

const OAuthButton = ({ children, label }: OAuthButtonProps) => (
  <SignInButton mode="modal" fallbackRedirectUrl="/" forceRedirectUrl="/">
    <Button
      variant="outline"
      className="w-full h-12 text-left justify-start space-x-3 border-border hover:bg-accent"
      aria-label={label}
    >
      {children}
    </Button>
  </SignInButton>
);

export default OAuthButton;
