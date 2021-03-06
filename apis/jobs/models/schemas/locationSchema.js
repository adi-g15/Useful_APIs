const { Schema } = require("mongoose");
const { countryDeCode } = require("./allowedData");

/**
 * @brief - The locationSchema isn't actually stored as colletion in the database, it will be a subdocument inside another document
 */
const locationSchema = new Schema({
	c: {
		alias: "city", // In cases we use inlined, we need to use full path (l.city), this isn't required in case of subdocuments (schema)
		type: String
	},
	s: {
		alias: "state",
		type: String
	},
	country: {
		alias: "country",
		type: String,
		trim: true,
		get: (val) => {
			if (val.length === 2 && Object.keys(countryDeCode).includes(val)) 
				return countryDeCode[val];
			
			return val;
		}

	}
});

module.exports = locationSchema;
