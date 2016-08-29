'use strict';

exports.userError = function(msg, statusCode){
	statusCode = statusCode || 400;
	var err = new Error(msg);
	err.code = statusCode;
	return err;
};

exports.sysError = function (msg, statusCode) {
	statusCode = statusCode || 500;
	var err = new Error(msg);
	err.code = statusCode;
	return err;
};