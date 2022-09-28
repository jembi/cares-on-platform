const PROFILE_URL =
  'http://openhie.org/fhir/covid19-casereporting/StructureDefinition/covid19-lab-order';

export const plugin = (table, entry, tableMapping) => {
  const resource = entry.resource;

  if (resource?.meta?.profile == PROFILE_URL) {
    table.rows['meta_profile'] = PROFILE_URL.replace(
      'http://openhie.org/fhir/covid19-casereporting/StructureDefinition/',
      ''
    );
    if (resource?.code?.coding?.length > 0) {
      switch (resource.code.coding[0].code) {
        case '1156860005':
          table.rows['test_requested'] =
            'SARS-CoV-2 (COVID-19) Ag [Presence] in Respiratory specimen by Rapid immunoassay';
          break;
        case '9718006':
          table.rows['test_requested'] =
            'SARS-CoV-2 (COVID-19) RNA [Cycle Threshold #] in Respiratory specimen by NAA with probe detection';
          break;
      }
    }
  }

  return table;
};
