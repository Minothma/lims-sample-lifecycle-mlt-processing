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
    sampleId:       "S-90348",
    internalRef:    "JOUR-90348-9",
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

export const MOCK_QUALITY_SAMPLES: QualitySample[] = [
    MOCK_QUALITY_SAMPLE, // existing one — S-90348
    {
        sampleId:       "S-90232",
        internalRef:    "JOUR-90232-4",
        patientName:    "Mohamed Kamil",
        patientTitle:   "Mr.",
        age:            37,
        gender:         "Male",
        mrn:            "DH-38822",
        location:       "OPD Clinic",
        bed:            "Bay 03",
        clinician:      "Dr. A. Perera",
        clinicianDept:  "General Medicine",
        testType:       "Full Blood Count",
        testColor:      "bg-purple-500",
        containerType:  "EDTA K3 (Purple Top)",
        collectionTime: "Today, 10:43 AM",
        elapsedMinutes: 10,
        timeWindow:     "60 min max",
    },
    {
        sampleId:       "S-90235",
        internalRef:    "JOUR-90235-6",
        patientName:    "Priya Rajan",
        patientTitle:   "Ms.",
        age:            29,
        gender:         "Female",
        mrn:            "DH-41002",
        location:       "Ward 02",
        bed:            "Bed 05-B",
        clinician:      "Dr. N. Fernando",
        clinicianDept:  "Endocrinology Dept.",
        testType:       "Thyroid Panel (T3, T4)",
        testColor:      "bg-yellow-400",
        containerType:  "SST Gold Top",
        collectionTime: "Today, 10:52 AM",
        elapsedMinutes: 5,
        timeWindow:     "60 min max",
    },
    {
        sampleId:       "S-90241",
        internalRef:    "JOUR-90241-2",
        patientName:    "Kamala Jayasinghe",
        patientTitle:   "Mrs.",
        age:            61,
        gender:         "Female",
        mrn:            "DH-39105",
        location:       "ICU",
        bed:            "Bed 01-A",
        clinician:      "Dr. R. Silva",
        clinicianDept:  "Critical Care",
        testType:       "Serum Electrolytes",
        testColor:      "bg-green-500",
        containerType:  "Heparin (Green Top)",
        collectionTime: "Today, 11:05 AM",
        elapsedMinutes: 3,
        timeWindow:     "60 min max",
    },
];

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