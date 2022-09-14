const queries = [
  `CREATE TABLE organization(
		facility_id String,
		id String,
		version String,
		created_at Date,
		last_updated String,
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
		id String,
		version String,
		created_at Date,
		last_updated String,
		patient_gender String,
		patient_birthdate Date NULL,
		patient_district String, 
		patient_key_population String,
		facility_id String
	  ) 
	  ENGINE=MergeTree
	  ORDER BY tuple();`,

  `CREATE TABLE condition(
		id String,
		version String,
		last_updated String,
		created_at Date,
		patient_id String,
		covid_diagnosis String,
		covid_diagnosis_date Date NULL, 
		hiv_diagnosis_date Date NULL
	  ) 
	  ENGINE=MergeTree
	  ORDER BY tuple();`,

  `CREATE TABLE service_request(
		id String,
		version String,
		last_updated String,
		created_at Date,
		patient_id String,
		test_requested String
	  ) 
	  ENGINE=MergeTree
	  ORDER BY tuple();`,

  `CREATE TABLE specimen(
		patient_id String,
		id String,
		version String,
		created_at Date,
		last_updated String,
		date_sample_collected Date NULL
	  ) 
	  ENGINE=MergeTree
	  ORDER BY tuple();`,

  `CREATE TABLE observation(
		patient_id String,
		id String,
		version String,
		last_updated String,
		created_at Date,
		rapid_antigen_test_result String,
		diagnostic_pcr_test_result String
	  ) 
	  ENGINE=MergeTree
	  ORDER BY tuple();`,

  `CREATE TABLE immunization(
		id String,
		version String,
		last_updated String,
		patient_id String,
		created_at Date,
		vaccine_administered String,
		vaccine_dose String,
		vaccine_series String,
		vaccination_date Date NULL,
		source_of_information String,
		meta_profile String,
		assessment_vaccine_administered String,
		assessment_vaccine_dose String,
		assessment_vaccine_series String,
		assessment_vaccination_date Date NULL,
		assessment_source_of_information String
	  ) 
	  ENGINE=MergeTree
	  ORDER BY tuple();`,

  `CREATE VIEW report_1 AS SELECT * from patient 
  	LEFT JOIN specimen ON patient.id=specimen.patient_id 
	LEFT JOIN service_request ON patient.id=service_request.patient_id
	LEFT JOIN condition ON patient.id=condition.patient_id
	LEFT JOIN observation ON patient.id=observation.patient_id 
	LEFT JOIN organization ON patient.facility_id=organization.facility_id;`,

  `CREATE VIEW report_2 AS SELECT * from patient 
	LEFT JOIN specimen ON patient.id=specimen.patient_id
	LEFT JOIN service_request ON patient.id=service_request.patient_id
	LEFT JOIN condition ON patient.id=condition.patient_id
	LEFT JOIN observation ON patient.id=observation.patient_id 
	LEFT JOIN organization ON patient.facility_id=organization.facility_id
	LEFT JOIN immunization ON patient.id=immunization.patient_id;`,

  `CREATE VIEW report_3 AS SELECT * from patient 
	LEFT JOIN specimen ON patient.id=specimen.patient_id
	LEFT JOIN service_request ON patient.id=service_request.patient_id
	LEFT JOIN condition ON patient.id=condition.patient_id
	LEFT JOIN observation ON patient.id=observation.patient_id 
	LEFT JOIN organization ON patient.facility_id=organization.facility_id
	LEFT JOIN immunization ON patient.id=immunization.patient_id;`,
];

module.exports = queries;
