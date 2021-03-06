const { Router } = require("express");

const { contains, all } = require("underscore");
const router = Router();

const corners = {
	oc: { // outer_corners
		"0,6": "R",
		"0,8": "D",
		"6,0": "R",
		"6,14": "D",
		"8,0": "U",
		"8,14": "L",
		"14,6": "U",
		"14,8": "L"
	},
	it: { // inner_turns
		"9,6": "L",
		"6,5": "U",
		"8,9": "D",
		"5,8": "R"
	}
};

const homeTurns = { // colour: [coord,direction]
	R: ["14,7", "U"],
	G: ["7,0", "R"],
	Y: ["0,7", "D"],
	B: ["7,14", "L"]
};

function isHomeEnd(coords) {
	const home_ends = ["8,7", "6,7", "7,6", "7,8"];
	if (home_ends.find(end => end == coords)) return true;
	else return false;
}

function turnAtCorner(corners_vec, coord) { // returns `null` to signify to direction
	return corners_vec[coord] || null;
}

function getDirection(coords) {
	if (!coords || typeof (coords[0]) !== "number" || typeof (coords[0]) !== "number") return null;

	if (coords[1] > 5 && coords[1] < 9) {
		if (coords[0] === 0) return "R";
		else if (coords[0] === 14) return "L";

		return coords[1] === 6 ? "U" : (coords[1] === 8 ? "D" : coords[0] < 6 ? "D" : "U"); // returning null for home path, since that is retrieved by homeTurns
	} else if (coords[0] > 5 && coords[0] < 9) {
		if (coords[1] === 0) return "U";
		else if (coords[1] === 14) return "D";

		return coords[0] === 6 ? "R" : (coords[0] === 8 ? "L" : coords[1] < 6 ? "R" : "L"); // returning null for home path, since that is retrieved by homeTurns
	}
}

function validData(reqData) {
	const allowed_colours = ["R", "G", "Y", "B"];

	if (!!reqData && !!reqData.dist && !!reqData.col && !!reqData.coords) {
		if (!contains(allowed_colours, reqData.col)) 
			return false;
		else return true;
	} else return false;
}

function moveGoti(colour, coord, dist) {
	let increment_coords = [0, 0];
	let turnDirection = null;
	const updated_coords = coord;
	let currDirection = getDirection(updated_coords);
	dist = Number(dist);	// if it's string, convert to number

	if (!currDirection || !dist || typeof (colour) !== "string") return [false];

	if (dist === 0) return [false];
	while (dist-- > 0) {
		increment_coords = [0, 0];

		turnDirection = turnAtCorner(corners.oc, updated_coords);
		if (turnDirection) {
			currDirection = turnDirection;
			switch (currDirection) {
			case "U": increment_coords = [-1, 0]; break;
			case "L": increment_coords = [0, -1]; break;
			case "R": increment_coords = [0, 1]; break;
			case "D": increment_coords = [1, 0]; break;
			}
		} else {
			turnDirection = turnAtCorner(corners.it, updated_coords);

			if (turnDirection) {
				currDirection = turnDirection;
				switch (currDirection) {
				case "U": increment_coords = [-1, 1]; break;
				case "L": increment_coords = [-1, -1]; break;
				case "R": increment_coords = [1, 1]; break;
				case "D": increment_coords = [1, -1]; break;
				}
			} else {
				if (updated_coords == homeTurns[colour][0])  currDirection = homeTurns[colour][1]; 

				switch (currDirection) {
				case "U": increment_coords = [-1, 0]; break;
				case "L": increment_coords = [0, -1]; break;
				case "R": increment_coords = [0, 1]; break;
				case "D": increment_coords = [1, 0]; break;
				}
			}
		}

		updated_coords[0] += increment_coords[0];
		updated_coords[1] += increment_coords[1];

		if (isHomeEnd(updated_coords) && dist > 0) return [false];
	}

	return [
		true,	// possibility
		updated_coords	// final coords
	];
}

router.post("/goti", (req, res) => {
	const reqData = {
		col: Object.hasOwnProperty.call(req.body, "col") ? toString(req.body.col): null, // colour
		dist: Number(req.body.dist) // dist=0 will give Input Not Valid
	};

	if( Object.hasOwnProperty.call(req.body, "coords") ){
		if( Array.isArray(reqData.coords) )
			reqData.coords = req.body.coords;
		else
			reqData.coords = [ req.body.coords ];
	}
	if (!validData(reqData)) 
		return res.status(400).send({ error: "Input Not Valid", inputReceived: req.body });
	

	const colour = reqData.col;
	const dist = reqData.dist;
	if (dist === 0)  return res.send({ bool: false }); 

	if ( ! reqData.coords ) return res.sendStatus(400);

	if ( reqData.coords.length === 2 && all(reqData.coords, iter => typeof (iter) === "number")) {	// ie. is a single pair
		reqData.coords = [reqData.coords];	// convert to an array
	}

	const bools = [];	// an array of bools
	const finalCoords = [];	// an array of bools

	let possibility, finalCoord;
	reqData.coords.forEach((coord) => {
		[possibility, finalCoord] = moveGoti(colour, coord, dist);
		bools.push(possibility);
		finalCoords.push(finalCoord);
	});

	res.send({
		bools,
		coords: finalCoords
	});
});

module.exports = router;
