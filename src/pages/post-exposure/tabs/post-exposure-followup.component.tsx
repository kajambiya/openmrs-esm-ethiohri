import React from "react";
import { EncounterList } from "@ohri/openmrs-esm-ohri-commons-lib";
import { POST_EXPOSURE_FOLLOWUP_ENCOUNTER_TYPE } from "../../../constants";
import { getData } from "../../encounterUtils";
import { moduleName } from "../../../index";

const columns = [
  {
    key: "visitDate",
    header: "Visit Date",
    getValue: (encounter) => {
      return getData(encounter, "163260AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", true);
    },
  },
  {
    key: "visitPeriod",
    header: "Visit Period",
    getValue: (encounter) => {
      return getData(encounter, "957a79b4-e771-4ab8-bcc6-e77f7dbcfd9d");
    },
  },
  {
    key: "adherence",
    header: "Adherence",
    getValue: (encounter) => {
      return getData(encounter, "b1a646d3-78ff-4dd5-823a-5bef7d69ff3d");
    },
  },
  {
    key: "hivStatus",
    header: "HIV Status",
    getValue: (encounter) => {
      return getData(encounter, "21ea1d83-acd7-4c99-b4cc-33a90e6dd7d7");
    },
  },
  {
    key: "actions",
    header: "Actions",
    getValue: (encounter) => [
      {
        form: { name: "Exposed Person Followup", package: "eth_hiv" },
        encounterUuid: encounter.uuid,
        intent: "*",
        label: "View Post Exposure Followup",
        mode: "view",
      },
      {
        form: { name: "Exposed Person Followup", package: "eth_hiv" },
        encounterUuid: encounter.uuid,
        intent: "*",
        label: "Edit Post Exposure Followup",
        mode: "edit",
      },
    ],
  },
];

const PostExposureFollowup: React.FC<{ patientUuid: string }> = ({
  patientUuid,
}) => {
  return (
    <EncounterList
      patientUuid={patientUuid}
      encounterType={POST_EXPOSURE_FOLLOWUP_ENCOUNTER_TYPE}
      formList={[{ name: "Exposed Person Followup" }]}
      columns={columns}
      description="Post Exposure Followup List"
      headerTitle="Post Exposure Followup"
      launchOptions={{
        displayText: "Add",
        moduleName: moduleName,
      }}
    />
  );
};

export default PostExposureFollowup;