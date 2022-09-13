const PROFILE_URL =
  'http://example.com/fhir/example/StructureDefinition/covid19-lab-order';

export const plugin = (table, entry, tableMapping) => {
  const resource = entry.resource;

  if (resource?.meta?.profile == PROFILE_URL) {
    if (resource?.code?.coding?.length > 0) {
      switch (resource.code.coding[0].code) {
        case '94558-4':
          table.rows['test_requested'] =
            'SARS-CoV-2 (COVID-19) Ag [Presence] in Respiratory specimen by Rapid immunoassay';
          break;
        case '94745-7':
          table.rows['test_requested'] =
            'SARS-CoV-2 (COVID-19) RNA [Cycle Threshold #] in Respiratory specimen by NAA with probe detection';
          break;
        default:
          table.rows['test_requested'] = '';
          break;
      }
    }
  }

  return table;
};
