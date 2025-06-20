//MSPCodes needs to be re-integrated inside MSP object
const MSPCodes = {
    CMD_VERSION:2,
    MSP_FC_VERSION: 3,
    MSP_BOARD_INFO: 4,
    CMD_BUILD_INFO: 5,

    MSP_NAME: 10, // DEPRECATED IN MSP 1.45
    MSP_SET_NAME: 11, // DEPRECATED IN MSP 1.45

    MSP_BATTERY_CONFIG: 32,
    MSP_SET_BATTERY_CONFIG: 33,
    MSP_MODE_RANGES: 34,
    MSP_SET_MODE_RANGE: 35,
    MSP_FEATURE_CONFIG: 36,
    MSP_SET_FEATURE_CONFIG: 37,
    MSP_BOARD_ALIGNMENT_CONFIG: 38,
    MSP_SET_BOARD_ALIGNMENT_CONFIG: 39,
    MSP_CURRENT_METER_CONFIG: 40,
    MSP_SET_CURRENT_METER_CONFIG: 41,
    MSP_MIXER_CONFIG: 42,
    MSP_SET_MIXER_CONFIG: 43,
    MSP_RX_CONFIG: 44,
    MSP_SET_RX_CONFIG: 45,
    MSP_LED_COLORS: 46,
    MSP_SET_LED_COLORS: 47,
    MSP_LED_STRIP_CONFIG: 48,
    MSP_SET_LED_STRIP_CONFIG: 49,
    MSP_RSSI_CONFIG: 50,
    MSP_SET_RSSI_CONFIG: 51,
    MSP_ADJUSTMENT_RANGES: 52,
    MSP_SET_ADJUSTMENT_RANGE: 53,
    MSP_CF_SERIAL_CONFIG: 54,
    MSP_SET_CF_SERIAL_CONFIG: 55,
    MSP_VOLTAGE_METER_CONFIG: 56,
    MSP_SET_VOLTAGE_METER_CONFIG: 57,
    MSP_SONAR: 58, // notice, in firmware named as MSP_SONAR_ALTITUDE
    MSP_PID_CONTROLLER: 59,
    MSP_SET_PID_CONTROLLER: 60,
    MSP_ARMING_CONFIG: 61,
    MSP_SET_ARMING_CONFIG: 62,
    MSP_RX_MAP: 64,
    MSP_SET_RX_MAP: 65,
    MSP_BF_CONFIG: 66, // DEPRECATED
    MSP_SET_BF_CONFIG: 67, // DEPRECATED
    MSP_SET_REBOOT: 68,
    MSP_BF_BUILD_INFO: 69, // Not used
    MSP_DATAFLASH_SUMMARY: 70,
    MSP_DATAFLASH_READ: 71,
    MSP_DATAFLASH_ERASE: 72,
    MSP_LOOP_TIME: 73,
    MSP_SET_LOOP_TIME: 74,
    MSP_FAILSAFE_CONFIG: 75,
    MSP_SET_FAILSAFE_CONFIG: 76,
    MSP_RXFAIL_CONFIG: 77,
    MSP_SET_RXFAIL_CONFIG: 78,
    MSP_SDCARD_SUMMARY: 79,
    MSP_BLACKBOX_CONFIG: 80,
    MSP_SET_BLACKBOX_CONFIG: 81,
    MSP_TRANSPONDER_CONFIG: 82,
    MSP_SET_TRANSPONDER_CONFIG: 83,
    MSP_OSD_CONFIG: 84,
    MSP_SET_OSD_CONFIG: 85,
    MSP_OSD_CHAR_READ: 86,
    MSP_OSD_CHAR_WRITE: 87,
    MSP_VTX_CONFIG: 88,
    MSP_SET_VTX_CONFIG: 89,
    MSP_ADVANCED_CONFIG: 90,
    MSP_SET_ADVANCED_CONFIG: 91,
    MSP_FILTER_CONFIG: 92,
    MSP_SET_FILTER_CONFIG: 93,
    MSP_PID_ADVANCED: 94,
    MSP_SET_PID_ADVANCED: 95,
    MSP_SENSOR_CONFIG: 96,
    MSP_SET_SENSOR_CONFIG: 97,
    //MSP_SPECIAL_PARAMETERS:         98, // DEPRECATED
    MSP_ARMING_DISABLE: 99,
    //MSP_SET_SPECIAL_PARAMETERS:     99, // DEPRECATED
    //MSP_IDENT:                      100, // DEPRECTED
    MSP_STATUS: 101,
    MSP_RAW_IMU: 102,
    MSP_SERVO: 103,
    MSP_MOTOR: 104,
    MSP_RC: 105,
    MSP_RAW_GPS: 106,
    MSP_COMP_GPS: 107,
    MSP_ATTITUDE: 108,
    MSP_ALTITUDE: 109,
    MSP_ANALOG: 110,
    MSP_ADAPTER: 111,
    MSP_FOURCORNER: 112,
    //MSP_BOX:                        113, // DEPRECATED
    MSP_WATER_BOX: 114, // DEPRECATED
    MSP_BOXNAMES: 116,
    MSP_PIDNAMES: 117,
    MSP_WP: 118, // Not used
    // MSP_BOXIDS: 119,
    MSP_SERVO_CONFIGURATIONS: 120,
    MSP_MOTOR_3D_CONFIG: 124,
    MSP_RC_DEADBAND: 125,
    MSP_SENSOR_ALIGNMENT: 126,
    MSP_LED_STRIP_MODECOLOR: 127,

    MSP_VOLTAGE_METERS: 128,
    MSP_CURRENT_METERS: 129,
    MSP_BATTERY_STATE: 130,
    MSP_MOTOR_CONFIG: 131,
    MSP_GPS_CONFIG: 132,
    MSP_COMPASS_CONFIG: 133,
    MSP_GPS_RESCUE: 135,

    MSP_VTXTABLE_BAND: 137,
    MSP_VTXTABLE_POWERLEVEL: 138,

    MSP_MOTOR_TELEMETRY: 139,

    // MSP_SIMPLIFIED_TUNING: 140,
    // MSP_SET_SIMPLIFIED_TUNING: 141,

    // MSP_CALCULATE_SIMPLIFIED_PID: 142, // calculate slider values in temp profile
    // MSP_CALCULATE_SIMPLIFIED_GYRO: 143,
    // MSP_CALCULATE_SIMPLIFIED_DTERM: 144,

    MSP_VALIDATE_SIMPLIFIED_TUNING: 145, // validate slider values in temp profile

    MSP_STATUS_EX: 150,

    MSP_UID: 160,
    MSP_GPS_SV_INFO: 164,

    MSP_DISPLAYPORT: 182,

    MSP_COPY_PROFILE: 183,

    MSP_BEEPER_CONFIG: 184,
    MSP_SET_BEEPER_CONFIG: 185,

    MSP_SET_OSD_CANVAS: 188,
    MSP_OSD_CANVAS: 189,

    MSP_SET_RAW_RC: 200,
    MSP_SET_RAW_GPS: 201, // Not used
    MSP_SET_PID: 202,
    //MSP_SET_BOX:                    203, // DEPRECATED
    MSP_SET_RC_TUNING: 204,
    MSP_ACC_CALIBRATION: 205,
    MSP_MAG_CALIBRATION: 206,
    MSP_SET_MISC: 207, // DEPRECATED
    MSP_PLAY_VOICE: 208,
    MSP_SET_SPRAY: 209, // Not used
    MSP_SELECT_SETTING: 210,
    MSP_SET_FAN: 211, // Not used
    MSP_SET_SERVO_CONFIGURATION: 212,
    MSP_SET_MOTOR: 214,
    MSP_SET_MOTOR_3D_CONFIG: 217,
    MSP_SET_RC_DEADBAND: 218,
    MSP_SET_RESET_CURR_PID: 219,
    // MSP_SET_SENSOR_ALIGNMENT: 220,
    // MSP_SET_LED_STRIP_MODECOLOR: 221,
    // MSP_SET_MOTOR_CONFIG: 222,
    // MSP_SET_GPS_CONFIG: 223,
    // MSP_SET_COMPASS_CONFIG: 224,
    // MSP_SET_GPS_RESCUE: 225,

    MSP_SET_VTXTABLE_BAND: 227,
    MSP_SET_VTXTABLE_POWERLEVEL: 228,

    MSP_MULTIPLE_MSP: 230,

    MSP_MODE_RANGES_EXTRA: 238,
    MSP_SET_ACC_TRIM: 239,
    MSP_ACC_TRIM: 240,
    MSP_SERVO_MIX_RULES: 241,
    MSP_SET_SERVO_MIX_RULE: 242, // Not used
    MSP_SET_4WAY_IF: 245, // Not used
    MSP_SET_RTC: 246,
    MSP_RTC: 247, // Not used
    MSP_SET_BOARD_INFO: 248, // Not used
    MSP_SET_SIGNATURE: 249, // Not used

    MSP_EEPROM_WRITE: 250,
    MSP_DEBUGMSG: 253, // Not used
    MSP_DEBUG: 254,

    // MSPv2 Common
    MSP2_COMMON_SERIAL_CONFIG: 0x1009,
    MSP2_COMMON_SET_SERIAL_CONFIG: 0x100a,

    // MSPv2 Ovobot specific
    MSP2_Ovobot_BIND: 0x3000,
    MSP2_MOTOR_OUTPUT_REORDERING: 0x3001,
    MSP2_SET_MOTOR_OUTPUT_REORDERING: 0x3002,
    MSP2_SEND_DSHOT_COMMAND: 0x3003,
    MSP2_GET_VTX_DEVICE_STATUS: 0x3004,
    MSP2_GET_OSD_WARNINGS: 0x3005,
    MSP2_GET_TEXT: 0x3006,
    MSP2_SET_TEXT: 0x3007,
    MSP2_GET_LED_STRIP_CONFIG_VALUES: 0x3008,
    MSP2_SET_LED_STRIP_CONFIG_VALUES: 0x3009,
    MSP2_SENSOR_CONFIG_ACTIVE: 0x300a,
    MSP2_MCU_INFO: 0x300c,

    // MSP2_GET_TEXT and MSP2_SET_TEXT variable types
    PILOT_NAME: 1,
    CRAFT_NAME: 2,
    PID_PROFILE_NAME: 3,
    RATE_PROFILE_NAME: 4,
    BUILD_KEY: 5,

    MSP_WIFI_RSSI: 115,
    MSP_BARO_DIFF: 119,//气压值
    MSP_MOTOR_CURRENT: 123,//马达实际电流

    //GET
    MSP_GET_PWMVALUE: 130,
    MSP_GET_USE_FAN_LEVEL_DYNAMIC_COMP: 131,
    MSP_GET_USE_FAN_OUTPUT_PID: 132,
    MSP_GET_MOTOR_VALUE: 133,
    MSP_GET_BOUNDLESS: 134,
    MSP_GET_SPRAY_VALUE: 135,
    MSP_GET_GYRO_THRESHOLD: 136,

    //SET
    MSP_SET_PWMVALUE: 220,
    MSP_SET_USE_FAN_LEVEL_DYNAMIC_COMP: 221,
    MSP_SET_USE_FAN_OUTPUT_PID: 222,
    MSP_SET_MOTOR_VALUE: 223,
    MSP_SET_BOUNDLESS: 224,
    MSP_SET_SPRAY_VALUE: 225,
    MSP_SET_GYRO_THRESHOLD: 226,

    //pid调试
    MSP_GET_FAN_PID: 140,
    MSP_SET_FAN_PID: 141,
    MSP_GET_FAN_PID_VALUE: 142,

    //电池
    MSP_GET_BATTERY: 146,
    //记录自动测试结果
    MSP_SET_AUTO_TEST_RESULT: 147,
    MSP_GET_AUTO_TEST_RESULT: 148,

    MSP_GET_FUNCTION: 151,
    MSP_SET_AUTO_PLAY_VOICE: 152,
};

export default MSPCodes;
