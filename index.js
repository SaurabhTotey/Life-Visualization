const toValidDateOfBirth = param => {
	if (!param || param.length !== 10 || (param[2] != param[5] || param[2] != "-")) {
		return null;
	}
	const day = parseInt(param.substring(0, 2));
	const month = parseInt(param.substring(3, 5));
	const year = parseInt(param.substring(6, 10));
	const returnValue = [day, month, year];
	if (returnValue.some(value => isNaN(value))) {
		return null;
	}
	return returnValue;
};

const urlParameters = new URLSearchParams(window.location.search);
const dateOfBirth = toValidDateOfBirth(urlParameters.get("dateOfBirth")) || [5, 12, 2000];
const lifeExpectancy = parseInt(urlParameters.get("lifeExpectancy")) || 90;

const main = () => {
	const canvas = document.getElementById("canvas");
	const renderer = canvas.getContext("2d");

	canvas.width = document.documentElement.clientWidth;
	canvas.height = document.documentElement.clientHeight;

	const birthDate = new Date();
	birthDate.setFullYear(dateOfBirth[2]);
	birthDate.setMonth(dateOfBirth[1] - 1, dateOfBirth[0]);
	const deathDate = new Date(birthDate.getTime());
	deathDate.setFullYear(dateOfBirth[2] + lifeExpectancy);
	const today = new Date();

	const msToWeeks = ms => ms / (1000 * 3600 * 24 * 7);
	const weeksTotal = msToWeeks(deathDate.getTime() - birthDate.getTime());
	const weeksPassed = msToWeeks(today.getTime() - birthDate.getTime());

	renderer.clearRect(0, 0, canvas.width, canvas.height);
	const numberOfRows = Math.ceil(weeksTotal / 52);
	const squareSize = Math.min(canvas.width / 52, canvas.height / numberOfRows);
	const padding = squareSize / 10;

	const drawingWidth = squareSize * 52;
	const drawingHeight = squareSize * numberOfRows;
	const xOffset = (canvas.width - drawingWidth) / 2;
	const yOffset = (canvas.height - drawingHeight) / 2;

	let weeksDrawn = 0;
	let weeksPassedToStillDraw = weeksPassed;
	for (let yearsSinceBirth = 0; yearsSinceBirth < numberOfRows; yearsSinceBirth++) {
		const y = squareSize * yearsSinceBirth + yOffset;
		const squaresToDraw = Math.min(weeksTotal - weeksDrawn, 52);
		for (i = 0; i < squaresToDraw; i++) {
			const x = squareSize * i + xOffset;
			renderer.strokeRect(x + padding, y + padding, squareSize - 2 * padding, squareSize - 2 * padding);
			if (weeksPassedToStillDraw > 0) {
				renderer.beginPath();
				renderer.moveTo(x, y);
				renderer.lineTo(x + squareSize, y + squareSize);
				renderer.stroke();
				renderer.beginPath();
				renderer.moveTo(x + squareSize, y);
				renderer.lineTo(x, y + squareSize);
				renderer.stroke();
				weeksPassedToStillDraw -= 1;
			}
		}
		weeksDrawn += squaresToDraw;
	}
};
window.onresize = main;

window.onload = main;

//TODO: maybe add some sort of timer to call main at the start of each new day
