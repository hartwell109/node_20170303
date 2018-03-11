var ffi = require('ffi');
var ref = require('ref');
var refArray = require('ref-array')
var config = require('./config.js');

/**
 * CRT-310的类库函数
 */
var CRT_310 = ffi.Library(__dirname + '/' + config.crt310.driver, {
    "CommOpen": [ref.types.int16, [ref.types.CString]],
    "CRT310_CardSetting": [ref.types.int16, [ref.types.int16, ref.types.byte, ref.types.byte]],
    "CRT310_Reset": [ref.types.int16, [ref.types.int16, ref.types.byte]],
    "CRT310_CardPosition": [ref.types.int16, [ref.types.int16, ref.types.byte]],
    "CRT310_GetStatus": [ref.types.int16, [ref.types.int16, 'string', 'string', 'string']],
    "CRT310_SensorStatus": [ref.types.int16, ['string', 'string', 'string', 'string', 'string', 'string', 'string', 'string']],
    "CRT310_ReadSnr": [ref.types.int16, [ref.types.int16, refArray(ref.types.char), ref.refType('int')]],
    "CRT310_MovePosition": [ref.types.int16, [ref.types.int16, 'byte']],
    "MC_ReadTrack": [ref.types.int16, [ref.types.int16, 'byte', 'byte', ref.refType('int'), refArray(ref.types.char)]],
    "CommClose": [ref.types.int16, [ref.types.int16]]
});

module.exports = CRT_310;
