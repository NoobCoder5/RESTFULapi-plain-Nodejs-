const handlers = {};
const _data = require("./data.js");
const helpers = require("./helpers.js");
handlers.users = function (data, callback) {
  const acceptableMethods = ["GET", "POST", "PUT", "DELETE"];

  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers_users[data.method.toLowerCase()](data, callback);
  }
};
handlers.tokens = function (data, callback) {
  const acceptableMethods = ["GET", "POST", "PUT", "DELETE"];

  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers_tokens[data.method.toLowerCase()](data, callback);
  }
};
const handlers_users = {};
const handlers_tokens = {};
handlers_users.post = function (data, callback) {
  const firstName =
    typeof data.payload.firstName == "string" &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;
  const lastName =
    typeof data.payload.lastName == "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;
  const password =
    typeof data.payload.password == "string" &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;
  const phone =
    typeof data.payload.phone == "string" &&
    data.payload.phone.trim().length == 10
      ? data.payload.phone.trim()
      : false;
  const tosAgreement =
    typeof data.payload.tosAgreement == "boolean" &&
    data.payload.tosAgreement == true
      ? true
      : false;
  // console.log(firstName, lastName, phone, password, tosAgreement);
  if (firstName && lastName && phone && password && tosAgreement) {
    _data.read("users", phone, function (err, data) {
      if (err) {
        var hashedPassword = helpers.hashPassword(password);
        if (hashedPassword) {
          const userObject = {
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            password: password,
            hashedPassword: hashedPassword,
            tosAgreement: true,
          };
          _data.create("users", phone, userObject, function (err) {
            if (!err) {
              callback(200);
            } else {
              // console.log(err);
              callback(500, { error: "creating new file" });
            }
          });
        } else {
          callback(500, { error: "hashing password" });
        }
      } else {
        callback(500, { error: "user already exists" });
      }
    });
  } else {
    callback(420, { error: "missing required fields" });
  }
};

handlers_users.get = function (data, callback) {
  const phone =
    typeof data.queryStringObject.phone == "string" &&
    data.queryStringObject.phone.trim().length == 10
      ? data.queryStringObject.phone.trim()
      : false;
  _data.read("users", phone, function (err, data) {
    if (!err) {
      delete data.hashedPassword;
      callback(200, data);
    } else {
      callback(404, { error: "user don't exist " });
    }
  });
};

handlers_users.put = function (data, callback) {
  // console.log(data.payload);
  const phone =
    typeof data.payload.phone == "string" &&
    data.payload.phone.trim().length == 10
      ? data.payload.phone.trim()
      : false;

  const firstName =
    typeof data.payload.firstName == "string" &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;
  const lastName =
    typeof data.payload.lastName == "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;
  const password =
    typeof data.payload.password == "string" &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;

  if (phone) {
    if (firstName || lastName || password) {
      _data.read("users", phone, function (err, userData) {
        if (firstName) {
          userData.firstName = firstName;
        }
        if (lastName) {
          userData.lastName = lastName;
        }
        if (password) {
          userData.password = password;
        }
        _data.update("users", phone, userData, function (err) {
          if (!err) {
            callback(200);
          } else {
            callback(err, { error: err });
          }
        });
      });
    } else {
      callback(440, { error: "no data to update" });
    }
  } else {
    callback(400, { error: "phone number is not valid" });
  }
};
handlers_users.delete = function (data, callback) {
  const phone =
    typeof data.queryStringObject.phone == "string" &&
    data.queryStringObject.phone.trim().length == 10
      ? data.queryStringObject.phone.trim()
      : false;
  if (phone) {
    _data.read("users", phone, function (err, data) {
      if (!err) {
        _data.delete("users", phone, function (err) {
          if (!err) {
            callback(200);
          } else {
            callback(400, { error: err });
          }
        });
      } else {
        callback(400, { error: err });
      }
    });
  } else {
    callback(400, { error: "phone number is valid" });
  }
};

handlers_tokens.post = function (data, callback) {
  const phone =
    typeof data.payload.phone == "string" &&
    data.payload.phone.trim().length == 10
      ? data.payload.phone.trim()
      : false;
  const password =
    typeof data.payload.password == "string" &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;
  if (phone && password) {
    _data.read("users", phone, function (err, userData) {
      if (!err && userData) {
        const hashPassword = helpers.hashPassword(password);
        if (hashPassword != userData.hashPassword) {
          const randomString = helpers.randomString(20);
          const tokenObject = {
            tokenId: randomString,
            phone: phone,
            expires: Date.now() + 1000 * 60 * 60,
          };
          _data.create("tokens", randomString, tokenObject, function (err) {
            if (!err) {
              callback(200, tokenObject);
            } else {
              callback(400, { error: err });
            }
          });
        } else {
          callback(400, { error: "password is wrong" });
        }
      } else {
        callback(400, { error: err });
      }
    });
  } else {
    callback(400, { error: "something  wrong with fields" });
  }
};
handlers_tokens.get = function (data, callback) {
  // console.log( data.queryStringObject.id.trim().length);
  const id =
    typeof data.queryStringObject.id == "string" &&
    data.queryStringObject.id.trim().length == 20
      ? data.queryStringObject.id.trim()
      : false;
  if (id) {
    _data.read("tokens", id, function (err, tokenData) {
      if (!err && tokenData) {
        callback(200, tokenData);
      } else {
        callback(404, { error: "user don't exist " });
      }
    });
  } else {
    callback(404, { error: "missing required fields" });
  }
};
handlers_tokens.put = function (data, callback) {
  const id =
    typeof data.payload.id === "string" && data.payload.id.trim().length == 20
      ? data.payload.id.trim()
      : false;
  const extend = typeof data.payload.extend === "boolean" ? true : false;

  if (id && extend) {
    _data.read("tokens", id, function (err, tokenData) {
      if (!err && tokenData) {
        if (Date.now() < tokenData.expires) {
          tokenData.expires = Date.now() + 1000 * 60 * 60;
          _data.update("tokens", id, tokenData, function (err) {
            if (!err) {
              callback(200);
            } else {
              callback(400, { error: err });
            }
          });
        } else {
          callback(400, {
            Error: "The token has already expired, and cannot be extended.",
          });
        }
      } else {
        callback(400, { Error: "Specified user does not exist." });
      }
    });
  } else {
    callback(400, {
      Error: "Missing required field(s) or field(s) are invalid.",
    });
  }
};
handlers_tokens.delete = function (data, callback) {
  const id =
    typeof data.queryStringObject.id == "string" &&
    data.queryStringObject.id.trim().length === 20
      ? data.queryStringObject.id.trim()
      : false;
  if (id) {
    _data.read("tokens", id, function (err, tokenData) {
      if (!err && tokenData) {
        _data.delete("tokens", id, function (err) {
          if (!err) {
            callback(200);
          } else {
            callback(400, { error: err });
          }
        });
      } else {
        callback(400, { error: "user does not exist" });
      }
    });
  } else {
    callback(400, { error: "missing required field(s)" });
  }
};
handlers.sample = function (data, callback) {
  callback(406, { name: "sample Handler" });
};
handlers.notFound = function (data, callback) {
  callback(404);
};

module.exports = handlers;
