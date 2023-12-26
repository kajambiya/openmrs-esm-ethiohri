import React, { useEffect, useState } from "react";
import { EncounterList } from "@ohri/openmrs-esm-ohri-commons-lib";
import {
  MRN_NULL_WARNING,
  PMTCT_MOTHER_FINAL_OUTCOME_ENCOUNTER_TYPE,
} from "../../../../constants";
import { getData } from "../../../encounterUtils";
import { moduleName } from "../../../../index";
import { fetchIdentifiers } from "../../../../api/api";
import styles from "../../../../root.scss";

const columns = [
  {
    key: "heiDate",
    header: "HEI Code",
    getValue: (encounter) => {
      return getData(encounter, "2b30a270-be1f-4cce-9949-7d7eaba349be", true);
    },
  },
  {
    key: "arvStarted",
    header: "ARV started",
    getValue: (encounter) => {
      return getData(encounter, "b7f50074-b9f2-4b0d-9f20-d18b646d822e", false);
    },
  },
  {
    key: "infantReferred",
    header: "Infant Referred",
    getValue: (encounter) => {
      return getData(encounter, "a0b16ce2-80a8-4b26-9168-74a6f64adb09", false);
    },
  },
  {
    key: "placeOfDelivery",
    header: "Place of Delivery",
    getValue: (encounter) => {
      return getData(encounter, "1572AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", false);
    },
  },
  {
    key: "modeOfDelivery",
    header: "Mode of Delivery",
    getValue: (encounter) => {
      return getData(encounter, "5630AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", false);
    },
  },
  {
    key: "actions",
    header: "Actions",
    getValue: (encounter) => [
      {
        form: { name: "PMTCT Mother Inital Registration", package: "eth_hiv" },
        encounterUuid: encounter.uuid,
        intent: "*",
        label: "View Mother's Inital Registration",
        mode: "view",
      },
      {
        form: { name: "PMTCT Mother Inital Registration", package: "eth_hiv" },
        encounterUuid: encounter.uuid,
        intent: "*",
        label: "Edit Mother's Inital Registration",
        mode: "edit",
      },
    ],
  },
];

const PMTCTMotherFinalOutcomeEncounterList: React.FC<{
  patientUuid: string;
}> = ({ patientUuid }) => {
  const [hasMRN, setHasMRN] = useState(false);
  useEffect(() => {
    (async () => {
      const identifiers = await fetchIdentifiers(patientUuid);
      if (identifiers?.find((e) => e.identifierType.display === "MRN")) {
        setHasMRN(true);
      }
    })();
  });

  return (
    <>
      <EncounterList
        patientUuid={patientUuid}
        encounterType={PMTCT_MOTHER_FINAL_OUTCOME_ENCOUNTER_TYPE}
        formList={[{ name: "PMTCT Mother Final Outcome" }]}
        columns={columns}
        description="Mother's Final Outcome Encounter List"
        headerTitle="Mother's Final Outcome"
        launchOptions={{
          displayText: "Add",
          moduleName: moduleName,
        }}
      />
      {!hasMRN && <p className={styles.patientName}>{MRN_NULL_WARNING}</p>}
    </>
  );
};

export default PMTCTMotherFinalOutcomeEncounterList;