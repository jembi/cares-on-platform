const COVID19_TEST_RESULTS_PROFILE =
  'http://openhie.org/fhir/covid19-casereporting/StructureDefinition/covid19-test-results';
const CODE_ANTIGEN_TEST = '94558-4';
const CODE_PCR_TEST = '94745-7';

export const plugin = (table, entry, tableMapping) => {
  const resource = entry.resource;

  if (resource?.meta?.profile == COVID19_TEST_RESULTS_PROFILE) {
    table.rows['meta_profile'] = COVID19_TEST_RESULTS_PROFILE.replace(
      'http://openhie.org/fhir/covid19-casereporting/StructureDefinition/',
      ''
    );
    if (
      resource?.code?.coding?.length > 0 &&
      resource.code.coding[0].code == CODE_ANTIGEN_TEST &&
      resource?.valueCodeableConcept?.coding?.length > 0
    ) {
      switch (resource.valueCodeableConcept.coding[0].code) {
        case '10828004':
          table.rows['rapid_antigen_test_result'] = 'Positive';
          break;
        case '260385009':
          table.rows['rapid_antigen_test_result'] = 'Negative';
          break;
        case '419984006':
          table.rows['rapid_antigen_test_result'] = 'Inconclusive';
          break;
        default:
          table.rows['rapid_antigen_test_result'] = '';
          break;
      }
    } else if (
      resource?.code?.coding?.length > 0 &&
      resource.code.coding[0].code == CODE_PCR_TEST &&
      resource?.valueCodeableConcept?.coding?.length > 0
    ) {
      switch (resource.valueCodeableConcept.coding[0].code) {
        case '10828004':
          table.rows['diagnostic_pcr_test_result'] = 'Positive';
          break;
        case '260385009':
          table.rows['diagnostic_pcr_test_result'] = 'Negative';
          break;
        case '419984006':
          table.rows['diagnostic_pcr_test_result'] = 'Inconclusive';
          break;
        default:
          table.rows['diagnostic_pcr_test_result'] = '';
          break;
      }
    }
  }

  return table;
};
