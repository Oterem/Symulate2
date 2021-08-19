const Ajv = require("ajv");
const ajv = new Ajv({strict: false,allErrors:true,errorDataPath:'property'});


const settingsSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    type: "object",
    properties: {
        geo: {
            type: "object",
            properties:{
                city:{
                    type:"string"
                },
                street:{
                    type:"string"
                }
            },
            required: ["city", "street"],

        },
        age: {type: "number"}
    },
    required: ["geo"],
    additionalProperties: false,
}
const validator = ajv.compile(settingsSchema);
function validateSettingsSchema(obj){
    const isValid = validator(obj);
    const errors = (validator.errors || []).map(err=>{
        return `${err.instancePath} ${err.message}`;
    })
    return {
        isValid,
        errors
    }
}

exports.validateSettingsSchema = validateSettingsSchema
