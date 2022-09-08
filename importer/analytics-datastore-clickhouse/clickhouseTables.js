const queries = [
  `CREATE TABLE organization(
		created_at Date,
		updated_at Date,
		facility_id String,
		id String,
		version String,
		lastUpdated String,
		facility_name String,
		facility_code String,
		country_state_province String,
		country String, 
		district String,
		city String
	  ) 
	  ENGINE=MergeTree
	  ORDER BY tuple();`,

  `CREATE TABLE patient(
		created_at Date,
		updated_at Date,
		patient_id String,
		id String,
		version String,
		lastUpdated String,
		patient_gender String,
		patient_birthdate Date,
		patient_district String, 
		patient_key_population String,
		facility_id String
	  ) 
	  ENGINE=MergeTree
	  ORDER BY tuple();`,

  `CREATE TABLE condition(
		created_at Date,
		updated_at Date,
		id String,
		version String,
		lastUpdated String,
		patient_id String,
		positive_hiv_diagnosis_date Date,
		covid_diagnosis String
	  ) 
	  ENGINE=MergeTree
	  ORDER BY tuple();`,

  `CREATE TABLE diagnostic_report(
		created_at Date,
		updated_at Date,
		id String,
		version String,
		lastUpdated String,
		patient_id String,
		rapid_antigen_test_result String,
		diagnostic_pcr_test_result String
	  ) 
	  ENGINE=MergeTree
	  ORDER BY tuple();`,

  `CREATE TABLE service_request(
		created_at Date,
		updated_at Date,
		id String,
		version String,
		lastUpdated String,
		patient_id String,
		test_requested String
	  ) 
	  ENGINE=MergeTree
	  ORDER BY tuple();`,

  // TODO patient_id for testing only [To be updated]
  `CREATE TABLE specimen(
		created_at Date,
		updated_at Date,
		patient_id String,
		id String,
		version String,
		lastUpdated String,
		date_sample_collected Date
	  ) 
	  ENGINE=MergeTree
	  ORDER BY tuple();`,

  `CREATE TABLE immunization(
		created_at Date,
		updated_at Date,
		id String,
		version String,
		lastUpdated String,
		vaccine_administered String,
		vaccine_dose String,
		vaccination_date Date
	  ) 
	  ENGINE=MergeTree
	  ORDER BY tuple();`,

  // TODO Add join according + create live view
  `CREATE VIEW report_1_test_2 AS SELECT * from patient INNER JOIN specimen ON patient.patient_id=specimen.patient_id`,
];

module.exports = queries;
