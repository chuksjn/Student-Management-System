import fs from 'fs';
import csvParser from 'csv-parser';
import csvWriter from 'csv-writer';

const studentHeader = [
  { id: 'studentId', title: 'Student ID' },
  { id: 'studentName', title: 'Student Name' },
  { id: 'attendance', title: 'Attendance' },
  { id: 'checkpoints', title: 'Checkpoints' },
  { id: 'notes', title: 'Notes' },
];

const checkFileExists = (filePath) => {
  try {
    // Check if the file exists
    fs.accessSync(filePath, fs.constants.F_OK);
    return true; // File exists
  } catch (error) {
    return false; // File does not exist
  }
};

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

const createFileIfNotExists = (filePath, content = '') => {
  return new Promise((resolve, reject) => {
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        fs.writeFile(filePath, content, (err) => {
          if (err) {
            reject(err); // Error occurred while creating the file
          } else {
            resolve(); // File created successfully
          }
        });
      } else {
        resolve(); // File already exists
      }
    });
  });
};
export const addDetails = async (req, res) => {
  const { moduleName } = req.params;
  const { detailsData } = req.body;
  const filePath = `./data/modules/${moduleName}_students.csv`;
  await createFileIfNotExists(
    filePath,
    'Student ID,Student Name,Attendance,Checkpoints,Notes\n'
  );
  const duplicate = await checkDuplicates(
    'Student ID',
    detailsData.studentId,
    filePath
  );

  try {
    if (duplicate) {
      res
        .status(500)
        .json({ success: false, message: 'Details Already Exists' });
    } else {
      const writer = csvWriter.createObjectCsvWriter({
        path: filePath,
        header: studentHeader,
        append: true,
      });

      writer
        .writeRecords([detailsData])
        .then(() => {
          res.status(201).json({ message: 'Details added succesfully' });
        })
        .catch((error) => {
          console.error('Error adding attendance:', error);
          res.status(500).json({ error: 'Internal server error' });
        });
    }
  } catch (err) {
    console.error('Error adding details:', err);

    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateDetail = (req, res) => {
  const { moduleName } = req.params;
  const { detailsData } = req.body;
  const filePath = `./data/modules/${moduleName}_students.csv`;
  const rows = [];
  const updatedRows = [];

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (row) => {
      if (row['Student ID'] === detailsData.studentId) {
        updatedRows.push({ ...row, ...detailsData });
      } else {
        rows.push(row);
      }
    })
    .on('end', () => {
      const writer = csvWriter.createObjectCsvWriter({
        path: filePath,
        header: studentHeader,
        append: false,
      });

      writer
        .writeRecords([...rows, ...updatedRows])
        .then(() => {
          res.status(200).json({ message: 'Attendance updated successfully' });
        })
        .catch((error) => {
          console.error('Error updating attendance:', error);
          res.status(500).json({ error: 'Internal server error' });
        });
    })
    .on('error', (error) => {
      console.error('Error reading CSV file:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
};

export const getDetails = (req, res) => {
  const { moduleName } = req.params;
  const filePath = `./data/modules/${moduleName}_students.csv`;
  if (!checkFileExists(filePath)) {
    res.status(404).json({ error: 'No file exists' });
  } else {
    const rows = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        rows.push(row);
      })
      .on('end', () => {
        res.status(200).json({ data: rows });
      })
      .on('error', (error) => {
        console.error('Error reading CSV file:', error);
        res.status(500).json({ error: 'Internal server error' });
      });
  }
};
