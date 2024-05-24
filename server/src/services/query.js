const DEFAULT_PAGE_LIMIT = 0;
const DEFAULT_PAGE_NUMBER = 1;
function getPagination(query) {
    const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;
    const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
    const skip = limit * (page - 1)

    return { limit, page, skip }
}

module.exports = { getPagination }