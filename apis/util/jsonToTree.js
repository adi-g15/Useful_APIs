const sampleJSON = {
	beginner: [
		"p1",
		"p2",
		"p3"
	],
	intermediate: [
		"ie1",
		"ie2",
		"ie3",
		"ie4"
	],
	advanced: [
		"adv1",
		"adv2",
		"adv3"
	]
};

function prtTree (JSON_file, key) {
	const val = JSON_file[key];

	// eslint-disable-next-line no-unused-vars
	const supportedTypes = [
		"number",
		"boolean",
		"string",
		"array" // JS shows it as object though
	];

	if ( ! val )  return console.log("No such key in JSON passed"); 
}

console.log(sampleJSON);
prtTree(sampleJSON, "advanced");

for (const key in { 56: 45, 4: 6 }) {
	if (Object.hasOwnProperty.call({ 56: 45, 4: 6 }, key)) {
		const element = { 56: 45, 4: 6 }[key];
		console.log(element, typeof (element));
	}
}
