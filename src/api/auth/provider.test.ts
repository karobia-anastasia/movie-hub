import { describe, it, expect, beforeEach, vi } from "vitest";
import { LoginCredentials, RegisterCredentials } from "./types";
import { authProvider } from "./provider";

describe("AuthProvider", () => {
  const mockUserEmail = "test@example.com";

  beforeEach(() => {
    localStorage.clear();
  });

  it("logs in with valid credentials", async () => {
    const credentials: LoginCredentials = {
      email: mockUserEmail,
      password: "password123",
    };

    const response = await authProvider.login(credentials);

    expect(response.user.email).toBe(mockUserEmail);
    expect(response.token).toBeDefined();
    expect(authProvider.isAuthenticated()).toBe(true);

    const stored = JSON.parse(localStorage.getItem("movie_app_auth")!);
    expect(stored.user.email).toBe(mockUserEmail);
    expect(stored.token).toBeDefined();
  });

  it("fails login with invalid credentials", async () => {
    const credentials = { email: "", password: "" };

    await expect(authProvider.login(credentials as LoginCredentials)).rejects.toThrow(
      "Invalid credentials"
    );
    expect(authProvider.isAuthenticated()).toBe(false);
  });

  it("registers a new user with valid data", async () => {
    const credentials: RegisterCredentials = {
      name: "John Doe",
      email: "john@example.com",
      password: "secret",
    };

    const response = await authProvider.register(credentials);

    expect(response.user.email).toBe(credentials.email);
    expect(response.user.name).toBe(credentials.name);
    expect(response.token).toBeDefined();
    expect(authProvider.isAuthenticated()).toBe(true);

    const stored = JSON.parse(localStorage.getItem("movie_app_auth")!);
    expect(stored.user.email).toBe(credentials.email);
    expect(stored.token).toBeDefined();
  });

  it("fails register with invalid data", async () => {
    const credentials = { name: "", email: "", password: "" };

    await expect(
      authProvider.register(credentials as RegisterCredentials)
    ).rejects.toThrow("Invalid registration data");
    expect(authProvider.isAuthenticated()).toBe(false);
  });

  it("logs out and clears stored data", async () => {
    const credentials: LoginCredentials = {
      email: mockUserEmail,
      password: "password123",
    };
    await authProvider.login(credentials);

    expect(authProvider.isAuthenticated()).toBe(true);

    await authProvider.logout();

    expect(authProvider.isAuthenticated()).toBe(false);
    expect(localStorage.getItem("movie_app_auth")).toBeNull();
  });

  it("returns current user if logged in", async () => {
    const credentials: LoginCredentials = {
      email: mockUserEmail,
      password: "password123",
    };
    await authProvider.login(credentials);

    const user = await authProvider.getCurrentUser();
    expect(user).not.toBeNull();
    expect(user!.email).toBe(mockUserEmail);
  });

  it("returns null for current user if not logged in", async () => {
    const user = await authProvider.getCurrentUser();
    expect(user).toBeNull();
  });
});
