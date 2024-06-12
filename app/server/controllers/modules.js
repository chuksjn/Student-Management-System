import fs from 'fs';
import csvParser from 'csv-parser';
import csvWriter from 'csv-writer';

const header = [
  { id: 'Identifier', title: 'Identifier' },
  { id: 'Module Name', title: 'Module Name' },
  { id: 'Module Code', title: 'Module Code' },
  { id: 'Students', title: 'Students' },
];

// Create a new record
const checkDuplicates = async (identifier, value, filePath) => {
  const rows = [];
  const readFilePromise = new Promise((resolve, reject) => {
    fs.createReadStream(filePath, { autoClose: true })
      .pipe(csvParser())
      .on('data', (row) => {
        rows.push(row);
      })
      .on('end', () => {
        resolve(rows);
      })
      .on('error', (error) => {
        reject(error);
      });
  });

  try {
    const rows = await readFilePromise;

    const found = rows.find((row) => row[identifier] == value);
    return Boolean(found);
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const createModule = async (req, res, next) => {
  const { name, code, students } = req.body;
  const filePath = './data/~$module_data.csv';
  const duplicate = await checkDuplicates('Module Code', code, filePath);
  try {
    if (duplicate) {
      res
        .status(500)
        .json({ success: false, message: 'Module Already Exists' });
    } else {
      const writer = csvWriter.createObjectCsvWriter({
        path: filePath,
        header,
        append: true, // Overwrite the file
      });
      writer
        .writeRecords([
          {
            'Identifier': 'Code',
            'Module Name': name,
            'Module Code': code,
            'Students': students,
          },
        ])
        .then(() => {
          res.status(200).json({
            success: true,
            message: 'Module added succesfully',
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({
            success: false,
            message: 'Error adding module',
          });
        });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Retrieve all records
export const getModules = (req, res) => {
  const filePath = './data/~$module_data.csv';
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

// Retrieve a specific record by ID
export const getModule = (req, res) => {
  const { id } = req.params;
  // Logic to retrieve record with 'id' from 'csvData'
  const filePath = './data/~$module_data.csv';
  const rows = [];

  try {
    // Read the CSV file using fs.createReadStream
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        rows.push(row);
      })
      .on('end', () => {
        const module = rows.find((row) => row['Module Code'] == id);
        if (!module) {
          res
            .status(404)
            .json({ success: false, data: {}, message: 'No such Module' });
        } else {
          res.status(200).json({ success: true, data: module });
        }
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

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
        } else {
          rows.push(row); // Add unchanged row
        }
      })
      .on('end', () => {
        // Write updated data back to the CSV file

        const writer = csvWriter.createObjectCsvWriter({
          path: filePath,
          header, // Use headers from original data
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
      })
      .on('error', (error) => {
        console.error(error);
        reject(error);
      });
  });
};

// Update a record by ID
export const updateModule = async (req, res) => {
  const { id } = req.params;
  const newData = req.body;
  try {
    // Read the CSV file using fs.createReadStream
    await updateRowInCSV(
      'Module Code',
      id,
      {
        'Identifier': 'Code',
        'Module Name': newData.name,
        'Module Code': newData.code,
        'Students': newData.students,
      },
      './data/~$module_data.csv'
    );
    res
      .status(200)
      .json({ success: true, data: {}, message: 'Module Updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to update Module',
    });
  }
};

const deleteRowFromCSV = (identifier, value, filePath) => {
  return new Promise((resolve, reject) => {
    const rows = [];
    let found = false;

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        if (row[identifier] != value) {
          rows.push(row);
        } else {
          found = true;
        }
      })
      .on('end', () => {
        if (!found) {
          reject({ message: 'No such record found' });
        } else {
          const writer = csvWriter.createObjectCsvWriter({
            path: filePath,
            header,
            append: false, // Overwrite the file
          });

          writer
            .writeRecords(rows)
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
// Delete a record by ID
export const deleteModule = async (req, res) => {
  const { id } = req.params;
  // Logic to delete record with 'id' from 'csvData'
  try {
    // Read the CSV file using fs.createReadStream
    await deleteRowFromCSV('Module Code', id, './data/~$module_data.csv');
    res.status(200).json({ success: true, message: 'Module Deleted' });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to update Module',
    });
  }
};
