import { render, screen, fireEvent } from "@testing-library/react";
import LoginDialog from "./LoginDialog";

// Mock dependencies
jest.mock("@clerk/clerk-react", () => ({
  SignUpButton: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-signup">{children}</div>
  ),
}));

jest.mock("@/components/ui/GoogleIcon", () => () => (
  <svg data-testid="google-icon" />
));

jest.mock("@/components/ui/OAuthButton", () => 
  ({ label, children }: { label: string; children: React.ReactNode }) => (
    <button data-testid={`oauth-${label.toLowerCase().replace(/\s/g, "-")}`}>
      {children}
    </button>
  )
);

describe("LoginDialog", () => {
  it("renders trigger children", () => {
    render(
      <LoginDialog>
        <button>Open Dialog</button>
      </LoginDialog>
    );

    expect(screen.getByText("Open Dialog")).toBeInTheDocument();
  });

  it("opens the dialog when trigger is clicked", () => {
    render(
      <LoginDialog>
        <button>Open Dialog</button>
      </LoginDialog>
    );

    fireEvent.click(screen.getByText("Open Dialog"));

    expect(
      screen.getByText("Welcome to NetMovie")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Sign in to access your personalized movie experience")
    ).toBeInTheDocument();
  });

  it("renders OAuth buttons (Google, GitHub, Email)", () => {
    render(
      <LoginDialog>
        <button>Open Dialog</button>
      </LoginDialog>
    );

    fireEvent.click(screen.getByText("Open Dialog"));

    expect(screen.getByTestId("oauth-sign-in-with-google")).toBeInTheDocument();
    expect(screen.getByTestId("oauth-sign-in-with-github")).toBeInTheDocument();
    expect(screen.getByTestId("oauth-sign-in-with-email")).toBeInTheDocument();
  });

  it("renders Sign Up button inside SignUpButton wrapper", () => {
    render(
      <LoginDialog>
        <button>Open Dialog</button>
      </LoginDialog>
    );

    fireEvent.click(screen.getByText("Open Dialog"));

    expect(screen.getByTestId("mock-signup")).toBeInTheDocument();
    expect(screen.getByText("Sign up for free")).toBeInTheDocument();
  });

  it("renders Terms and Privacy links", () => {
    render(
      <LoginDialog>
        <button>Open Dialog</button>
      </LoginDialog>
    );

    fireEvent.click(screen.getByText("Open Dialog"));

    expect(screen.getByText("Terms of Service")).toBeInTheDocument();
    expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
  });
});
