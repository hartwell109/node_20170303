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
 * 参数:
 *  Port:串口号字符串
 * 例如:CommOpen("Com1");
 * 返回:
 *  串口文件句柄
 * 备注:必须先调用此函数，获得指定串口的串口文件句柄，才可调用其他函数。
 *    可以同时打开多个串口，获得多个串口文件句柄，但不能多次打开同一个串口。
 *     使用完毕后，必须调用 CommClose()关闭串口。
 */
var handle = crt310.CommOpen(config.crt310.com);
console.log('CommOpen=' + handle);

/**
 * 卡机复位
 * 参数:
 * ComHandle：串口句柄。
 * _Eject:弹卡选择。 0=不弹卡 1=前端弹卡 2=后端弹卡
 * 返回值:
 *   如果函数调用成功，返回值为 0。
 *   如果函数调用失败，返回值不为 0
 */
// console.log('CRT310_Reset=' + crt310.CRT310_Reset(handle, 0x1))

/**
 * 获取卡机状态
 * 参数:
 * ComHandle：串口句柄。
 * _atPosition：
 *    =0X46   卡机内有长卡(卡的长度长于标准卡长度)
 *    =0X47   卡机内有短卡(卡的长度短于标准卡长度)
 *    =0X48   卡机前端,不持卡位置有卡。
 *    =0X49   卡机前端持卡位置有卡。
 *    =0X4A   卡机内停卡位置有卡。
 *    =0X4B   卡机内 IC 卡操作位置有卡，并且 IC 卡触点已下落。
 *    =0X4C   卡机后端持卡位置有卡。
 *    =0X4D   卡机后端不持卡位置有卡。
 *    =0X4E   卡机内无卡。
 * _frontSetting：
 *    =0X49  卡机允许磁信号方式进卡,只允许磁卡开闸门进卡。
 *    =0X4A  卡机允许开关信号方式进卡，允许磁卡，IC 卡，M1 射频卡，双界面卡进卡。
 *    =0X4B  卡机允许磁信号方式进卡，允许纸磁卡，薄卡进卡。
 *    =0X4E  卡机禁止进卡。
 * _rearSetting：
 *   =0X4A       卡机允许后端进卡，允许磁卡，IC 卡，M1 射频卡，双面卡进卡。
 *   =0X4E       卡机禁止后端进卡。
 * 返回值:
 *  如果函数调用成功，返回值为 0。
 *  如果函数调用失败，返回值不为 0。
 */
var atPosition = ref.allocCString(' ', 'utf8');
var frontSetting = ref.allocCString(' ', 'utf8');
var rearSetting = ref.allocCString(' ', 'utf8');
console.log('CRT310_GetStatus=%s;atPosition=%s;frontSetting=%s;rearSetting=%s', crt310.CRT310_GetStatus(handle, atPosition, frontSetting, rearSetting), atPosition.toString(), frontSetting, rearSetting);

/**
 * CRT310 进卡控制设置
 * 参数:
 * ComHandle：串口句柄。
 * _CardIn：前端进卡设置：
 *   =0x1    不允许；
 *   =0x2    磁卡方式（磁信号+开关同时有效）进卡使能, 只允许磁卡从前端开闸门进卡；
 *   =0x3    开关信号方式进卡使能，允许磁卡，IC 卡，M1 射频卡，双界面卡从前端开闸门进卡。
 *   =0x4    磁信号方式进卡使能, 针对薄磁卡等一些纸卡进卡；
 * _EnableBackIn：是否允许后端进卡。 0x0=允许；0x1=不允许。
 * CRT310 读卡器上电或执行复位命令后默认的前端进卡方式是开关方式进卡使能，后端允许进卡。
 * 返回值:
 *   如果函数调用成功，返回值为 0。
 *   如果函数调用失败，返回值不为 0。
 */
var cardIn = 0x3;
var enableBackIn = 0x01;
console.log('CRT310_CardSetting=' + crt310.CRT310_CardSetting(handle, cardIn, enableBackIn))

/**
 * 停卡位置设置
 * 参数:
 * ComHandle：串口句柄。
 * _Position：
 *        =0x1      进卡后停卡在前端位置，不持卡。
 *        =0x2      进卡后停卡在前端位置，并持卡。
 *        =0x3      进卡后停卡在卡机内位置，但是 IC 卡触点没有与卡接触，M1 射频卡可以进行读写操作。
 *        =0x4      进卡后停卡在卡机内位置，同时将 IC 卡座触点与卡接触，直接可进行 IC 卡操作。
 *        =0x5      进卡后停卡在后端位置，并持卡。
 *        =0x6      进卡后将卡从后端弹出，不持卡。
 *  返回值:
 *        如果函数调用成功，返回值为 0。
 *        如果函数调用失败，返回值不为 0。
 */
var position = 0x3;
console.log('CRT310_CardPosition=' + crt310.CRT310_CardPosition(handle, position));

/**
 * 读磁轨数据
 * 参数:
 *  ComHandle：串口句柄。
 *  _mode：数据模式，读卡模式：
 *     0x30    以 ASCII 码读卡数据
 *     0x31    以二进制码读卡数据
 *  _track：磁轨，指定轨道号：
 *     0x30    磁卡三轨都不读
 *     0x31    读磁卡一轨
 *     0x32    读磁卡二轨
 *     0x33    读磁卡三轨
 *     0x34    读磁卡一二轨
 *     0x35    读磁卡二三轨
 *     0x36    读磁卡一三轨
 *     0x37    读磁卡一二三轨
 * _BlockDataLen：数据包长度
 * _BlockData：数据内容，其中每轨数据包格式如下：轨数据起始字+读卡状态字+卡轨道数据
 *   轨道起始字：  0x1F
 *   读卡状态字：
 *     0x59   读该轨数据读正确，卡轨道数据为该轨信息数据
 *     0x4E   读卡不正确，卡轨道数据为错误信息
 *     0x4F   该轨道不读，卡轨道数据为 0xE0；
 * 错误信息：
 *     0xE1   读该轨数据错误，没有起始位 STX
 *     0xE2   读该轨数据错误，没有结束位 ETX
 *     0xE3   读该轨数据错误，位校验错误 VRC
 *     0xE4   读该轨数据错误，字节校验位错误 LRC
 *     0xE5   读该轨数据错误，该轨是空白信息磁道
 * 二进制读卡传送的数据格式是：
 *   一轨：b0,b1,b2,b3,b4,P
 *   二轨,三轨：b0,b1,b2 b3,P
 * 注意：
 *  当设置以 ASCII 码读卡时将卡每一轨信息的别换成一个字节 ASCII 码上传达卡数据。
 *
 *  返回值:
 *     如果函数调用成功，返回值为 0。
 *     如果函数调用失败，返回值为非 0。
 */
var BlockDataLen = new Buffer(4)
BlockDataLen.writeInt32LE(12345, 0)
BlockDataLen.type=ref.types.int32
var track = 0x34;
var mode = 0x30;
var BlockData = ref.alloc('char', 100);
console.log('MC_ReadTrack=%s;BlockDataLen=%s;BlockData=%s', crt310.MC_ReadTrack(handle, mode, track, BlockDataLen, BlockData), BlockDataLen, BlockData);

/**
 * 走卡位置设置
 * 参数:
 * ComHandle：串口句柄。
 * _Position：
 *    =0x1      将卡重新走位到前端位置，不持卡。
 *    =0x2      将卡重新走位到前端位置，并持卡。
 *    =0x3      将卡重新走位到卡机内位置,操作成功后可进行 M1 射频卡操作。
 *    =0x4      将卡重新走位到卡机内位置，并将 IC 卡触点落下，操作成功后可进行接触式 IC 卡操作。
 *    =0x5      将卡重新走位到后端位置，并持卡。
 *    =0x6      将卡重新走位后端位置，不持卡。
 *    =0x7      将异常长度卡（短卡，长卡）清出卡机内，将卡向后端弹卡，对于短卡还需人工在卡口插正常卡辅助操作.
 *    =0x8      启动清洁卡操作
 * 返回值:
 *     如果函数调用成功，返回值为 0。
 *     如果函数调用失败，返回值不为 0。
 *注：当卡不在有持卡位置上或不在卡机内时再执行其它的进、弹卡命令时，将返回“卡不在允许操作位置”的信息上。
 *卡机处于无卡状态时 Host 发出设置清洁卡命令后，返回设置成功后，从卡机前端闸门处插入清洁卡，卡机进卡后会执行对卡
 *机清洁动作，执行完成将卡走卡到前端不持卡位置，此命令执行完对卡机进行一次清洁卡机操作。
 */
console.log('CRT310_MovePosition=%s', crt310.CRT310_MovePosition(handle, 0x1))

/**
 * 关闭端口
 * 参数:
 * ComHandle：串口句柄。
 * 返回:
 *  0=成功
 */
// console.log('CommClose=' + crt310.CommClose(handle))