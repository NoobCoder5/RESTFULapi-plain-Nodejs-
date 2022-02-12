const fs = require("fs");
const path = require("path");
const lib = {};

lib.baseDir = path.join(__dirname, "../.data/");

lib.create = function (dir, filename, data, callback) {
  if (!fs.existsSync(lib.baseDir + dir)) {
    fs.mkdirSync(lib.baseDir + dir);
  }

  fs.open(
    lib.baseDir + dir + "/" + filename + ".json",
    "w+",
    function (err, fd) {
      console.log(err, fd);
      if (!err && fd) {
        const stringData = JSON.stringify(data);

        fs.writeFile(fd, stringData, (err) => {
          if (err) callback("Error writing to new file");
          else {
            fs.close(fd, function (err) {
              if (err) console.error("Failed to close file", err);
              else {
                callback(false);
              }
            });
          }
        });
      } else {
        callback("Could not create new file, it may already exist");
      }
    }
  );
};

lib.read = function (dir, filename, callback) {
  fs.readFile(
    lib.baseDir + dir + "/" + filename + ".json",
    "utf8",
    (err, data) => {
      if (!err) {
        const parsedData = JSON.parse(data);
        callback(false, parsedData);
      } else {
        callback(err, data);
      }
    }
  );
};

lib.update = function (dir, filename, data, callback) {
  fs.open(
    lib.baseDir + dir + "/" + filename + ".json",
    "r+",
    function (err, fd) {
      const stringData = JSON.stringify(data);

      if (!err && fd) {
        fs.ftruncate(fd, (err) => {
          if (!err) {
            fs.writeFile(fd, stringData, function (err) {
              if (!err) {
                fs.close(fd, function (err) {
                  if (!err) {
                    callback(false);
                  } else {
                    callback("Error closing existing file");
                  }
                });
              } else {
                callback("error writing file");
              }
            });
          } else {
            callback("error truncating file");
          }
        });
      } else {
        callback("error opening file");
      }
    }
  );
};

lib.delete = function (dir, filename, callback) {
  fs.unlink(lib.baseDir + dir + "/" + filename + ".json", function (err) {
    if (err) {
      callback("error deleting file");
    } else {
      callback(false);
    }
  });
};

lib.list = function (dir, callback) {
  fs.readdir(lib.baseDir + dir + "/", function (err, data) {
    if (!err && data && data.length > 0) {
      var trimmedFileNames = [];
      data.forEach(function (fileName) {
        trimmedFileNames.push(fileName.replace(".json", ""));
      });
      callback(false, trimmedFileNames);
    } else {
      callback(err, data);
    }
  });
};


module.exports = lib;
