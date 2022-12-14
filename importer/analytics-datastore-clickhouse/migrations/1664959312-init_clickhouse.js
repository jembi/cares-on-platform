const queries = [
  // Resource Tables
  `CREATE TABLE organization(
		facility_id String NULL,
		id String NULL,
		version String NULL,
		inserted_at DateTime DEFAULT now(),
		last_updated Date NULL,
		facility_name String NULL,
		facility_code String NULL,
		country_state_province String NULL,
		country String NULL, 
		district String NULL,
		city String NULL
	  ) 
	  ENGINE=MergeTree
	  ORDER BY tuple();`,

  `CREATE TABLE patient(
		id String NULL,
		version String NULL,
		inserted_at DateTime DEFAULT now(),
		last_updated Date NULL,
		golden_id String NULL,
		patient_gender String NULL,
		patient_birthdate Date32 NULL,
		patient_district String NULL, 
		patient_key_population String NULL,
		facility_id String NULL
	  ) 
	  ENGINE=MergeTree
	  ORDER BY tuple();`,

  `CREATE TABLE encounter(
		id String NULL,
		version String NULL,
		last_updated Date NULL,
		inserted_at DateTime DEFAULT now(),
		patient_id String NULL,
		meta_profile String NULL
		) 
		ENGINE=MergeTree
		ORDER BY tuple();`,

  `CREATE TABLE condition(
		id String NULL,
		version String NULL,
		last_updated Date NULL,
		inserted_at DateTime DEFAULT now(),
		patient_id String NULL,
		encounter_id String NULL,
		covid_diagnosis String NULL,
		covid_diagnosis_date Date NULL, 
		hiv_diagnosis_date Date NULL,
		meta_profile String NULL
	  ) 
	  ENGINE=MergeTree
	  ORDER BY tuple();`,

  `CREATE TABLE service_request(
		id String NULL,
		version String NULL,
		last_updated Date NULL,
		inserted_at DateTime DEFAULT now(),
		patient_id String NULL,
		encounter_id String NULL,
		specimen_id String NULL,
		test_requested String NULL,
		meta_profile String NULL
	  ) 
	  ENGINE=MergeTree
	  ORDER BY tuple();`,

  `CREATE TABLE specimen(
		patient_id String NULL,
		id String NULL,
		version String NULL,
		inserted_at DateTime DEFAULT now(),
		last_updated Date NULL,
		date_sample_collected Date NULL,
		meta_profile String NULL
	  ) 
	  ENGINE=MergeTree
	  ORDER BY tuple();`,

  `CREATE TABLE observation(
		patient_id String NULL,
		id String NULL,
		version String NULL,
		last_updated Date NULL,
		inserted_at DateTime DEFAULT now(),
		rapid_antigen_test_result String NULL,
		diagnostic_pcr_test_result String NULL,
		meta_profile String NULL,
		encounter_id String NULL,
		result_date Date NULL
	  ) 
	  ENGINE=MergeTree
	  ORDER BY tuple();`,

  `CREATE TABLE immunization(
		id String NULL,
		version String NULL,
		last_updated Date NULL,
		patient_id String NULL,
		encounter_id String NULL,
		inserted_at DateTime DEFAULT now(),
		vaccine_administered String NULL,
		vaccine_dose String NULL,
		vaccine_series String NULL,
		vaccination_date Date NULL,
		source_of_information String NULL,
		meta_profile String NULL,
		assessment_vaccine_administered String NULL,
		assessment_vaccine_dose String NULL,
		assessment_vaccine_series String NULL,
		assessment_vaccination_date Date NULL,
		assessment_source_of_information String NULL
	  ) 
	  ENGINE=MergeTree
	  ORDER BY tuple();`,

  // Views
  `CREATE VIEW vaccination AS SELECT encounter_id, patient_id, vaccination_date, vaccine_dose, vaccine_series, vaccine_administered, source_of_information, meta_profile
	FROM (
		WITH assessment AS (
			SELECT assessment_vaccination_date, meta_profile as assessment_meta_profile, patient_id, assessment_vaccine_dose, assessment_vaccine_series, assessment_vaccine_administered, assessment_source_of_information, encounter_id
			FROM immunization 
			WHERE assessment_vaccination_date IS NOT NULL
		), vaccination AS (
				SELECT vaccination_date, patient_id, meta_profile, vaccine_dose, vaccine_series, vaccine_administered, source_of_information, encounter_id
				FROM immunization 
				WHERE vaccination_date IS NOT NULL
		)
		SELECT 
			multiIf(date_diff('day', assessment.assessment_vaccination_date, vaccination.vaccination_date) < 0, assessment.encounter_id, vaccination.vaccination_date IS NULL, assessment.encounter_id, vaccination.encounter_id) AS encounter_id,
			multiIf(date_diff('day', assessment.assessment_vaccination_date, vaccination.vaccination_date) < 0, assessment.patient_id, vaccination.vaccination_date IS NULL, assessment.patient_id, vaccination.patient_id) AS patient_id,
			multiIf(date_diff('day', assessment.assessment_vaccination_date, vaccination.vaccination_date) < 0, assessment.assessment_meta_profile, vaccination.vaccination_date IS NULL, assessment.assessment_meta_profile, vaccination.meta_profile) AS meta_profile,
			multiIf(date_diff('day', assessment.assessment_vaccination_date, vaccination.vaccination_date) < 0, assessment.assessment_vaccination_date, vaccination.vaccination_date IS NULL, assessment.assessment_vaccination_date, vaccination.vaccination_date) AS vaccination_date,
			multiIf(date_diff('day', assessment.assessment_vaccination_date, vaccination.vaccination_date) < 0, assessment.assessment_vaccine_dose, vaccination.vaccination_date IS NULL, assessment.assessment_vaccine_dose, vaccination.vaccine_dose) AS vaccine_dose, 
			multiIf(date_diff('day', assessment.assessment_vaccination_date, vaccination.vaccination_date) < 0, assessment.assessment_vaccine_series, vaccination.vaccination_date IS NULL, assessment.assessment_vaccine_series, vaccination.vaccine_series) AS vaccine_series,
			multiIf(date_diff('day', assessment.assessment_vaccination_date, vaccination.vaccination_date) < 0, assessment.assessment_vaccine_administered, vaccination.vaccination_date IS NULL, assessment.assessment_vaccine_administered, vaccination.vaccine_administered) AS vaccine_administered,
			multiIf(date_diff('day', assessment.assessment_vaccination_date, vaccination.vaccination_date) < 0, assessment.assessment_source_of_information, vaccination.vaccination_date IS NULL, assessment.assessment_source_of_information, vaccination.source_of_information) AS source_of_information
		FROM vaccination
		FULL OUTER JOIN assessment
		ON assessment.encounter_id=vaccination.encounter_id
	);`,

  `CREATE VIEW diagnosis AS SELECT patient_id, covid_diagnosis, covid_diagnosis_date, hiv_diagnosis_date, encounter_id  
   		FROM (
			WITH covid_condition AS (
				SELECT covid_diagnosis, patient_id, covid_diagnosis_date, encounter_id
				FROM condition 
				WHERE meta_profile='covid19-diagnosis'
			), hiv_condition AS (
				SELECT hiv_diagnosis_date, patient_id, encounter_id
				FROM condition 
				WHERE hiv_diagnosis_date IS NOT NULL 
			)
			SELECT 
				hiv_condition.encounter_id, covid_condition.encounter_id as encounter_id, covid_condition.covid_diagnosis, covid_condition.patient_id as patient_id, covid_condition.covid_diagnosis_date, hiv_condition.hiv_diagnosis_date
			FROM hiv_condition
			FULL OUTER JOIN covid_condition
			ON hiv_condition.patient_id=covid_condition.patient_id
		)`,

  `CREATE VIEW report_1 AS SELECT * from patient
		LEFT JOIN encounter ON encounter.patient_id = patient.id
		LEFT JOIN service_request ON encounter.id=service_request.encounter_id 
		LEFT JOIN specimen ON patient.id=specimen.patient_id 
		LEFT JOIN (SELECT covid_diagnosis, patient_id, covid_diagnosis_date, encounter_id FROM condition WHERE condition.meta_profile='covid19-diagnosis') AS covid_diagnosis ON encounter.id=covid_diagnosis.encounter_id
		LEFT JOIN (SELECT hiv_diagnosis_date, patient_id, encounter_id FROM condition WHERE condition.meta_profile='hiv-diagnosis') AS hiv_diagnosis ON encounter.id=hiv_diagnosis.encounter_id
		LEFT JOIN (SELECT * FROM observation WHERE observation.meta_profile='covid19-test-results') AS obs ON patient.id=obs.patient_id 
		LEFT JOIN organization ON patient.facility_id=organization.facility_id`,

  `CREATE VIEW report_2 AS SELECT * from patient 
		LEFT JOIN encounter ON encounter.patient_id = patient.id
		LEFT JOIN service_request ON encounter.id=service_request.encounter_id 
		LEFT JOIN specimen ON patient.id=specimen.patient_id 
		LEFT JOIN (SELECT covid_diagnosis, patient_id, covid_diagnosis_date, encounter_id FROM condition WHERE condition.meta_profile='covid19-diagnosis') AS covid_diagnosis ON encounter.id=covid_diagnosis.encounter_id
		LEFT JOIN (SELECT hiv_diagnosis_date, patient_id, encounter_id FROM condition WHERE condition.meta_profile='hiv-diagnosis') AS hiv_diagnosis ON encounter.id=hiv_diagnosis.encounter_id
		LEFT JOIN (SELECT * FROM observation WHERE observation.meta_profile='covid19-test-results') AS obs ON patient.id=obs.patient_id 
		LEFT JOIN organization ON patient.facility_id=organization.facility_id
		LEFT JOIN vaccination ON encounter.id=vaccination.encounter_id;`,

  `CREATE VIEW report_3 AS SELECT * from patient 
		LEFT JOIN encounter ON encounter.patient_id = patient.id
		LEFT JOIN service_request ON encounter.id=service_request.encounter_id 
		LEFT JOIN specimen ON patient.id=specimen.patient_id 
		LEFT JOIN (SELECT covid_diagnosis, patient_id, covid_diagnosis_date, encounter_id FROM condition WHERE condition.meta_profile='covid19-diagnosis') AS covid_diagnosis ON encounter.id=covid_diagnosis.encounter_id
		LEFT JOIN (SELECT hiv_diagnosis_date, patient_id, encounter_id FROM condition WHERE condition.meta_profile='hiv-diagnosis') AS hiv_diagnosis ON encounter.id=hiv_diagnosis.encounter_id
		LEFT JOIN (SELECT * FROM observation WHERE observation.meta_profile='covid19-test-results') AS obs ON patient.id=obs.patient_id 
		LEFT JOIN organization ON patient.facility_id=organization.facility_id
		LEFT JOIN vaccination ON encounter.id=vaccination.encounter_id;`,

  // Manufactuerer Table
  `CREATE TABLE manufacturer(
		id String,
		version String,
		inserted_at DateTime DEFAULT now(),
		last_updated String,
		name String,
		max_doses String,
		age_group_start String,
		age_group_end String, 
		series String,
		weeks_waiting_interval String,
		code String
		) 
		ENGINE=MergeTree
		ORDER BY tuple();`,

  `INSERT into manufacturer(id, name, max_doses, age_group_start, age_group_end, series, weeks_waiting_interval, code) 
		values('1','Pfizer-BioNTech','3','0.5','4','Primary', '2', 'XM8NQ0')`,

  `INSERT into manufacturer(id, name, max_doses, age_group_start, age_group_end, series, weeks_waiting_interval, code) 
		values('2','Pfizer-BioNTech','2','5','17','Primary', '', 'XM8NQ0')`,

  `INSERT into manufacturer(id, name, max_doses, age_group_start, age_group_end, series, weeks_waiting_interval, code) 
		values('3','Pfizer-BioNTech','1','5','17','Booster', '0', 'XM8NQ0')`,

  `INSERT into manufacturer(id, name, max_doses, age_group_start, age_group_end, series, weeks_waiting_interval, code) 
		values('4','Pfizer-BioNTech','2','18','49','Primary', '', 'XM8NQ0')`,

  `INSERT into manufacturer(id, name, max_doses, age_group_start, age_group_end, series, weeks_waiting_interval, code) 
		values('5','Pfizer-BioNTech','1','18','49','Booster', '0', 'XM8NQ0')`,

  `INSERT into manufacturer(id, name, max_doses, age_group_start, age_group_end, series, weeks_waiting_interval, code) 
		values('6','Pfizer-BioNTech','2','50','','Primary', '', 'XM8NQ0')`,

  `INSERT into manufacturer(id, name, max_doses, age_group_start, age_group_end, series, weeks_waiting_interval, code) 
		values('7','Pfizer-BioNTech','2','50','','Booster', '0', 'XM8NQ0')`,

  `INSERT into manufacturer(id, name, max_doses, age_group_start, age_group_end, series, weeks_waiting_interval, code) 
		values('8','Moderna','2','0.5','17','Primary', '2', 'XM3DT5')`,

  `INSERT into manufacturer(id, name, max_doses, age_group_start, age_group_end, series, weeks_waiting_interval, code) 
		values('9','Moderna','2','18','49','Primary', '', 'XM3DT5')`,

  `INSERT into manufacturer(id, name, max_doses, age_group_start, age_group_end, series, weeks_waiting_interval, code) 
		values('10','Moderna','1','18','49','Booster', '0', 'XM3DT5')`,

  `INSERT into manufacturer(id, name, max_doses, age_group_start, age_group_end, series, weeks_waiting_interval, code) 
		values('11','Moderna','2','50','','Primary', '', 'XM3DT5')`,

  `INSERT into manufacturer(id, name, max_doses, age_group_start, age_group_end, series, weeks_waiting_interval, code) 
		values('12','Moderna','2','50','','Booster', '0', 'XM3DT5')`,

  `INSERT into manufacturer(id, name, max_doses, age_group_start, age_group_end, series, weeks_waiting_interval, code) 
		values('13','Novavax','2','18','','Primary', '2', 'XM5JC5')`,

  `INSERT into manufacturer(id, name, max_doses, age_group_start, age_group_end, series, weeks_waiting_interval, code) 
		values('14','Johnson and Johnson','1','18','49','Primary', '', 'XM6QV1')`,

  `INSERT into manufacturer(id, name, max_doses, age_group_start, age_group_end, series, weeks_waiting_interval, code) 
		values('15','Johnson and Johnson','1','18','49','Booster', '0', 'XM6QV1')`,
];

module.exports = queries;
