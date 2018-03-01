var ffi = require('ffi');
var ref = require('ref');
var refArray = require('ref-array');
var charPtr = ref.refType('char');
var int32 = ref.types.int32;
var UCharArray = refArray('uchar');
var opczRspMsg = new UCharArray(64);
console.log('start......');
console.log('path=' + __dirname)
var nlMisPos = ffi.Library(__dirname + '/NlMisPos.dll', {
    "DoBankTrans2": [int32, ["string", "string", "string", "string", "string", "string", UCharArray, "string", "string"]]
});
console.log('result=' + nlMisPos.DoBankTrans2("a", "b", "c", "d", "e", "f", opczRspMsg, "h", "i"));
console.log(JSON.stringify(opczRspMsg))
