

class ResponseBuilder {
    static successMessage(msg) {
        const rb = new ResponseBuilder();
        rb.code = 200;
        rb.msg = msg;
        return rb;
    }

    static errorMessage(msg) {
        const rb = new ResponseBuilder();
        rb.code = 500;
        rb.msg = msg != null ? msg : "Internal Server Error";
        return rb;
    }

    static badRequest(msg) {
        const rb = new ResponseBuilder();
        rb.code = 400;
        rb.msg = msg;
        return rb;
    }

    static data(result, msg) {
        const rb = new ResponseBuilder();
        rb.code = 200;
        rb.data = result;
        rb.msg = msg || null;
        return rb;
    }
}

module.exports = { ResponseBuilder };
