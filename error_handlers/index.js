class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

const errorHandler = (err, req, res) => {
    const status = err.status || 500;
    const message = err.message || 'Something went wrong';
    res.status(status).send({ data: [], message });
}

export default errorHandler;
export { HttpError };