var crt310 = require('./interface/CRT_310.js')
var ref = require('ref');
var refArray = require('ref-array');
var config = require("../config")


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
var commOpen = function () {
    var handle = crt310.CommOpen(config.crt310.com);
    console.log('CommOpen.handle = ' + handle);
    return handle;
}
//
// /**
//  * 卡机复位
//  * 参数:
//  * ComHandle：串口句柄。
//  * _Eject:弹卡选择。 0=不弹卡 1=前端弹卡 2=后端弹卡
//  * 返回值:
//  *   如果函数调用成功，返回值为 0。
//  *   如果函数调用失败，返回值不为 0
//  */
var reset = function (handle) {
    var eject = 0x1;
    var result = crt310.CRT310_Reset(handle, eject)
    console.log('CRT310_Reset=' + result)
    return result;
}

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
var getStatus = function (handle) {
    var atPosition = ref.alloc(ref.types.int8);
    var frontSetting = ref.alloc(ref.types.int8);
    var readSetting = ref.alloc(ref.types.int8);
    console.log('CRT310_GetStatus=%s',
        crt310.CRT310_GetStatus(handle, atPosition, frontSetting, readSetting));
    var Sb1 = "", Sb2 = "", Sb3 = ""
    switch (atPosition.deref()) {
        case 0x46:
            Sb1 = "卡机内有长卡(卡的长度长于标准卡长度)";
            break;
        case 0x47:
            Sb1 = "卡机内有短卡(卡的长度短于标准卡长度)";
            break;
        case 0x48:
            Sb1 = "卡机前端,不持卡位置有卡";
            break;
        case 0x49:
            Sb1 = "卡机前端,持卡位置有卡";
            break;
        case 0x4A:
            Sb1 = "卡机内停卡位置有卡";
            break;
        case 0x4B:
            Sb1 = "卡机内 IC 卡操作位置有卡，并且 IC 卡触点已下落";
            break;
        case 0x4C:
            Sb1 = "卡机后端持卡位置有卡";
            break;
        case 0x4D:
            Sb1 = "卡机后端不持卡位置有卡";
            break;
        case 0x4E:
            Sb1 = "卡机内无卡";
            break;
    }
    console.log('atPosition=' + Sb1)
    switch (frontSetting.deref()) {
        case 0x49:
            Sb2 = "卡机允许磁信号方式进卡,只允许磁卡开闸门进卡";
            break;
        case 0x4A:
            Sb2 = "卡机允许开关信号方式进卡，允许磁卡，IC 卡，M1 射频卡，双界面卡进卡";
            break;
        case 0x4B:
            Sb2 = "卡机允许磁信号方式进卡，允许纸磁卡，薄卡进卡";
            break;
        case 0x4C:
            Sb2 = "卡机禁止进卡";
            break;
    }
    console.log('frontSetting=' + Sb2)
    switch (readSetting.deref()) {
        case 0x4A:
            Sb3 = "卡机允许后端进卡，允许磁卡，IC 卡，M1 射频卡，双面卡进卡";
            break;
        case 0x4E:
            Sb3 = "卡机禁止后端进卡";
            break;
    }
    console.log('readSetting=' + Sb3)
}

/**
 * CRT310 进卡控制设置
 * 参数:
 * ComHandle：串口句柄。
 * _CardIn：前端进卡设置：
 *   =0x1    不允许；
 *   =0x2    磁卡方式（磁信号+开关同时有效）进卡使能, 只允许磁卡从前端开闸门进卡
 *   =0x3    开关信号方式进卡使能，允许磁卡，IC 卡，M1 射频卡，双界面卡从前端开闸门进卡
 *   =0x4    磁信号方式进卡使能, 针对薄磁卡等一些纸卡进卡
 * _EnableBackIn：是否允许后端进卡。 0x0=允许；0x1=不允许
 * CRT310 读卡器上电或执行复位命令后默认的前端进卡方式是开关方式进卡使能，后端允许进卡
 * 返回值:
 *   如果函数调用成功，返回值为 0。
 *   如果函数调用失败，返回值不为 0。
 */
var cardSetting = function (handle) {
    var cardIn = 0x3;
    var enableBackIn = 0x01
    var result = crt310.CRT310_CardSetting(handle, cardIn, enableBackIn)
    console.log('CRT310_CardSetting=' + result)
}

/**
 * 停卡位置设置
 * 参数:
 * ComHandle：串口句柄。
 * _Position：
 *        =0x1      进卡后停卡在前端位置，不持卡
 *        =0x2      进卡后停卡在前端位置，并持卡
 *        =0x3      进卡后停卡在卡机内位置，但是 IC 卡触点没有与卡接触，M1 射频卡可以进行读写操作
 *        =0x4      进卡后停卡在卡机内位置，同时将 IC 卡座触点与卡接触，直接可进行 IC 卡操作
 *        =0x5      进卡后停卡在后端位置，并持卡
 *        =0x6      进卡后将卡从后端弹出，不持卡
 *  返回值:
 *        如果函数调用成功，返回值为 0。
 *        如果函数调用失败，返回值不为 0。
 */
var cardPosition = function (handle) {
        const position = 0x4
        const result = crt310.CRT310_CardPosition(handle, position);
        console.log('CRT310_CardPosition=' + result);
    }

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
     */;
var readTrack = function (handle) {
    var blockDataLen = ref.alloc(ref.types.int32)
    var track = 0x37;
    var mode = 0x30;
    var blockData = ref.alloc(ref.types.int64)
    const result = crt310.MC_ReadTrack(handle, mode, track, blockDataLen, blockData);
    console.log('MC_ReadTrack=%s;BlockDataLen=%s;BlockData=%s', result, blockDataLen.deref(), blockData.deref())
}

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
var movePosition = function (handle) {
    const position = 0x1
    const result = crt310.CRT310_MovePosition(handle, position)
    console.log('CRT310_MovePosition=%s', result)

}

/**
 * 关闭端口
 * 参数:
 * ComHandle：串口句柄。
 * 返回:
 *  0=成功
 */
var commClose = function (handle) {
    const result = crt310.CommClose(handle);
    console.log("commClose=" + result)
}
var handle = 0;
process.on("message", function (msg) {
    console.log("msg=" + msg)
    switch (msg) {
        case "commOpen":
            this.handle = commOpen()
            break
        case "reset":
            reset(this.handle);
            break
        case "cardSetting":
            cardSetting(this.handle);
            break
        case "commClose":
            console.log("handle=" + this.handle)
            commClose(this.handle)
            this.handle = 0
            break
        case "getStatus":
            getStatus(this.handle)
            break
        case "readTrack":
            readTrack(this.handle)
            break
        case "cardPosition":
            cardPosition(this.handle)
            break
        case "movePosition":
            movePosition(this.handle);
            break
    }
})