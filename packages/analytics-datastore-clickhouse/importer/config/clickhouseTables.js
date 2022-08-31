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
		PositiveHIVDiagnosisDate String
	  ) 
	  ENGINE=MergeTree
	  ORDER BY tuple();`,

  `CREATE TABLE diagnostic_report(
		createdAt Date,
		updatedAt Date,
		RapidAntigenTestResult String
	  ) 
	  ENGINE=MergeTree
	  ORDER BY tuple();`,

  `CREATE TABLE service_request(
		createdAt Date,
		updatedAt Date,
		TestRequested String
	  ) 
	  ENGINE=MergeTree
	  ORDER BY tuple();`,

  `CREATE TABLE specimen(
		createdAt Date,
		updatedAt Date,
		DateSampleCollected String
	  ) 
	  ENGINE=MergeTree
	  ORDER BY tuple();`,
];

module.exports = queries;
