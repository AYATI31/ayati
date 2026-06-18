"use client";

import { useEffect } from "react";

const resetVersion = "no-dummy-records-2026-06-15";
const resetKey = "ayati_local_data_reset_version";
const localDataKeys = ["ayati_inquiries", "ayati_pre_visit_forms", "ayati_clinic_drafts"];

export function LocalDemoDataReset() {
  useEffect(() => {
    if (typeof window === "undefined" || !window.localStorage) {
      return;
    }

    if (window.localStorage.getItem(resetKey) === resetVersion) {
      return;
    }

    localDataKeys.forEach((key) => window.localStorage.removeItem(key));
    window.localStorage.setItem(resetKey, resetVersion);
    window.dispatchEvent(new Event("ayati-demo-storage-change"));
  }, []);

  return null;
}
