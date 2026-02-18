// mock/quality.mock.ts

export interface VerificationCheck {
    id:          string;
    label:       string;
    description: string;
    required:    boolean;
    checked:     boolean;
    tag?:        "OPTIONAL" | "REQUIRED";
}

export interface QualitySample {
    sampleId:       string;
    internalRef:    string;
    patientName:    string;
    patientTitle:   string;
    age:            number;
    gender:         string;
    mrn:            string;
    location:       string;
    bed:            string;
    clinician:      string;
    clinicianDept:  string;
    testType:       string;
    testColor:      string;
    containerType:  string;
    collectionTime: string;
    elapsedMinutes: number;
    timeWindow:     string;
}

export const MOCK_QUALITY_SAMPLE: QualitySample = {
    sampleId:       "77291034",
    internalRef:    "JOUR-77291034-9",
    patientName:    "Sandhya Rajakaruna",
    patientTitle:   "Mrs.",
    age:            64,
    gender:         "Female",
    mrn:            "882-0034",
    location:       "General Ward 03",
    bed:            "Bed 12-A",
    clinician:      "Dr. B. Wickramasinghe",
    clinicianDept:  "Internal Medicine Dept.",
    testType:       "Full Blood Count (FBC) + ESR",
    testColor:      "bg-purple-500",
    containerType:  "EDTA K3 (Purple Top)",
    collectionTime: "Today, 09:45 AM",
    elapsedMinutes: 22,
    timeWindow:     "60 min max",
};

export const MOCK_VERIFICATION_CHECKS: VerificationCheck[] = [
    {
        id:          "barcode",
        label:       "Barcode Integrity",
        description: "Label is unscratched, properly aligned, and readable by scanner.",
        required:    true,
        checked:     false,
    },
    {
        id:          "container",
        label:       "Correct Container",
        description: "Verified against test requirements (Lavender EDTA K3).",
        required:    true,
        checked:     false,
    },
    {
        id:          "volume",
        label:       "Volume Sufficiency",
        description: "Actual: 3.5ml | Required: Min 2.0ml",
        required:    false,
        checked:     false,
        tag:         "OPTIONAL",
    },
    {
        id:          "condition",
        label:       "Sample Condition",
        description: "Visual check: No Hemolysis, No Clots, No Lipemia observed.",
        required:    true,
        checked:     false,
    },
    {
        id:          "window",
        label:       "Collection Window",
        description: "Received within established stability timeframe (60 min max).",
        required:    true,
        checked:     true,
    },
];