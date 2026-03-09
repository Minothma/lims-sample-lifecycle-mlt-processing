// mock/barcode.mock.ts
// ✅ Sample IDs and patient details match reception/accessioning page

export interface BarcodeSearchResult {
    sampleId:          string;
    patientName:       string;
    age:               number;
    gender:            "Male" | "Female";
    testProfile:       string;
    collectionDate:    string;
    collectionTime:    string;
    tubeType:          string;
    tubeColor:         string;
    orderingPhysician: string;
    barcode:           string;
    lastPrinted?:      string;
}

export const MOCK_BARCODE_RESULTS: Record<string, BarcodeSearchResult> = {
    // ── Matches accessioning log: al1 ──
    "S-90231": {
        sampleId:          "S-90231",
        patientName:       "Jane Doe",
        age:               45,
        gender:            "Female",
        testProfile:       "HbA1c + Lipid Profile",
        collectionDate:    "26 Feb 2026",
        collectionTime:    "10:30 AM",
        tubeType:          "SST Gold Top",
        tubeColor:         "gold",
        orderingPhysician: "Lab Tech Perera",
        barcode:           "S-90231",
        lastPrinted:       "5 minutes ago",
    },

    // ── Matches accessioning log: al2 ──
    "S-90232": {
        sampleId:          "S-90232",
        patientName:       "Mohamed Kamil",
        age:               37,
        gender:            "Male",
        testProfile:       "Full Blood Count (FBC)",
        collectionDate:    "26 Feb 2026",
        collectionTime:    "10:43 AM",
        tubeType:          "EDTA Lavender Top",
        tubeColor:         "lavender",
        orderingPhysician: "Lab Tech Perera",
        barcode:           "S-90232",
        lastPrinted:       "2 minutes ago",
    },

    // ── Matches accessioning log: al3 ──
    "S-90233": {
        sampleId:          "S-90233",
        patientName:       "Chaminda Silva",
        age:               52,
        gender:            "Male",
        testProfile:       "Blood Culture",
        collectionDate:    "26 Feb 2026",
        collectionTime:    "10:51 AM",
        tubeType:          "Heparin Green Top",
        tubeColor:         "green",
        orderingPhysician: "Lab Tech Mendis",
        barcode:           "S-90233",
        lastPrinted:       "10 minutes ago",
    },

    // ── Matches accessioning log: al4 ──
    "S-90235": {
        sampleId:          "S-90235",
        patientName:       "Priya Rajan",
        age:               29,
        gender:            "Female",
        testProfile:       "Thyroid Panel",
        collectionDate:    "26 Feb 2026",
        collectionTime:    "10:52 AM",
        tubeType:          "SST Gold Top",
        tubeColor:         "gold",
        orderingPhysician: "Lab Tech Perera",
        barcode:           "S-90235",
        lastPrinted:       undefined,
    },

    // ── Matches accessioning log: al5 ──
    "S-90199": {
        sampleId:          "S-90199",
        patientName:       "Saman Perera",
        age:               53,
        gender:            "Male",
        testProfile:       "Urine Culture",
        collectionDate:    "26 Feb 2026",
        collectionTime:    "05:15 AM",
        tubeType:          "Plain Red Top",
        tubeColor:         "red",
        orderingPhysician: "Lab Tech Mendis",
        barcode:           "S-90199",
        lastPrinted:       "30 minutes ago",
    },

    // ── Matches accessioning log: al6 ──
    "S-90241": {
        sampleId:          "S-90241",
        patientName:       "Kamala Jayasinghe",
        age:               61,
        gender:            "Female",
        testProfile:       "Serum Electrolytes",
        collectionDate:    "26 Feb 2026",
        collectionTime:    "11:05 AM",
        tubeType:          "SST Gold Top",
        tubeColor:         "gold",
        orderingPhysician: "Lab Tech Perera",
        barcode:           "S-90241",
        lastPrinted:       "1 minute ago",
    },
};

export const MOCK_PRE_PRINT_CHECKLIST = [
    "Ensure the current unreadable label is discarded properly.",
    "Verify patient identity with two identifiers before re-labeling.",
    "Check printer ribbon and label stock levels.",
];