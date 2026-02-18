// mock/phlebotomy.mock.ts
import { Sample } from "@/types/sample.types";

export const MOCK_WORKLIST: Sample[] = [
    {
        id: "1",
        sampleId: "S-90001",
        orderId: "ORD-2024-001",
        patient: { id: "p1", pid: "DH-40281", name: "Mohamed Shafi", age: 45, gender: "M" },
        testType: "Full Blood Count + CRP",
        testCodes: ["FBC", "CRP", "ESR"],
        priority: "URGENT",
        status: "PENDING_COLLECTION",
        tubeTypes: ["EDTA_LAVENDER", "SST_RED"],
        waitTimeMinutes: 22,
    },
    {
        id: "2",
        sampleId: "S-90002",
        orderId: "ORD-2024-002",
        patient: { id: "p2", pid: "DH-38822", name: "Anula Rathnayake", age: 32, gender: "F" },
        testType: "Lipid Profile + HbA1c",
        testCodes: ["Lipid Profile", "HbA1c"],
        priority: "NORMAL",
        status: "PENDING_COLLECTION",
        tubeTypes: ["SST_GOLD", "EDTA_LAVENDER"],
        waitTimeMinutes: 8,
    },
    {
        id: "3",
        sampleId: "S-90003",
        orderId: "ORD-2024-003",
        patient: { id: "p3", pid: "DH-41002", name: "Devin Samarasinghe", age: 58, gender: "M" },
        testType: "PT/INR",
        testCodes: ["PT/INR"],
        priority: "NORMAL",
        status: "PENDING_COLLECTION",
        tubeTypes: ["CITRATE_BLUE"],
        waitTimeMinutes: 5,
    },
    {
        id: "4",
        sampleId: "S-90004",
        orderId: "ORD-2024-004",
        patient: { id: "p4", pid: "DH-40531", name: "Kanthi Wijetunge", age: 72, gender: "F" },
        testType: "Troponin I + UAE",
        testCodes: ["Troponin I", "UAE"],
        priority: "URGENT",
        status: "PENDING_COLLECTION",
        tubeTypes: ["SST_RED", "EDTA_LAVENDER"],
        waitTimeMinutes: 14,
    },
];

export const MOCK_DASHBOARD_STATS = {
    pendingCollections: 24,
    urgentSamples: 5,
    collectedToday: 142,
    rejections: 2,
};