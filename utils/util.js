
module.exports={
    isEmpty: function (val) {
        if (val instanceof Array) {
            if (val.length == 0) return true;
        } else if (val instanceof Object) {
            if (JSON.stringify(val) === '{}') return true;
        } else {
            if (val == 'null' || val == null || val == 'undefined' || val == undefined || val == '') return true;
            return false;
        }
        return false;
    },
    printJson: function (res, code, msg, data) {
        if (typeof data === 'undefined') {
            res.json({
                code: code,
                msg: msg ? msg : ''
            });
        } else {
            res.json({
                code: code,
                msg: msg ? msg : '',
                data: data
            });
        }
    },
}
