const queries = [
  // Add new column
  `ALTER TABLE manufacturer ADD COLUMN invalid Bool`,
  // Add new row to the manufacturer
  `INSERT into manufacturer(id, name, max_doses, age_group_start, age_group_end, series, weeks_waiting_interval, code, invalid)
    values('16','Johnson and Johnson','0','50','','', '', 'XM6QV1', true);`,
];
module.exports = queries;
