const express = require('express');
const router = express.Router();
const {getItemById, AddItemById,removeItemById} =  require('./storage');
const {validateSettingsSchema} = require("./schemas/settingSchema");
const {generateAuditRecord} = require('./utils/utils');
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
const SETTINGS = '/settings';

function encrypt(text) {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

function decrypt(text) {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

router.get(SETTINGS, async  function (req, res) {
    //decrypt
    const userId = req.query.id || "";
    const userSettings = await getItemById('settings', userId);
    const encryptedRes = encrypt(userSettings || {});
    return res.status(200).send(encryptedRes)
})

router.post(SETTINGS, async  function (req, res) {
    //decrypt
    const {userEmail, settings, operation} = req.body
    const {isValid,errors} = validateSettingsSchema(settings);
    if(!isValid){
        return res.status(400).send(errors);
    }
    await AddItemById('settings', userEmail, settings);
    const audit = generateAuditRecord({user:userEmail,operation});
    await AddItemById('audit', audit._id, audit);
    const encryptedRes = encrypt("added");
    return res.status(200).send(encryptedRes.encryptedData);
})

router.put(SETTINGS, async  function (req, res) {
    //decrypt
    const {userEmail, settings, operation} = req.body
    const {isValid,errors} = validateSettingsSchema(settings);
    if(!isValid){
        return res.status(400).send(errors);
    }
    await AddItemById('settings', userEmail, settings);
    const audit = generateAuditRecord({user:userEmail,operation:"update"});
    await AddItemById('audit', audit._id, audit);
    const encryptedRes = encrypt("updated");
    return res.status(200).send(encryptedRes.encryptedData);
})

router.delete(SETTINGS, async  function (req, res) {
    //decrypt
    const userId = req.query.id || "";
    const {deletedCount} = await removeItemById('settings', userId);
    if (!deletedCount){
        const audit = generateAuditRecord({user:userId,operation:"delete"});
        await AddItemById('audit', audit._id, audit);
    }
    const encryptedRes = encrypt("deleted");
    return res.status(200).send(encryptedRes.encryptedData);
})



module.exports = router;


