
const dbPoolConfig = require('@root/dbconfig')

const responseSuccess = (data = null, message = null) => {

  return {
    'status' : 'success',
    'message' : message,
    'data' 	: data,
  }

}

const responseFail = (data = null, message = null, errors = null) => {
  return {
    'status' : 'fail',
    'message' : message,
    'data' 	: data,
    'errors' 	: errors,
    }
}

const responseJson = (data = null, message = null, code) => {

  return {
    'status' : code,
    'message' : message,
    'data' 	: data,
  }
}


module.exports = {
  responseSuccess,
  responseFail,
  responseJson,
}