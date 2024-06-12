import fs from 'fs';
import csvParser from 'csv-parser';
import csvWriter from 'csv-writer';

const assessmentHeader = [
  { id: 'studentId', title: 'Student ID' },
  { id: 'studentName', title: 'Student Name' },
  { id: 'studentEmail', title: 'Student Email' },
  { id: 'submissionStatus', title: 'Submission Status' },
  { id: 'mark', title: 'Mark' },
  { id: 'weight', title: 'Weight/Maximum Grade' },
  { id: 'markingStatus', title: 'Marking workflow state' },
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
            console.log('god pls');
            resolve(); // File created successfully
          }
        });
      } else {
        resolve(); // File already exists
      }
    });
  });
};

export const addAssessment = async (req, res) => {
  const { moduleName, assessmentData } = req.body;
  const filePath = `./data/grades/${moduleName}_assessment.csv`;
  await createFileIfNotExists(
    filePath,
    'Student ID,Student Name,Student Email,Submission Status,Mark,Weight/Maximum Grade,Marking workflow state\n'
  );
  const duplicate = await checkDuplicates(
    'Student ID',
    assessmentData.studentId,
    filePath
  );

  try {
    if (duplicate) {
      res
        .status(500)
        .json({ success: false, message: 'Assessment Already Exists' });
    } else {
      const writer = csvWriter.createObjectCsvWriter({
        path: filePath,
        header: assessmentHeader,
        append: true,
      });

      writer
        .writeRecords([assessmentData])
        .then(() => {
          res.status(201).json({ message: 'Assessment added successfully' });
        })
        .catch((error) => {
          console.error('Error adding assessment:', error);
          res.status(500).json({ error: 'Internal server error' });
        });
    }
  } catch (err) {}
};

export const updateAssessment = (req, res) => {
  const { moduleName, assessmentData } = req.body;
  const filePath = `./data/grades/${moduleName}_assessment.csv`;
  const rows = [];
  const updatedRows = [];

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (row) => {
      console.log(row);
      console.log(assessmentData);
      if (row['Student ID'] == assessmentData.studentId) {
        updatedRows.push(assessmentData);
      } else {
        rows.push(row);
      }
    })
    .on('end', () => {
      const writer = csvWriter.createObjectCsvWriter({
        path: filePath,
        header: assessmentHeader,
        append: false,
      });

      writer
        .writeRecords([...rows, ...updatedRows])
        .then(() => {
          res.status(200).json({ message: 'Assessment updated successfully' });
        })
        .catch((error) => {
          console.error('Error updating assessment:', error);
          res.status(500).json({ error: 'Internal server error' });
        });
    })
    .on('error', (error) => {
      console.error('Error reading CSV file:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
};

export const getAssessments = (req, res) => {
  const { moduleName } = req.params;
  const filePath = `./data/grades/${moduleName}_assessment.csv`;
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
