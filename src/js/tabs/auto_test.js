import { data, isEmptyObject, indexOf } from "jquery";
import { i18n } from "../localization.js";
import GUI, { TABS } from "../../js/gui.js";
import MSPCodes from "../msp/MSPCodes.js";
import FC from "../fc.js";
import MSP from "../msp.js";
import { connectDisconnect } from "../serial_backend.js";

const auto_test = {};

auto_test.initialize = function (callback) {
    if (GUI.active_tab != "auto_test") {
        GUI.active_tab = "auto_test";
    }

    function load_status() {
        load_html();
    }

    function load_html() {
        $("#content").load("./tabs/auto_test.html", process_html);
    }

    load_status();

    function process_html() {
        // translate to user-selected language
        i18n.localizePage();

        const auto_test_button = $("#auto-test-button");
        const model_gyro_status = $("#model-gyro-status"),
            model_adpter_status = $("#model-adpter-status"),
            model_fan_status = $("#model-fan-status"),
            model_motor_status = $("#model-motor-status"),
            model_cliff_status = $("#model-cliff-status"),
            test_result_empty = $(".test-result-empty"),
            test_result_passed = $(".test-result-passed"),
            test_result_failed = $(".test-result-failed"),
            yes_spray_btn = $(".yes-spray-btn"),
            no_spary_btn = $(".no-spary-btn"),
            yes_voice_btn = $(".yes-voice-btn"),
            no_voice_btn = $(".no-voice-btn"),
            model_waterpump_status = $("#model-waterpump-status"),
            model_voice_status = $("#model-voice-status");

        let timers = [];
        let testResult = [0, 0, 0, 0, 0, 0, 0]; //index: 0适配器，1风机，2马达，3陀螺，4喷水，5光电，6语音；值代表的状态：0未测试，2测试通过，3测试失败
        let cilffValue = new Array(2);
        let cilffHitValue = new Array(2);
        let gyroXData = [];
        let gyroYData = [];
        let gyroZData = [];
        let accXData = [];
        let accYData = [];
        let accZData = [];

        let isSprayFun = false; //是否有喷水功能
        let isVoiceFun = false; //是否有语音功能

        let model_id;
        let isAutoTest = true;
        let isTestedGyro = false; //是否已经测试完陀螺仪

        let pingValue = 0;

        // let fanCurrentStatic = [];
        // let motorCurrentStatic = [];
        // let fanCurrentStatic = [];
        // let motorCurrentStatic = [];

        const dialogConfirmUnderingTestSpary = $(".dialogConfirmUnderingTest-Spary")[0];
        const dialogConfirmUnderingTestVoice = $(".dialogConfirmUnderingTest-Voice")[0];

        focusedButtons();
        function focusedButtons() {
            let showModel;
            let buttonsObj;
            let focusedIndex = 0;
            let atLeastOneDialogOpen =
                $("dialog").filter(function () {
                    if ($(this).prop("open")) {
                        showModel = $(this);
                        return $(this).prop("open");
                    }
                }).length > 0;
            if (!atLeastOneDialogOpen) {
                //没有弹框弹出
                buttonsObj = $("#auto-test-button a");
            } else {
                buttonsObj = $(`#${showModel.find("div.buttons").attr("id")} a`);
            }
            focusedIndex = setFocus(focusedIndex, buttonsObj);
            focusedIndex = bindKey(focusedIndex, buttonsObj);
        }
        function setFocus(index, obj) {
            obj.removeClass("focused"); // 先移除所有按钮的聚焦样式
            if (!obj.eq(index).hasClass("no-click")) {
                obj.eq(index).addClass("focused"); // 为当前聚焦的按钮添加样式
                obj.eq(index).focus(); // 将焦点设置到当前按钮
            } else {
                index += 1;
                setFocus(index, obj);
            }
            return index;
        }

        function bindKey(index, obj) {
            obj.on("keydown", function (e) {
                if (e.key === "Tab") {
                    // 检查是否是 Tab 键被按下
                    e.preventDefault(); // 阻止默认行为，防止浏览器切换焦点
                    e.stopPropagation();
                    index = (index + 1) % obj.length; // 计算下一个按钮的索引，实现循环
                    index = setFocus(index, obj); // 设置焦点和样式
                }
            });
            return index;
        }
        $(document).keydown(function (event) {
            if (event.which === 13 || event.key === "Enter") {
                // Enter 键的键码是 13
                event.preventDefault(); // 阻止默认行为，防止浏览器切换焦点
                event.stopPropagation();
                let focusedElement = $(":focus"); // 获取当前聚焦的元素
                // console.log("================focusedElement:" + JSON.stringify(focusedElement, null, 2));
                focusedElement.click(); // 触发点击事件
                focusedButtons();
            }
        });

        auto_test_button.on("click", function () {
            clear_info();
            //查询软件是否有喷水和语音功能
            software_function();
            GUI.interval_add("setup_auto_test_gyro_fast", test_gyro, 50, true);
            GUI.interval_add("setup_auto_test_cliff_fast", test_cliff, 50, true);
            GUI.interval_add("setup_auto_test_fast", auto_test, 50, true);
            let timerIdCallGyro = setTimeout(() => {
                GUI.interval_remove("setup_auto_test_gyro_fast");
                isTestedGyro = true;
                once_test();
            }, 1000);
            timers.push(timerIdCallGyro);
            result_back();
        });

        $(".retest-btn a").on("click", function () {
            if (!$(this).hasClass("no-click")) {
                //先清空信息
                model_id = $(this).closest(".grid-row-content").attr("id");
                // console.log("==================================model_id:" + model_id);
                if (isEmptyObject(model_id) == false && undefined != model_id) {
                    if (model_id.indexOf("gyro") !== -1) {
                        updateDialogMessages(model_gyro_status, 0);
                        testResult[3] = 0;
                        gyroXData = [];
                        gyroYData = [];
                        gyroZData = [];
                        accXData = [];
                        accYData = [];
                        accZData = [];
                        GUI.interval_add("setup_auto_test_gyro_fast", test_gyro, 50, true);
                        setTimeout(function () {
                            GUI.interval_remove("setup_auto_test_gyro_fast");
                            isTestedGyro = true;
                        }, 1000);
                    } else if (model_id.indexOf("adpter") !== -1) {
                        testResult[0] = 0;
                        updateDialogMessages(model_adpter_status, 0);
                        test_adapter();
                    } else if (model_id.indexOf("fan") !== -1) {
                        testResult[1] = 0;
                        updateDialogMessages(model_fan_status, 0);
                        test_fan();
                    } else if (model_id.indexOf("motor") !== -1) {
                        testResult[2] = 0;
                        updateDialogMessages(model_motor_status, 0);
                        test_motor();
                    } else if (model_id.indexOf("cliff") !== -1) {
                        testResult[5] = 0;
                        cilffValue = [];
                        cilffHitValue = [];
                        updateDialogMessages(model_cliff_status, 0);
                        GUI.interval_add("setup_auto_test_cliff_fast", test_cliff, 50, true);
                        setTimeout(function () {
                            GUI.interval_remove("setup_auto_test_cliff_fast");
                            isTestedGyro = true;
                        }, 1000);
                    } else if (model_id.indexOf("waterpump") !== -1) {
                        testResult[4] = 0;
                        updateDialogMessages(model_waterpump_status, 0);
                        isAutoTest = false;
                        software_function();
                        test_waterpump();
                    } else if (model_id.indexOf("voice") !== -1) {
                        testResult[6] = 0;
                        updateDialogMessages(model_voice_status, 0);
                        isAutoTest = false;
                        software_function();
                        test_voice();
                    }
                    result_back(model_id);
                }
            }
        });

        yes_spray_btn.on("click", function () {
            testResult[4] = 2;
            updateDialogMessages(model_waterpump_status, 2);
            dialogConfirmUnderingTestSpary.close();
            if (isAutoTest) {
                test_voice();
            }
            result_back(model_id);
        });

        no_spary_btn.on("click", function () {
            testResult[4] = 3;
            updateDialogMessages(model_waterpump_status, 3);
            dialogConfirmUnderingTestSpary.close();
            if (isAutoTest) {
                test_voice();
            }
            result_back(model_id);
        });

        yes_voice_btn.on("click", function () {
            testResult[6] = 2;
            updateDialogMessages(model_voice_status, 2);
            dialogConfirmUnderingTestVoice.close();
            result_back(model_id);
        });
        no_voice_btn.on("click", function () {
            testResult[6] = 3;
            updateDialogMessages(model_voice_status, 3);
            dialogConfirmUnderingTestVoice.close();
            result_back(model_id);
        });

        function auto_test() {
            test_adapter();
            test_cliff();
        }
        function once_test() {
            test_waterpump();
            test_fan();
            test_motor();
        }

        function clear_info() {
            clearAllTimers();
            testResult = [0, 0, 0, 0, 0, 0, 0]; //index: 0适配器，1风机，2马达，3陀螺，4喷水，5光电，6语音；值代表的状态：0未测试，2测试通过，3测试失败
            gyroXData = [];
            gyroYData = [];
            gyroZData = [];
            accXData = [];
            accYData = [];
            accZData = [];
            model_id = undefined;

            cilffValue = [];
            cilffHitValue = [];

            isSprayFun = false; //是否有喷水功能
            isVoiceFun = false; //是否有语音功能

            isAutoTest = true;

            //先更新所有的状态为：未测试
            updateDialogMessages(model_gyro_status, 0);
            updateDialogMessages(model_adpter_status, 0);
            updateDialogMessages(model_fan_status, 0);
            updateDialogMessages(model_motor_status, 0);
            updateDialogMessages(model_cliff_status, 0);
            updateDialogMessages(model_waterpump_status, 0);
            updateDialogMessages(model_voice_status, 0);
            test_result_empty.removeClass("model-display");
            test_result_passed.addClass("model-display");
            test_result_failed.addClass("model-display");
        }

        function result_back(modelId) {
            let timerIdGyroResult = setTimeout(() => {
                if (isTestedGyro) {
                    //陀螺仪
                    if (modelId == model_gyro_status.attr("id") || modelId == undefined) {
                        if (testResult[3] == 2) {
                            updateDialogMessages(model_gyro_status, 2);
                        } else if (testResult[3] == 3) {
                            updateDialogMessages(model_gyro_status, 3);
                        }
                    }
                }
            }, 1010);
            timers.push(timerIdGyroResult);
            let timerIdOtherResult = setTimeout(() => {
                //适配器
                if (modelId == model_adpter_status.attr("id") || modelId == undefined) {
                    if (testResult[0] == 2) {
                        updateDialogMessages(model_adpter_status, 2);
                    } else if (testResult[0] == 3) {
                        updateDialogMessages(model_adpter_status, 3);
                    }
                }
                //风机
                if (modelId == model_fan_status.attr("id") || modelId == undefined) {
                    if (testResult[1] == 2) {
                        updateDialogMessages(model_fan_status, 2);
                    } else if (testResult[1] == 3) {
                        updateDialogMessages(model_fan_status, 3);
                    }
                }
                //马达
                if (modelId == model_motor_status.attr("id") || modelId == undefined) {
                    if (testResult[2] == 2) {
                        updateDialogMessages(model_motor_status, 2);
                    } else if (testResult[2] == 3) {
                        updateDialogMessages(model_motor_status, 3);
                    }
                }

                //光电开关最后判断
                if (modelId == model_cliff_status.attr("id") || modelId == undefined) {
                    // console.log("======================cilffValue[0]:" + cilffValue[0] + " || ===================cilffValue[1]:" + cilffValue[1]);
                    let exists_1 = cilffValue[0] == undefined ? true : cilffValue[0].includes(0);
                    let exists_0 = cilffValue[1] == undefined ? true : cilffValue[1].includes(1);

                    if (exists_1 || exists_0) {
                        testResult[5] = 3;
                        updateDialogMessages(model_cliff_status, 3);
                    } else {
                        testResult[5] = 2;
                        updateDialogMessages(model_cliff_status, 2);
                    }

                    //碰撞检测
                    if (FC.CONFIG.isCollision == 1) {
                        let c_exists_1 = cilffHitValue[0] == undefined ? true : cilffHitValue[0].includes(0);
                        let c_exists_0 = cilffHitValue[1] == undefined ? true : cilffHitValue[1].includes(1);
                        if (exists_1 || exists_0 || c_exists_1 || c_exists_0) {
                            testResult[5] = 3;
                            updateDialogMessages(model_cliff_status, 3);
                        } else {
                            testResult[5] = 2;
                            updateDialogMessages(model_cliff_status, 2);
                        }
                    }
                }
                //整体测试结果
                reverseTestResults();
            }, 3010);
            timers.push(timerIdOtherResult);
        }

        function software_function() {
            MSP.send_message(MSPCodes.MSP_GET_FUNCTION, false, false, function () {
                if (FC.OVOBOT_FUNCTION.isSprayFun == 1) {
                    isSprayFun = true;
                    //显示喷水模块
                    model_waterpump_status.closest(".grid-row").removeClass("model-display");
                } else {
                    isSprayFun = false;
                    testResult[4] = 2; //没有此功能时，默认测试通过
                    //关闭喷水模块
                    model_waterpump_status.closest(".grid-row").addClass("model-display");
                }
                if (FC.OVOBOT_FUNCTION.isVoiceFun == 1) {
                    isVoiceFun = true;
                    //显示语音模块
                    model_voice_status.closest(".grid-row").removeClass("model-display");
                } else {
                    isVoiceFun = false;
                    testResult[6] = 2;
                    //关闭语音模块
                    model_voice_status.closest(".grid-row").addClass("model-display");
                }
            });
        }

        //适配器检测
        function test_adapter() {
            updateDialogMessages(model_adpter_status, 1);
            MSP.send_message(MSPCodes.MSP_ADAPTER, false, false, function () {
                // console.log("======FC.ANALOG.adapter:"+FC.ANALOG.adapter);
                if (FC.ANALOG.adapter >= 18 && FC.ANALOG.adapter <= 26) {
                    testResult[0] = 2;
                } else {
                    testResult[0] = 3;
                }
            });
        }

        //风机检测
        function test_fan() {
            updateDialogMessages(model_fan_status, 1);
            //检测静态电流
            get_fan_motor(1);
            let timerIdFanOn = setTimeout(() => {
                // console.log("===============testResult[1]:" + testResult[1]);
                //风机动态电流检测
                if (testResult[1] == 2) {
                    //开启风机
                    MSP.send_message(MSPCodes.MSP_SET_FAN, [60], false, function () {
                        get_fan_motor(1);
                    });
                    //关闭风机
                    let timerIdFanOff = setTimeout(() => {
                        MSP.send_message(MSPCodes.MSP_SET_FAN, [0], false, function () {
                            get_fan_motor(1);
                        });
                    }, 2000);
                    timers.push(timerIdFanOff);
                }
            }, 100);
            timers.push(timerIdFanOn);
        }
        //马达检测
        function test_motor() {
            updateDialogMessages(model_motor_status, 1);

            //检测静态电流
            get_fan_motor(2);

            //马达动态电流检测
            let timerIdMotorPositive = setTimeout(() => {
                if (testResult[2] == 2) {
                    //马达正转
                    MSP.send_message(MSPCodes.MSP_SET_MOTOR, [1], false, function () {
                        get_fan_motor(2);
                    });
                    let timerIdMotorNegative = setTimeout(() => {
                        //马达反转
                        MSP.send_message(MSPCodes.MSP_SET_MOTOR, [2], false, function () {
                            get_fan_motor(2);
                        });
                    }, 1000);
                    timers.push(timerIdMotorNegative);
                    //关闭马达
                    let timerIdMotorOff = setTimeout(() => {
                        MSP.send_message(MSPCodes.MSP_SET_MOTOR, [0], false, function () {
                            get_fan_motor(2);
                        });
                    }, 2000);
                    timers.push(timerIdMotorOff);
                }
            }, 100);
            timers.push(timerIdMotorPositive);
        }
        //type:1风机；2马达
        function get_fan_motor(type) {
            //电流
            MSP.send_message(MSPCodes.MSP_ANALOG, false, false, function () {
                //风机电流

                if (type == 1 && (FC.ANALOG.fanAdc < 2500 || FC.ANALOG.fanAdc > 3100)) {
                    testResult[1] = 3;
                } else {
                    testResult[1] = 2;
                }
                //马达电流
                if (
                    type == 2 &&
                    (FC.ANALOG.leftMotorAdc < 2500 ||
                        FC.ANALOG.leftMotorAdc > 3100 ||
                        FC.ANALOG.rightMotorAdc < 2500 ||
                        FC.ANALOG.rightMotorAdc > 3100)
                ) {
                    testResult[2] = 3;
                } else {
                    testResult[2] = 2;
                }
            });
        }
        //陀螺仪检测
        function test_gyro() {
            //测试状态改变
            updateDialogMessages(model_gyro_status, 1);
            MSP.send_message(MSPCodes.MSP_RAW_IMU, false, false, function () {
                //写入数据
                gyroXData.push(FC.SENSOR_DATA.gyroscope[0]);
                gyroYData.push(FC.SENSOR_DATA.gyroscope[1]);
                gyroZData.push(FC.SENSOR_DATA.gyroscope[2]);

                accXData.push(FC.SENSOR_DATA.accelerometer[0]);
                accYData.push(FC.SENSOR_DATA.accelerometer[1]);
                accZData.push(FC.SENSOR_DATA.accelerometer[2]);

                if (
                    isErrorDtata(gyroXData, 20, -20) ||
                    isErrorDtata(gyroYData, 20, -20) ||
                    isErrorDtata(gyroZData, 20, -20) ||
                    isErrorDtata(accXData, 300, -300) ||
                    isErrorDtata(accYData, 300, -300) ||
                    isErrorDtata(accZData, 4396, 3797)
                ) {
                    //说明陀螺仪数据不对，测试失败
                    testResult[3] = 3;
                } else {
                    testResult[3] = 2;
                }
            });
        }
        function isErrorDtata(arr, maxValue, minValue) {
            // console.log("==========================arr[arr.length - 1]:" + arr[arr.length - 1]);
            if (areAllValuesSame(arr) || isDataRange(arr[arr.length - 1], maxValue, minValue) == false) {
                // console.log("==========================数据超出范围或相同");
                return true; //数据不对
            } else {
                return false;
            }
        }

        function areAllValuesSame(arr) {
            let resultArr = false;
            if (arr.length >= 2) {
                resultArr = arr.every((value) => value === arr[0]) && arr[arr.length - 2] == arr[arr.length - 1];
            } else {
                resultArr = true;
            }
            return resultArr;
        }
        function isDataRange(data, maxValue, minValue) {
            if (data < minValue || data > maxValue) {
                return false;
            } else {
                return true;
            }
        }

        function test_waterpump() {
            //调用喷水功能并弹出确认弹框
            updateDialogMessages(model_waterpump_status, 1);
            let timerIdWaterPunmp = setTimeout(() => {
                if (isSprayFun) {
                    //调用喷水
                    MSP.send_message(MSPCodes.MSP_SET_SPRAY, [1], false, function () {
                        dialogConfirmUnderingTestSpary.showModal();
                        // focused(".button-spray");
                        focusedButtons();
                    });
                } else {
                    updateDialogMessages(model_waterpump_status, 0);
                }
            }, 200);
            timers.push(timerIdWaterPunmp);
        }

        function test_voice() {
            updateDialogMessages(model_voice_status, 1);
            let timerIdVoice = setTimeout(() => {
                if (isVoiceFun) {
                    MSP.send_message(
                        MSPCodes.MSP_SET_AUTO_PLAY_VOICE,
                        [FC.OVOBOT_FUNCTION.voiceIndex],
                        false,
                        function () {
                            //显示弹框
                            dialogConfirmUnderingTestVoice.showModal();
                            focusedButtons();
                        },
                    );
                } else {
                    updateDialogMessages(model_voice_status, 0);
                }
            }, 200);
            timers.push(timerIdVoice);
        }

        //光电
        function test_cliff() {
            //测试状态改变
            updateDialogMessages(model_cliff_status, 1);
            MSP.send_message(MSPCodes.MSP_FOURCORNER, false, false, function () {
                const ul_data = bitIsZero(FC.ANALOG.corner, 3) ? 0 : 1;
                const ur_data = bitIsZero(FC.ANALOG.corner, 2) ? 0 : 1;
                const bl_data = bitIsZero(FC.ANALOG.corner, 1) ? 0 : 1;
                const br_data = bitIsZero(FC.ANALOG.corner, 0) ? 0 : 1;
                if (FC.ANALOG.corner == 0x0f) {
                    cilffValue[0] = [ul_data, ur_data, bl_data, br_data];
                }
                if (FC.ANALOG.corner == 0x00) {
                    cilffValue[1] = [ul_data, ur_data, bl_data, br_data];
                }
                // console.log("======================FC.ANALOG.corner:" + FC.ANALOG.corner);

                //碰撞检测
                if (FC.CONFIG.isCollision == 1) {
                    const c_ul_data = bitIsZero(FC.ANALOG.hitCorner, 3) ? 0 : 1;
                    const c_ur_data = bitIsZero(FC.ANALOG.hitCorner, 2) ? 0 : 1;
                    const c_bl_data = bitIsZero(FC.ANALOG.hitCorner, 1) ? 0 : 1;
                    const c_br_data = bitIsZero(FC.ANALOG.hitCorner, 0) ? 0 : 1;
                    if (FC.ANALOG.hitCorner == 0x0f) {
                        cilffHitValue[0] = [c_ul_data, c_ur_data, c_bl_data, c_br_data];
                    }
                    if (FC.ANALOG.hitCorner == 0x00) {
                        cilffHitValue[1] = [c_ul_data, c_ur_data, c_bl_data, c_br_data];
                    }
                }
            });
        }

        function bitIsZero(x, bitIndex) {
            return ((x >> bitIndex) & 1) == 1 ? false : true;
        }

        //status 四个状态 0未测试,1测试中,2测试通过,3测试失败
        //testModelStatus 两个状态 0静态-messages不需要；1动态；
        function updateDialogMessages(model, status) {
            if (model != null) {
                status == 0
                    ? model.find(".not-tested").removeClass("model-display")
                    : model.find(".not-tested").addClass("model-display");
                status == 1
                    ? model.find(".under-testing").removeClass("model-display")
                    : model.find(".under-testing").addClass("model-display");
                status == 2
                    ? model.find(".test-passed").removeClass("model-display")
                    : model.find(".test-passed").addClass("model-display");
                status == 3
                    ? model.find(".test-failed").removeClass("model-display")
                    : model.find(".test-failed").addClass("model-display");
                switch (status) {
                    case 0:
                        model.find("a").removeClass("no-click");
                        break;
                    case 1:
                        model.find("a").addClass("no-click");
                        break;
                    case 2:
                        model.find("a").addClass("no-click");
                        break;
                    case 3:
                        model.find("a").removeClass("no-click");
                        break;
                    default:
                        break;
                }
            }
        }
        // 清除所有定时器
        function clearAllTimers() {
            timers.forEach((timerId) => clearTimeout(timerId));
            timers = []; // 清空数组，防止重复清除
        }

        function reverseTestResults() {
            if (testResult.includes(3)) {
                //测试失败
                test_result_empty.addClass("model-display");
                test_result_failed.removeClass("model-display");
                test_result_passed.addClass("model-display");
            } else if (testResult.includes(1) || testResult.includes(0)) {
                //说明存在未测试项,暂不写入结果
                test_result_empty.removeClass("model-display");
                test_result_passed.addClass("model-display");
                test_result_failed.addClass("model-display");
            } else {
                test_result_empty.addClass("model-display");
                test_result_passed.removeClass("model-display");
                test_result_failed.addClass("model-display");
            }
            GUI.interval_remove("setup_auto_test_fast");
            GUI.interval_remove("setup_auto_test_cliff_fast");
            GUI.interval_add("setup_getRec_fast", getRec, 500, true);
        }
        function getRec() {
            MSP.callbacks = [];
            MSP.send_message(MSPCodes.CMD_BUILD_INFO, false, false, function (obj) {
                if (pingValue == 0) {
                    //未赋值前为上一次的值,上一次值为0，说明换过板子，不为0说明没有换过板子，不需要自动再次测试（否则会陷入死循环）
                    if (!GUI.connected_to) {
                        connectDisconnect();
                    }

                    pingValue = FC.CONFIG.buildInfo;
                    if (pingValue != 0) {
                        GUI.interval_remove("setup_getRec_fast");
                        auto_test_button.trigger("click");
                    }
                }
            });
        }

        function clickAutoTestBtn() {
            GUI.interval_add("setup_getRec_fast", getRec, 500, true);
        }
        setTimeout(function () {
            clickAutoTestBtn();
        }, 100);

        GUI.content_ready(callback);
    }
};

auto_test.cleanup = function (callback) {
    if (callback) callback();
};

TABS.auto_test = auto_test;
export { auto_test };
