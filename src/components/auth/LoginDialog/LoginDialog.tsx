import { SignUpButton } from "@clerk/clerk-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Github } from "lucide-react";
import GoogleIcon from "@/components/ui/GoogleIcon";
import OAuthButton from "@/components/ui/OAuthButton";



interface LoginDialogProps {
  children: React.ReactNode;
}

const LoginDialog = ({ children }: LoginDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Welcome to NetMovie
          </DialogTitle>
          <p className="text-center text-muted-foreground mt-2">
            Sign in to access your personalized movie experience
          </p>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          {/* Google Sign In */}
          <OAuthButton label="Sign in with Google">
            <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
              <GoogleIcon />
            </div>
            <span className="text-foreground">Continue with Google</span>
          </OAuthButton>

          {/* GitHub Sign In */}
          <OAuthButton label="Sign in with GitHub">
            <Github className="w-5 h-5" />
            <span className="text-foreground">Continue with GitHub</span>
          </OAuthButton>

          {/* Separator */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Email Sign In */}
          <OAuthButton label="Sign in with Email">
            <span className="mx-auto text-foreground">Sign in with Email</span>
          </OAuthButton>

          {/* Sign Up */}
          <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <SignUpButton mode="modal" fallbackRedirectUrl="/" forceRedirectUrl="/">
              <Button variant="link" className="p-0 h-auto text-netflix-red">
                Sign up for free
              </Button>
            </SignUpButton>
          </div>

          {/* Terms + Privacy */}
          <div className="text-xs text-center text-muted-foreground pt-4">
            By continuing, you agree to our{" "}
            <Button
              variant="link"
              className="p-0 h-auto text-xs text-netflix-red"
            >
              Terms of Service
            </Button>{" "}
            and{" "}
            <Button
              variant="link"
              className="p-0 h-auto text-xs text-netflix-red"
            >
              Privacy Policy
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
