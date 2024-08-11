import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import MainNavbar from "./MainNavbar";
import { useUser } from "../features/authentication/useUser";
import { useLogout } from "../features/authentication/useLogout";
import { BrowserRouter } from "react-router-dom";
import { useDarkMode } from "../context/DarkModeContext";

// Mock out hooks
vi.mock("../features/authentication/useUser", () => ({
    useUser: vi.fn(),
}));

vi.mock("../features/authentication/useLogout", () => ({
    useLogout: vi.fn(),
}));

vi.mock("../context/DarkModeContext", () => ({
    useDarkMode: vi.fn(),
}));

describe("MainNavbar component", () => {
    beforeEach(() => {
        // set up default mockReturnValues:
        vi.mocked(useUser).mockReturnValue({
            isPending: false,
            error: { name: "", message: "" },
            fullName: "Test user",
            userRole: "manager",
            userTenantId: 1,
            userTenantName: "Test tenant",
            isAuthenticated: true,
        });

        vi.mocked(useLogout).mockReturnValue({
            logout: () => {},
            isPending: false,
        });

        vi.mocked(useDarkMode).mockReturnValue({
            isDarkMode: true,
            toggleDarkMode: () => {},
        });
    });
    afterAll(() => {
        vi.restoreAllMocks();
    });

    test("renders title", () => {
        // ARRANGE
        render(
            <BrowserRouter>
                <MainNavbar />
            </BrowserRouter>
        );

        // ASSERT
        expect(screen.getByText("Supabase Custom Claims"));
    });

    test("renders links", () => {
        // ARRANGE
        render(
            <BrowserRouter>
                <MainNavbar />
            </BrowserRouter>
        );

        // ASSERT
        expect(screen.getByRole("link", { name: /home/i }));
        expect(screen.getByRole("link", { name: /widgets/i }));
        expect(screen.getByRole("link", { name: /help/i }));
        // Check for false positives:
        expect(
            screen.queryByRole("link", { name: /doesn't exist/i })
        ).not.toBeInTheDocument();
    });

    test("renders spinner while waiting for user info", () => {
        // ARRANGE
        vi.mocked(useUser).mockReturnValue({
            isPending: true,
            error: { name: "", message: "" },
            fullName: undefined,
            userRole: undefined,
            userTenantId: undefined,
            userTenantName: undefined,
            isAuthenticated: false,
        });

        render(
            <BrowserRouter>
                <MainNavbar />
            </BrowserRouter>
        );

        // ASSERT
        expect(screen.getByTestId("spinner")).toBeInTheDocument();
    });

    test("renders user info", () => {
        // ARRANGE
        render(
            <BrowserRouter>
                <MainNavbar />
            </BrowserRouter>
        );

        // ASSERT
        expect(screen.getByRole("button", { name: "Test user (manager)" }));
    });

    test("renders darkmode toggle", () => {
        // ARRANGE
        render(
            <BrowserRouter>
                <MainNavbar />
            </BrowserRouter>
        );

        // ASSERT
        expect(screen.getByRole("button", { name: "Turn off dark mode" }));

        // ARRANGE
        vi.mocked(useDarkMode).mockReturnValue({
            isDarkMode: false,
            toggleDarkMode: () => {},
        });

        render(
            <BrowserRouter>
                <MainNavbar />
            </BrowserRouter>
        );

        // ASSERT
        expect(screen.getByRole("button", { name: "Turn on dark mode" }));
    });

    test("opens user context menu", async () => {
        // ARRANGE
        const user = userEvent.setup();

        render(
            <BrowserRouter>
                <MainNavbar />
            </BrowserRouter>
        );

        // ASSERT
        expect(screen.queryByRole("button", { name: "Log out" })).toBeNull();

        // ACT
        const userButton = screen.getByRole("button", {
            name: "Test user (manager)",
        });

        await user.click(userButton);

        // ASSERT
        // The NavDropdown.Item around the logout button will also be
        // matched, so expect two results
        const logoutButtons = await screen.getAllByRole("button", {
            name: "Log out",
        });

        expect(logoutButtons.length === 2);

        // Would like to test for closure, also, but this is not possible.
        // When closed, context menu elements remain on the DOM, but with
        // parent div having display: none.
        // jsdom does not have enough CSS support to recognise this, and the context
        // menu remains always visible in test environment.
    });
});
