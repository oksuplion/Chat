export default function onError(err, req, res){
	console.log(err);

	if (res) {
		const status = err.status || err.statusCode || 500;
		const message = err.message || "Something went wrong. Please, try later again";
		res.status(status).json({ message });
	}
}