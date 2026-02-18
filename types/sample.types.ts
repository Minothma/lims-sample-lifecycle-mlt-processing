// types/sample.types.ts

export type Priority = "URGENT" | "NORMAL" | "STAT";

export type SampleStatus =
    | "PENDING_COLLECTION"
    | "COLLECTED"
    | "IN_TRANSIT"
    | "RECEIVED_AT_LAB"
    | "QUALITY_CHECK"
    | "ACCEPTED"
    | "REJECTED"
    | "IN_TESTING"
    | "RESULT_ENTERED"
    | "SENT_FOR_VERIFICATION"
    | "VERIFIED"
    | "AUTHORIZED"
    | "DISPATCHED";

export type TubeType =
    | "EDTA_PURPLE"
    | "EDTA_LAVENDER"
    | "SST_GOLD"
    | "SST_RED"
    | "CITRATE_BLUE"
    | "HEPARIN_GREEN"
    | "URINE_YELLOW"
    | "OTHER";

export interface Patient {
    id: string;
    pid: string;           // e.g. DH-40281
    name: string;
    age: number;
    gender: "M" | "F";
    wardRoom?: string;
    mrn?: string;
}

export interface Sample {
    id: string;
    sampleId: string;      // e.g. S-90231
    orderId: string;
    patient: Patient;
    testType: string;
    testCodes: string[];   // e.g. ["FBC", "CRP", "ESR"]
    priority: Priority;
    status: SampleStatus;
    tubeTypes: TubeType[];
    collectionTime?: string;
    receivedTime?: string;
    waitTimeMinutes?: number;
    collectorName?: string;
    notes?: string;
}

export interface TestResult {
    parameterId: string;
    parameterName: string;
    result: string | number;
    unit: string;
    referenceRangeLow: number;
    referenceRangeHigh: number;
    flag: "NORMAL" | "LOW" | "HIGH" | "CRITICAL_LOW" | "CRITICAL_HIGH";
    isCritical: boolean;
}

export interface ResultEntry {
    sampleId: string;
    testType: string;
    results: TestResult[];
    mltNotes: string;
    criticalNotified: boolean;
    submittedAt: string;
    submittedBy: string;
}

export interface RejectSamplePayload {
    sampleId: string;
    reason: string;
    comments?: string;
    notifyFrontDesk: boolean;
    notifyPhlebotomy?: boolean;
    requestReCollection?: boolean;
}