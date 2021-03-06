const countryEnCode = {
	India: "IN"
};

const tempCountries = {};
for (const key in countryEnCode) {
	if( Object.hasOwnProperty.call(countryEnCode, key) )
		tempCountries[countryEnCode[key]] = key;
}
const countryDeCode = tempCountries;

module.exports = {
	countryEnCode,
	countryDeCode,
	allowedJobTypes: {
		I: "Internship",
		F: "FullTime",
		P: "PartTime"
	},
	allowedRoles: {
		A: "Algorithm",
		B: "Backend",
		DA: "Data Analytics",
		DS: "Data Scientist",
		F: "Frontend",
		M: "Marketing",
		S: "System Admin",
		O: "Others"
	},

	// Use it when interacting with user, since this one returns an array of the expanded versions of each role
	getAllowedRoles: function getAllowedRoles (allowedRoles) {
		const tempRoles = [];
		for (const key in allowedRoles) {
			if( Object.hasOwnProperty.call(allowedRoles, key) )
				tempRoles.push(allowedRoles[key]);
		}
		return tempRoles;
	}
};
