const mysql = require('mysql');

exports.handler = (event, context, callback) => {

    const connection = mysql.createConnection({
        host     : process.env.DB_ARN,
        user     : process.env.DB_USER,
        password : process.env.DB_PASS,
        port     : process.env.DB_PORT,
        database : process.env.DB_SCHEMA
    })

    // Make sure the request isn't missing
    if (isMissing(event.request)) {
        callback(null, createResponse("error", "Missing request"))
        return
    }

    // Make sure the request isn't missing the table name
    if (isMissing(event.request.tableName)) {
        callback(null, createResponse("error", "The provided request is missing the table name"))
        return
    }

    // Attempt to connect or exit
    connection.connect(err => {
        // If can't connect, then exit
        if (err) {
            callback(null, createResponse('error', 'Connection error: ' + err))
            return
        }

        // SQL INJECTION: check that the table and any filter columns referenced in the request actually
        // exist in the database. This is done by running a parametrized query on the information_schema,
        // to select the count of objects which are found having the name of the table or the names of
        // the filter columns. 
        let sql = 'SELECT COUNT(*) cnt FROM information_schema.'
        let expectedCount = 0
        let params = []

        // If there are filters provided, then the check is made on information_schema.colums, by counting
        // the columns mapped to the referenced table which have the name included in the given list, which
        // is composed from the "columnName" attribute of all provided filters. The count is expected to
        // match the number of filters. Otherwise, one of the column names provided in the filters array
        // might be wrong or this might be an attempt at SQL injection.
        if (event.request.filters) {
            // If the filters array is empty, exit with an error response
            if (!(event.request.filters.length > 0)) {
                callback(null, createResponse('error', 'The provided filters array is empty'))
                connection.end()
                return
            }

            sql += "columns WHERE UPPER(column_name) IN ('lowercasecolumn'"

            for (let filter of event.request.filters) {
                sql += ',UPPER(?)'
                params.push(filter.columnName)
                expectedCount++
            }

            sql += ')'
        }
        // If there are no filters provided, the verification is made by counting the records in the
        // information_schema.tables table where the table name is the provided table name. The count
        // is expected to be 1. Otherwise, the given table name might be wrong or this might be an
        // attempt at SQL injection.
        else {
            sql += "tables WHERE 1 = 1"
            expectedCount = 1
        }

        sql += " AND UPPER(table_name) = UPPER(?) AND table_schema = '" + process.env.DB_SCHEMA + "'"
        params.push(event.request.tableName)

        // Check the paging
        if (event.request.paging) {
            // First check if it's defined correctly
            if (isMissing(event.request.paging.windowStart) || isMissing(event.request.paging.windowSize)) {
                callback(null, createResponse('error', 'The paging attribute is missing the windowStart or windowSize or both'))
                connection.end()
                return
            }

            // SQL INJECTION: check that the windowStart end windowSize attributes are numbers
            if (isNaN(event.request.paging.windowStart) || isNaN(event.request.paging.windowSize)) {
                callback(null, createResponse('error', 'The provided paging attributes are illegal'))
                connection.end()
                return
            }
        }

        // DEBUG:
        console.log('SQL = ' + sql)
        console.log('Params = ' + params)

        // Run the query composed above and check the count. If the check passes, move forward and
        // query the referenced table for the requested data.
        connection.query(
            sql,
            params,
            (err, results, fields) => {
                // Handle any errors
                if (err) {
                    callback(null, createResponse('error', err))
                    connection.end()
                    return
                }

                // DEBUG:
                console.log('Resulted count = ' + results[0]["cnt"] + ', while expected count = ' + expectedCount)

                // Check the count
                if (results[0]["cnt"] != expectedCount) {
                    callback(null, createResponse('error', 'Either the table name or one or more of the provided column names are wrong'))
                    connection.end()
                    return
                }

                // Initialize the query for fulfilling the actual request
                let sql = 'SELECT * FROM ' + event.request.tableName;
                let params = []

                // Add any filters to the query
                if (event.request.filters) {
                    sql += ' WHERE 1 = 1'
                    for (let filter of event.request.filters) {
                        let comparisonOperator = ("" + filter.columnValue).indexOf('%') > -1 ? 'LIKE' : '='
                        sql += ' AND ' + filter.columnName + " " + comparisonOperator + " ?"
                        params.push(filter.columnValue)
                    }
                }

                // Add paging, if defined
                if (event.request.paging) {
                    sql += ' LIMIT ' + event.request.paging.windowStart + ',' + event.request.paging.windowSize
                }

                // DEBUG:
                console.log('Final SQL = ' + sql)

                // Finally, run the query
                connection.query(
                    sql,
                    params,
                    (err, results, fields) => {
                        callback(
                            null,
                            err ? createResponse('error', err) : createResponse('ok', results)
                        )
                        connection.end()
                    }
                )
            }
        )
    })
}

function createResponse(respType, resp) {
    return {
        responseType: respType,
        response: resp
    }
}

function isMissing(item) {
    return item == null || item == undefined
}