// lib/auth/mock-session.ts
// Temporary mock session — will be replaced by Keycloak in Step 3

export type UserRole =
    | "PHLEBOTOMIST"
    | "LAB_RECEPTIONIST"
    | "MLT"
    | "SENIOR_MLT"
    | "PATHOLOGIST"
    | "BRANCH_ADMIN"
    | "SUPER_ADMIN";

export interface MockUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    branchId: string;
    branchName: string;
    employeeId: string;
}

// Change this to test different role views
export const MOCK_CURRENT_USER: MockUser = {
    id: "usr-001",
    name: "Dr. Aritha Perera",
    email: "aritha.perera@durdans.lk",
    role: "PHLEBOTOMIST",
    branchId: "BR-001",
    branchName: "Colombo Main",
    employeeId: "EMP-2024-001",
};

export function getMockUser(): MockUser {
    return MOCK_CURRENT_USER;
}

export function hasRole(requiredRole: UserRole[]): boolean {
    return requiredRole.includes(MOCK_CURRENT_USER.role);
}