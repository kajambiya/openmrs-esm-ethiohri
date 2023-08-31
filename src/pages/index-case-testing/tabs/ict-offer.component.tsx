import React from "react";
import { EncounterList } from "@ohri/openmrs-esm-ohri-commons-lib";
import { ICT_OFFER_ENCOUNTER_TYPE } from "../../../constants";
import { getData } from "../../encounterUtils";
import { moduleName } from "../../../index";

const columns = [
    {
        key: "offered",
        header: "Offered",
        getValue: (encounter) => {
            return getData(encounter, "eef33554-8844-48ed-abec-a06e4918b7fe", true);
        },
    },
    {
        key: "offeredDate",
        header: "Offered Date",
        getValue: (encounter) => {
            return getData(encounter, "a7c606b1-9f3e-4095-815a-3a623dc738e1");
        },
    },
    {
        key: "accepted",
        header: "Accepted",
        getValue: (encounter) => {
            return getData(encounter, "fdcbadef-40c5-486a-a30b-a88477ab90ae");
        },
    },
    {
        key: "acceptedDate",
        header: "Accepted Date",
        getValue: (encounter) => {
            return getData(encounter, "da8e65a1-04ee-44a0-be4b-d2bc4f002aa4");
        },
    },
    {
        key: "actions",
        header: "Actions",
        getValue: (encounter) => [
            {
                form: { name: "ICT Offer", package: "eth_hiv" },
                encounterUuid: encounter.uuid,
                intent: "*",
                label: "View ICT Offer",
                mode: "view",
            },
            {
                form: { name: "ICT Offer", package: "eth_hiv" },
                encounterUuid: encounter.uuid,
                intent: "*",
                label: "Edit ICT Offer",
                mode: "edit",
            },
        ],
    },
];

const ICTOffer: React.FC<{ patientUuid: string }> = ({
    patientUuid,
}) => {
    return (
        <EncounterList
            patientUuid={patientUuid}
            encounterType={ICT_OFFER_ENCOUNTER_TYPE}
            formList={[{ name: "ICT Offer" }]}
            columns={columns}
            description="ICT Offer List"
            headerTitle="ICT Offer"
            launchOptions={{
                displayText: "Add",
                moduleName: moduleName,
            }}
        />
    );
};

export default ICTOffer;