const queries = [
  `CREATE TABLE patient(
		createdAt Date,
		updatedAt Date,
		patientGender String,
		patientBirthdate Date, 
		patientCountry String, 
		patientKeyPopulation String
	  ) 
	  ENGINE=MergeTree
	  ORDER BY tuple();`,

  `CREATE TABLE condition(
		createdAt Date,
		updatedAt Date,
		positiveHIVDiagnosisDate String
	  ) 
	  ENGINE=MergeTree
	  ORDER BY tuple();`,

  `CREATE TABLE diagnostic_report(
		createdAt Date,
		updatedAt Date,
		rapidAntigenTestResult String
	  ) 
	  ENGINE=MergeTree
	  ORDER BY tuple();`,

  `CREATE TABLE service_request(
		createdAt Date,
		updatedAt Date,
		testRequested String
	  ) 
	  ENGINE=MergeTree
	  ORDER BY tuple();`,

  `CREATE TABLE specimen(
		createdAt Date,
		updatedAt Date,
		dateSampleCollected String
	  ) 
	  ENGINE=MergeTree
	  ORDER BY tuple();`,
];

module.exports = queries;
