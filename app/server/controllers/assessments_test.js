import fs from 'fs';
import csvParser from 'csv-parser';
import csvWriter from 'csv-writer';

const updateRowInCSV = (identifier, value, newData, filePath) => {
  return new Promise((resolve, reject) => {
    const rows = [];
    const updatedRows = [];
    let found = false;
    // Read the CSV file and filter out the row to be updated
    fs.createReadStream(filePath, { autoClose: true })
      .pipe(csvParser())
      .on('data', (row) => {
        if (row[identifier] === value) {
          updatedRows.push(newData); // Add updated row
          found = true;
        } else {
          rows.push(row); // Add unchanged row
        }
      })
      .on('end', () => {
        // Write updated data back to the CSV file
        if (!found) {
          reject({ message: 'No such record found' });
        } else {
          const writer = csvWriter.createObjectCsvWriter({
            path: filePath,
            header: Object.keys(newData), // Use keys from newData as headers
            append: false, // Overwrite the file
          });

          writer
            .writeRecords([...rows, ...updatedRows])
            .then(() => {
              resolve(true);
            })
            .catch((error) => {
              console.error(error);
              reject(error);
            });
        }
      })
      .on('error', (error) => {
        console.error(error);
        reject(error);
      });
  });
};

// Create a new assessment
export const createAssessment = async (req, res, next) => {
  const { moduleCode, assessmentName, deadline, weight } = req.body;
  const filePath = `./data/${moduleCode}_assessments.csv`;

  try {
    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        // File does not exist, create it
        const header = ['Assessment Name', 'Deadline', 'Weight'];
        const headerRow = header.join(',') + '\n';

        fs.writeFile(filePath, headerRow, (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({
              success: false,
              message: 'Error creating assessment file',
            });
          }

          // File created successfully, now add the assessment
          const csvRow = `${assessmentName},${deadline},${weight}\n`;
          fs.appendFile(filePath, csvRow, (err) => {
            if (err) {
              console.error(err);
              return res.status(500).json({
                success: false,
                message: 'Error adding assessment',
              });
            }
            res.status(200).json({
              success: true,
              message: 'Assessment added successfully',
            });
          });
        });
      } else {
        // File exists, add the assessment
        const csvRow = `${assessmentName},${deadline},${weight}\n`;
        fs.appendFile(filePath, csvRow, (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({
              success: false,
              message: 'Error adding assessment',
            });
          }
          res.status(200).json({
            success: true,
            message: 'Assessment added successfully',
          });
        });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Retrieve all assessments for a module
export const getAssessments = (req, res) => {
  const { moduleCode } = req.params;
  const filePath = `./data/${moduleCode}_assessments.csv`;
  const rows = [];

  try {
    // Read the CSV file using fs.createReadStream
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        // Process each row of data
        rows.push(row);
      })
      .on('end', () => {
        // Once all rows are read, send the data in response
        res.status(200).json({ success: true, data: rows });
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Retrieve a specific assessment by name
export const getAssessment = (req, res) => {
  const { moduleCode, assessmentName } = req.params;
  const filePath = `./data/${moduleCode}_assessments.csv`;
  const rows = [];

  try {
    // Read the CSV file using fs.createReadStream
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        rows.push(row);
      })
      .on('end', () => {
        const assessment = rows.find(
          (row) => row['Assessment Name'] === assessmentName
        );
        if (!assessment) {
          res
            .status(404)
            .json({ success: false, data: {}, message: 'No such assessment' });
        } else {
          res.status(200).json({ success: true, data: assessment });
        }
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update an assessment by name
export const updateAssessment = async (req, res) => {
  const { moduleCode, assessmentName } = req.params;
  const { deadline, weight } = req.body;
  const filePath = `./data/${moduleCode}_assessments.csv`;

  try {
    await updateRowInCSV(
      'Assessment Name',
      assessmentName,
      {
        'Assessment Name': assessmentName,
        Deadline: deadline,
        Weight: weight,
      },
      filePath
    );
    res.status(200).json({ success: true, message: 'Assessment updated' });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: 'Failed to update assessment' });
  }
};

// Delete an assessment by name
export const deleteAssessment = async (req, res) => {
  const { moduleCode, assessmentName } = req.params;
  const filePath = `./data/${moduleCode}_assessments.csv`;

  try {
    await deleteRowFromCSV('Assessment Name', assessmentName, filePath);
    res.status(200).json({ success: true, message: 'Assessment deleted' });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: 'Failed to delete assessment' });
  }
};
