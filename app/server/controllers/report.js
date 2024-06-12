import fs from 'fs';
import csvParser from 'csv-parser';

const checkFileExists = (filePath) => {
  try {
    // Check if the file exists
    fs.accessSync(filePath, fs.constants.F_OK);
    return true; // File exists
  } catch (error) {
    return false; // File does not exist
  }
};

const calculateAverage = (numbers) => {
  if (numbers.length === 0) return 0; // Handle empty array case
  const sum = numbers.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
  return sum / numbers.length;
};

export const generateStudentReport = (req, res) => {
  const { studentId } = req.params;
  const moduleDataPath = './data/~$module_data.csv';
  const modules = [];

  fs.createReadStream(moduleDataPath)
    .pipe(csvParser())
    .on('data', (row) => {
      const students = row.Students.split(',');
      if (students.includes(studentId)) {
        modules.push(row['Module Code']);
      }
    })
    .on('end', () => {
      const reportData = [];

      // Process each module
      modules.forEach((moduleCode) => {
        const assessmentDataPath = `./data/grades/${moduleCode}_assessment.csv`;

        const studentDataPath = `./data/modules/${moduleCode}_students.csv`;
        if (!checkFileExists(assessmentDataPath)) {
          res
            .status(404)
            .json({ error: 'No assessment data found for this student' });
        } else if (!checkFileExists(studentDataPath)) {
          res
            .status(404)
            .json({ error: 'No details data found for this student' });
        } else {
          const moduleData = {
            moduleName: '',
            mark: '',
            expectedMark: '',
            attendance: '',
            expectedAttendance: '',
            moduleAverageMark: '',
            moduleAverageAttendance: '',
          };
          const marks = [];
          const attendaces = [];
          // Read the assessment data CSV file for the module
          fs.createReadStream(assessmentDataPath)
            .pipe(csvParser())
            .on('data', (row) => {
              if (row['Student ID'] === studentId) {
                moduleData.moduleName = moduleCode;
                moduleData.mark = row['Mark'];
                moduleData.expectedMark = row['Weight/Maximum Grade'];
              } else {
                !isNaN(parseInt(row['Mark']))
                  ? marks.push(parseInt(row['Mark']))
                  : marks.push(0);
              }
            })
            .on('end', () => {
              // Read the student data CSV file for the module
              fs.createReadStream(studentDataPath)
                .pipe(csvParser())
                .on('data', (row) => {
                  if (row['Student ID'] === studentId) {
                    moduleData.attendance = row['Attendance'];
                    moduleData.expectedAttendance = '30';
                  } else {
                    !isNaN(parseInt(row['Attendance']))
                      ? attendaces.push(parseInt(row['Attendance']))
                      : attendaces.push(0);
                  }
                })
                .on('end', () => {
                  // Calculate the module average mark and attendance
                  // You can implement the logic based on your requirements
                  moduleData.moduleAverageMark = calculateAverage(marks); // Example value
                  moduleData.moduleAverageAttendance =
                    calculateAverage(attendaces); // Example value

                  reportData.push(moduleData);

                  if (reportData.length === modules.length) {
                    res.status(200).json({ data: reportData });
                  }
                });
            });
        }
      });
    });
};
