import fs from 'fs';
import path from 'path';

// Function to get folder information
const getFolderInfo = (req, res) => {
  const { folder } = req.query;
  const folderPath = folder ? `./data/${folder}` : './data'; // Specify your folder path
  console.log(folderPath);

  try {
    // Read the directory
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: 'Error reading folder' });
      }
      const filesData = [];
      const folders = [];
      let numFiles = 0;
      let numFolders = 0;

      // Loop through the files and folders
      files.forEach((file) => {
        const filePath = path.join(folderPath, file);
        // Check if it's a file or directory
        const stats = fs.statSync(filePath);
        if (stats.isFile()) {
          numFiles++;
          filesData.push(file);
        } else if (stats.isDirectory()) {
          numFolders++;
          folders.push(file);
        }
      });

      res.status(200).json({
        success: true,
        data: { numFiles, numFolders, files: filesData, folders },
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export { getFolderInfo };
