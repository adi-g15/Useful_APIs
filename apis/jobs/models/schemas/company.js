const { Schema, Types, model } = require("mongoose");
const { URL } = require("url");
const { realpathSync } = require("fs");

const storageUrls = [ // index 0 is local Storage
	`file:\\${realpathSync("../../storage/company")}`
];

/**
 * @brief -> The companies collection stores the company listings, this is the document schema
 * 
 * 			 It has the following fields ->
 * 			 name, logoURL, jobs
 * @note -> jobs is an array of ObjectIds, so to get the actual job document, you will fetch them from the database using this id
 */
const companySchema = new Schema({
	n: {
		alias: "name",
		type: String,
		required: true,
		trim: true,
		unique: true
	},
	l: {
		alias: "logoUrl",
		type: [Number | String], // will be a pair of [0, '/123.png']... meaning the 2nd one is relatve url, and 0 is the index of base url in storageUrls[] array
		default: null,
		validate: (val) => {
			if (typeof (val[0]) !== "number" || typeof (val[1]) !== "string") 
				return false;
			
			try {
				URL(val[1]);
				return true;
			} catch (err) {
				return false;
			}
		},
		get: (val) => {
			return (storageUrls[val[0]] + val[1]);
		}
	},
	j: {
		alias: "jobs",
		type: [Types.ObjectId]
	}
});

companySchema.pre("save", function (doc) {
	if (!(this.val[1].includes("/") || this.val[1].includes("\\"))) 
		this.val[1] = "/" + this.val[1];
	
});

module.exports = model("companies", companySchema);
