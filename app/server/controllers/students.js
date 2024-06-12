import fs from 'fs';
import csvParser from 'csv-parser';
import csvWriter from 'csv-writer';

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

export const createStudent = async (req, res, next) => {
  const { name, id, email, tutor, course } = req.body;
  const filePath = './data/~$student_data.csv';
  const duplicate = await checkDuplicates('Email address', email, filePath);
  try {
    if (duplicate) {
      res
        .status(500)
        .json({ success: false, message: 'Student Already Exists' });
    } else {
      const writer = csvWriter.createObjectCsvWriter({
        path: filePath,
        header: [
          { id: 'Identifier', title: 'Identifier' },
          { id: 'Full name', title: 'Full name' },
          { id: 'ID number', title: 'ID number' },
          { id: 'Email address', title: 'Email address' },
          { id: 'Course', title: 'Course' },
          { id: 'Tutor Group', title: 'Tutor Group' },
        ],
        append: true, // Overwrite the file
      });
      writer
        .writeRecords([
          {
            'Identifier': 'Email',
            'Full name': name,
            'ID number': id,
            'Email address': email,
            'Course': course,
            'Tutor Group': tutor,
          },
        ])
        .then(() => {
          res.status(200).json({
            success: true,
            message: 'Student added succesfully',
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({
            success: false,
            message: 'Error adding student',
          });
        });
    }
  } catch (error) {
    console.log(error);
  }
};

// Retrieve all records
export const getStudents = (req, res) => {
  const filePath = './data/~$student_data.csv';
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
export const getStudent = (req, res) => {
  const { id } = req.params;
  // Logic to retrieve record with 'id' from 'csvData'
  const filePath = './data/~$student_data.csv';
  const rows = [];

  try {
    // Read the CSV file using fs.createReadStream
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        rows.push(row);
      })
      .on('end', () => {
        console.log(rows);
        const student = rows.find((row) => row['ID number'] == id);
        if (!student) {
          res
            .status(404)
            .json({ success: false, data: {}, message: 'No such student' });
        } else {
          res.status(200).json({ success: true, data: student });
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
          header: [
            { id: 'Identifier', title: 'Identifier' },
            { id: 'Full name', title: 'Full name' },
            { id: 'ID number', title: 'ID number' },
            { id: 'Email address', title: 'Email address' },
            { id: 'Course', title: 'Course' },
            { id: 'Tutor Group', title: 'Tutor Group' },
            { id: 'Modules ', title: 'Modules ' },
          ], // Use headers from original data
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
export const updateStudent = async (req, res) => {
  const { id } = req.params;
  const newData = req.body;
  console.log(newData);
  try {
    // Read the CSV file using fs.createReadStream
    await updateRowInCSV(
      'ID number',
      id,
      {
        'Identifier': 'Email',
        'Full name': newData.name,
        'ID number': newData.id,
        'Email address': newData.email,
        'Course': newData.course,
        'Tutor Group': newData.tutor,
      },
      './data/~$student_data.csv'
    );
    res
      .status(200)
      .json({ success: true, data: {}, message: 'Student Updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to update student',
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
          console.log({ row: row[identifier] }); // Add rows that don't match the identifier
        } else {
          console.log('huh');
          found = true;
        }
      })
      .on('end', () => {
        if (!found) {
          reject({ message: 'No such record found' });
        } else {
          const writer = csvWriter.createObjectCsvWriter({
            path: filePath,
            header: [
              { id: 'Identifier', title: 'Identifier' },
              { id: 'Full name', title: 'Full name' },
              { id: 'ID number', title: 'ID number' },
              { id: 'Email address', title: 'Email address' },
              { id: 'Course', title: 'Course' },
              { id: 'Tutor Group', title: 'Tutor Group' },
              { id: 'Modules ', title: 'Modules ' },
            ], // Use headers from original data
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
export const deleteStudent = async (req, res) => {
  const { id } = req.params;
  // Logic to delete record with 'id' from 'csvData'
  try {
    // Read the CSV file using fs.createReadStream
    await deleteRowFromCSV('ID number', id, './data/~$student_data.csv');
    res.status(200).json({ success: true, message: 'Student Deleted' });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to update student',
    });
  }
};
