const toValidDateOfBirth = param => {
	if (!param || param.length !== 10 || (param[2] != param[5] || param[2] != "/")) {
		return null;
	}
	const day = parseInt(param.substring(0, 2));
	const month = parseInt(param.substring(3, 5));
	const year = parseInt(param.substring(6, 10));
	const returnValue = [day, month, year];
	if (returnValue.some(value => isNan(value))) {
		return null;
	}
	return returnValue;
};

const urlParameters = new URLSearchParams(window.location.search);
const dateOfBirth = toValidDateOfBirth(urlParameters.get("dateOfBirth")) || [5, 12, 2000];
const lifeExpectancy = parseInt(urlParameters.get("lifeExpectancy")) || 90;

const resizeFunction = () => {
	const canvas = document.getElementById("canvas");
	const renderer = canvas.getContext("2d");

	canvas.width = document.documentElement.clientWidth;
	canvas.height = document.documentElement.clientHeight;

	const birthDate = new Date();
	birthDate.setYear(dateOfBirth[2]);
	birthDate.setMonth(dateOfBirth[1], dateOfBirth[0]);
	const deathDate = new Date(birthDate.getTime());
	deathDate.setYear(dateOfBirth[2] + lifeExpectancy);
	const today = new Date();

	const msToWeeks = ms => ms / (1000 * 3600 * 24 * 7);
	const weeksTotal = msToWeeks(deathDate.getTime() - birthDate.getTime());
	const weeksPassed = msToWeeks(today.getTime() - birthDate.getTime());

	renderer.clearRect(0, 0, canvas.width, canvas.height);

	let weeksDrawn = 0;
	for (let yearsSinceBirth = 0; yearsSinceBirth < Math.ceil(weeksTotal / 52); yearsSinceBirth++) {
		// TODO: draw either 52 squares in a row or draw weeksTotal - weeksDrawn boxes depending on which is smaller and add that to weeksDrawn
		// TODO: fill in boxes depending on how much time has passed
	}
};
window.onresize = resizeFunction;

window.onload = resizeFunction;
