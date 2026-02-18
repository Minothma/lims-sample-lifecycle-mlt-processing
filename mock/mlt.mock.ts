// mock/mlt.mock.ts
import { Sample } from "@/types/sample.types";

export interface MLTSample extends Sample {
    department:   string;
    receivedTime: string;
    assignedTo?:  string;
    instrument?:  string;
}

export const MOCK_MLT_WORKLIST: MLTSample[] = [
    {
        id:           "m1",
        sampleId:     "LB-2023-0982",
        orderId:      "ORD-2024-101",
        patient:      { id: "p1", pid: "DH-40281", name: "Mrs. Kumari Rathnayake", age: 40, gender: "F", wardRoom: "Ward 04" },
        testType:     "FBC & CRP",
        testCodes:    ["FBC", "CRP"],
        priority:     "URGENT",
        status:       "RECEIVED_AT_LAB",
        tubeTypes:    ["EDTA_LAVENDER"],
        department:   "Haematology",
        collectionTime:"10:15 AM",
        receivedTime: "10:19 AM",
        waitTimeMinutes: 4,
    },
    {
        id:           "m2",
        sampleId:     "LB-2023-1004",
        orderId:      "ORD-2024-102",
        patient:      { id: "p2", pid: "DH-41082", name: "Mr. Chaminda Silva", age: 62, gender: "M", wardRoom: "ICU-02" },
        testType:     "Arterial Blood Gas",
        testCodes:    ["ABG"],
        priority:     "URGENT",
        status:       "RECEIVED_AT_LAB",
        tubeTypes:    ["HEPARIN_GREEN"],
        department:   "Biochemistry",
        collectionTime:"10:28 AM",
        receivedTime: "10:30 AM",
        waitTimeMinutes: 9,
    },
    {
        id:           "m3",
        sampleId:     "LB-2023-0877",
        orderId:      "ORD-2024-103",
        patient:      { id: "p3", pid: "DH-38901", name: "Ms. Ishara Perera", age: 28, gender: "F", wardRoom: "OPD" },
        testType:     "Lipid Profile",
        testCodes:    ["Lipid Profile"],
        priority:     "NORMAL",
        status:       "RECEIVED_AT_LAB",
        tubeTypes:    ["SST_GOLD"],
        department:   "Biochemistry",
        collectionTime:"09:55 AM",
        receivedTime: "10:00 AM",
        waitTimeMinutes: 18,
    },
    {
        id:           "m4",
        sampleId:     "LB-2023-0975",
        orderId:      "ORD-2024-104",
        patient:      { id: "p4", pid: "DH-40012", name: "Master Rahul Naveen", age: 8, gender: "M", wardRoom: "Paediatrics" },
        testType:     "Blood Grouping",
        testCodes:    ["Blood Grouping"],
        priority:     "NORMAL",
        status:       "RECEIVED_AT_LAB",
        tubeTypes:    ["EDTA_LAVENDER"],
        department:   "Blood Bank",
        collectionTime:"10:30 AM",
        receivedTime: "10:35 AM",
        waitTimeMinutes: 6,
    },
    {
        id:           "m5",
        sampleId:     "LB-2023-0991",
        orderId:      "ORD-2024-105",
        patient:      { id: "p5", pid: "DH-39821", name: "Mrs. Preethi Fernando", age: 35, gender: "F", wardRoom: "Ward 02" },
        testType:     "Thyroid Panel (T3, T4, TSH)",
        testCodes:    ["T3", "T4", "TSH"],
        priority:     "NORMAL",
        status:       "RECEIVED_AT_LAB",
        tubeTypes:    ["SST_GOLD"],
        department:   "Immunology",
        collectionTime:"09:30 AM",
        receivedTime: "09:38 AM",
        waitTimeMinutes: 25,
    },
];

export const MOCK_MLT_ALL_WORKLIST: MLTSample[] = [
    {
        id:           "a1",
        sampleId:     "LB-2023-0982",
        orderId:      "ORD-2024-101",
        patient:      { id: "p1", pid: "DH-40281", name: "Mrs. Kumari Rathnayake", age: 40, gender: "F", wardRoom: "Ward 04" },
        testType:     "FBC & CRP",
        testCodes:    ["FBC", "CRP"],
        priority:     "URGENT",
        status:       "SENT_FOR_VERIFICATION",
        tubeTypes:    ["EDTA_LAVENDER"],
        department:   "Haematology",
        collectionTime:"10:15 AM",
        receivedTime: "10:19 AM",
        waitTimeMinutes: 4,
    },
    {
        id:           "a2",
        sampleId:     "LB-2023-1004",
        orderId:      "ORD-2024-102",
        patient:      { id: "p2", pid: "DH-41082", name: "Mr. Chaminda Silva", age: 62, gender: "M", wardRoom: "ICU-02" },
        testType:     "Arterial Blood Gas",
        testCodes:    ["ABG"],
        priority:     "URGENT",
        status:       "SENT_FOR_VERIFICATION",
        tubeTypes:    ["HEPARIN_GREEN"],
        department:   "Biochemistry",
        collectionTime:"10:28 AM",
        receivedTime: "10:30 AM",
        waitTimeMinutes: 9,
    },
    {
        id:           "a3",
        sampleId:     "LB-2023-0877",
        orderId:      "ORD-2024-103",
        patient:      { id: "p3", pid: "DH-38901", name: "Ms. Ishara Perera", age: 28, gender: "F", wardRoom: "OPD" },
        testType:     "Lipid Profile",
        testCodes:    ["Lipid Profile"],
        priority:     "NORMAL",
        status:       "SENT_FOR_VERIFICATION",
        tubeTypes:    ["SST_GOLD"],
        department:   "Biochemistry",
        collectionTime:"09:55 AM",
        receivedTime: "10:00 AM",
        waitTimeMinutes: 18,
    },
    {
        id:           "a4",
        sampleId:     "LB-2023-0975",
        orderId:      "ORD-2024-104",
        patient:      { id: "p4", pid: "DH-40012", name: "Master Rahul Naveen", age: 8, gender: "M", wardRoom: "Paediatrics" },
        testType:     "Blood Grouping",
        testCodes:    ["Blood Grouping"],
        priority:     "NORMAL",
        status:       "SENT_FOR_VERIFICATION",
        tubeTypes:    ["EDTA_LAVENDER"],
        department:   "Blood Bank",
        collectionTime:"10:30 AM",
        receivedTime: "10:35 AM",
        waitTimeMinutes: 6,
    },
    {
        id:           "a5",
        sampleId:     "LB-2023-0968",
        orderId:      "ORD-2024-105",
        patient:      { id: "p5", pid: "DH-39201", name: "Mr. Sunil Shantha", age: 55, gender: "M", wardRoom: "Ward 12" },
        testType:     "HbA1c",
        testCodes:    ["HbA1c"],
        priority:     "NORMAL",
        status:       "SENT_FOR_VERIFICATION",
        tubeTypes:    ["EDTA_LAVENDER"],
        department:   "Biochemistry",
        collectionTime:"09:30 AM",
        receivedTime: "09:35 AM",
        waitTimeMinutes: 30,
    },
];

export const MOCK_MLT_STATS = {
    rejectedTests:  42,
    rejectedSince:  "+6 since 8am",
    pendingTests:   42,
    pendingSince:   "+6 since 8am",
    criticalResults: 8,
    myDrafts:       12,
};

export const MOCK_INSTRUMENTS: {
    name: string;
    status: "online" | "offline" | "busy";
    lastSync: string;
}[] = [
    { name: "Sysmex XN-1000", status: "online",  lastSync: "2 mins ago" },
    { name: "Cobas C311",     status: "online",  lastSync: "5 mins ago" },
    { name: "BioFire RP2.1",  status: "offline", lastSync: "1 hr ago"   },
];

export const DEPARTMENTS = [
    "All Departments",
    "Haematology",
    "Biochemistry",
    "Immunology",
    "Microbiology",
    "Blood Bank",
];

export const TEST_TYPES = [
    "All Test Types",
    "FBC & CRP",
    "Arterial Blood Gas",
    "Lipid Profile",
    "Blood Grouping",
    "Thyroid Panel",
    "HbA1c",
    "Urine Culture",
];