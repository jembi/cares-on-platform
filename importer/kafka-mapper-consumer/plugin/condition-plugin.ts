const PROFILE_URL_COVID =
  'http://example.com/fhir/example/StructureDefinition/covid19-diagnosis';
const PROFILE_URL_HIV =
  'http://openhie.org/fhir/hiv-casereporting/StructureDefinition/hiv-diagnosis';

export const plugin = (table, entry, tableMapping) => {
  const resource = entry.resource;

  if (resource?.meta?.profile == PROFILE_URL_COVID) {
    table.rows['covid_diagnosis_date'] = resource.recordedDate;

    if (resource?.verificationStatus?.coding?.length > 0) {
      switch (resource.verificationStatus.coding[0].code) {
        case '410605003':
          table.rows['covid_diagnosis'] = 'Confirmed present';
          break;
        case '2931005':
          table.rows['covid_diagnosis'] = 'Probable diagnosis';
          break;
        case '415684004':
          table.rows['covid_diagnosis'] = 'Suspected';
          break;
        default:
          break;
      }
    }
  } else if (resource?.meta?.profile == PROFILE_URL_HIV) {
    table.rows['hiv_diagnosis_date'] = resource.recordedDate;
  }

  return table;
};
