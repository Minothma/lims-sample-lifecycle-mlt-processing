// mock/result-entry.mock.ts

export type ResultFlag =
    | "NORMAL"
    | "LOW"
    | "HIGH"
    | "CRITICAL_LOW"
    | "CRITICAL_HIGH";

export interface TestParameter {
    id:                 string;
    parameterName:      string;
    result:             string;
    unit:               string;
    referenceRangeLow:  number;
    referenceRangeHigh: number;
    flag:               ResultFlag;
    isCritical:         boolean;
    editable:           boolean;
}

export interface TestGroup {
    groupName:  string;
    parameters: TestParameter[];
}

export interface ResultEntrySample {
    sampleId:       string;
    patientName:    string;
    patientId:      string;
    age:            number;
    gender:         string;
    wardRoom:       string;
    collectionDate: string;
    collectionTime: string;
    validatedAt:    string;
    activeCaseNote: string;
    testGroups:     TestGroup[];
}

// ── Helper to compute flag ─────────────────────────────────────
export function computeFlag(
    value: number,
    low: number,
    high: number
): ResultFlag {
    if (value < low * 0.7)  return "CRITICAL_LOW";
    if (value > high * 1.3) return "CRITICAL_HIGH";
    if (value < low)        return "LOW";
    if (value > high)       return "HIGH";
    return "NORMAL";
}

export const MOCK_RESULT_ENTRY: ResultEntrySample = {
    sampleId:       "SAPP-2025-9912",
    patientName:    "Kamala Jayasinghe",
    patientId:      "DH-982384",
    age:            54,
    gender:         "Female",
    wardRoom:       "ICU — Bed 04",
    collectionDate: "Oct 24, 2023",
    collectionTime: "08:45 AM",
    validatedAt:    "Oct 24, 2023 | 09:12 AM",
    activeCaseNote: "Stat request from ICU. Requires immediate validation.",
    testGroups: [
        {
            groupName: "COMPLETE BLOOD COUNT",
            parameters: [
                {
                    id:                 "wbc",
                    parameterName:      "WBC (White Blood Cells)",
                    result:             "7.2",
                    unit:               "10³/µL",
                    referenceRangeLow:  4.0,
                    referenceRangeHigh: 10.0,
                    flag:               "NORMAL",
                    isCritical:         false,
                    editable:           true,
                },
                {
                    id:                 "rbc",
                    parameterName:      "RBC (Red Blood Cells)",
                    result:             "3.9",
                    unit:               "10⁶/µL",
                    referenceRangeLow:  4.5,
                    referenceRangeHigh: 5.5,
                    flag:               "LOW",
                    isCritical:         false,
                    editable:           true,
                },
                {
                    id:                 "hgb",
                    parameterName:      "Hemoglobin",
                    result:             "11.2",
                    unit:               "g/dL",
                    referenceRangeLow:  12.0,
                    referenceRangeHigh: 17.0,
                    flag:               "LOW",
                    isCritical:         false,
                    editable:           true,
                },
                {
                    id:                 "hct",
                    parameterName:      "Hematocrit (HCT)",
                    result:             "34.5",
                    unit:               "%",
                    referenceRangeLow:  36.0,
                    referenceRangeHigh: 50.0,
                    flag:               "LOW",
                    isCritical:         false,
                    editable:           true,
                },
                {
                    id:                 "plt",
                    parameterName:      "Platelets",
                    result:             "185",
                    unit:               "10³/µL",
                    referenceRangeLow:  150,
                    referenceRangeHigh: 400,
                    flag:               "NORMAL",
                    isCritical:         false,
                    editable:           true,
                },
            ],
        },
        {
            groupName: "SERUM ELECTROLYTES",
            parameters: [
                {
                    id:                 "na",
                    parameterName:      "Sodium (Na+)",
                    result:             "138",
                    unit:               "mmol/L",
                    referenceRangeLow:  135,
                    referenceRangeHigh: 145,
                    flag:               "NORMAL",
                    isCritical:         false,
                    editable:           true,
                },
                {
                    id:                 "k",
                    parameterName:      "Potassium (K+)",
                    result:             "6.8",
                    unit:               "mmol/L",
                    referenceRangeLow:  3.5,
                    referenceRangeHigh: 5.1,
                    flag:               "CRITICAL_HIGH",
                    isCritical:         true,
                    editable:           true,
                },
                {
                    id:                 "cl",
                    parameterName:      "Chloride (Cl-)",
                    result:             "101",
                    unit:               "mmol/L",
                    referenceRangeLow:  96,
                    referenceRangeHigh: 106,
                    flag:               "NORMAL",
                    isCritical:         false,
                    editable:           true,
                },
            ],
        },
    ],
};