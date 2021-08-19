
function generateAuditRecord({user,operation='add'}){
    return {
        user,
        operation,
        _id: new Date().toISOString()
    }
}

exports.generateAuditRecord = generateAuditRecord
