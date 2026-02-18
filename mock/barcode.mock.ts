// mock/barcode.mock.ts

export interface BarcodeSearchResult {
    sampleId:         string;
    patientName:      string;
    age:              number;
    gender:           "Male" | "Female";
    testProfile:      string;
    collectionDate:   string;
    collectionTime:   string;
    tubeType:         string;
    tubeColor:        string;
    orderingPhysician:string;
    barcode:          string;
    lastPrinted?:     string;
}

export const MOCK_BARCODE_RESULTS: Record<string, BarcodeSearchResult> = {
    "DUR-2023-0812": {
        sampleId:         "DUR-2023-0812",
        patientName:      "Jane Doe Fernandez",
        age:              45,
        gender:           "Female",
        testProfile:      "HbA1c, Lipid Profile (Total, HDL, LDL)",
        collectionDate:   "24 Oct 2023",
        collectionTime:   "08:45 AM",
        tubeType:         "EDTA (Lavender Top)",
        tubeColor:        "lavender",
        orderingPhysician:"Dr. S. K. Perera",
        barcode:          "DUR-2023-0812",
        lastPrinted:      "2 minutes ago",
    },
    "DUR-2023-0901": {
        sampleId:         "DUR-2023-0901",
        patientName:      "Kamala Jayasinghe",
        age:              54,
        gender:           "Female",
        testProfile:      "Full Blood Count (FBC) + ESR",
        collectionDate:   "24 Oct 2023",
        collectionTime:   "09:15 AM",
        tubeType:         "EDTA K3 (Purple Top)",
        tubeColor:        "purple",
        orderingPhysician:"Dr. R. Mendis",
        barcode:          "DUR-2023-0901",
        lastPrinted:      "15 minutes ago",
    },
};

export const MOCK_PRE_PRINT_CHECKLIST = [
    "Ensure the current unreadable label is discarded properly.",
    "Verify patient identity with two identifiers before re-labeling.",
    "Check printer ribbon and label stock levels.",
];