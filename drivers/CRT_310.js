var ffi = require('ffi');
var ref = require('ref');
var refArray = require('ref-array');
var config = require('./config.js');

/**
 * CRT-310的类库函数
 */
var crt310 = ffi.Library(__dirname + '/' + config.crt310.driver, {
    "CommOpen": [ref.types.int16, [ref.types.CString]],
    "GetSysVerion": [ref.types.int16, [ref.types.int16, 'string']],
    "CRT310_CardSetting": [ref.types.int16, [ref.types.int16, ref.types.byte, ref.types.byte]],
    "CRT310_Reset": [ref.types.int16, [ref.types.int16, ref.types.byte]],
    "CRT310_CardPosition": [ref.types.int16, [ref.types.int16, ref.types.byte]],
    "CRT310_GetStatus": [ref.types.int16, [ref.types.int16, 'string', 'string', 'string']],
    "CRT310_ReadSnr": [ref.types.int16, [ref.types.int16, refArray(ref.types.char), ref.refType('int')]],
    "CRT310_MovePosition": [ref.types.int16, [ref.types.int16, 'byte']],
    "MC_ReadTrack": [ref.types.int16, [ref.types.int16, 'byte', 'byte', ref.refType('int'), refArray(ref.types.char)]],
    "CommClose": [ref.types.int16, [ref.types.int16]]
});

/**
 * 设置通讯端口，获取端口控制句柄
 */
var handle = crt310.CommOpen(config.crt310.com);
console.log('CommOpen=' + handle);

/**
 * 卡机复位
 */
// console.log('CRT310_Reset=' + crt310.CRT310_Reset(handle, 0x2))

/**
 * 获取卡机版本号
 */
var version = ref.allocCString('version_cr', 'utf8');

console.log('GetSysVerion=%s;version=%s', crt310.GetSysVerion(handle, version), version);

/**
 * 获取卡机状态
 */
var atPosition = ref.allocCString(' ', 'utf8');
var frontSetting = ref.allocCString(' ', 'utf8');
var rearSetting = ref.allocCString(' ', 'utf8');
console.log('CRT310_GetStatus=%s;atPosition=%s;frontSetting=%s;rearSetting=%s', crt310.CRT310_GetStatus(handle, atPosition, frontSetting, rearSetting), atPosition.toString(), frontSetting, rearSetting);

/**
 * 卡机设置：
 */
console.log('CRT310_CardSetting=' + crt310.CRT310_CardSetting(handle, 0x3, 0x1))

/**
 * 获取卡机序列号
 */
var SNData = ref.alloc('char', 100);
var dataLen = ref.alloc('int', 100);
console.log('CRT310_ReadSnr=%s;SNData=%s;dataLen=%s', crt310.CRT310_ReadSnr(handle, SNData, dataLen), SNData.toString(), dataLen);

/**
 * 停卡位置设置
 */
// console.log('CRT310_CardPosition=' + crt310.CRT310_CardPosition(handle, 0x4));

/**
 *读磁轨数据
 */
var BlockData = ref.alloc('char', 100);
var BlockDataLen = ref.alloc('int', 100);
// console.log('MC_ReadTrack=%s;BlockDataLen=%s;BlockData=%s', crt310.MC_ReadTrack(handle, 0x30, 0x34, BlockDataLen, BlockData), BlockDataLen, BlockData.toString());

/**
 *退卡操作
 */
console.log('CRT310_MovePosition=%s', crt310.CRT310_MovePosition(handle, 0x2))

/**
 * 关闭端口
 */
console.log('CommClose=' + crt310.CommClose(handle))