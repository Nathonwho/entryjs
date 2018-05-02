'use strict';

if (typeof global.Entry !== 'object') {
    global.Entry = {};
}


if (typeof exports == 'object') {
    /* IGNORE_WEBPACK:START */
    var Lang = require('../../extern/lang/ko.js').Lang;
    global.Lang = Lang;
    /* IGNORE_WEBPACK:END */
    if (typeof EntryStatic !== 'object') {
        global.EntryStatic = {};
    }
}

if (!Entry.block) {
    Entry.block = {};
}

if (!Entry.block.converters) {
    Entry.block.converters = {};
}

if (Entry && Entry.block) {
    (function(c) {
        c.keyboardCode = function(key, value) {
            var code;

            if (key) code = key.toUpperCase();

            var map = {
                32: 'space',
                13: 'enter',
                38: 'up',
                37: 'left',
                39: 'right',
                40: 'down',
            };

            code = map[value] || code || value;
            if (!Entry.Utils.isNumber(code)) {
                return '"()"'.replace('()', code);
            } else return '"()"'.replace('"()"', code);
        };

        c.returnStringKey = function(key, value) {
            if ((!value && typeof value !== 'number') || value === 'null')
                return 'None';
            key = String(key);
            if (value === 'mouse') key = 'mouse';

            var name = Entry.TextCodingUtil.dropdownDynamicIdToNameConvertor(
                value,
                this.menuName
            );
            if (name) key = name;
            if (this.codeMap) var codeMap = eval(this.codeMap);
            var codeMapKey = value;
            if (codeMap) {
                var codeMapValue = codeMap[codeMapKey];
                if (codeMapValue) key = codeMapValue;
            }

            key = key.replace(/\"/gi, '');
            return '"()"'.replace('()', key);
        };

        c.returnRawStringKey = function(key, value) {
            if ((!value && typeof value !== 'number') || value === 'null')
                return 'None';
            key = String(key);
            if (value === 'mouse') key = value;
            var name = Entry.TextCodingUtil.dropdownDynamicIdToNameConvertor(
                value,
                this.menuName
            );
            if (name) key = name;
            key = key.replace(/\"/gi, '');
            return '"()"'.replace('"()"', key);
        };

        c.returnStringValue = function(key, value) {
            if ((!value && typeof value !== 'number') || value === 'null')
                return 'None';

            if (this.codeMap) var codeMap = eval(this.codeMap);
            var codeMapKey = value;
            if (codeMap) {
                var codeMapValue = codeMap[codeMapKey];
                if (codeMapValue) value = codeMapValue;
            }
            return '"()"'.replace('()', value);
        };

        c.returnOperator = function(key, value) {
            var map = {
                EQUAL: '==',
                GREATER: '>',
                LESS: '<',
                GREATER_OR_EQUAL: '>=',
                LESS_OR_EQUAL: '<=',
                PLUS: '+',
                MINUS: '-',
                MULTI: '*',
                DIVIDE: '/',
                '==': 'EQUAL',
                '>': 'GREATER',
                '<': 'LESS',
                '>=': 'GREATER_OR_EQUAL',
                '<=': 'LESS_OR_EQUAL',
                '+': 'PLUS',
                '-': 'MINUS',
                '*': 'MULTI',
                '/': 'DIVIDE',
                AND: 'and',
                OR: 'or',
            };
            return map[value];
        };

        c.returnRawNumberValueByKey = function(key, value) {
            //return String(key).replace(/\D/, '');
            return key;
        };

        c.returnStringOrNumberByValue = function(key, value) {
            if (!Entry.Utils.isNumber(value)) {
                value = value.replace(/\"/gi, '');
                return '"()"'.replace('()', value);
            } else return value;
        };

        c.returnObjectOrStringValue = function(key, value) {
            if (Entry.container && Entry.container.getObject(value)) {
                var objectName = Entry.container.getObject(value).name;
                return '"()"'.replace('()', objectName);
            } else {
                if (this.codeMap) var codeMap = eval(this.codeMap);
                var codeMapKey = value;
                if (codeMap) {
                    var codeMapValue = codeMap[codeMapKey];
                    if (codeMapValue) value = codeMapValue;
                }
                value = value.replace(/\"/gi, '');
                return '"()"'.replace('()', value);
            }
        };

        c.returnStringValueUpperCase = function(key, value) {
            if (this.codeMap) var codeMap = eval(this.codeMap);
            var codeMapKey = value;
            if (codeMap) {
                var codeMapValue = codeMap[codeMapKey];
                if (codeMapValue) value = codeMapValue;
            }
            return '"()"'.replace('()', value).toUpperCase();
        };

        c.returnValueUpperCase = function(key, value) {
            if (this.codeMap) var codeMap = eval(this.codeMap);
            var codeMapKey = value;
            if (codeMap) {
                var codeMapValue = codeMap[codeMapKey];
                if (codeMapValue) value = codeMapValue;
            }
            return value.toUpperCase();
        };

        c.returnStringValueLowerCase = function(key, value) {
            if (this.codeMap) var codeMap = eval(this.codeMap);
            var codeMapKey = value;
            if (codeMap) {
                var codeMapValue = codeMap[codeMapKey];
                if (codeMapValue) value = codeMapValue;
            }
            return '"()"'.replace('()', value).toLowerCase();
        };

        c.returnValuePartialUpperCase = function(key, value) {
            if (this.codeMap) var codeMap = eval(this.codeMap);
            var codeMapKey = value;
            if (codeMap) {
                var codeMapValue = codeMap[codeMapKey];
                if (codeMapValue) value = codeMapValue;
            }
            var dot = value.indexOf('.') + 1;
            if (dot > 1) {
                return (
                    value.charAt(0).toUpperCase() +
                    value.substring(1, dot) +
                    value.substring(dot).toUpperCase()
                );
            } else {
                return value.toUpperCase();
            }
        };
    })(Entry.block.converters);
}

const blocks = require('./blocks');

const block = {
    //region hardware 하드웨어 기본
    arduino_download_connector: {
        skeleton: 'basic_button',
        isNotFor: ['arduinoDisconnected'],
        color: '#eee',
        params: [
            {
                type: 'Text',
                text: !Entry.isOffline
                    ? Lang.Blocks.ARDUINO_download_connector
                    : Lang.Blocks.ARDUINO_open_connector,
                color: '#333',
                align: 'center',
            },
        ],
        events: {
            mousedown: [
                function() {
                    Entry.hw.downloadConnector();
                },
            ],
        },
    },
    download_guide: {
        skeleton: 'basic_button',
        isNotFor: ['arduinoDisconnected'],
        color: '#eee',
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.download_guide,
                color: '#333',
                align: 'center',
            },
        ],
        events: {
            mousedown: [
                function() {
                    Entry.hw.downloadGuide();
                },
            ],
        },
    },
    arduino_download_source: {
        skeleton: 'basic_button',
        isNotFor: ['arduinoDisconnected'],
        color: '#eee',
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.ARDUINO_download_source,
                color: '#333',
                align: 'center',
            },
        ],
        events: {
            mousedown: [
                function() {
                    Entry.hw.downloadSource();
                },
            ],
        },
    },
    arduino_connected: {
        skeleton: 'basic_button',
        color: '#eee',
        isNotFor: ['arduinoConnected'],
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.ARDUINO_connected,
                color: '#333',
                align: 'center',
            },
        ],
        events: {},
    },
    arduino_connect: {
        skeleton: 'basic_button',
        color: '#eee',
        isNotFor: ['arduinoConnect'],
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.ARDUINO_connect,
                color: '#333',
                align: 'center',
            },
        ],
        events: {},
    },
    arduino_reconnect: {
        skeleton: 'basic_button',
        color: '#eee',
        isNotFor: ['arduinoDisconnected'],
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.ARDUINO_reconnect,
                color: '#333',
                align: 'center',
            },
        ],
        events: {
            mousedown: [
                function() {
                    Entry.hw.retryConnect();
                },
            ],
        },
    },
    robot_reconnect: {
        skeleton: 'basic_button',
        color: '#eee',
        isNotFor: ['arduinoDisconnected'],
        template: '%1',
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.ROBOT_reconnect,
                color: '#333',
                align: 'center',
            },
        ],
        events: {
            mousedown: [
                function() {
                    Entry.hw.retryConnect();
                },
            ],
        },
    },
    arduino_open: {
        skeleton: 'basic_button',
        color: '#eee',
        isNotFor: ['arduinoDisconnected'],
        template: '%1',
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.ARDUINO_open_connector,
                color: '#333',
                align: 'center',
            },
        ],
        events: {
            mousedown: [
                function() {
                    Entry.hw.openHardwareProgram();
                },
            ],
        },
    },
    arduino_cloud_pc_open: {
        skeleton: 'basic_button',
        color: '#eee',
        isNotFor: ['arduinoConnect', 'arduinoConnected'],
        template: '%1',
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.ARDUINO_cloud_pc_connector,
                color: '#333',
                align: 'center',
            },
        ],
        events: {
            mousedown: [
                function() {
                    Entry.hw.openHardwareProgram();
                },
            ],
        },
    },
    //endregion hardware 하드웨어 기본
    //region basic 기본블록
    change_opacity: {
        color: '#FF9E20',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/brush_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['10'],
                },
                null,
            ],
            type: 'change_opacity',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'brush_opacity',
        isNotFor: ['textBox'],
        func: function(sprite, script) {
            var opacity = script.getNumberValue('VALUE', script);

            if (!sprite.brush || !sprite.shapes.length) {
                Entry.setBasicBrush(sprite);
                sprite.brush.stop = true;
            }
            opacity = Entry.adjustValueWithMaxMin(
                sprite.brush.opacity + opacity,
                0,
                100
            );

            if (sprite.brush) {
                sprite.brush.opacity = opacity;
                sprite.brush.endStroke();
                var rgb = sprite.brush.rgb;
                sprite.brush.beginStroke(
                    'rgba(' +
                        rgb.r +
                        ',' +
                        rgb.g +
                        ',' +
                        rgb.b +
                        ',' +
                        sprite.brush.opacity / 100 +
                        ')'
                );
                sprite.brush.moveTo(sprite.getX(), sprite.getY() * -1);
            }

            return script.callReturn();
        },
        syntax: { js: [], py: [''] },
    },
    set_opacity: {
        color: '#FF9E20',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/brush_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['50'],
                },
                null,
            ],
            type: 'set_opacity',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'brush_opacity',
        isNotFor: ['textBox'],
        func: function(sprite, script) {
            var opacity = script.getNumberValue('VALUE', script);

            if (!sprite.brush || !sprite.shapes.length) {
                Entry.setBasicBrush(sprite);
                sprite.brush.stop = true;
            }

            if (sprite.brush) {
                sprite.brush.opacity = Entry.adjustValueWithMaxMin(
                    opacity,
                    0,
                    100
                );
                sprite.brush.endStroke();
                var rgb = sprite.brush.rgb;
                sprite.brush.beginStroke(
                    'rgba(' +
                        rgb.r +
                        ',' +
                        rgb.g +
                        ',' +
                        rgb.b +
                        ',' +
                        sprite.brush.opacity / 100 +
                        ')'
                );
                sprite.brush.moveTo(sprite.getX(), sprite.getY() * -1);
            }

            return script.callReturn();
        },
        syntax: { js: [], py: [''] },
    },
    number: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'TextInput',
                value: 10,
            },
        ],
        events: {},
        def: {
            params: [],
        },
        paramsKeyMap: {
            NUM: 0,
        },
        func: function(sprite, script) {
            return script.getField('NUM', script);
        },
        isPrimitive: true,
        syntax: {
            js: ['Scope', '%1'],
            py: [
                {
                    syntax: '%1',
                    keyOption: 'number',
                    textParams: [
                        {
                            type: 'TextInput',
                            converter:
                                Entry.block.converters
                                    .returnStringOrNumberByValue,
                        },
                    ],
                },
            ],
        },
    },
    angle: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Angle',
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'angle',
        },
        paramsKeyMap: {
            ANGLE: 0,
        },
        func: function(sprite, script) {
            return script.getNumberField('ANGLE');
        },
        isPrimitive: true,
        syntax: {
            js: [],
            py: [
                {
                    syntax: '%1',
                    keyOption: 'angle',
                    textParams: [
                        {
                            type: 'Angle',
                            converter:
                                Entry.block.converters
                                    .returnRawNumberValueByKey,
                        },
                    ],
                },
            ],
        },
    },
    get_x_coordinate: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.CALC_get_x_coordinate,
                color: '#3D3D3D',
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'get_x_coordinate',
        },
        class: 'calc',
        isNotFor: [],
        func: function(sprite, script) {
            return sprite.getX();
        },
        syntax: { js: [], py: [''] },
    },
    get_y_coordinate: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.CALC_get_y_coordinate,
                color: '#3D3D3D',
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'get_y_coordinate',
        },
        class: 'calc',
        isNotFor: [],
        func: function(sprite, script) {
            return sprite.getY();
        },
        syntax: { js: [], py: [''] },
    },
    get_angle: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.CALC_get_angle,
                color: '#3D3D3D',
            },
        ],
        events: {},
        def: {
            params: [null],
        },
        func: function(sprite, script) {
            return parseFloat(sprite.getRotation().toFixed(1));
        },
        syntax: { js: [], py: [''] },
    },
    get_rotation_direction: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.CALC_rotation_value, 'ROTATION'],
                    [Lang.Blocks.CALC_direction_value, 'DIRECTION'],
                ],
                value: 'ROTATION',
                fontSize: 11,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'get_rotation_direction',
        },
        paramsKeyMap: {
            OPERATOR: 0,
        },
        class: 'calc',
        isNotFor: [],
        func: function(sprite, script) {
            var o = script.getField('OPERATOR', script);
            if (o.toUpperCase() == 'DIRECTION')
                return parseFloat(sprite.getDirection().toFixed(1));
            else return parseFloat(sprite.getRotation().toFixed(1));
        },
        syntax: { js: [], py: [''] },
    },
    calc_plus: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Text',
                text: '+',
                color: '#3D3D3D',
            },
            {
                type: 'Block',
                accept: 'string',
            },
        ],
        events: {},
        def: {
            params: [null],
        },
        paramsKeyMap: {
            LEFTHAND: 0,
            RIGHTHAND: 2,
        },
        func: function(sprite, script) {
            var leftValue = script.getNumberValue('LEFTHAND', script);
            var rightValue = script.getNumberValue('RIGHTHAND', script);
            return leftValue + rightValue;
        },
        syntax: { js: [], py: [''] },
    },
    calc_minus: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Text',
                text: '-',
                color: '#3D3D3D',
            },
            {
                type: 'Block',
                accept: 'string',
            },
        ],
        events: {},
        def: {
            params: [null],
        },
        paramsKeyMap: {
            LEFTHAND: 0,
            RIGHTHAND: 2,
        },
        func: function(sprite, script) {
            var leftValue = script.getNumberValue('LEFTHAND', script);
            var rightValue = script.getNumberValue('RIGHTHAND', script);
            return leftValue - rightValue;
        },
        syntax: { js: [], py: [''] },
    },
    calc_times: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Text',
                text: 'x',
                color: '#3D3D3D',
            },
            {
                type: 'Block',
                accept: 'string',
            },
        ],
        events: {},
        def: {
            params: [null],
        },
        paramsKeyMap: {
            LEFTHAND: 0,
            RIGHTHAND: 2,
        },
        func: function(sprite, script) {
            var leftValue = script.getNumberValue('LEFTHAND', script);
            var rightValue = script.getNumberValue('RIGHTHAND', script);
            return leftValue * rightValue;
        },
        syntax: { js: [], py: [''] },
    },
    calc_divide: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Text',
                text: '/',
                color: '#3D3D3D',
            },
            {
                type: 'Block',
                accept: 'string',
            },
        ],
        events: {},
        def: {
            params: [null],
        },
        paramsKeyMap: {
            LEFTHAND: 0,
            RIGHTHAND: 2,
        },
        func: function(sprite, script) {
            var leftValue = script.getNumberValue('LEFTHAND', script);
            var rightValue = script.getNumberValue('RIGHTHAND', script);
            return leftValue / rightValue;
        },
        syntax: { js: [], py: [''] },
    },
    calc_mod: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Text',
                text: '/',
                color: '#3D3D3D',
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Text',
                text: Lang.Blocks.CALC_calc_mod_3,
                color: '#3D3D3D',
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['10'],
                },
                null,
                {
                    type: 'number',
                    params: ['10'],
                },
                null,
            ],
            type: 'calc_mod',
        },
        paramsKeyMap: {
            LEFTHAND: 0,
            RIGHTHAND: 2,
        },
        class: 'calc',
        isNotFor: [],
        func: function(sprite, script) {
            var leftValue = script.getNumberValue('LEFTHAND', script);
            var rightValue = script.getNumberValue('RIGHTHAND', script);
            return leftValue % rightValue;
        },
        syntax: { js: [], py: ['Entry.get_remainder(%1, %3)'] },
    },
    calc_share: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Text',
                text: '/',
                color: '#3D3D3D',
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Text',
                text: '의 몫',
                color: '#3D3D3D',
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['10'],
                },
                null,
                {
                    type: 'number',
                    params: ['10'],
                },
                null,
            ],
            type: 'calc_share',
        },
        paramsKeyMap: {
            LEFTHAND: 0,
            RIGHTHAND: 2,
        },
        class: 'calc',
        isNotFor: [],
        func: function(sprite, script) {
            var leftValue = script.getNumberValue('LEFTHAND', script);
            var rightValue = script.getNumberValue('RIGHTHAND', script);
            return Math.floor(leftValue / rightValue);
        },
        syntax: { js: [], py: [''] },
    },
    reset_project_timer: {
        color: '#FFD974',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Text',
                text: '초시계 초기화',
                color: '#3D3D3D',
            },
        ],
        events: {
            viewAdd: [
                function() {
                    if (Entry.engine) Entry.engine.showProjectTimer();
                },
            ],
            viewDestroy: [
                function(block, notIncludeSelf) {
                    if (Entry.engine)
                        Entry.engine.hideProjectTimer(block, notIncludeSelf);
                },
            ],
        },
        def: {
            params: [null],
            type: 'reset_project_timer',
        },
        class: 'calc_timer',
        isNotFor: [],
        func: function(sprite, script) {
            Entry.engine.updateProjectTimer(0);
            return script.callReturn();
        },
        syntax: { js: [], py: [''] },
    },
    set_visible_project_timer: {
        color: '#FFD974',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.CALC_timer_visible_1,
                color: '#000',
            },
            {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.CALC_timer_visible_show, 'SHOW'],
                    [Lang.Blocks.CALC_timer_visible_hide, 'HIDE'],
                ],
                value: 'SHOW',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_CALC,
            },
            {
                type: 'Text',
                text: Lang.Blocks.CALC_timer_visible_2,
                color: '#000',
            },
            {
                type: 'Indicator',
                img: 'block_icon/calc_01.png',
                size: 12,
            },
        ],
        events: {
            viewAdd: [
                function() {
                    if (Entry.engine) Entry.engine.showProjectTimer();
                },
            ],
            viewDestroy: [
                function(block, notIncludeSelf) {
                    if (Entry.engine)
                        Entry.engine.hideProjectTimer(block, notIncludeSelf);
                },
            ],
        },
        def: {
            params: [null, 'HIDE', null, null],
            type: 'set_visible_project_timer',
        },
        pyHelpDef: {
            params: [null, 'A&value', null, null],
            type: 'set_visible_project_timer',
        },
        paramsKeyMap: {
            ACTION: 1,
        },
        class: 'calc_timer',
        isNotFor: [],
        func: function(sprite, script) {
            var action = script.getField('ACTION');
            var timer = Entry.engine.projectTimer;
            if (action == 'SHOW') timer.setVisible(true);
            else timer.setVisible(false);

            return script.callReturn();
        },
        syntax: {
            js: [],
            py: [
                {
                    template: '%1 %2 %3',
                    syntax: 'Entry.timer_view(%2)',
                    textParams: [
                        {
                            type: 'Text',
                            text: 'Entry.timer_view(',
                            color: '#000',
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.CALC_timer_visible_show, 'SHOW'],
                                [Lang.Blocks.CALC_timer_visible_hide, 'HIDE'],
                            ],
                            value: 'SHOW',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_CALC,
                            converter:
                                Entry.block.converters
                                    .returnStringValueLowerCase,
                            codeMap:
                                'Entry.CodeMap.Entry.set_visible_project_timer[1]',
                        },
                        {
                            type: 'Text',
                            text: ')',
                            color: '#000',
                        },
                    ],
                },
            ],
        },
    },
    timer_variable: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Text',
                text: '초시계 값',
                color: '#3D3D3D',
            },
            {
                type: 'Text',
                text: ' ',
                color: '#3D3D3D',
            },
        ],
        events: {},
        def: {
            params: [null, null],
        },
        func: function(sprite, script) {
            return Entry.container.inputValue.getValue();
        },
        syntax: { js: [], py: [''] },
    },
    stop_run: {
        color: '#498deb',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Indicator',
                img: 'block_icon/flow_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null],
        },
        func: function(sprite, script) {
            return Entry.engine.toggleStop();
        },
        syntax: { js: [], py: [''] },
    },
    function_field_label: {
        skeleton: 'basic_param',
        isNotFor: ['functionEdit'],
        color: '#f9c535',
        params: [
            {
                type: 'TextInput',
                value: Lang.Blocks.FUNCTION_explanation_1,
            },
            {
                type: 'Output',
                accept: 'param',
            },
        ],
        paramsKeyMap: {
            NAME: 0,
            NEXT: 1,
        },
        def: {
            params: [Lang.Blocks.FUNCTION_explanation_1],
            type: 'function_field_label',
        },
        //"syntax": {"js": [], "py": ["%1function_field_label#"]}
        syntax: { js: [], py: ['name'] },
    },
    function_field_string: {
        skeleton: 'basic_param',
        isNotFor: ['functionEdit'],
        color: '#ffd974',
        params: [
            {
                type: 'Block',
                accept: 'string',
                restore: true,
            },
            {
                type: 'Output',
                accept: 'param',
            },
        ],
        paramsKeyMap: {
            PARAM: 0,
            NEXT: 1,
        },
        def: {
            params: [
                {
                    type: 'text',
                    params: [Lang.template.function_param_string],
                },
            ],
            type: 'function_field_string',
        },
        //"syntax": {"js": [], "py": ["%1function_field_string#"]}
        syntax: { js: [], py: ['value'] },
    },
    function_field_boolean: {
        skeleton: 'basic_param',
        isNotFor: ['functionEdit'],
        color: '#aeb8ff',
        params: [
            {
                type: 'Block',
                accept: 'boolean',
                restore: true,
            },
            {
                type: 'Output',
                accept: 'param',
            },
        ],
        paramsKeyMap: {
            PARAM: 0,
            NEXT: 1,
        },
        def: {
            params: [
                {
                    type: 'True',
                    params: [Lang.template.function_param_boolean],
                },
            ],
            type: 'function_field_boolean',
        },
        //"syntax": {"js": [], "py": ["%1function_field_boolean#"]}
        syntax: { js: [], py: ['boolean'] },
    },
    function_param_string: {
        skeleton: 'basic_string_field',
        color: '#ffd974',
        template: '%1 %2',
        events: {
            viewAdd: [
                function() {
                    if (Entry.Func.isEdit) Entry.Func.refreshMenuCode();
                },
            ],
        },
        func: function() {
            return this.executor.register.params[
                this.executor.register.paramMap[this.block.type]
            ];
        },
        syntax: { js: [], py: [''] },
    },
    function_param_boolean: {
        skeleton: 'basic_boolean_field',
        color: '#aeb8ff',
        template: '%1 %2',
        events: {
            viewAdd: [
                function() {
                    if (Entry.Func.isEdit) Entry.Func.refreshMenuCode();
                },
            ],
        },
        func: function() {
            return this.executor.register.params[
                this.executor.register.paramMap[this.block.type]
            ];
        },
        syntax: { js: [], py: [''] },
    },
    function_create: {
        skeleton: 'basic_create',
        color: '#cc7337',
        event: 'funcDef',
        params: [
            {
                type: 'Block',
                accept: 'param',
                value: {
                    type: 'function_field_label',
                    params: [Lang.Blocks.FUNC],
                    copyable: false,
                },
            },
            {
                type: 'Indicator',
                img: 'block_icon/function_03.png',
                size: 12,
            },
        ],
        paramsKeyMap: {
            FIELD: 0,
        },
        func: function() {},
        syntax: {
            js: [],
            py: [
                {
                    syntax: '%1',
                    keyOption: 'function_create',
                },
            ],
        },
    },
    function_general: {
        skeleton: 'basic',
        color: '#cc7337',
        params: [
            {
                type: 'Indicator',
                img: 'block_icon/function_03.png',
                size: 12,
            },
        ],
        events: {
            dataAdd: [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.addRef('_functionRefs', block);
                },
            ],
            dataDestroy: [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.removeRef('_functionRefs', block);
                },
            ],
            dblclick: [
                function(blockView) {
                    var mode = blockView.getBoard().workspace.getMode();
                    if (mode !== Entry.Workspace.MODE_BOARD) return;
                    if (Entry.type !== 'workspace') return;
                    var block = blockView.block;
                    var id = block.getFuncId();
                    Entry.Func.edit(Entry.variableContainer.functions_[id]);
                },
            ],
        },
        func: function(entity) {
            if (!this.initiated) {
                this.initiated = true;
                Entry.callStackLength++;

                if (Entry.callStackLength > Entry.Executor.MAXIMUM_CALLSTACK) {
                    Entry.toast.alert(
                        Lang.Workspace.RecursiveCallWarningTitle,
                        Lang.Workspace.RecursiveCallWarningContent
                    );
                    throw new Error();
                }

                var func = Entry.variableContainer.getFunction(
                    this.block.getFuncId()
                );
                this.funcCode = func.content;
                this.funcExecutor = this.funcCode.raiseEvent(
                    'funcDef',
                    entity
                )[0];
                this.funcExecutor.register.params = this.getParams();
                var paramMap = {};
                this.funcExecutor.register.paramMap = func.paramMap;
                this.funcExecutor.parentExecutor = this.executor;
                this.funcExecutor.isFuncExecutor = true;
            }
            this.funcExecutor.execute();
            if (!this.funcExecutor.isEnd()) {
                this.funcCode.removeExecutor(this.funcExecutor);
                return Entry.STATIC.BREAK;
            }

            Entry.callStackLength--;
        },
        syntax: { js: [], py: [''] },
    },
    //endregion basic 기본블록
    //region basic 기본
    change_to_nth_shape: {
        color: '#EC4466',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'pictures',
                fontSize: 11,
            },
            {
                type: 'Indicator',
                img: 'block_icon/looks_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null, null],
            type: 'change_to_nth_shape',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'shape',
        isNotFor: [],
        func: function(sprite, script) {
            var imageId = script.getField('VALUE', script);
            var picture = sprite.parent.getPicture(imageId);
            sprite.setImage(picture);
            return script.callReturn();
        },
        syntax: { js: [], py: [''] },
    },
    set_effect_volume: {
        color: '#EC4466',
        skeleton: 'basic',
        statements: [],
        deprecated: true,
        params: [
            {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.color, 'color'],
                    [Lang.Blocks.brightness, 'brightness'],
                    [Lang.Blocks.opacity, 'opacity'],
                ],
                value: 'color',
                fontSize: 11,
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/looks_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                null,
                {
                    type: 'number',
                    params: ['10'],
                },
                null,
            ],
            type: 'set_effect_volume',
        },
        paramsKeyMap: {
            EFFECT: 0,
            VALUE: 1,
        },
        class: 'effect',
        isNotFor: ['textBox'],
        func: function(sprite, script) {
            var effect = script.getField('EFFECT', script);
            var effectValue = script.getNumberValue('VALUE', script);
            var effectName = '';
            if (effect == 'color') {
                sprite.effect.hue = effectValue + sprite.effect.hue;
                effectName = 'hue';
            } else if (effect == 'lens') {
            } else if (effect == 'swriling') {
            } else if (effect == 'pixel') {
            } else if (effect == 'mosaic') {
            } else if (effect == 'brightness') {
                sprite.effect.brightness =
                    effectValue + sprite.effect.brightness;
                effectName = 'brightness';
            } else if (effect == 'blur') {
            } else if (effect == 'opacity') {
                sprite.effect.alpha = sprite.effect.alpha + effectValue / 100;
                effectName = 'alpha';
            }
            sprite.applyFilter(true, [effectName]);
            return script.callReturn();
        },
        syntax: { js: [], py: ['Entry.set_effect_volume(%1, %2)'] },
    },
    set_effect: {
        color: '#EC4466',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.color, 'color'],
                    [Lang.Blocks.brightness, 'brightness'],
                    [Lang.Blocks.opacity, 'opacity'],
                ],
                value: 'color',
                fontSize: 11,
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/looks_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                null,
                {
                    type: 'number',
                    params: ['100'],
                },
                null,
            ],
            type: 'set_effect',
        },
        paramsKeyMap: {
            EFFECT: 0,
            VALUE: 1,
        },
        class: 'effect',
        isNotFor: ['textBox'],
        func: function(sprite, script) {
            var effect = script.getField('EFFECT', script);
            var effectValue = script.getNumberValue('VALUE', script);
            var effectName = '';
            if (effect == 'color') {
                sprite.effect.hue = effectValue;
                effectName = 'hue';
            } else if (effect == 'lens') {
            } else if (effect == 'swriling') {
            } else if (effect == 'pixel') {
            } else if (effect == 'mosaic') {
            } else if (effect == 'brightness') {
                sprite.effect.brightness = effectValue;
                effectName = 'brightness';
            } else if (effect == 'blur') {
            } else if (effect == 'opacity') {
                sprite.effect.alpha = effectValue / 100;
                effectName = 'alpha';
            }
            sprite.applyFilter(true, [effectName]);
            return script.callReturn();
        },
        syntax: { js: [], py: ['Entry.set_effect(%1, %2)'] },
    },
    change_scale_percent: {
        color: '#EC4466',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/looks_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['10'],
                },
                null,
            ],
            type: 'change_scale_percent',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'scale',
        isNotFor: [],
        func: function(sprite, script) {
            var scaleValue =
                (script.getNumberValue('VALUE', script) + 100) / 100;
            sprite.setScaleX(sprite.getScaleX() * scaleValue);
            sprite.setScaleY(sprite.getScaleY() * scaleValue);
            return script.callReturn();
        },
        syntax: { js: [], py: [''] },
    },
    set_scale_percent: {
        color: '#EC4466',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/looks_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['100'],
                },
                null,
            ],
            type: 'set_scale_percent',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'scale',
        isNotFor: [],
        func: function(sprite, script) {
            var scaleValue = script.getNumberValue('VALUE', script) / 100;
            var snapshot = sprite.snapshot_;
            sprite.setScaleX(scaleValue * snapshot.scaleX);
            sprite.setScaleY(scaleValue * snapshot.scaleY);
            return script.callReturn();
        },
        syntax: { js: [], py: [''] },
    },
    set_object_order: {
        color: '#EC4466',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'objectSequence',
                fontSize: 11,
            },
            {
                type: 'Indicator',
                img: 'block_icon/looks_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null, null],
            type: 'set_object_order',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'z-index',
        isNotFor: [],
        func: function(sprite, script) {
            var targetIndex = script.getField('VALUE', script);
            //var currentIndex = Entry.container.getBelongedObjectsToScene().indexOf(sprite.parent);
            var currentIndex = Entry.container
                .getCurrentObjects()
                .indexOf(sprite.parent);

            if (currentIndex > -1) {
                return script.callReturn();
            } else throw new Error('object is not available');
        },
        syntax: { js: [], py: [''] },
    },
    get_pictures: {
        color: '#EC4466',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'pictures',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_LOOKS,
            },
        ],
        events: {},
        def: {
            params: [null],
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        func: function(sprite, script) {
            return script.getStringField('VALUE');
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: '%1',
                    keyOption: 'get_pictures',
                    textParams: [
                        {
                            type: 'DropdownDynamic',
                            value: null,
                            menuName: 'pictures',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_LOOKS,
                            converter: Entry.block.converters.returnStringKey,
                        },
                    ],
                },
            ],
        },
    },
    set_effect_amount: {
        color: '#EC4466',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.color, 'color'],
                    [Lang.Blocks.brightness, 'brightness'],
                    [Lang.Blocks.transparency, 'transparency'],
                ],
                value: 'color',
                fontSize: 11,
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/looks_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                null,
                {
                    type: 'number',
                    params: ['10'],
                },
                null,
            ],
            type: 'set_effect_amount',
        },
        paramsKeyMap: {
            EFFECT: 0,
            VALUE: 1,
        },
        class: 'effect',
        isNotFor: ['textBox'],
        func: function(sprite, script) {
            var effect = script.getField('EFFECT', script);
            var effectValue = script.getNumberValue('VALUE', script);
            var effectName = '';
            if (effect == 'color') {
                sprite.effect.hue = effectValue + sprite.effect.hue;
                effectName = 'hue';
            } else if (effect == 'brightness') {
                sprite.effect.brightness =
                    effectValue + sprite.effect.brightness;
                effectName = 'brightness';
            } else if (effect == 'transparency') {
                sprite.effect.alpha = sprite.effect.alpha - effectValue / 100;
                effectName = 'alpha';
            }
            sprite.applyFilter(true, [effectName]);
            return script.callReturn();
        },
        syntax: { js: [], py: [''] },
    },
    set_entity_effect: {
        color: '#EC4466',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.color, 'color'],
                    [Lang.Blocks.brightness, 'brightness'],
                    [Lang.Blocks.transparency, 'transparency'],
                ],
                value: 'color',
                fontSize: 11,
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/looks_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                null,
                {
                    type: 'number',
                    params: ['100'],
                },
                null,
            ],
            type: 'set_entity_effect',
        },
        paramsKeyMap: {
            EFFECT: 0,
            VALUE: 1,
        },
        class: 'effect',
        isNotFor: ['textBox'],
        func: function(sprite, script) {
            var effect = script.getField('EFFECT', script);
            var effectValue = script.getNumberValue('VALUE', script);
            var effectName = '';
            if (effect == 'color') {
                sprite.effect.hue = effectValue;
                effectName = 'hue';
            } else if (effect == 'brightness') {
                sprite.effect.brightness = effectValue;
                effectName = 'brightness';
            } else if (effect == 'transparency') {
                sprite.effect.alpha = 1 - effectValue / 100;
                effectName = 'alpha';
            }
            sprite.applyFilter(true, [effectName]);
            return script.callReturn();
        },
        syntax: { js: [], py: [''] },
    },
    rotate_by_angle: {
        color: '#A751E3',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/moving_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['90'],
                },
                null,
            ],
            type: 'rotate_by_angle',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'rotate',
        isNotFor: [],
        func: function(sprite, script) {
            var value = script.getNumberValue('VALUE', script);
            sprite.setRotation(sprite.getRotation() + value);
            return script.callReturn();
        },
        syntax: { js: [], py: [''] },
    },
    rotate_by_angle_dropdown: {
        color: '#A751E3',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Dropdown',
                options: [
                    ['45', '45'],
                    ['90', '90'],
                    ['135', '135'],
                    ['180', '180'],
                ],
                value: '45',
                fontSize: 11,
            },
            {
                type: 'Indicator',
                img: 'block_icon/moving_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: ['45', null],
            type: 'rotate_by_angle_dropdown',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'ebs',
        isNotFor: [],
        func: function(sprite, script) {
            var value = script.getField('VALUE', script);
            sprite.setRotation(sprite.getRotation() + Number(value));
            return script.callReturn();
        },
        syntax: { js: [], py: [''] },
    },
    see_angle: {
        color: '#A751E3',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/moving_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['90'],
                },
                null,
            ],
            type: 'see_angle',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'rotate',
        isNotFor: [],
        func: function(sprite, script) {
            var value = script.getNumberValue('VALUE', script);
            sprite.setDirection(value);
            return script.callReturn();
        },
        syntax: { js: [], py: [''] },
    },
    see_direction: {
        color: '#A751E3',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'sprites',
                fontSize: 11,
            },
            {
                type: 'Indicator',
                img: 'block_icon/moving_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null, null],
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        func: function(sprite, script) {
            var targetId = script.getField('VALUE', script);
            var targetEntity = Entry.container.getEntity(targetId);
            var deltaX = targetEntity.getX() - sprite.getX();
            var deltaY = targetEntity.getY() - sprite.getY();
            if (deltaX >= 0) {
                sprite.setRotation(
                    Math.atan(deltaY / deltaX) / Math.PI * 180 + 90
                );
            } else {
                sprite.setRotation(
                    Math.atan(deltaY / deltaX) / Math.PI * 180 + 270
                );
            }
            return script.callReturn();
        },
        syntax: { js: [], py: [''] },
    },
    rotate_by_angle_time: {
        color: '#A751E3',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'angle',
                params: ['90'],
            },
            {
                type: 'Indicator',
                img: 'block_icon/moving_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['2'],
                },
                null,
                null,
            ],
            type: 'rotate_by_angle_time',
        },
        paramsKeyMap: {
            VALUE: 1,
        },
        class: 'rotate',
        isNotFor: [],
        func: function(sprite, script) {
            if (!script.isStart) {
                var timeValue;
                timeValue = script.getNumberValue('VALUE', script);
                var angleValue = script.getNumberField('VALUE', script);
                script.isStart = true;
                script.frameCount = Math.floor(timeValue * Entry.FPS);
                script.dAngle = angleValue / script.frameCount;
            }
            if (script.frameCount != 0) {
                sprite.setRotation(sprite.getRotation() + script.dAngle);
                script.frameCount--;
                return script;
            } else {
                delete script.isStart;
                delete script.frameCount;
                return script.callReturn();
            }
        },
        syntax: { js: [], py: [''] },
    },
    flip_arrow_horizontal: {
        color: '#A751E3',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Indicator',
                img: 'block_icon/moving_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null],
        },
        func: function(sprite, script) {
            sprite.setDirection(sprite.getDirection() + 180);
            return script.callReturn();
        },
        syntax: { js: [], py: [''] },
    },
    flip_arrow_vertical: {
        color: '#A751E3',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Indicator',
                img: 'block_icon/moving_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null],
        },
        func: function(sprite, script) {
            sprite.setDirection(sprite.getDirection() + 180);
            return script.callReturn();
        },
        syntax: { js: [], py: [''] },
    },
    see_angle_direction: {
        color: '#A751E3',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/moving_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['90'],
                },
                null,
            ],
            type: 'see_angle_direction',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'rotate',
        isNotFor: [],
        func: function(sprite, script) {
            var value = script.getNumberValue('VALUE', script);
            var nativeDirection = sprite.getDirection() + sprite.getRotation();
            sprite.setRotation(sprite.getRotation() + value - nativeDirection);
            return script.callReturn();
        },
        syntax: { js: [], py: [''] },
    },
    rotate_direction: {
        color: '#A751E3',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/moving_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['90'],
                },
                null,
            ],
            type: 'rotate_direction',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'rotate',
        isNotFor: [],
        func: function(sprite, script) {
            var value = script.getNumberValue('VALUE', script);
            sprite.setDirection(value + sprite.getDirection());
            return script.callReturn();
        },
        syntax: { js: [], py: [''] },
    },
    //endregion basic 기본
    //region basic 기본
    sound_something: {
        color: '#A4D01D',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'sounds',
                fontSize: 11,
            },
            {
                type: 'Indicator',
                img: 'block_icon/sound_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null, null],
            type: 'sound_something',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'sound',
        isNotFor: [],
        func: function(sprite, script) {
            var soundId = script.getField('VALUE', script);
            var sounds = sprite.parent.sounds;
            var isExist = Entry.isExist(soundId, 'id', sounds);
            if (isExist) createjs.Sound.play(soundId);
            return script.callReturn();
        },
        syntax: { js: [], py: [''] },
    },
    sound_something_second: {
        color: '#A4D01D',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'sounds',
                fontSize: 11,
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/sound_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                null,
                {
                    type: 'number',
                    params: ['1'],
                },
                null,
            ],
            type: 'sound_something_second',
        },
        paramsKeyMap: {
            VALUE: 0,
            SECOND: 1,
        },
        class: 'sound',
        isNotFor: [],
        func: function(sprite, script) {
            var soundId = script.getField('VALUE', script);
            var timeValue = script.getNumberValue('SECOND', script);
            var sounds = sprite.parent.sounds;
            var isExist = Entry.isExist(soundId, 'id', sounds);
            if (isExist) {
                var instance = createjs.Sound.play(soundId);
                Entry.Utils.addSoundInstances(instance);
                setTimeout(function() {
                    instance.stop();
                }, timeValue * 1000);
            }
            return script.callReturn();
        },
        syntax: { js: [], py: [''] },
    },
    sound_something_wait: {
        color: '#A4D01D',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'sounds',
                fontSize: 11,
            },
            {
                type: 'Indicator',
                img: 'block_icon/sound_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null, null],
            type: 'sound_something_wait',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'sound',
        isNotFor: [],
        func: function(sprite, script) {
            if (!script.isPlay) {
                script.isPlay = true;
                script.playState = 1;
                var soundId = script.getField('VALUE', script);
                var sound = sprite.parent.getSound(soundId);
                var sounds = sprite.parent.sounds;
                var isExist = Entry.isExist(soundId, 'id', sounds);
                if (isExist) {
                    var instance = createjs.Sound.play(soundId);
                    Entry.Utils.addSoundInstances(instance);
                    setTimeout(function() {
                        script.playState = 0;
                    }, sound.duration * 1000);
                }
                return script;
            } else if (script.playState == 1) {
                return script;
            } else {
                delete script.playState;
                delete script.isPlay;
                return script.callReturn();
            }
        },
        syntax: { js: [], py: [''] },
    },
    sound_something_second_wait: {
        color: '#A4D01D',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'sounds',
                fontSize: 11,
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/sound_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                null,
                {
                    type: 'number',
                    params: ['1'],
                },
                null,
            ],
            type: 'sound_something_second_wait',
        },
        paramsKeyMap: {
            VALUE: 0,
            SECOND: 1,
        },
        class: 'sound',
        isNotFor: [],
        func: function(sprite, script) {
            if (!script.isPlay) {
                script.isPlay = true;
                script.playState = 1;
                var soundId = script.getField('VALUE', script);
                var sounds = sprite.parent.sounds;
                var isExist = Entry.isExist(soundId, 'id', sounds);
                if (isExist) {
                    var instance = createjs.Sound.play(soundId);
                    var timeValue = script.getNumberValue('SECOND', script);
                    Entry.Utils.addSoundInstances(instance);
                    setTimeout(function() {
                        instance.stop();
                        script.playState = 0;
                    }, timeValue * 1000);
                    instance.addEventListener('complete', function(e) {});
                }
                return script;
            } else if (script.playState == 1) {
                return script;
            } else {
                delete script.isPlay;
                delete script.playState;
                return script.callReturn();
            }
        },
        syntax: { js: [], py: [''] },
    },
    get_sounds: {
        color: '#A4D01D',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'sounds',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_SOUNDS,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'get_sounds',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        func: function(sprite, script) {
            return script.getStringField('VALUE');
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: '%1',
                    textParams: [
                        {
                            type: 'DropdownDynamic',
                            value: null,
                            menuName: 'sounds',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_SOUNDS,
                            converter: Entry.block.converters.returnStringKey,
                        },
                    ],
                    keyOption: 'get_sounds',
                },
            ],
        },
    },
    boolean_comparison: {
        color: '#AEB8FF',
        skeleton: 'basic_boolean_field',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Dropdown',
                options: [
                    ['=', 'EQUAL'],
                    ['<', 'SMALLER'],
                    ['>', 'BIGGER'],
                ],
                value: 'EQUAL',
                fontSize: 11,
            },
            {
                type: 'Block',
                accept: 'string',
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'boolean_comparison',
        },
        paramsKeyMap: {
            LEFTHAND: 0,
            OPERATOR: 1,
            RIGHTHAND: 2,
        },
        func: function(sprite, script) {
            var operator = script.getField('OPERATOR', script);
            var leftValue = script.getNumberValue('LEFTHAND', script);
            var rightValue = script.getNumberValue('RIGHTHAND', script);
            if (operator == 'EQUAL') return leftValue == rightValue;
            else if (operator == 'BIGGER') return leftValue > rightValue;
            else return leftValue < rightValue;
        },
        syntax: { js: [], py: [''] },
    },
    boolean_equal: {
        color: '#AEB8FF',
        skeleton: 'basic_boolean_field',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Text',
                text: '=',
                color: '#3D3D3D',
            },
            {
                type: 'Block',
                accept: 'string',
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['10'],
                },
                null,
                {
                    type: 'number',
                    params: ['10'],
                },
            ],
            type: 'boolean_equal',
        },
        paramsKeyMap: {
            LEFTHAND: 0,
            RIGHTHAND: 2,
        },
        class: 'boolean_compare',
        isNotFor: [],
        func: function(sprite, script) {
            var leftValue = script.getStringValue('LEFTHAND', script);
            var rightValue = script.getStringValue('RIGHTHAND', script);
            return leftValue == rightValue;
        },
        syntax: { js: [], py: [''] },
    },
    boolean_bigger: {
        color: '#AEB8FF',
        skeleton: 'basic_boolean_field',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Text',
                text: '>',
                color: '#3D3D3D',
            },
            {
                type: 'Block',
                accept: 'string',
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['10'],
                },
                null,
                {
                    type: 'number',
                    params: ['10'],
                },
            ],
            type: 'boolean_bigger',
        },
        paramsKeyMap: {
            LEFTHAND: 0,
            RIGHTHAND: 2,
        },
        class: 'boolean_compare',
        isNotFor: [],
        func: function(sprite, script) {
            var leftValue = script.getNumberValue('LEFTHAND', script);
            var rightValue = script.getNumberValue('RIGHTHAND', script);
            return leftValue > rightValue;
        },
        syntax: { js: [], py: [''] },
    },
    boolean_smaller: {
        color: '#AEB8FF',
        skeleton: 'basic_boolean_field',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Text',
                text: '<',
                color: '#3D3D3D',
            },
            {
                type: 'Block',
                accept: 'string',
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['10'],
                },
                null,
                {
                    type: 'number',
                    params: ['10'],
                },
            ],
            type: 'boolean_smaller',
        },
        paramsKeyMap: {
            LEFTHAND: 0,
            RIGHTHAND: 2,
        },
        class: 'boolean_compare',
        isNotFor: [],
        func: function(sprite, script) {
            var leftValue = script.getNumberValue('LEFTHAND', script);
            var rightValue = script.getNumberValue('RIGHTHAND', script);
            return leftValue < rightValue;
        },
        syntax: { js: [], py: [''] },
    },
    boolean_and: {
        color: '#AEB8FF',
        skeleton: 'basic_boolean_field',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'boolean',
            },
            {
                type: 'Text',
                text: Lang.Blocks.JUDGEMENT_boolean_and,
                color: '#3D3D3D',
            },
            {
                type: 'Block',
                accept: 'boolean',
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'True',
                },
                null,
                {
                    type: 'True',
                },
            ],
            type: 'boolean_and',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'boolean_shell',
                    params: ['A'],
                },
                null,
                {
                    type: 'boolean_shell',
                    params: ['B'],
                },
            ],
            type: 'boolean_and',
        },
        paramsKeyMap: {
            LEFTHAND: 0,
            RIGHTHAND: 2,
        },
        class: 'boolean',
        isNotFor: [],
        func: function(sprite, script) {
            var leftValue = script.getBooleanValue('LEFTHAND', script);
            var rightValue = script.getBooleanValue('RIGHTHAND', script);
            return leftValue && rightValue;
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: '(%1 and %3)',
                    template: '%1 and %3',
                    blockType: 'param',
                    dic: '&&',
                },
            ],
        },
    },
    boolean_or: {
        color: '#AEB8FF',
        skeleton: 'basic_boolean_field',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'boolean',
            },
            {
                type: 'Text',
                text: Lang.Blocks.JUDGEMENT_boolean_or,
                color: '#3D3D3D',
            },
            {
                type: 'Block',
                accept: 'boolean',
            },
        ],
        events: {},
        def: {
            params: [{ type: 'True' }, null, { type: 'False' }],
            type: 'boolean_or',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'boolean_shell',
                    params: ['A'],
                },
                null,
                {
                    type: 'boolean_shell',
                    params: ['B'],
                },
            ],
            type: 'boolean_or',
        },
        paramsKeyMap: {
            LEFTHAND: 0,
            RIGHTHAND: 2,
        },
        class: 'boolean',
        isNotFor: [],
        func: function(sprite, script) {
            var leftValue = script.getBooleanValue('LEFTHAND', script);
            var rightValue = script.getBooleanValue('RIGHTHAND', script);
            return leftValue || rightValue;
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: '(%1 or %3)',
                    template: '%1 or %3',
                    blockType: 'param',
                    dic: '||',
                },
            ],
        },
    },
    true_or_false: {
        color: '#AEB8FF',
        skeleton: 'basic_boolean_field',
        statements: [],
        params: [
            {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.JUDGEMENT_true, 'true'],
                    [Lang.Blocks.JUDGEMENT_false, 'false'],
                ],
                value: 'true',
                fontSize: 11,
            },
        ],
        events: {},
        def: {
            params: [null],
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        func: function(sprite, script) {
            var value = script.children[0].textContent;
            return value == 'true';
        },
        syntax: { js: [], py: [''] },
    },
    True: {
        color: '#AEB8FF',
        skeleton: 'basic_boolean_field',
        statements: [],
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.JUDGEMENT_true,
                color: '#3D3D3D',
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'True',
        },
        func: function(sprite, script) {
            return true;
        },
        isPrimitive: true,
        syntax: { js: ['Scope', 'true'], py: ['True'] },
    },
    False: {
        color: '#AEB8FF',
        skeleton: 'basic_boolean_field',
        statements: [],
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.JUDGEMENT_false,
                color: '#3D3D3D',
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'False',
        },
        func: function(sprite, script) {
            return false;
        },
        isPrimitive: true,
        syntax: { js: [], py: ['False'] },
    },
    press_some_key: {
        color: '#3BBD70',
        skeleton: 'basic_event',
        statements: [],
        params: [
            {
                type: 'Indicator',
                img: 'block_icon/start_icon_keyboard.png',
                size: 17,
                position: {
                    x: 0,
                    y: -2,
                },
            },
            {
                type: 'Dropdown',
                options: [
                    ['q', '81'],
                    ['w', '87'],
                    ['e', '69'],
                    ['r', '82'],
                    ['a', '65'],
                    ['s', '83'],
                    ['d', '68'],
                    ['위쪽 화살표', '38'],
                    ['아래쪽 화살표', '40'],
                    ['왼쪽 화살표', '37'],
                    ['오른쪽 화살표', '39'],
                    ['엔터', '13'],
                    ['스페이스', '32'],
                ],
                value: '81',
                fontSize: 11,
            },
            {
                type: 'Indicator',
                img: 'block_icon/start_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null, null, null],
        },
        paramsKeyMap: {
            VALUE: 1,
        },
        func: function(sprite, script) {
            return script.callReturn();
        },
        syntax: { js: [], py: [''] },
    },
    when_some_key_click: {
        color: '#3BBD70',
        skeleton: 'basic_event',
        statements: [],
        params: [
            {
                type: 'Indicator',
                img: 'block_icon/start_icon_keyboard.png',
                size: 17,
                position: {
                    x: 0,
                    y: -2,
                },
            },
        ],
        events: {},
        def: {
            params: [null],
        },
        func: function(sprite, script) {
            return script.callReturn();
        },
        event: 'keyPress',
        syntax: { js: [], py: ['Entry.on_key_press_down(%1)'] },
    },
    text: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'TextInput',
                value: 10,
            },
        ],
        events: {},
        def: {
            params: [],
            type: 'text',
        },
        paramsKeyMap: {
            NAME: 0,
        },
        func: function(sprite, script) {
            return script.getField('NAME', script);
        },
        isPrimitive: true,
        syntax: {
            js: ['Scope', '%1'],
            py: [
                {
                    syntax: '%1',
                    keyOption: 'text',
                    textParams: [
                        {
                            type: 'TextInput',
                            converter:
                                Entry.block.converters
                                    .returnStringOrNumberByValue,
                        },
                    ],
                },
            ],
        },
    },
    options_for_list: {
        color: '#E457DC',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Dropdown',
                options: [
                    ['첫번째', 'FIRST'],
                    ['마지막', 'LAST'],
                    ['무작위', 'RANDOM'],
                ],
                value: 'FIRST',
                fontSize: 11,
            },
        ],
        events: {},
        def: {
            params: [null],
        },
        paramsKeyMap: {
            OPERATOR: 0,
        },
        func: function(sprite, script) {
            return script.getField('OPERATOR', script);
        },
        syntax: { js: [], py: [''] },
    },
    //endregion basic 기본
    //region basic 기본
    run: {
        skeleton: 'basic',
        color: '#3BBD70',
        contents: ['this is', 'basic block'],
    },
    mutant: {
        skeleton: 'basic',
        event: 'start',
        color: '#3BBD70',
        params: [],
        changeEvent: {
            _listeners: [],
        },
    },
    jr_start: {
        skeleton: 'pebble_event',
        event: 'start',
        color: '#3BBD70',
        params: [
            {
                type: 'Indicator',
                img: '../../../img/assets/ntry/bitmap/jr/block_play_image.png',
                highlightColor: '#3BBD70',
                position: {
                    x: 0,
                    y: 0,
                },
                size: 22,
            },
        ],
        func: function() {
            var entities = Ntry.entityManager.getEntitiesByComponent(
                Ntry.STATIC.UNIT
            );

            for (var key in entities) this._unit = entities[key];

            Ntry.unitComp = Ntry.entityManager.getComponent(
                this._unit.id,
                Ntry.STATIC.UNIT
            );
        },
    },
    jr_repeat: {
        skeleton: 'pebble_loop',
        color: '#127CDB',
        params: [
            {
                type: 'Text',
                text: '',
            },
            {
                type: 'Dropdown',
                options: [
                    [1, 1],
                    [2, 2],
                    [3, 3],
                    [4, 4],
                    [5, 5],
                    [6, 6],
                    [7, 7],
                    [8, 8],
                    [9, 9],
                    [10, 10],
                ],
                value: 3,
                fontSize: 14,
                roundValue: 3,
            },
        ],
        statements: [{ accept: 'pebble_basic' }],
        func: function() {
            if (this.repeatCount === undefined) {
                this.repeatCount = this.block.params[1];
                return Entry.STATIC.BREAK;
            } else if (this.repeatCount > 0) {
                this.repeatCount--;
                var statement = this.block.statements[0];
                if (statement.getBlocks().length === 0) return;
                this.executor.stepInto(statement);
                return Entry.STATIC.BREAK;
            } else {
                delete this.repeatCount;
            }
        },
    },
    jr_item: {
        skeleton: 'pebble_basic',
        color: '#F46C6C',
        params: [
            {
                type: 'Indicator',
                img: '../../../img/assets/ntry/bitmap/jr/block_item_image.png',
                highlightColor: '#FFF',
                position: {
                    x: 83,
                    y: 0,
                },
                size: 22,
            },
        ],
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var self = this;
                var callBack = function() {
                    Ntry.dispatchEvent('getItem');
                    self.isAction = false;
                };
                Ntry.dispatchEvent(
                    'unitAction',
                    Ntry.STATIC.GET_ITEM,
                    callBack
                );
                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    cparty_jr_item: {
        skeleton: 'pebble_basic',
        color: '#8ABC1D',
        params: [
            {
                type: 'Indicator',
                img: '../../../img/assets/ntry/bitmap/cpartyjr/pen.png',
                highlightColor: '#FFF',
                position: {
                    x: 83,
                    y: 0,
                },
                size: 22,
            },
        ],
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var self = this;
                var callBack = function() {
                    Ntry.dispatchEvent('getItem');
                    self.isAction = false;
                };
                Ntry.dispatchEvent(
                    'unitAction',
                    Ntry.STATIC.GET_ITEM,
                    callBack
                );
                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    jr_north: {
        skeleton: 'pebble_basic',
        color: '#A751E3',
        params: [
            {
                type: 'Indicator',
                img: '../../../img/assets/ntry/bitmap/jr/block_up_image.png',
                position: {
                    x: 83,
                    y: 0,
                },
                size: 22,
            },
        ],
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var STATIC = Ntry.STATIC;
                var self = this;
                var callBack = function() {
                    window.setTimeout(function() {
                        Ntry.dispatchEvent(
                            'unitAction',
                            Ntry.STATIC.WALK,
                            function() {
                                self.isAction = false;
                            }
                        );
                    }, 3);
                };
                var actionType;
                switch (Ntry.unitComp.direction) {
                    case Ntry.STATIC.EAST:
                        actionType = STATIC.TURN_LEFT;
                        break;
                    case Ntry.STATIC.SOUTH:
                        actionType = STATIC.HALF_ROTATION;
                        break;
                    case Ntry.STATIC.WEST:
                        actionType = STATIC.TURN_RIGHT;
                        break;
                    default:
                        callBack();
                        break;
                }
                if (actionType)
                    Ntry.dispatchEvent('unitAction', actionType, callBack);
                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    jr_east: {
        skeleton: 'pebble_basic',
        color: '#A751E3',
        params: [
            {
                type: 'Indicator',
                img: '../../../img/assets/ntry/bitmap/jr/block_right_image.png',
                position: {
                    x: 83,
                    y: 0,
                },
                size: 22,
            },
        ],
        func: function() {
            var STATIC = Ntry.STATIC;

            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var self = this;
                var callBack = function() {
                    window.setTimeout(function() {
                        Ntry.dispatchEvent(
                            'unitAction',
                            STATIC.WALK,
                            function() {
                                self.isAction = false;
                            }
                        );
                    }, 3);
                };

                // turn direction
                var actionType;
                switch (Ntry.unitComp.direction) {
                    case STATIC.SOUTH:
                        actionType = STATIC.TURN_LEFT;
                        break;
                    case STATIC.WEST:
                        actionType = STATIC.HALF_ROTATION;
                        break;
                    case STATIC.NORTH:
                        actionType = STATIC.TURN_RIGHT;
                        break;
                    default:
                        callBack();
                        break;
                }
                if (actionType)
                    Ntry.dispatchEvent('unitAction', actionType, callBack);
                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    jr_south: {
        skeleton: 'pebble_basic',
        color: '#A751E3',
        params: [
            {
                type: 'Indicator',
                img: '../../../img/assets/ntry/bitmap/jr/block_down_image.png',
                position: {
                    x: 83,
                    y: 0,
                },
                size: 22,
            },
        ],
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var STATIC = Ntry.STATIC;
                var self = this;
                var callBack = function() {
                    window.setTimeout(function() {
                        Ntry.dispatchEvent(
                            'unitAction',
                            Ntry.STATIC.WALK,
                            function() {
                                self.isAction = false;
                            }
                        );
                    }, 3);
                };

                // turn direction
                var actionType;
                switch (Ntry.unitComp.direction) {
                    case STATIC.EAST:
                        actionType = STATIC.TURN_RIGHT;
                        break;
                    case STATIC.NORTH:
                        actionType = STATIC.HALF_ROTATION;
                        break;
                    case STATIC.WEST:
                        actionType = STATIC.TURN_LEFT;
                        break;
                    default:
                        callBack();
                        break;
                }
                if (actionType)
                    Ntry.dispatchEvent('unitAction', actionType, callBack);
                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    jr_west: {
        skeleton: 'pebble_basic',
        color: '#A751E3',
        params: [
            {
                type: 'Indicator',
                img: '../../../img/assets/ntry/bitmap/jr/block_left_image.png',
                position: {
                    x: 83,
                    y: 0,
                },
                size: 22,
            },
        ],
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var STATIC = Ntry.STATIC;
                var self = this;
                var callBack = function() {
                    window.setTimeout(function() {
                        Ntry.dispatchEvent(
                            'unitAction',
                            STATIC.WALK,
                            function() {
                                self.isAction = false;
                            }
                        );
                    }, 3);
                };

                // turn direction
                var actionType;
                switch (Ntry.unitComp.direction) {
                    case STATIC.SOUTH:
                        actionType = STATIC.TURN_RIGHT;
                        break;
                    case STATIC.EAST:
                        actionType = STATIC.HALF_ROTATION;
                        break;
                    case STATIC.NORTH:
                        actionType = STATIC.TURN_LEFT;
                        break;
                    default:
                        callBack();
                        break;
                }
                if (actionType)
                    Ntry.dispatchEvent('unitAction', actionType, callBack);
                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    jr_start_basic: {
        skeleton: 'basic_event',
        event: 'start',
        color: '#3BBD70',
        params: [
            {
                type: 'Indicator',
                boxMultiplier: 2,
                img: '../../../img/assets/block_icon/start_icon_play.png',
                highlightColor: '#3BBD70',
                size: 17,
                position: {
                    x: 0,
                    y: -2,
                },
            },
            {
                text: '시작하기를 클릭했을때',
                type: 'Text',
            },
        ],
        func: function() {
            var entities = Ntry.entityManager.getEntitiesByComponent(
                Ntry.STATIC.UNIT
            );

            for (var key in entities) this._unit = entities[key];

            Ntry.unitComp = Ntry.entityManager.getComponent(
                this._unit.id,
                Ntry.STATIC.UNIT
            );
        },
    },
    jr_go_straight: {
        skeleton: 'basic',
        color: '#A751E3',
        params: [
            {
                type: 'Image',
                img:
                    '../../../img/assets/ntry/bitmap/jr/cparty_go_straight.png',
                size: 24,
            },
        ],
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var self = this;
                var callBack = function() {
                    self.isAction = false;
                };
                // turn direction
                Ntry.dispatchEvent('unitAction', Ntry.STATIC.WALK, callBack);

                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
        syntax: ['Scope', 'move'],
    },
    jr_turn_left: {
        skeleton: 'basic',
        color: '#A751E3',
        params: [
            {
                type: 'Image',
                img: '../../../img/assets/ntry/bitmap/jr/cparty_rotate_l.png',
                size: 24,
            },
        ],
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var self = this;
                var callBack = function() {
                    self.isAction = false;
                };

                // turn direction
                Ntry.dispatchEvent(
                    'unitAction',
                    Ntry.STATIC.TURN_LEFT,
                    callBack
                );

                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
        syntax: ['Scope', 'left'],
    },
    jr_turn_right: {
        skeleton: 'basic',
        color: '#A751E3',
        params: [
            {
                type: 'Image',
                img: '../../../img/assets/ntry/bitmap/jr/cparty_rotate_r.png',
                size: 24,
            },
        ],
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var self = this;
                var callBack = function() {
                    self.isAction = false;
                };

                // turn direction
                Ntry.dispatchEvent(
                    'unitAction',
                    Ntry.STATIC.TURN_RIGHT,
                    callBack
                );

                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
        syntax: ['Scope', 'right'],
    },
    jr_go_slow: {
        skeleton: 'basic',
        color: '#f46c6c',
        params: [
            {
                type: 'Image',
                img: '../../../img/assets/ntry/bitmap/jr/cparty_go_slow.png',
                size: 24,
            },
        ],
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var self = this;
                var callBack = function() {
                    self.isAction = false;
                };

                // turn direction
                Ntry.dispatchEvent('unitAction', Ntry.STATIC.GO_SLOW, callBack);

                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
        syntax: ['Scope', 'move_slowly'],
    },
    jr_repeat_until_dest: {
        skeleton: 'basic_loop',
        color: '#498DEB',
        syntax: ['BasicWhile', 'true'],
        params: [
            {
                type: 'Image',
                img: '../../../img/assets/ntry/bitmap/jr/jr_goal_image.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
        ],
        func: function() {
            var statement = this.block.statements[0];
            if (statement.getBlocks().length === 0) return;

            this.executor.stepInto(statement);
            return Entry.STATIC.BREAK;
        },
    },
    jr_if_construction: {
        skeleton: 'basic_loop',
        color: '#498DEB',
        syntax: ['BasicIf', "front == 'wall'"],
        params: [
            {
                type: 'Image',
                img:
                    '../../../img/assets/ntry/bitmap/jr/jr_construction_image.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
        ],
        func: function() {
            if (this.isContinue) return;
            var entities = Ntry.entityManager.getEntitiesByComponent(
                Ntry.STATIC.UNIT
            );

            var entity;
            for (var key in entities) entity = entities[key];

            var unitComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.UNIT
            );
            var gridComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.GRID
            );

            var grid = { x: gridComp.x, y: gridComp.y };
            Ntry.addVectorByDirection(grid, unitComp.direction, 1);

            var fitEntities = Ntry.entityManager.find(
                {
                    type: Ntry.STATIC.GRID,
                    x: grid.x,
                    y: grid.y,
                },
                {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.OBSTACLE_REPAIR,
                }
            );

            this.isContinue = true;

            var statement = this.block.statements[0];
            if (fitEntities.length === 0) return;
            else if (statement.getBlocks().length === 0) return;
            else {
                this.executor.stepInto(statement);
                return Entry.STATIC.BREAK;
            }
        },
    },
    jr_if_speed: {
        skeleton: 'basic_loop',
        color: '#498DEB',
        syntax: ['BasicIf', "front == 'hump'"],
        params: [
            {
                type: 'Image',
                img: '../../../img/assets/ntry/bitmap/jr/jr_speed_image.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
        ],
        func: function() {
            if (this.isContinue) return;
            var entities = Ntry.entityManager.getEntitiesByComponent(
                Ntry.STATIC.UNIT
            );

            var entity;
            for (var key in entities) entity = entities[key];

            var unitComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.UNIT
            );
            var gridComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.GRID
            );

            var grid = { x: gridComp.x, y: gridComp.y };
            Ntry.addVectorByDirection(grid, unitComp.direction, 1);

            var fitEntities = Ntry.entityManager.find(
                {
                    type: Ntry.STATIC.GRID,
                    x: grid.x,
                    y: grid.y,
                },
                {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.OBSTACLE_SLOW,
                }
            );

            this.isContinue = true;

            var statement = this.block.statements[0];
            if (fitEntities.length === 0) return;
            else if (statement.getBlocks().length === 0) return;
            else {
                this.executor.stepInto(statement);
                return Entry.STATIC.BREAK;
            }
        },
    },
    maze_step_start: {
        skeleton: 'basic_event',
        mode: 'maze',
        event: 'start',
        color: '#3BBD70',
        syntax: ['Program'],
        params: [
            {
                type: 'Indicator',
                boxMultiplier: 2,
                img: '../../../img/assets/block_icon/start_icon_play.png',
                highlightColor: '#3BBD70',
                size: 17,
                position: {
                    x: 0,
                    y: -2,
                },
            },
        ],
        func: function() {
            var entities = Ntry.entityManager.getEntitiesByComponent(
                Ntry.STATIC.UNIT
            );

            for (var key in entities) this._unit = entities[key];

            Ntry.unitComp = Ntry.entityManager.getComponent(
                this._unit.id,
                Ntry.STATIC.UNIT
            );
            Ntry.unit = this._unit;
        },
    },
    maze_step_jump: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#FF6E4B',
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/jump.png',
                size: 24,
            },
        ],
        syntax: ['Scope', 'jump'],
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var self = this;
                var callBack = function() {
                    self.isAction = false;
                };

                Ntry.dispatchEvent('unitAction', Ntry.STATIC.JUMP, callBack);

                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    maze_step_jump2: {
        parent: 'maze_step_jump',
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var self = this;
                var callBack = function() {
                    self.isAction = false;
                };

                var entities = Ntry.entityManager.getEntitiesByComponent(
                    Ntry.STATIC.UNIT
                );
                var unitId;
                $.each(entities, function(id, entity) {
                    unitId = id;
                });

                var unitComp = Ntry.entityManager.getComponent(
                    unitId,
                    Ntry.STATIC.UNIT
                );
                var unitGrid = $.extend(
                    {},
                    Ntry.entityManager.getComponent(unitId, Ntry.STATIC.GRID)
                );
                var checkGrid = {
                    x: unitGrid.x,
                    y: unitGrid.y,
                };
                var isCollisionPossible = Ntry.checkCollisionTile(
                    unitGrid,
                    unitComp.direction,
                    [Ntry.STATIC.OBSTACLE_IRON],
                    2
                );
                if (isCollisionPossible) {
                    Ntry.dispatchEvent(
                        'unitAction',
                        Ntry.STATIC.FAIL_JUMP,
                        callBack
                    );
                    Ntry.dispatchEvent(
                        'complete',
                        false,
                        Ntry.STATIC.CONTACT_IRON
                    );
                    return;
                }
                Ntry.dispatchEvent('unitAction', Ntry.STATIC.JUMP, callBack);
                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    maze_step_jump_pinkbean: {
        parent: 'maze_step_jump',
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var self = this;
                var callBack = function() {
                    self.isAction = false;
                };
                var unit = Ntry.getUnit();
                var components = unit.components || {};
                var unitComp = components[Ntry.STATIC.UNIT] || {};
                var unitGrid = $.extend({}, components[Ntry.STATIC.GRID]);
                var checkGrid = {
                    x: unitGrid.x,
                    y: unitGrid.y,
                };
                var isCollisionPossible = Ntry.checkCollisionTile(
                    unitGrid,
                    unitComp.direction,
                    [Ntry.STATIC.OBSTACLE_MUSHROOM],
                    1
                );
                if (isCollisionPossible) {
                    Ntry.dispatchEvent(
                        'unitAction',
                        Ntry.STATIC.FAIL_JUMP,
                        callBack
                    );
                    Ntry.dispatchEvent(
                        'complete',
                        false,
                        Ntry.STATIC.HIT_UNIT_BY_MUSHROOM
                    );
                    return;
                }

                Ntry.dispatchEvent('unitAction', Ntry.STATIC.JUMP, callBack);
                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    maze_step_for: {
        skeleton: 'basic_loop',
        mode: 'maze',
        color: '#498DEB',
        syntax: ['BasicIteration'],
        params: [
            {
                type: 'Dropdown',
                key: 'REPEAT',
                options: [
                    [1, 1],
                    [2, 2],
                    [3, 3],
                    [4, 4],
                    [5, 5],
                    [6, 6],
                    [7, 7],
                    [8, 8],
                    [9, 9],
                    [10, 10],
                ],
                value: 1,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
        ],
        func: function() {
            if (this.repeatCount === undefined) {
                this.repeatCount = this.block.params[0];
                return Entry.STATIC.BREAK;
            } else if (this.repeatCount > 0) {
                this.repeatCount--;
                var statement = this.block.statements[0];
                if (statement.getBlocks().length === 0) return;
                this.executor.stepInto(statement);
                return Entry.STATIC.BREAK;
            } else {
                delete this.repeatCount;
            }
        },
    },
    test: {
        skeleton: 'basic_boolean_field',
        mode: 'maze',
        color: '#127CDB',
        params: [
            {
                type: 'Angle',
                value: '90',
            },
            {
                type: 'Dropdown',
                options: [
                    [1, 1],
                    [2, 2],
                    [3, 3],
                    [4, 4],
                    [5, 5],
                    [6, 6],
                    [7, 7],
                    [8, 8],
                    [9, 9],
                    [10, 10],
                ],
                value: 1,
            },
        ],
    },
    maze_repeat_until_1: {
        skeleton: 'basic_loop',
        mode: 'maze',
        color: '#498DEB',
        syntax: ['BasicWhile', 'true'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/ntry/block_inner/repeat_goal_1.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
        ],
        func: function() {
            var statement = this.block.statements[0];
            if (statement.getBlocks().length === 0) return;

            this.executor.stepInto(statement);
            return Entry.STATIC.BREAK;
        },
    },
    maze_repeat_until_2: {
        skeleton: 'basic_loop',
        mode: 'maze',
        color: '#498DEB',
        syntax: ['BasicWhile', 'true'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/ntry/block_inner/repeat_goal_1.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
        ],
        func: function() {
            var statement = this.block.statements[0];
            if (statement.getBlocks().length === 0) return;

            this.executor.stepInto(statement);
            return Entry.STATIC.BREAK;
        },
    },
    maze_step_if_1: {
        skeleton: 'basic_loop',
        mode: 'maze',
        color: '#498DEB',
        syntax: ['BasicIf', "front == 'wall'"],
        params: [
            {
                type: 'Image',
                img: '/img/assets/ntry/block_inner/if_target_1.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/if.png',
                size: 24,
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
        ],
        func: function() {
            if (this.isContinue) return;
            var entities = Ntry.entityManager.getEntitiesByComponent(
                Ntry.STATIC.UNIT
            );

            var entity;
            for (var key in entities) entity = entities[key];

            var unitComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.UNIT
            );
            var gridComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.GRID
            );

            var grid = { x: gridComp.x, y: gridComp.y };
            Ntry.addVectorByDirection(grid, unitComp.direction, 1);

            var existEntities = Ntry.entityManager.find({
                type: Ntry.STATIC.GRID,
                x: grid.x,
                y: grid.y,
            });

            var statement = this.block.statements[0];

            if (existEntities.length === 0) {
                this.executor.stepInto(statement);
                return Entry.STATIC.BREAK;
            }

            var fitEntities = Ntry.entityManager.find(
                {
                    type: Ntry.STATIC.GRID,
                    x: grid.x,
                    y: grid.y,
                },
                {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.WALL,
                }
            );

            this.isContinue = true;

            if (fitEntities.length === 0) {
                return;
            } else if (statement.getBlocks().length === 0) return;
            else {
                this.executor.stepInto(statement);
                return Entry.STATIC.BREAK;
            }
        },
    },
    maze_step_if_2: {
        skeleton: 'basic_loop',
        mode: 'maze',
        color: '#498DEB',
        syntax: ['BasicIf', "front == 'bee'"],
        params: [
            {
                type: 'Image',
                img: '../../../img/assets/ntry/bitmap/maze2/obstacle_01.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/if.png',
                size: 24,
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
        ],
        func: function() {
            if (this.isContinue) return;

            var entities = Ntry.entityManager.getEntitiesByComponent(
                Ntry.STATIC.UNIT
            );

            var entity;
            for (var key in entities) entity = entities[key];

            var unitComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.UNIT
            );
            var gridComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.GRID
            );

            var grid = { x: gridComp.x, y: gridComp.y };
            Ntry.addVectorByDirection(grid, unitComp.direction, 1);

            var fitEntities = Ntry.entityManager.find(
                {
                    type: Ntry.STATIC.GRID,
                    x: grid.x,
                    y: grid.y,
                },
                {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.OBSTACLE_BEE,
                }
            );

            this.isContinue = true;

            var statement = this.block.statements[0];
            if (fitEntities.length === 0) {
                return;
            } else if (statement.getBlocks().length === 0) return;
            else {
                this.executor.stepInto(statement);
                return Entry.STATIC.BREAK;
            }
        },
    },
    maze_call_function: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#B57242',
        syntax: ['Scope', 'promise'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/function.png',
                size: 24,
            },
        ],
        func: function() {
            if (!this.funcExecutor) {
                var codes = Ntry.entityManager.getEntitiesByComponent(
                    Ntry.STATIC.CODE
                );

                for (var key in codes) {
                    var code = codes[key].components[Ntry.STATIC.CODE].code;
                    this.funcExecutor = new Entry.Executor(
                        code.getEventMap('define')[0]
                    );
                }
            }

            this.funcExecutor.execute();
            if (this.funcExecutor.scope.block === null) return;
            else return Entry.STATIC.BREAK;
        },
    },
    maze_define_function: {
        skeleton: 'basic_define',
        mode: 'maze',
        color: '#B57242',
        event: 'define',
        syntax: ['BasicFunction'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/function.png',
                size: 24,
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
        ],
        func: function(executor) {
            if (this.executed) return;
            var statement = this.block.statements[0];
            if (statement.getBlocks().length === 0) return;
            this.executor.stepInto(statement);
            this.executed = true;
            return Entry.STATIC.BREAK;
        },
    },
    maze_step_if_3: {
        skeleton: 'basic_loop',
        mode: 'maze',
        color: '#498DEB',
        syntax: ['BasicIf', 'front == banana'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/ntry/block_inner/if_target_3.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/if.png',
                size: 24,
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
        ],
        func: function() {
            if (this.isContinue) return;

            var entities = Ntry.entityManager.getEntitiesByComponent(
                Ntry.STATIC.UNIT
            );

            var entity;
            for (var key in entities) entity = entities[key];

            var unitComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.UNIT
            );
            var gridComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.GRID
            );

            var grid = { x: gridComp.x, y: gridComp.y };
            Ntry.addVectorByDirection(grid, unitComp.direction, 1);

            var fitEntities = Ntry.entityManager.find(
                {
                    type: Ntry.STATIC.GRID,
                    x: grid.x,
                    y: grid.y,
                },
                {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.OBSTACLE_BANANA,
                }
            );

            this.isContinue = true;

            var statement = this.block.statements[0];
            if (fitEntities.length === 0) {
                return;
            } else if (statement.getBlocks().length === 0) return;
            else {
                this.executor.stepInto(statement);
                return Entry.STATIC.BREAK;
            }
        },
    },
    maze_step_if_4: {
        skeleton: 'basic_loop',
        mode: 'maze',
        color: '#498DEB',
        syntax: ['BasicIf', 'front == wall'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/ntry/block_inner/if_target_2.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/if.png',
                size: 24,
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
        ],
        func: function() {
            if (this.isContinue) return;

            var entities = Ntry.entityManager.getEntitiesByComponent(
                Ntry.STATIC.UNIT
            );

            var entity;
            for (var key in entities) entity = entities[key];

            var unitComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.UNIT
            );
            var gridComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.GRID
            );

            var grid = { x: gridComp.x, y: gridComp.y };
            Ntry.addVectorByDirection(grid, unitComp.direction, 1);

            var fitEntities = Ntry.entityManager.find(
                {
                    type: Ntry.STATIC.GRID,
                    x: grid.x,
                    y: grid.y,
                },
                {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.WALL,
                }
            );

            this.isContinue = true;

            var statement = this.block.statements[0];
            if (fitEntities.length === 0) {
                return;
            } else if (statement.getBlocks().length === 0) return;
            else {
                this.executor.stepInto(statement);
                return Entry.STATIC.BREAK;
            }
        },
    },
    maze_step_move_step: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#A751E3',
        syntax: ['Scope', 'move'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/moveStep.png',
                size: 24,
            },
        ],
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var self = this;
                var callBack = function() {
                    self.isAction = false;
                };
                // turn direction
                Ntry.dispatchEvent('unitAction', Ntry.STATIC.WALK, callBack);

                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    maze_step_rotate_left: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#A751E3',
        syntax: ['Scope', 'left'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/turnL.png',
                size: 24,
            },
        ],
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var self = this;
                var callBack = function() {
                    self.isAction = false;
                };

                // turn direction
                Ntry.dispatchEvent(
                    'unitAction',
                    Ntry.STATIC.TURN_LEFT,
                    callBack
                );

                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    maze_step_rotate_right: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#A751E3',
        syntax: ['Scope', 'right'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/turnR.png',
                size: 24,
            },
        ],
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var self = this;
                var callBack = function() {
                    self.isAction = false;
                };

                // turn direction
                Ntry.dispatchEvent(
                    'unitAction',
                    Ntry.STATIC.TURN_RIGHT,
                    callBack
                );

                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    maze_step_forward: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#A751E3',
        syntax: ['Scope', 'move'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/moveStep.png',
                size: 24,
            },
        ],
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var self = this;
                var callBack = function() {
                    self.isAction = false;
                };
                // turn direction
                Ntry.dispatchEvent('unitAction', Ntry.STATIC.WALK, callBack);

                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    maze_turn_right: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#A751E3',
        syntax: ['Scope', 'turn_right'],
        params: [
            {
                type: 'Indicator',
                img: '../../../img/assets/week/blocks/right_ic.png',
                size: 12,
            },
        ],
        func: function() {
            if (this.isDead) {
                return Entry.STATIC.BREAK;
            } else if (this.executor.register.isTurned) {
                Ntry.dispatchEvent('startEnemyWalk', false, function() {});
                this.isDead = true;
                return Entry.STATIC.BREAK;
            } else {
                Ntry.unit.components[Ntry.STATIC.UNIT].direction =
                    Ntry.STATIC.EAST;
                this.executor.register.isTurned = true;
            }
        },
    },
    maze_turn_left: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#A751E3',
        syntax: ['Scope', 'turn_left'],
        params: [
            {
                type: 'Indicator',
                img: '../../../img/assets/week/blocks/left_ic.png',
                size: 12,
            },
        ],
        func: function() {
            if (this.isDead) {
                return Entry.STATIC.BREAK;
            } else if (this.executor.register.isTurned) {
                Ntry.dispatchEvent('startEnemyWalk', false, function() {});
                this.isDead = true;
                return Entry.STATIC.BREAK;
            } else {
                Ntry.unit.components[Ntry.STATIC.UNIT].direction =
                    Ntry.STATIC.WEST;
                this.executor.register.isTurned = true;
            }
        },
    },
    maze_step_if_left_monster: {
        skeleton: 'basic_double_loop',
        mode: 'maze',
        color: '#498DEB',
        syntax: ['BasicIf', 'left == monster'],
        params: [
            {
                type: 'Indicator',
                img: '../../../img/assets/week/blocks/if.png',
                size: 12,
            },
            {
                type: 'LineBreak',
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
            {
                accept: 'basic',
            },
        ],
        statementsKeyMap: {
            STACK_IF: 0,
            STACK_ELSE: 1,
        },
        func: function(sprite, script) {
            if (this.isContinue) return;
            var unitComp = Ntry.entityManager.getComponent(
                Ntry.unit.id,
                Ntry.STATIC.UNIT
            );
            var gridComp = Ntry.entityManager.getComponent(
                Ntry.unit.id,
                Ntry.STATIC.GRID
            );
            var grid = { x: gridComp.x - 1, y: gridComp.y };
            var fitEntities = Ntry.entityManager
                .find({
                    type: Ntry.STATIC.GRID,
                    x: grid.x,
                    y: grid.y,
                })
                .filter(function(e) {
                    return e.components[Ntry.STATIC.ENEMY];
                });
            this.isContinue = true;
            if (fitEntities.length === 0) {
                return script.getStatement('STACK_ELSE', script);
            } else {
                return script.getStatement('STACK_IF', script);
            }
        },
    },
    maze_step_if_right_monster: {
        skeleton: 'basic_double_loop',
        mode: 'maze',
        color: '#498DEB',
        syntax: ['BasicIf', 'right == monster'],
        params: [
            {
                type: 'Indicator',
                img: '../../../img/assets/week/blocks/if.png',
                size: 12,
            },
            {
                type: 'LineBreak',
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
            {
                accept: 'basic',
            },
        ],
        statementsKeyMap: {
            STACK_IF: 0,
            STACK_ELSE: 1,
        },
        func: function(sprite, script) {
            if (this.isContinue) return;
            var unitComp = Ntry.entityManager.getComponent(
                Ntry.unit.id,
                Ntry.STATIC.UNIT
            );
            var gridComp = Ntry.entityManager.getComponent(
                Ntry.unit.id,
                Ntry.STATIC.GRID
            );
            var grid = { x: gridComp.x + 1, y: gridComp.y };
            var fitEntities = Ntry.entityManager
                .find({
                    type: Ntry.STATIC.GRID,
                    x: grid.x,
                    y: grid.y,
                })
                .filter(function(e) {
                    return e.components[Ntry.STATIC.ENEMY];
                });
            this.isContinue = true;
            if (fitEntities.length === 0) {
                return script.getStatement('STACK_ELSE', script);
            } else {
                return script.getStatement('STACK_IF', script);
            }
        },
    },
    maze_step_if_yeti: {
        skeleton: 'basic_double_loop',
        mode: 'maze',
        color: '#498DEB',
        syntax: ['BasicIf', 'front == yeti'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/yeti.png',
                size: 24,
            },
            {
                type: 'Indicator',
                img: '../../../img/assets/week/blocks/if.png',
                size: 12,
            },
            {
                type: 'LineBreak',
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
            {
                accept: 'basic',
            },
        ],
        statementsKeyMap: {
            STACK_IF: 0,
            STACK_ELSE: 1,
        },
        func: function(sprite, script) {
            if (this.isContinue) return;
            var unitComp = Ntry.entityManager.getComponent(
                Ntry.unit.id,
                Ntry.STATIC.UNIT
            );
            var gridComp = Ntry.entityManager.getComponent(
                Ntry.unit.id,
                Ntry.STATIC.GRID
            );
            var grid = { x: gridComp.x, y: gridComp.y };
            Ntry.addVectorByDirection(grid, unitComp.direction, 1);
            var fitEntities = Ntry.entityManager.find(
                {
                    type: Ntry.STATIC.GRID,
                    x: grid.x,
                    y: grid.y,
                },
                {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.OBSTACLE_YETI,
                }
            );
            this.isContinue = true;
            if (fitEntities.length === 0) {
                return script.getStatement('STACK_ELSE', script);
            } else {
                return script.getStatement('STACK_IF', script);
            }
        },
    },
    maze_repeat_until_beat_monster: {
        parent: 'repeat_inf',
        params: [
            {
                type: 'Indicator',
                img: '../../../img/assets/week/blocks/for.png',
                size: 12,
            },
        ],
    },
    maze_ladder_climb: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#71C11B',
        emphasizedColor: '#9BDB40',
        syntax: ['Scope', 'climb'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/ladder.png',
                size: 24,
            },
        ],
        func: function(sprite, script) {
            if (!script.isContinue) {
                script.isContinue = true;
                script.isAction = true;
                var entities = Ntry.entityManager.getEntitiesByComponent(
                    Ntry.STATIC.UNIT
                );
                var unitId;
                $.each(entities, function(id, entity) {
                    unitId = id;
                });
                var unitComp = Ntry.entityManager.getComponent(
                    unitId,
                    Ntry.STATIC.UNIT
                );
                var unitGrid = $.extend(
                    {},
                    Ntry.entityManager.getComponent(unitId, Ntry.STATIC.GRID)
                );
                script.direction = unitComp.direction;
                var callBack = function() {
                    unitComp.direction = script.direction;
                    script.isAction = false;
                };
                var isCollisionPossible = false;
                if (unitGrid.y > 3) {
                    unitComp.direction = Ntry.STATIC.NORTH;
                    isCollisionPossible = Ntry.checkCollisionTile(
                        unitGrid,
                        unitComp.direction,
                        [Ntry.STATIC.LADDER],
                        2
                    );
                } else {
                    unitComp.direction = Ntry.STATIC.SOUTH;
                    var tile = Ntry.getTileByGrid(unitGrid);
                    if (tile.tileType === Ntry.STATIC.LADDER) {
                        isCollisionPossible = true;
                    }
                }
                if (isCollisionPossible) {
                    Ntry.dispatchEvent(
                        'unitAction',
                        Ntry.STATIC.CLIMB,
                        callBack
                    );
                } else {
                    Ntry.dispatchEvent(
                        'unitAction',
                        Ntry.STATIC.NOT_FOUND_LADDER,
                        callBack
                    );
                }
                return Entry.STATIC.BREAK;
            } else if (script.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete script.isAction;
                delete script.isContinue;
            }
        },
    },
    maze_attack_lupin: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#ef6d6a',
        emphasizedColor: '#f29999',
        syntax: ['Scope', 'yoyo'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/lupin.png',
                size: 24,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/pinkbean_ic.png',
                size: 24,
            },
        ],
        func: function(sprite, script) {
            if (!script.isContinue) {
                var entities = Ntry.entityManager.getEntitiesByComponent(
                    Ntry.STATIC.UNIT
                );
                var unitId;
                $.each(entities, function(id, entity) {
                    unitId = id;
                });
                var unitComp = Ntry.entityManager.getComponent(
                    unitId,
                    Ntry.STATIC.UNIT
                );
                script.isContinue = true;
                script.isAction = true;
                var isFoundMushroom = false;
                var grid = $.extend(
                    {},
                    Ntry.entityManager.getComponent(unitId, Ntry.STATIC.GRID)
                );
                for (var i = 0; i < 2; i++) {
                    Ntry.addVectorByDirection(grid, unitComp.direction, 1);
                    var findTile = Ntry.entityManager.find(
                        {
                            type: Ntry.STATIC.GRID,
                            x: grid.x,
                            y: grid.y,
                        },
                        {
                            type: Ntry.STATIC.TILE,
                            tileType: Ntry.STATIC.OBSTACLE_MUSHROOM,
                        }
                    );
                    if (findTile && findTile.length) {
                        isFoundMushroom = true;
                    }
                }
                if (isFoundMushroom) {
                    Ntry.dispatchEvent(
                        'unitAction',
                        Ntry.STATIC.WRONG_ATTACK_OBSTACLE,
                        function() {
                            script.isAction = false;
                        }
                    );
                    return Entry.STATIC.BREAK;
                }
                var unitGrid = $.extend(
                    {},
                    Ntry.entityManager.getComponent(unitId, Ntry.STATIC.GRID)
                );
                var isCollisionPossible = Ntry.checkCollisionTile(
                    unitGrid,
                    unitComp.direction,
                    [Ntry.STATIC.OBSTACLE_LUPIN],
                    2
                );
                if (!isCollisionPossible) {
                    Ntry.dispatchEvent(
                        'unitAction',
                        Ntry.STATIC.NOT_FOUND_DESTORY_OBJECT,
                        function() {
                            script.isAction = false;
                        }
                    );
                    return Entry.STATIC.BREAK;
                }
                var callBack = function() {
                    Ntry.dispatchEvent('playSound', 'dieLupin');
                    Ntry.dispatchEvent('destroyObstacle', 2, function(state) {
                        script.isAction = false;
                    });
                };
                Ntry.dispatchEvent(
                    'unitAction',
                    Ntry.STATIC.ATTACK_LUPIN,
                    callBack
                );
                return Entry.STATIC.BREAK;
            } else if (script.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete script.isAction;
                delete script.isContinue;
            }
        },
    },
    maze_attack_both_side: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#ef6d6a',
        emphasizedColor: '#f29999',
        syntax: ['Scope', 'both_side'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/pinkbean_ic.png',
                size: 24,
            },
        ],
        func: function(sprite, script) {
            if (!script.isContinue) {
                Ntry.dispatchEvent('stopEnemyWalk');
                this.executor.register.isTurned = false;
                script.isContinue = true;
                script.isAction = true;
                var grid = $.extend(
                    { type: Ntry.STATIC.GRID },
                    Ntry.entityManager.getComponent(
                        Ntry.unit.id,
                        Ntry.STATIC.GRID
                    )
                );
                var backGrid = $.extend(
                    { type: Ntry.STATIC.GRID },
                    Ntry.entityManager.getComponent(
                        Ntry.unit.id,
                        Ntry.STATIC.GRID
                    )
                );
                Ntry.addVectorByDirection(grid, Ntry.unitComp.direction, 1);
                Ntry.addVectorByDirection(
                    backGrid,
                    Ntry.unitComp.direction,
                    -1
                );
                var frontExist = !!Ntry.entityManager
                    .find(grid)
                    .filter(function(e) {
                        return e.components[Ntry.STATIC.ENEMY];
                    }).length;
                var backExist = !!Ntry.entityManager
                    .find(backGrid)
                    .filter(function(e) {
                        return e.components[Ntry.STATIC.ENEMY];
                    }).length;
                if (!frontExist || !backExist) {
                    Ntry.dispatchEvent(
                        'unitAction',
                        Ntry.STATIC.BOTH_SIDE_FAIL,
                        function() {
                            script.isAction = false;
                        }
                    );
                    return Entry.STATIC.BREAK;
                }
                Ntry.dispatchEvent('destroyObstacle', 1, function(state) {});
                Ntry.dispatchEvent('destroyObstacle', -1, function(state) {});
                var callBack = function() {
                    Ntry.dispatchEvent('startEnemyWalk', true, function() {
                        script.isAction = false;
                    });
                };
                Ntry.dispatchEvent(
                    'unitAction',
                    Ntry.STATIC.BOTH_SIDE,
                    callBack
                );
                return Entry.STATIC.BREAK;
            } else if (script.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete script.isAction;
                delete script.isContinue;
            }
        },
    },
    maze_attack_pepe: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#ef6d6a',
        emphasizedColor: '#f29999',
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/pepe.png',
                size: 24,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/pinkbean_ic.png',
                size: 24,
            },
        ],
        func: function(sprite, script) {
            if (!script.isContinue) {
                Ntry.dispatchEvent('stopEnemyWalk');
                this.executor.register.isTurned = false;
                script.isContinue = true;
                script.isAction = true;
                var grid = $.extend(
                    { type: Ntry.STATIC.GRID },
                    Ntry.entityManager.getComponent(
                        Ntry.unit.id,
                        Ntry.STATIC.GRID
                    )
                );
                var backGrid = $.extend(
                    { type: Ntry.STATIC.GRID },
                    Ntry.entityManager.getComponent(
                        Ntry.unit.id,
                        Ntry.STATIC.GRID
                    )
                );
                Ntry.addVectorByDirection(grid, Ntry.unitComp.direction, 1);
                var findTile = Ntry.entityManager.find(grid, {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.OBSTACLE_PEPE,
                });
                Ntry.addVectorByDirection(
                    backGrid,
                    Ntry.unitComp.direction,
                    -1
                );
                var findBackTile = Ntry.entityManager
                    .find(backGrid)
                    .filter(function(e) {
                        return e.components[Ntry.STATIC.ENEMY];
                    });
                var frontEnemyExist = !!Ntry.entityManager
                    .find(grid)
                    .filter(function(e) {
                        return e.components[Ntry.STATIC.ENEMY];
                    }).length;
                var frontEnemyValid = !!findTile.length;
                var backEnemyExist = !!findBackTile.length;
                if (frontEnemyValid && !backEnemyExist) {
                    // success
                    var callBack = function() {
                        Ntry.dispatchEvent('destroyObstacle', 1, function(
                            state
                        ) {});
                        Ntry.dispatchEvent('startEnemyWalk', true, function() {
                            script.isAction = false;
                        });
                    };
                    Ntry.dispatchEvent(
                        'unitAction',
                        Ntry.STATIC.PEPE,
                        callBack
                    );
                } else if (frontEnemyValid && backEnemyExist) {
                    // attack and dead
                    var callBack = function() {
                        Ntry.dispatchEvent('destroyObstacle', 1, function(
                            state
                        ) {});
                        Ntry.dispatchEvent(
                            'startEnemyWalk',
                            false,
                            function() {}
                        );
                    };
                    Ntry.dispatchEvent(
                        'unitAction',
                        Ntry.STATIC.PEPE,
                        callBack
                    );
                } else if (backEnemyExist) {
                    // dead
                    if (frontEnemyExist)
                        Ntry.dispatchEvent(
                            'unitAction',
                            Ntry.STATIC.PEPE_FAIL,
                            function() {
                                script.isAction = false;
                            }
                        );
                    else
                        Ntry.dispatchEvent(
                            'startEnemyWalk',
                            false,
                            function() {}
                        );
                } else {
                    // music time
                    Ntry.dispatchEvent(
                        'unitAction',
                        Ntry.STATIC.PEPE_FAIL,
                        function() {
                            script.isAction = false;
                        }
                    );
                }
                return Entry.STATIC.BREAK;
            } else if (script.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete script.isAction;
                delete script.isContinue;
            }
        },
    },
    maze_attack_yeti: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#ef6d6a',
        emphasizedColor: '#f29999',
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/yeti.png',
                size: 24,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/pinkbean_ic.png',
                size: 24,
            },
        ],
        func: function(sprite, script) {
            if (!script.isContinue) {
                Ntry.dispatchEvent('stopEnemyWalk');
                this.executor.register.isTurned = false;
                script.isContinue = true;
                script.isAction = true;
                var grid = $.extend(
                    { type: Ntry.STATIC.GRID },
                    Ntry.entityManager.getComponent(
                        Ntry.unit.id,
                        Ntry.STATIC.GRID
                    )
                );
                var backGrid = $.extend(
                    { type: Ntry.STATIC.GRID },
                    Ntry.entityManager.getComponent(
                        Ntry.unit.id,
                        Ntry.STATIC.GRID
                    )
                );
                Ntry.addVectorByDirection(grid, Ntry.unitComp.direction, 1);
                var findTile = Ntry.entityManager.find(grid, {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.OBSTACLE_YETI,
                });
                Ntry.addVectorByDirection(
                    backGrid,
                    Ntry.unitComp.direction,
                    -1
                );
                var findBackTile = Ntry.entityManager
                    .find(backGrid)
                    .filter(function(e) {
                        return e.components[Ntry.STATIC.ENEMY];
                    });
                var frontEnemyExist = !!Ntry.entityManager
                    .find(grid)
                    .filter(function(e) {
                        return e.components[Ntry.STATIC.ENEMY];
                    }).length;
                var frontEnemyValid = !!findTile.length;
                var backEnemyExist = !!findBackTile.length;
                if (frontEnemyValid && !backEnemyExist) {
                    // success
                    var callBack = function() {
                        Ntry.dispatchEvent('destroyObstacle', 1, function(
                            state
                        ) {});
                        Ntry.dispatchEvent('startEnemyWalk', true, function() {
                            script.isAction = false;
                        });
                    };
                    Ntry.dispatchEvent(
                        'unitAction',
                        Ntry.STATIC.PEPE,
                        callBack
                    );
                } else if (frontEnemyValid && backEnemyExist) {
                    // attack and dead
                    var callBack = function() {
                        Ntry.dispatchEvent('destroyObstacle', 1, function(
                            state
                        ) {});
                        Ntry.dispatchEvent(
                            'startEnemyWalk',
                            false,
                            function() {}
                        );
                    };
                    Ntry.dispatchEvent(
                        'unitAction',
                        Ntry.STATIC.PEPE,
                        callBack
                    );
                } else if (backEnemyExist) {
                    // dead
                    if (frontEnemyExist)
                        Ntry.dispatchEvent(
                            'unitAction',
                            Ntry.STATIC.YETI_FAIL,
                            function() {
                                script.isAction = false;
                            }
                        );
                    else
                        Ntry.dispatchEvent(
                            'startEnemyWalk',
                            false,
                            function() {}
                        );
                } else {
                    // music time
                    Ntry.dispatchEvent(
                        'unitAction',
                        Ntry.STATIC.YETI_FAIL,
                        function() {
                            script.isAction = false;
                        }
                    );
                }
                return Entry.STATIC.BREAK;
            } else if (script.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete script.isAction;
                delete script.isContinue;
            }
        },
    },
    maze_attack_mushroom: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#ef6d6a',
        emphasizedColor: '#f29999',
        syntax: ['Scope', 'both_side'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/mushroom.png',
                size: 24,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/pinkbean_ic.png',
                size: 24,
            },
        ],
        func: function(sprite, script) {
            if (!script.isContinue) {
                var entities = Ntry.entityManager.getEntitiesByComponent(
                    Ntry.STATIC.UNIT
                );
                var unitId;
                $.each(entities, function(id, entity) {
                    unitId = id;
                });
                var unitComp = Ntry.entityManager.getComponent(
                    unitId,
                    Ntry.STATIC.UNIT
                );
                var unitGrid = $.extend(
                    {},
                    Ntry.entityManager.getComponent(unitId, Ntry.STATIC.GRID)
                );
                var isCollisionPossible = Ntry.checkCollisionTile(
                    unitGrid,
                    unitComp.direction,
                    [Ntry.STATIC.OBSTACLE_MUSHROOM],
                    1
                );
                script.isContinue = true;
                script.isAction = true;
                if (!isCollisionPossible) {
                    Ntry.dispatchEvent(
                        'unitAction',
                        Ntry.STATIC.NOT_FOUND_DESTORY_OBJECT,
                        function() {
                            script.isAction = false;
                        }
                    );
                    // Ntry.dispatchEvent("unitAction", Ntry.STATIC.NOT_FOUND_MEAT, callBack);
                    return Entry.STATIC.BREAK;
                }
                var callBack = function() {
                    Ntry.dispatchEvent('destroyObstacle', 1, function(state) {
                        script.isAction = false;
                    });
                };
                Ntry.dispatchEvent(
                    'unitAction',
                    Ntry.STATIC.ATTACK_MUSHROOM,
                    callBack
                );
                return Entry.STATIC.BREAK;
            } else if (script.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete script.isAction;
                delete script.isContinue;
            }
        },
    },
    maze_attack_peti: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#ef6d6a',
        emphasizedColor: '#f29999',
        syntax: ['Scope', 'both_side'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/bigYeti.png',
                size: 24,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/pinkbean_ic.png',
                size: 24,
            },
        ],
        func: function(sprite, script) {
            if (!script.isContinue) {
                Ntry.dispatchEvent('stopEnemyWalk');
                this.executor.register.isTurned = false;
                script.isContinue = true;
                script.isAction = true;
                var grid = $.extend(
                    { type: Ntry.STATIC.GRID },
                    Ntry.entityManager.getComponent(
                        Ntry.unit.id,
                        Ntry.STATIC.GRID
                    )
                );
                var backGrid = $.extend(
                    { type: Ntry.STATIC.GRID },
                    Ntry.entityManager.getComponent(
                        Ntry.unit.id,
                        Ntry.STATIC.GRID
                    )
                );
                Ntry.addVectorByDirection(grid, Ntry.unitComp.direction, 1);
                var findTile = Ntry.entityManager.find(grid, {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.OBSTACLE_PETI,
                });
                Ntry.addVectorByDirection(
                    backGrid,
                    Ntry.unitComp.direction,
                    -1
                );
                var findBackTile = Ntry.entityManager
                    .find(backGrid)
                    .filter(function(e) {
                        return e.components[Ntry.STATIC.ENEMY];
                    });
                var frontEnemyExist = !!Ntry.entityManager
                    .find(grid)
                    .filter(function(e) {
                        return e.components[Ntry.STATIC.ENEMY];
                    }).length;
                var frontEnemyValid = !!findTile.length;
                var backEnemyExist = !!findBackTile.length;
                if (frontEnemyValid && !backEnemyExist) {
                    // success
                    Ntry.dispatchEvent('destroyObstacle', 1, function(
                        state
                    ) {});
                    var callBack = function() {
                        Ntry.dispatchEvent('startEnemyWalk', true, function() {
                            script.isAction = false;
                        });
                    };
                    Ntry.dispatchEvent(
                        'unitAction',
                        Ntry.STATIC.PETI,
                        callBack
                    );
                } else if (frontEnemyValid && backEnemyExist) {
                    // attack and dead
                    Ntry.dispatchEvent('destroyObstacle', 1, function(
                        state
                    ) {});
                    var callBack = function() {
                        Ntry.dispatchEvent(
                            'startEnemyWalk',
                            false,
                            function() {}
                        );
                    };
                    Ntry.dispatchEvent(
                        'unitAction',
                        Ntry.STATIC.PETI,
                        callBack
                    );
                } else if (backEnemyExist) {
                    // dead
                    if (frontEnemyExist)
                        Ntry.dispatchEvent(
                            'unitAction',
                            Ntry.STATIC.PETI_FAIL,
                            function() {
                                script.isAction = false;
                            }
                        );
                    else
                        Ntry.dispatchEvent(
                            'startEnemyWalk',
                            false,
                            function() {}
                        );
                } else {
                    // music time
                    Ntry.dispatchEvent(
                        'unitAction',
                        Ntry.STATIC.PETI_FAIL,
                        function() {
                            script.isAction = false;
                        }
                    );
                }
                return Entry.STATIC.BREAK;
            } else if (script.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete script.isAction;
                delete script.isContinue;
            }
        },
    },
    maze_eat_item: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#b2521d',
        emphasizedColor: '#9BDB40',
        syntax: ['Scope', 'item'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/eat.png',
                size: 24,
            },
        ],
        func: function(sprite, script) {
            if (!script.isContinue) {
                script.isContinue = true;
                script.isAction = true;
                var entities = Ntry.entityManager.getEntitiesByComponent(
                    Ntry.STATIC.UNIT
                );
                var unitId;
                $.each(entities, function(id, entity) {
                    unitId = id;
                });
                var callBack = function() {
                    script.isAction = false;
                };
                var unitComp = Ntry.entityManager.getComponent(
                    unitId,
                    Ntry.STATIC.UNIT
                );
                var unitGrid = $.extend(
                    {},
                    Ntry.entityManager.getComponent(unitId, Ntry.STATIC.GRID)
                );
                var meatEntity = Ntry.checkTileByGrid(
                    unitGrid,
                    Ntry.STATIC.MEAT
                );
                if (
                    !meatEntity ||
                    meatEntity.components[Ntry.STATIC.ITEM].isEaten
                ) {
                    Ntry.dispatchEvent(
                        'unitAction',
                        Ntry.STATIC.NOT_FOUND_MEAT,
                        callBack
                    );
                    return Entry.STATIC.BREAK;
                }
                Ntry.dispatchEvent('unlockItem');
                Ntry.dispatchEvent('unitAction', Ntry.STATIC.EAT, callBack);
                return Entry.STATIC.BREAK;
            } else if (script.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete script.isAction;
                delete script.isContinue;
            }
        },
    },
    maze_rotate_left: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#A751E3',
        syntax: ['Scope', 'left'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/turnL.png',
                size: 24,
            },
        ],
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var self = this;
                var callBack = function() {
                    self.isAction = false;
                };

                // turn direction
                Ntry.dispatchEvent(
                    'unitAction',
                    Ntry.STATIC.TURN_LEFT,
                    callBack
                );

                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    maze_rotate_right: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#A751E3',
        syntax: ['Scope', 'right'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/turnR.png',
                size: 24,
            },
        ],
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var self = this;
                var callBack = function() {
                    self.isAction = false;
                };

                // turn direction
                Ntry.dispatchEvent(
                    'unitAction',
                    Ntry.STATIC.TURN_RIGHT,
                    callBack
                );

                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    maze_moon_kick: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#2EB0E8',
        syntax: ['Scope', 'right'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/maze/sprite/moon_icon.png',
                size: 24,
            },
        ],
        func: function() {
            // TODO: func 내용은 변경해야 함.

            if (!this.isContinue) {
                var entities = Ntry.entityManager.getEntitiesByComponent(
                    Ntry.STATIC.UNIT
                );
                var unitId;
                $.each(entities, function(id, entity) {
                    unitId = id;
                });
                var unitComp = Ntry.entityManager.getComponent(
                    unitId,
                    Ntry.STATIC.UNIT
                );
                var unitGrid = $.extend(
                    {},
                    Ntry.entityManager.getComponent(unitId, Ntry.STATIC.GRID)
                );
                var isCollisionPossible = Ntry.checkCollisionTile(
                    unitGrid,
                    unitComp.direction,
                    [Ntry.STATIC.OBSTACLE_BRICK],
                    1
                );

                if (!isCollisionPossible) {
                    Ntry.dispatchEvent(
                        'playSound',
                        Ntry.STATIC.NOT_FOUND_DESTORY_OBJECT
                    );
                    Ntry.dispatchEvent(
                        'complete',
                        false,
                        Ntry.STATIC.NOT_FOUND_DESTORY_OBJECT
                    );
                    return;
                }
                this.isContinue = true;
                this.isAction = true;
                var self = this;
                var callback = function() {
                    Ntry.dispatchEvent('destroyObstacle', 1, function(state) {
                        switch (state) {
                            case Ntry.STATIC.OBSTACLE_DESTROY_SUCCESS:
                                self.isAction = false;
                                break;
                        }
                    });
                };

                // turn direction
                Ntry.dispatchEvent('unitAction', Ntry.STATIC.ATTACK, callback);

                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    maze_cony_flower_throw: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#D8617D',
        syntax: ['Scope', 'right'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/maze/sprite/cony_icon.png',
                size: 24,
            },
        ],
        func: function() {
            var self = this;
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;

                var entities = Ntry.entityManager.getEntitiesByComponent(
                    Ntry.STATIC.UNIT
                );
                var unitId, components;
                $.each(entities, function(id, entity) {
                    unitId = id;
                    components = entity.components;
                });

                var unitComp = Ntry.entityManager.getComponent(
                    unitId,
                    Ntry.STATIC.UNIT
                );
                var unitGrid = $.extend(
                    {},
                    Ntry.entityManager.getComponent(unitId, Ntry.STATIC.GRID)
                );
                var isCollisionPossible = Ntry.checkCollisionTile(
                    unitGrid,
                    unitComp.direction,
                    [Ntry.STATIC.OBSTACLE_SPIDER]
                );
                var particleZIndex = 550;
                if (unitComp.direction === Ntry.STATIC.NORTH) {
                    particleZIndex = 450;
                }
                if (!isCollisionPossible) {
                    Ntry.dispatchEvent(
                        'playSound',
                        Ntry.STATIC.NOT_FOUND_DESTORY_OBJECT
                    );
                    Ntry.dispatchEvent(
                        'complete',
                        false,
                        Ntry.STATIC.NOT_FOUND_DESTORY_OBJECT
                    );
                    return;
                }

                var particle = Ntry.entityManager.addEntity();
                Ntry.dispatchEvent(
                    'unitAction',
                    Ntry.STATIC.ATTACK,
                    function() {
                        $.each(components, function(type, component) {
                            if (+type === Ntry.STATIC.SPRITE) {
                                var cloneComponent = $.extend({}, component);
                                cloneComponent.zIndex = particleZIndex;
                                Ntry.entityManager.addComponent(
                                    particle.id,
                                    cloneComponent
                                );
                            } else if (+type != Ntry.STATIC.UNIT) {
                                Ntry.entityManager.addComponent(
                                    particle.id,
                                    component
                                );
                            } else {
                                Ntry.entityManager.addComponent(particle.id, {
                                    type: Ntry.STATIC.PARTICLE,
                                    direction: component.direction,
                                    collisionList: [
                                        Ntry.STATIC.OBSTACLE_SPIDER,
                                    ],
                                });
                            }
                        });
                        Ntry.dispatchEvent('particleAction', {
                            entityId: particle.id,
                            actionType: Ntry.STATIC.FLOWER_ATTACK,
                            callback: function() {
                                Ntry.entityManager.removeEntity(particle.id);
                                self.isAction = false;
                            },
                        });
                    }
                );
                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    maze_cony_flower_throw2: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#D8617D',
        template: Lang.template.maze_cony_flower_throw,
        syntax: ['Scope', 'right'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/maze/sprite/cony_icon.png',
                size: 24,
            },
        ],
        func: function() {
            var self = this;
            if (!this.isContinue) {
                var entities = Ntry.entityManager.getEntitiesByComponent(
                    Ntry.STATIC.UNIT
                );

                var unitId, components;
                $.each(entities, function(id, entity) {
                    unitId = id;
                    components = entity.components;
                });

                var unitComp = Ntry.entityManager.getComponent(
                    unitId,
                    Ntry.STATIC.UNIT
                );
                var unitGrid = $.extend(
                    {},
                    Ntry.entityManager.getComponent(unitId, Ntry.STATIC.GRID)
                );
                var isCollisionPossible = Ntry.checkCollisionTile(
                    unitGrid,
                    unitComp.direction,
                    [
                        Ntry.STATIC.OBSTACLE_ENERMY5,
                        Ntry.STATIC.OBSTACLE_ENERMY4,
                    ],
                    2,
                    true
                );
                var particleZIndex = 550;
                if (unitComp.direction === Ntry.STATIC.NORTH) {
                    particleZIndex = 450;
                }
                if (!isCollisionPossible) {
                    Ntry.dispatchEvent(
                        'playSound',
                        Ntry.STATIC.NOT_FOUND_DESTORY_OBJECT
                    );
                    Ntry.dispatchEvent(
                        'complete',
                        false,
                        Ntry.STATIC.NOT_FOUND_DESTORY_OBJECT
                    );
                    return;
                }

                this.isContinue = true;
                this.isAction = true;

                var particle = Ntry.entityManager.addEntity();

                Ntry.dispatchEvent(
                    'unitAction',
                    Ntry.STATIC.ATTACK,
                    function() {
                        $.each(components, function(type, component) {
                            if (+type === Ntry.STATIC.SPRITE) {
                                var cloneComponent = $.extend({}, component);
                                cloneComponent.zIndex = particleZIndex;
                                Ntry.entityManager.addComponent(
                                    particle.id,
                                    cloneComponent
                                );
                            } else if (+type != Ntry.STATIC.UNIT) {
                                Ntry.entityManager.addComponent(
                                    particle.id,
                                    component
                                );
                            } else {
                                Ntry.entityManager.addComponent(particle.id, {
                                    type: Ntry.STATIC.PARTICLE,
                                    direction: component.direction,
                                    collisionList: [
                                        Ntry.STATIC.OBSTACLE_ENERMY5,
                                        ,
                                        Ntry.STATIC.OBSTACLE_ENERMY4,
                                    ],
                                    penetrationList: [Ntry.STATIC.WALL],
                                });
                            }
                        });

                        Ntry.dispatchEvent('particleAction', {
                            entityId: particle.id,
                            actionType: Ntry.STATIC.HEART_ATTACK,
                            callback: function() {
                                Ntry.entityManager.removeEntity(particle.id);
                                self.isAction = false;
                            },
                        });
                    }
                );
                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    maze_james_heart: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#D39D18',
        syntax: ['Scope', 'right'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/maze/sprite/james_icon.png',
                size: 24,
            },
        ],
        func: function() {
            var self = this;
            if (!this.isContinue) {
                var entities = Ntry.entityManager.getEntitiesByComponent(
                    Ntry.STATIC.UNIT
                );

                var unitId, components;
                $.each(entities, function(id, entity) {
                    unitId = id;
                    components = entity.components;
                });

                var unitComp = Ntry.entityManager.getComponent(
                    unitId,
                    Ntry.STATIC.UNIT
                );
                var unitGrid = $.extend(
                    {},
                    Ntry.entityManager.getComponent(unitId, Ntry.STATIC.GRID)
                );
                var isCollisionPossible = Ntry.checkCollisionTile(
                    unitGrid,
                    unitComp.direction,
                    [
                        Ntry.STATIC.OBSTACLE_ENERMY1,
                        Ntry.STATIC.OBSTACLE_ENERMY2,
                        Ntry.STATIC.OBSTACLE_ENERMY3,
                        Ntry.STATIC.OBSTACLE_ENERMY5,
                    ]
                );
                var particleZIndex = 550;
                if (unitComp.direction === Ntry.STATIC.NORTH) {
                    particleZIndex = 450;
                }
                if (!isCollisionPossible) {
                    Ntry.dispatchEvent(
                        'playSound',
                        Ntry.STATIC.NOT_FOUND_DESTORY_OBJECT
                    );
                    Ntry.dispatchEvent(
                        'complete',
                        false,
                        Ntry.STATIC.NOT_FOUND_DESTORY_OBJECT
                    );
                    return;
                }

                this.isContinue = true;
                this.isAction = true;

                var particle = Ntry.entityManager.addEntity();

                Ntry.dispatchEvent(
                    'unitAction',
                    Ntry.STATIC.ATTACK,
                    function() {
                        $.each(components, function(type, component) {
                            if (+type === Ntry.STATIC.SPRITE) {
                                var cloneComponent = $.extend({}, component);
                                cloneComponent.zIndex = particleZIndex;
                                Ntry.entityManager.addComponent(
                                    particle.id,
                                    cloneComponent
                                );
                            } else if (+type != Ntry.STATIC.UNIT) {
                                Ntry.entityManager.addComponent(
                                    particle.id,
                                    component
                                );
                            } else {
                                Ntry.entityManager.addComponent(particle.id, {
                                    type: Ntry.STATIC.PARTICLE,
                                    direction: component.direction,
                                    collisionList: [
                                        Ntry.STATIC.OBSTACLE_ENERMY1,
                                        Ntry.STATIC.OBSTACLE_ENERMY2,
                                        Ntry.STATIC.OBSTACLE_ENERMY3,
                                        Ntry.STATIC.OBSTACLE_ENERMY5,
                                    ],
                                });
                            }
                        });

                        Ntry.dispatchEvent('particleAction', {
                            entityId: particle.id,
                            actionType: Ntry.STATIC.HEART_ATTACK,
                            callback: function() {
                                Ntry.entityManager.removeEntity(particle.id);
                                self.isAction = false;
                            },
                        });
                    }
                );
                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    maze_james_heart2: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#D39D18',
        template: Lang.template.maze_james_heart,
        syntax: ['Scope', 'right'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/maze/sprite/james_icon.png',
                size: 24,
            },
        ],
        func: function() {
            var self = this;
            if (!this.isContinue) {
                var entities = Ntry.entityManager.getEntitiesByComponent(
                    Ntry.STATIC.UNIT
                );

                var unitId, components;
                $.each(entities, function(id, entity) {
                    unitId = id;
                    components = entity.components;
                });

                var unitComp = Ntry.entityManager.getComponent(
                    unitId,
                    Ntry.STATIC.UNIT
                );
                var unitGrid = $.extend(
                    {},
                    Ntry.entityManager.getComponent(unitId, Ntry.STATIC.GRID)
                );
                var isCollisionPossible = Ntry.checkCollisionTile(
                    unitGrid,
                    unitComp.direction,
                    [
                        Ntry.STATIC.OBSTACLE_ENERMY3,
                        Ntry.STATIC.OBSTACLE_ENERMY4,
                    ],
                    2
                );
                var particleZIndex = 550;
                if (unitComp.direction === Ntry.STATIC.NORTH) {
                    particleZIndex = 450;
                }
                if (!isCollisionPossible) {
                    Ntry.dispatchEvent(
                        'playSound',
                        Ntry.STATIC.NOT_FOUND_DESTORY_OBJECT
                    );
                    Ntry.dispatchEvent(
                        'complete',
                        false,
                        Ntry.STATIC.NOT_FOUND_DESTORY_OBJECT
                    );
                    return;
                }

                this.isContinue = true;
                this.isAction = true;

                var particle = Ntry.entityManager.addEntity();

                Ntry.dispatchEvent(
                    'unitAction',
                    Ntry.STATIC.ATTACK,
                    function() {
                        $.each(components, function(type, component) {
                            if (+type === Ntry.STATIC.SPRITE) {
                                var cloneComponent = $.extend({}, component);
                                cloneComponent.zIndex = particleZIndex;
                                Ntry.entityManager.addComponent(
                                    particle.id,
                                    cloneComponent
                                );
                            } else if (+type != Ntry.STATIC.UNIT) {
                                Ntry.entityManager.addComponent(
                                    particle.id,
                                    component
                                );
                            } else {
                                Ntry.entityManager.addComponent(particle.id, {
                                    type: Ntry.STATIC.PARTICLE,
                                    direction: component.direction,
                                    collisionList: [
                                        Ntry.STATIC.OBSTACLE_ENERMY3,
                                        Ntry.STATIC.OBSTACLE_ENERMY4,
                                        Ntry.STATIC.OBSTACLE_ENERMY_AREA,
                                    ],
                                    penetrationList: [
                                        Ntry.STATIC.OBSTACLE_ENERMY_AREA,
                                    ],
                                });
                            }
                        });

                        Ntry.dispatchEvent('particleAction', {
                            entityId: particle.id,
                            actionType: Ntry.STATIC.HEART_ATTACK,
                            callback: function() {
                                Ntry.entityManager.removeEntity(particle.id);
                                self.isAction = false;
                            },
                        });
                    }
                );
                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    maze_iron_switch: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#748d69',
        syntax: ['Scope', 'right'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/maze/sprite/iron_icon.png',
                size: 24,
            },
        ],
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var eventCount = 0;
                var self = this;
                var gridSize = Ntry.configManager.getConfig('gridSize');
                var tileSize = Ntry.configManager.getConfig('tileSize').width;
                var entities = Ntry.entityManager.getEntitiesByComponent(
                    Ntry.STATIC.OBSTACLE
                );

                for (var id in entities) {
                    var obstacleComp = Ntry.entityManager.getComponent(
                        id,
                        Ntry.STATIC.OBSTACLE
                    );
                    if (obstacleComp.tileType === Ntry.STATIC.OBSTACLE_IRON) {
                        var obstacleGrid = Ntry.entityManager.getComponent(
                            id,
                            Ntry.STATIC.GRID
                        );
                        var obstaclePosition = Ntry.entityManager.getComponent(
                            id,
                            Ntry.STATIC.POSITION
                        );
                        var grid = {
                            x: obstacleGrid.x,
                            y: obstacleGrid.y === 1 ? 3 : 1,
                        };

                        obstacleGrid.y = obstacleGrid.y === 1 ? 3 : 1;

                        var deltaY = tileSize * 2;

                        if (obstacleGrid.y === 1) {
                            deltaY = -deltaY;
                        }

                        var deltaPos = {
                            x: 0,
                            y: deltaY * 0.5,
                        };

                        var deltaPos2 = {
                            x: 0,
                            y: deltaY,
                        };

                        var targetPos = {
                            minY: 0,
                            maxY: gridSize.height * tileSize,
                        };

                        if (deltaY > 0) {
                            targetPos.maxY =
                                obstacleGrid.y * tileSize + tileSize / 2;
                        } else {
                            targetPos.minY =
                                obstacleGrid.y * tileSize + tileSize / 2;
                        }

                        (function(
                            _id,
                            _deltaPos,
                            _deltaPos2,
                            _targetPos,
                            obstacleGrid
                        ) {
                            var comp = Ntry.entityManager.getComponent(
                                _id,
                                Ntry.STATIC.ANIMATE
                            );
                            if (comp) {
                                if (eventCount === 0) {
                                    self.isAction = false;
                                }
                                Ntry.entityManager.addComponent(_id, {
                                    type: Ntry.STATIC.ANIMATE,
                                    animateType: Ntry.STATIC.TRANSITION,
                                    duration: 20,
                                    option: {
                                        deltaPos: _deltaPos2,
                                        targetPos: _targetPos,
                                    },
                                    afterAnimate: function() {
                                        var unitGrid = Ntry.getUtilGrid();

                                        if (
                                            obstacleGrid.x == unitGrid.x &&
                                            obstacleGrid.y == unitGrid.y
                                        ) {
                                            Ntry.dispatchEvent(
                                                'unitAction',
                                                Ntry.STATIC.CONTACT_IRON2
                                            );
                                        }
                                    },
                                });
                            } else {
                                Ntry.entityManager.addComponent(_id, {
                                    type: Ntry.STATIC.ANIMATE,
                                    animateType: Ntry.STATIC.TRANSITION,
                                    duration: 10,
                                    option: {
                                        deltaPos: _deltaPos,
                                    },
                                    afterAnimate: function() {
                                        if (eventCount === 0) {
                                            self.isAction = false;
                                        }
                                        Ntry.entityManager.addComponent(_id, {
                                            type: Ntry.STATIC.ANIMATE,
                                            animateType: Ntry.STATIC.TRANSITION,
                                            duration: 10,
                                            option: {
                                                deltaPos: _deltaPos,
                                                targetPos: _targetPos,
                                            },
                                            afterAnimate: function() {
                                                var unitGrid = Ntry.getUtilGrid();

                                                if (
                                                    obstacleGrid.x ==
                                                        unitGrid.x &&
                                                    obstacleGrid.y == unitGrid.y
                                                ) {
                                                    console.log('충돌');
                                                    // Ntry.dispatchEvent("playSound", Ntry.STATIC.NOT_FOUND_DESTORY_OBJECT);
                                                    Ntry.dispatchEvent(
                                                        'unitAction',
                                                        Ntry.STATIC
                                                            .CONTACT_IRON2
                                                    );
                                                    // Ntry.dispatchEvent("complete", false, Ntry.STATIC.CONTACT_IRON2);
                                                }
                                            },
                                        });
                                    },
                                });
                            }
                        })(id, deltaPos, deltaPos2, targetPos, obstacleGrid);
                    }
                }
                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    maze_brown_punch: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#6C483A',
        syntax: ['Scope', 'right'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/maze/sprite/brown_icon.png',
                size: 24,
            },
        ],
        func: function() {
            if (!this.isContinue) {
                var self = this;
                var entities = Ntry.entityManager.getEntitiesByComponent(
                    Ntry.STATIC.UNIT
                );
                var unitId;
                $.each(entities, function(id, entity) {
                    unitId = id;
                });
                var unitComp = Ntry.entityManager.getComponent(
                    unitId,
                    Ntry.STATIC.UNIT
                );
                var unitGrid = $.extend(
                    {},
                    Ntry.entityManager.getComponent(unitId, Ntry.STATIC.GRID)
                );
                var isCollisionPossible = Ntry.checkCollisionTile(
                    unitGrid,
                    unitComp.direction,
                    [Ntry.STATIC.OBSTACLE_ICE],
                    1
                );

                if (!isCollisionPossible) {
                    Ntry.dispatchEvent(
                        'playSound',
                        Ntry.STATIC.NOT_FOUND_DESTORY_OBJECT
                    );
                    Ntry.dispatchEvent(
                        'complete',
                        false,
                        Ntry.STATIC.NOT_FOUND_DESTORY_OBJECT
                    );
                    return;
                }
                this.isContinue = true;
                this.isAction = true;

                var callback = function() {
                    Ntry.dispatchEvent('destroyObstacle', 1, function(state) {
                        switch (state) {
                            case Ntry.STATIC.OBSTACLE_DESTROY_SUCCESS:
                                self.isAction = false;
                                break;
                        }
                    });
                };

                // turn direction
                Ntry.dispatchEvent('unitAction', Ntry.STATIC.ATTACK, callback);

                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    maze_repeat_until_3: {
        skeleton: 'basic_loop',
        mode: 'maze',
        color: '#498DEB',
        syntax: ['BasicWhile', 'true'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/maze/bitmap/ws/tile_goal_01.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
        ],
        func: function() {
            var isGoal = false;
            var statement = this.block.statements[0];
            if (statement.getBlocks().length === 0) {
                return;
            }

            var entities = Ntry.entityManager.getEntitiesByComponent(
                Ntry.STATIC.UNIT
            );
            var entity;
            for (var key in entities) {
                entity = entities[key];
            }

            var unitComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.UNIT
            );

            if (unitComp.isStartedUnit) {
                var unitGrid = Ntry.entityManager.getComponent(
                    entity.id,
                    Ntry.STATIC.GRID
                );
                var entities = Ntry.entityManager.getEntitiesByGrid(
                    unitGrid.x,
                    unitGrid.y
                );

                for (var idx in entities) {
                    var entity = entities[idx];
                    var tile = Ntry.entityManager.getComponent(
                        entity.id,
                        Ntry.STATIC.TILE
                    );
                    var item = Ntry.entityManager.getComponent(
                        entity.id,
                        Ntry.STATIC.ITEM
                    );

                    if (
                        tile &&
                        item &&
                        tile.tileType === Ntry.STATIC.GOAL &&
                        Ntry.STATIC.GOAL_ITEM_LIST.indexOf(item.itemType) > -1
                    ) {
                        isGoal = true;
                        break;
                    }
                }
            }

            if (!isGoal) {
                this.executor.stepInto(statement);
                return Entry.STATIC.BREAK;
            }
            // Ntry.dispatchEvent('executeEnd');
        },
    },
    maze_repeat_until_4: {
        parent: 'maze_repeat_until_3',
        params: [
            {
                type: 'Image',
                img: '/img/assets/maze/bitmap/ws/tile_goal_02.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
        ],
    },
    maze_repeat_until_5: {
        parent: 'maze_repeat_until_3',
        params: [
            {
                type: 'Image',
                img: '/img/assets/maze/bitmap/ws/tile_goal_03.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
        ],
    },
    maze_repeat_until_6: {
        parent: 'maze_repeat_until_3',
        params: [
            {
                type: 'Image',
                img: '/img/assets/maze/bitmap/ws/blcok-1.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
        ],
    },
    maze_repeat_until_7: {
        parent: 'maze_repeat_until_3',
        params: [
            {
                type: 'Image',
                img: '/img/assets/maze/bitmap/ws/blcok-4.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
        ],
    },
    maze_repeat_until_8: {
        template: Lang.template.maze_repeat_until_7,
        parent: 'maze_repeat_until_3',
        params: [
            {
                type: 'Image',
                img: '/img/assets/maze/bitmap/ws/blcok-5.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
        ],
    },
    maze_repeat_until_9: {
        template: Lang.template.maze_repeat_until_7,
        parent: 'maze_repeat_until_3',
        params: [
            {
                type: 'Image',
                img: '/img/assets/maze/bitmap/ws/blcok-6.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
        ],
    },
    maze_repeat_until_10: {
        template: Lang.template.maze_repeat_until_7,
        parent: 'maze_repeat_until_3',
        params: [
            {
                type: 'Image',
                img: '/img/assets/maze/bitmap/ws/blcok-7.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
        ],
    },
    maze_repeat_until_11: {
        template: Lang.template.maze_repeat_until_7,
        parent: 'maze_repeat_until_3',
        params: [
            {
                type: 'Image',
                img: '/img/assets/maze/bitmap/ws/blcok-9.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
        ],
    },
    maze_repeat_until_12: {
        template: Lang.template.maze_repeat_until_7,
        parent: 'maze_repeat_until_3',
        params: [
            {
                type: 'Image',
                img: '/img/assets/maze/bitmap/ws/blcok-10.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
        ],
    },
    maze_repeat_until_13: {
        template: Lang.template.maze_repeat_until_7,
        parent: 'maze_repeat_until_3',
        params: [
            {
                type: 'Image',
                img: '/img/assets/maze/bitmap/ws/blcok-11.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
        ],
    },
    maze_repeat_until_14: {
        template: Lang.template.maze_repeat_until_7,
        parent: 'maze_repeat_until_3',
        params: [
            {
                type: 'Image',
                img: '/img/assets/maze/bitmap/ws/blcok-12.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
        ],
    },
    maze_repeat_until_15: {
        template: Lang.template.maze_repeat_until_7,
        parent: 'maze_repeat_until_3',
        params: [
            {
                type: 'Image',
                img: '/img/assets/maze/bitmap/ws/tile_goal_04.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
        ],
    },
    maze_repeat_until_goal: {
        parent: 'maze_repeat_until_3',
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
        ],
    },
    maze_radar_check: {
        skeleton: 'basic_boolean_field',
        mode: 'maze',
        color: '#AEB8FF',
        params: [
            {
                type: 'Dropdown',
                options: [
                    [Lang.Menus.maze_distance1, '1'],
                    [Lang.Menus.maze_distance2, '2'],
                ],
                value: '1',
                fontSize: 11,
            },
            {
                type: 'Dropdown',
                options: [
                    [Lang.Menus.maze_object_trap, 'TRAP'],
                    [Lang.Menus.maze_object_monster, 'MONSTER'],
                    [Lang.Menus.maze_object_obstacle1, 'OBSTACLE'],
                ],
                value: 'TRAP',
                fontSize: 11,
            },
        ],
        paramsKeyMap: {
            DISTANCE: 0,
            TYPE: 1,
        },
        func: function(sprite, script) {
            var distance = script.getNumberField('DISTANCE', script);
            var type = script.getField('TYPE', script);

            var entityId = Ntry.getRadarEntityIdByDistance(distance);
            var tileType;
            if (entityId) {
                var tileComp = Ntry.entityManager.getComponent(
                    entityId,
                    Ntry.STATIC.TILE
                );
                switch (tileComp.tileType) {
                    case Ntry.STATIC.OBSTACLE_HOLE:
                        tileType = 'TRAP';
                        break;
                    case Ntry.STATIC.OBSTACLE_ENERMY1:
                    case Ntry.STATIC.OBSTACLE_ENERMY2:
                    case Ntry.STATIC.OBSTACLE_ENERMY3:
                    case Ntry.STATIC.OBSTACLE_ENERMY4:
                    case Ntry.STATIC.OBSTACLE_ENERMY5:
                        tileType = 'MONSTER';
                        break;
                    case Ntry.STATIC.OBSTACLE_IRON:
                        tileType = 'OBSTACLE';
                        break;
                }
            } else {
                tileType = 'TRAP';
            }

            if (type === tileType) {
                return true;
            } else {
                return false;
            }
        },
    },
    // TODO: 해당 부분 수정 필요
    maze_step_if_5: {
        skeleton: 'basic_loop',
        mode: 'maze',
        color: '#498DEB',
        syntax: ['BasicIf', 'front == bee'],
        params: [
            {
                type: 'Image',
                img: '../../../img/assets/ntry/bitmap/maze2/obstacle_01.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/if.png',
                size: 24,
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
        ],
        func: function() {
            if (this.isContinue) return;

            var entities = Ntry.entityManager.getEntitiesByComponent(
                Ntry.STATIC.UNIT
            );

            var entity;
            for (var key in entities) entity = entities[key];

            var unitComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.UNIT
            );
            var gridComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.GRID
            );

            var grid = { x: gridComp.x, y: gridComp.y };
            Ntry.addVectorByDirection(grid, unitComp.direction, 1);

            var fitEntities = Ntry.entityManager.find(
                {
                    type: Ntry.STATIC.GRID,
                    x: grid.x,
                    y: grid.y,
                },
                {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.OBSTACLE_BEE,
                }
            );

            this.isContinue = true;

            var statement = this.block.statements[0];
            if (fitEntities.length === 0) {
                return;
            } else if (statement.getBlocks().length === 0) return;
            else {
                this.executor.stepInto(statement);
                return Entry.STATIC.BREAK;
            }
        },
    },
    // TODO: 해당 부분 수정 필요
    maze_step_if_6: {
        skeleton: 'basic_loop',
        mode: 'maze',
        color: '#498DEB',
        syntax: ['BasicIf', 'front == bee'],
        params: [
            {
                type: 'Image',
                img: '../../../img/assets/maze/bitmap/stage4/road_4_01.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/if.png',
                size: 24,
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
        ],
        func: function() {
            if (this.isContinue) return;

            var entities = Ntry.entityManager.getEntitiesByComponent(
                Ntry.STATIC.UNIT
            );

            var entity;
            for (var key in entities) entity = entities[key];

            var unitComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.UNIT
            );
            var gridComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.GRID
            );

            var grid = { x: gridComp.x, y: gridComp.y };
            Ntry.addVectorByDirection(grid, unitComp.direction, 1);

            var fitEntities = Ntry.entityManager.find(
                {
                    type: Ntry.STATIC.GRID,
                    x: grid.x,
                    y: grid.y,
                },
                {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.ROAD,
                }
            );

            this.isContinue = true;

            var statement = this.block.statements[0];
            if (fitEntities.length > 0) {
                return;
            } else if (statement.getBlocks().length === 0) {
                return;
            } else {
                this.executor.stepInto(statement);
                return Entry.STATIC.BREAK;
            }
        },
    },
    // TODO: 해당 부분 수정 필요
    maze_step_if_7: {
        skeleton: 'basic_loop',
        mode: 'maze',
        color: '#498DEB',
        syntax: ['BasicIf', 'front == ice'],
        params: [
            {
                type: 'Image',
                img: '../../../img/assets/maze/bitmap/stage4/obj_ice_01.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/if.png',
                size: 24,
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
        ],
        func: function() {
            if (this.isContinue) return;

            var entities = Ntry.entityManager.getEntitiesByComponent(
                Ntry.STATIC.UNIT
            );

            var entity;
            for (var key in entities) entity = entities[key];

            var unitComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.UNIT
            );
            var gridComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.GRID
            );

            var grid = { x: gridComp.x, y: gridComp.y };
            Ntry.addVectorByDirection(grid, unitComp.direction, 1);

            var fitEntities = Ntry.entityManager.find(
                {
                    type: Ntry.STATIC.GRID,
                    x: grid.x,
                    y: grid.y,
                },
                {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.OBSTACLE_ICE,
                }
            );

            this.isContinue = true;

            var statement = this.block.statements[0];
            if (fitEntities.length === 0) {
                return;
            } else if (statement.getBlocks().length === 0) return;
            else {
                this.executor.stepInto(statement);
                return Entry.STATIC.BREAK;
            }
        },
    },
    maze_step_if_8: {
        parent: '_if',
        class: '',
        syntax: { js: [], py: [] },
    },
    maze_step_if_mushroom: {
        skeleton: 'basic_loop',
        mode: 'maze',
        color: '#498DEB',
        syntax: ['BasicIf', 'front == mushroom'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/mushroom.png',
                size: 24,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/if.png',
                size: 24,
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
        ],
        func: function() {
            if (this.isContinue) return;
            var entities = Ntry.entityManager.getEntitiesByComponent(
                Ntry.STATIC.UNIT
            );
            var entity;
            for (var key in entities) {
                entity = entities[key];
            }
            var unitComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.UNIT
            );
            var gridComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.GRID
            );
            var grid = { x: gridComp.x, y: gridComp.y };
            Ntry.addVectorByDirection(grid, unitComp.direction, 1);
            var fitEntities = Ntry.entityManager.find(
                {
                    type: Ntry.STATIC.GRID,
                    x: grid.x,
                    y: grid.y,
                },
                {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.OBSTACLE_MUSHROOM,
                }
            );
            this.isContinue = true;
            var statement = this.block.statements[0];
            if (fitEntities.length === 0) {
                return;
            } else if (statement.getBlocks().length === 0) return;
            else {
                this.executor.stepInto(statement);
                return Entry.STATIC.BREAK;
            }
        },
    },
    maze_step_if_lupin: {
        skeleton: 'basic_loop',
        mode: 'maze',
        color: '#498DEB',
        syntax: ['BasicIf', 'front == lupin'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/lupin.png',
                size: 24,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/if.png',
                size: 24,
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
        ],
        func: function() {
            if (this.isContinue) return;
            var entities = Ntry.entityManager.getEntitiesByComponent(
                Ntry.STATIC.UNIT
            );
            var entity;
            for (var key in entities) {
                entity = entities[key];
            }
            var unitComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.UNIT
            );
            var gridComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.GRID
            );
            var grid = { x: gridComp.x, y: gridComp.y };
            Ntry.addVectorByDirection(grid, unitComp.direction, 2);
            var fitEntities = Ntry.entityManager.find(
                {
                    type: Ntry.STATIC.GRID,
                    x: grid.x,
                    y: grid.y,
                },
                {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.OBSTACLE_LUPIN,
                }
            );
            this.isContinue = true;
            var statement = this.block.statements[0];
            if (fitEntities.length === 0) {
                return;
            } else if (statement.getBlocks().length === 0) return;
            else {
                this.executor.stepInto(statement);
                return Entry.STATIC.BREAK;
            }
        },
    },
    maze_step_if_else_road: {
        skeleton: 'basic_double_loop',
        mode: 'maze',
        color: '#498DEB',
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/if.png',
                size: 24,
            },
            {
                type: 'LineBreak',
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
            {
                accept: 'basic',
            },
        ],
        statementsKeyMap: {
            STACK_IF: 0,
            STACK_ELSE: 1,
        },
        func: function(sprite, script) {
            if (script.isCondition) {
                delete script.isCondition;
                return script.callReturn();
            }
            var entities = Ntry.entityManager.getEntitiesByComponent(
                Ntry.STATIC.UNIT
            );
            var entity;
            for (var key in entities) {
                entity = entities[key];
            }
            var unitComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.UNIT
            );
            var gridComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.GRID
            );
            var grid = { x: gridComp.x, y: gridComp.y };
            Ntry.addVectorByDirection(grid, unitComp.direction, 1);
            var fitEntities = Ntry.entityManager.find(
                {
                    type: Ntry.STATIC.GRID,
                    x: grid.x,
                    y: grid.y,
                },
                {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.ROAD,
                }
            );
            script.isCondition = true;
            if (fitEntities.length) {
                return script.getStatement('STACK_IF', script);
            } else {
                return script.getStatement('STACK_ELSE', script);
            }
        },
    },
    maze_step_if_else_mushroom: {
        skeleton: 'basic_double_loop',
        mode: 'maze',
        color: '#498DEB',
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/mushroom.png',
                size: 24,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/if.png',
                size: 24,
            },
            {
                type: 'LineBreak',
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
            {
                accept: 'basic',
            },
        ],
        statementsKeyMap: {
            STACK_IF: 0,
            STACK_ELSE: 1,
        },
        func: function(sprite, script) {
            if (script.isCondition) {
                delete script.isCondition;
                return script.callReturn();
            }
            var entities = Ntry.entityManager.getEntitiesByComponent(
                Ntry.STATIC.UNIT
            );
            var entity;
            for (var key in entities) {
                entity = entities[key];
            }
            var unitComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.UNIT
            );
            var gridComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.GRID
            );
            var grid = { x: gridComp.x, y: gridComp.y };
            Ntry.addVectorByDirection(grid, unitComp.direction, 1);
            var fitEntities = Ntry.entityManager.find(
                {
                    type: Ntry.STATIC.GRID,
                    x: grid.x,
                    y: grid.y,
                },
                {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.OBSTACLE_MUSHROOM,
                }
            );
            script.isCondition = true;
            if (fitEntities.length) {
                return script.getStatement('STACK_IF', script);
            } else {
                return script.getStatement('STACK_ELSE', script);
            }
        },
    },
    maze_step_if_else_lupin: {
        skeleton: 'basic_double_loop',
        mode: 'maze',
        color: '#498DEB',
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/lupin.png',
                size: 24,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/if.png',
                size: 24,
            },
            {
                type: 'LineBreak',
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
            {
                accept: 'basic',
            },
        ],
        statementsKeyMap: {
            STACK_IF: 0,
            STACK_ELSE: 1,
        },
        func: function(sprite, script) {
            if (script.isCondition) {
                delete script.isCondition;
                return script.callReturn();
            }
            var entities = Ntry.entityManager.getEntitiesByComponent(
                Ntry.STATIC.UNIT
            );
            var entity;
            for (var key in entities) {
                entity = entities[key];
            }
            var unitComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.UNIT
            );
            var gridComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.GRID
            );
            var grid = { x: gridComp.x, y: gridComp.y };
            Ntry.addVectorByDirection(grid, unitComp.direction, 2);
            var fitEntities = Ntry.entityManager.find(
                {
                    type: Ntry.STATIC.GRID,
                    x: grid.x,
                    y: grid.y,
                },
                {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.OBSTACLE_LUPIN,
                }
            );
            script.isCondition = true;
            if (fitEntities.length) {
                return script.getStatement('STACK_IF', script);
            } else {
                return script.getStatement('STACK_ELSE', script);
            }
        },
    },
    maze_step_if_else_ladder: {
        skeleton: 'basic_double_loop',
        mode: 'maze',
        color: '#498DEB',
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/ic_ladder.png',
                size: 24,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/if.png',
                size: 24,
            },
            {
                type: 'LineBreak',
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
            {
                accept: 'basic',
            },
        ],
        statementsKeyMap: {
            STACK_IF: 0,
            STACK_ELSE: 1,
        },
        func: function(sprite, script) {
            if (script.isCondition) {
                delete script.isCondition;
                return script.callReturn();
            }
            var entities = Ntry.entityManager.getEntitiesByComponent(
                Ntry.STATIC.UNIT
            );
            var entity;
            for (var key in entities) {
                entity = entities[key];
            }
            var unitComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.UNIT
            );
            var gridComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.GRID
            );
            var grid = { x: gridComp.x, y: gridComp.y };
            if (grid.y > 3) {
                grid.y = 2;
            }
            Ntry.addVectorByDirection(grid, unitComp.direction, 1);
            var fitEntities = Ntry.entityManager.find(
                {
                    type: Ntry.STATIC.GRID,
                    x: grid.x,
                    y: grid.y,
                },
                {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.LADDER,
                }
            );
            script.isCondition = true;
            if (fitEntities.length) {
                return script.getStatement('STACK_IF', script);
            } else {
                return script.getStatement('STACK_ELSE', script);
            }
        },
    },
    maze_step_if_else: {
        parent: 'if_else',
        class: '',
        syntax: { js: [], py: [] },
    },
    test_wrapper: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#3BBD70',
        params: [
            {
                type: 'Block',
                accept: 'basic_boolean_field',
                value: [
                    {
                        type: 'test',
                        params: [30, 50],
                    },
                ],
            },
            {
                type: 'Dropdown',
                options: [
                    [1, 1],
                    [2, 2],
                    [3, 3],
                    [4, 4],
                    [5, 5],
                    [6, 6],
                    [7, 7],
                    [8, 8],
                    [9, 9],
                    [10, 10],
                ],
                value: 1,
            },
        ],
    },
    basic_button: {
        skeleton: 'basic_button',
        color: '#eee',
        params: [
            {
                type: 'Text',
                text: 'basic button',
                color: '#333',
                align: 'center',
            },
        ],
    },
    //endregion basic 기본
    //region basic 기본
    ebs_if: {
        parent: '_if',
        def: {
            type: '_if',
            params: [
                {
                    type: 'reach_something',
                    params: [null, 'wall'],
                },
            ],
        },
        syntax: { js: [], py: [] },
    },
    ebs_if2: {
        parent: '_if',
        def: {
            type: '_if',
            params: [
                {
                    type: 'reach_something',
                    params: [null, 'cwz5'],
                },
            ],
        },
        syntax: { js: [], py: [] },
    },
    ai_move_right: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#A751E3',
        syntax: ['Scope', 'move'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/moveStep.png',
                size: 24,
            },
        ],
        func: function(entity, script) {
            if (!script.isStart) {
                script.isStart = true;
                script.isAction = true;
                Ntry.dispatchEvent('gridChange', function() {
                    script.isAction = false;
                });
                var spaceShipComp = Ntry.entityManager.getComponent(
                    entity.id,
                    Ntry.STATIC.SPACE_SHIP
                );
                spaceShipComp.direction = Ntry.STATIC.EAST;
                var gridComp = Ntry.entityManager.getComponent(
                    entity.id,
                    Ntry.STATIC.GRID
                );
                Ntry.entityManager.addComponent(entity.id, {
                    type: Ntry.STATIC.ANIMATE,
                    animateType: Ntry.STATIC.ROTATE_TO,
                    animateValue: 0,
                });
                gridComp.x++;
                return Entry.STATIC.BREAK;
            } else if (script.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete script.isAction;
                delete script.isStart;
                //Entry.engine.isContinue = false;
            }
        },
    },
    ai_move_up: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#A751E3',
        syntax: ['Scope', 'up'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/ai_move_up.png',
                size: 24,
            },
        ],
        func: function(entity, script) {
            if (!script.isStart) {
                script.isStart = true;
                script.isAction = true;
                Ntry.dispatchEvent('gridChange', function() {
                    script.isAction = false;
                });
                var spaceShipComp = Ntry.entityManager.getComponent(
                    entity.id,
                    Ntry.STATIC.SPACE_SHIP
                );
                spaceShipComp.direction = Ntry.STATIC.NORTH;
                var gridComp = Ntry.entityManager.getComponent(
                    entity.id,
                    Ntry.STATIC.GRID
                );
                Ntry.entityManager.addComponent(entity.id, {
                    type: Ntry.STATIC.ANIMATE,
                    animateType: Ntry.STATIC.ROTATE_TO,
                    animateValue: -45,
                });
                gridComp.x++;
                gridComp.y--;
                return script;
            } else if (script.isAction) {
                return script;
            } else {
                delete script.isAction;
                delete script.isStart;
                return script.callReturn();
            }
        },
    },
    ai_move_down: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#A751E3',
        syntax: ['Scope', 'down'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/ai_move_down.png',
                size: 24,
            },
        ],
        func: function(entity, script) {
            if (!script.isStart) {
                script.isStart = true;
                script.isAction = true;
                Ntry.dispatchEvent('gridChange', function() {
                    script.isAction = false;
                });
                var spaceShipComp = Ntry.entityManager.getComponent(
                    entity.id,
                    Ntry.STATIC.SPACE_SHIP
                );
                spaceShipComp.direction = Ntry.STATIC.SOUTH;
                var gridComp = Ntry.entityManager.getComponent(
                    entity.id,
                    Ntry.STATIC.GRID
                );
                Ntry.entityManager.addComponent(entity.id, {
                    type: Ntry.STATIC.ANIMATE,
                    animateType: Ntry.STATIC.ROTATE_TO,
                    animateValue: 45,
                });
                gridComp.x++;
                gridComp.y++;
                return script;
            } else if (script.isAction) {
                return script;
            } else {
                delete script.isAction;
                delete script.isStart;
                return script.callReturn();
            }
        },
    },
    ai_repeat_until_reach: {
        skeleton: 'basic_loop',
        mode: 'maze',
        color: '#498DEB',
        syntax: ['BasicWhile', 'true'],
        statements: [
            {
                accept: 'basic',
            },
        ],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
        ],
        func: function() {
            var statement = this.block.statements[0];
            if (statement.getBlocks().length === 0) return;

            return this.executor.stepInto(statement);
        },
    },
    ai_if_else_1: {
        skeleton: 'basic_double_loop',
        mode: 'maze',
        color: '#498DEB',
        syntax: ['BasicIf', "front == 'stone'"],
        statements: [
            {
                accept: 'basic',
            },
            {
                accept: 'basic',
            },
        ],
        params: [
            {
                type: 'Image',
                img: '/img/assets/ntry/bitmap/ai/obstacle_1.png',
                size: 24,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
            {
                type: 'LineBreak',
            },
        ],
        func: function(entity, script) {
            if (script.isLooped) {
                delete script.isLooped;
                return script.callReturn();
            }
            var radar = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.RADAR
            );

            var statements = this.block.statements;
            var index = 1;
            script.isLooped = true;
            if (
                radar.center.type == Ntry.STATIC.AI_METEO &&
                radar.center.distance == 1
            )
                index = 0;
            this.executor.stepInto(statements[index]);
            return Entry.STATIC.BREAK;
        },
    },
    ai_boolean_distance: {
        skeleton: 'basic_boolean_field',
        mode: 'maze',
        color: '#2fc9f0',
        fontColor: '#fff',
        syntax: ['Scope', 'radar_%1 %2 %3#'],
        params: [
            {
                type: 'Dropdown',
                options: [
                    [Lang.Menus.ai_above, 'UP'],
                    [Lang.Menus.ai_front, 'RIGHT'],
                    [Lang.Menus.ai_under, 'DOWN'],
                ],
                value: 'RIGHT',
                fontSize: 11,
            },
            {
                type: 'Dropdown',
                options: [
                    ['>', 'BIGGER'],
                    ['>=', 'BIGGER_EQUAL'],
                    ['=', 'EQUAL'],
                    ['<', 'SMALLER'],
                    ['<=', 'SMALLER_EQUAL'],
                ],
                value: 'BIGGER',
                fontSize: 11,
            },
            {
                type: 'Block',
                accept: 'string',
            },
        ],
        func: function(entity, script) {
            var radar = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.RADAR
            );

            var params = this.block.params;

            var direction = params[0];
            var operator = params[1];
            var value = this.getParam(2);

            var radarValue;
            switch (direction) {
                case 'UP':
                    radarValue = radar.left;
                    break;
                case 'RIGHT':
                    radarValue = radar.center;
                    break;
                case 'DOWN':
                    radarValue = radar.right;
                    break;
            }
            if (radarValue.type == Ntry.STATIC.AI_GOAL)
                radarValue = Number.MAX_VALUE;
            else radarValue = radarValue.distance;

            switch (operator) {
                case 'BIGGER':
                    return radarValue > value;
                case 'BIGGER_EQUAL':
                    return radarValue >= value;
                case 'EQUAL':
                    return radarValue == value;
                case 'SMALLER':
                    return radarValue < value;
                case 'SMALLER_EQUAL':
                    return radarValue <= value;
            }
        },
    },
    ai_distance_value: {
        skeleton: 'basic_string_field',
        mode: 'maze',
        color: '#ffd974',
        syntax: ['Scope', 'radar_%1#'],
        params: [
            {
                type: 'Dropdown',
                options: [
                    [Lang.Menus.ai_above, 'UP'],
                    [Lang.Menus.ai_front, 'RIGHT'],
                    [Lang.Menus.ai_under, 'DOWN'],
                ],
                value: 'RIGHT',
                fontSize: 11,
            },
        ],
        func: function(entity, script) {
            var radar = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.RADAR
            );
            var radarValue = {};
            switch (this.block.params[0]) {
                case 'UP':
                    radarValue = radar.left;
                    break;
                case 'RIGHT':
                    radarValue = radar.center;
                    break;
                case 'DOWN':
                    radarValue = radar.right;
                    break;
            }
            return radarValue.type == Ntry.STATIC.AI_GOAL
                ? Number.MAX_VALUE
                : radarValue.distance;
        },
    },
    ai_boolean_object: {
        skeleton: 'basic_boolean_field',
        fontColor: '#fff',
        mode: 'maze',
        color: '#2fc9f0',
        syntax: ['Scope', 'object_%1 == %2#'],
        params: [
            {
                type: 'Dropdown',
                options: [
                    [Lang.Menus.ai_above, 'UP'],
                    [Lang.Menus.ai_front, 'RIGHT'],
                    [Lang.Menus.ai_under, 'DOWN'],
                ],
                value: 'RIGHT',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_HW,
            },
            {
                type: 'Dropdown',
                options: [
                    [Lang.Menus.asteroids, 'OBSTACLE'],
                    [Lang.Menus.wall, 'WALL'],
                    [Lang.Menus.item, 'ITEM'],
                ],
                value: 'OBSTACLE',
                fontSize: 11,
            },
        ],
        func: function(entity, script) {
            var radar = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.RADAR
            );

            var params = this.block.params;

            var radarValue;
            switch (params[0]) {
                case 'UP':
                    radarValue = radar.left.type;
                    break;
                case 'RIGHT':
                    radarValue = radar.center.type;
                    break;
                case 'DOWN':
                    radarValue = radar.right.type;
                    break;
            }
            switch (params[1]) {
                case 'OBSTACLE':
                    return radarValue == Ntry.STATIC.AI_METEO;
                case 'WALL':
                    return radarValue == Ntry.STATIC.AI_WALL;
                case 'ITEM':
                    return radarValue == Ntry.STATIC.AI_ITEM;
            }
        },
    },
    ai_use_item: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#EACF11',
        syntax: ['Scope', 'use_item'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/item.png',
                size: 24,
            },
        ],
        func: function(entity, script) {
            if (!script.isStart) {
                Ntry.dispatchEvent('triggerWeapon');
                script.isStart = true;
                script.isAction = true;
                Ntry.dispatchEvent('gridChange', function() {
                    script.isAction = false;
                });
                var spaceShipComp = Ntry.entityManager.getComponent(
                    entity.id,
                    Ntry.STATIC.SPACE_SHIP
                );
                spaceShipComp.direction = Ntry.STATIC.EAST;
                var gridComp = Ntry.entityManager.getComponent(
                    entity.id,
                    Ntry.STATIC.GRID
                );
                Ntry.entityManager.addComponent(entity.id, {
                    type: Ntry.STATIC.ANIMATE,
                    animateType: Ntry.STATIC.ROTATE_TO,
                    animateValue: 0,
                });
                gridComp.x++;
                return script;
            } else if (script.isAction) {
                return script;
            } else {
                delete script.isAction;
                delete script.isStart;
                //Entry.engine.isContinue = false;
                return script.callReturn();
            }
        },
    },
    ai_boolean_and: {
        color: '#2fc9f0',
        skeleton: 'basic_boolean_field',
        fontColor: '#fff',
        statements: [],
        syntax: ['Scope', '%1 && %3#'],
        params: [
            {
                type: 'Block',
                accept: 'boolean',
            },
            {
                type: 'Text',
                text: Lang.Blocks.JUDGEMENT_boolean_and,
                color: '#fff',
            },
            {
                type: 'Block',
                accept: 'boolean',
            },
        ],
        events: {},
        func: function() {
            return this.getParam(0) && this.getParam(2);
        },
    },
    ai_True: {
        color: '#2fc9f0',
        skeleton: 'basic_boolean_field',
        statements: [],
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.JUDGEMENT_true,
                color: '#3D3D3D',
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'True',
        },
        func: function(sprite, script) {
            return true;
        },
        isPrimitive: true,
    },
    ai_if_else: {
        color: '#498deb',
        skeleton: 'basic_double_loop',
        statements: [
            {
                accept: 'basic',
            },
            {
                accept: 'basic',
            },
        ],
        params: [
            {
                type: 'Block',
                accept: 'boolean',
            },
            {
                type: 'Indicator',
                img: 'block_icon/if.png',
                size: 12,
            },
            {
                type: 'LineBreak',
            },
        ],
        func: function(sprite, script) {
            if (script.isCondition) {
                delete script.isCondition;
                return script.callReturn();
            }
            var value = this.getParam(0);
            script.isCondition = true;
            var statement = this.block.statements[value ? 0 : 1];
            //no blocks end execute
            if (statement.getBlocks().length === 0) return this.executor.end();
            else return this.executor.stepInto(statement);
        },
        syntax: ['BasicIf', 'true'],
    },
    //endregion basic 기본
    //region basic 기본
    hidden: {
        color: '#7C7C7C',
        skeleton: 'basic',
        template: '         %1       %2',
        statements: [],
        params: [
            {
                type: 'TextInput',
                value: '?',
                clearBG: true,
                color: 'white',
            },
            {
                type: 'Indicator',
                color: '#6B6B6B',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'hidden',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'etc',
        isNotFor: [],
        func: function(sprite, script) {},
    },
    hidden_event: {
        color: '#7C7C7C',
        skeleton: 'basic_event',
        template: '         %1       ',
        statements: [],
        params: [
            {
                type: 'TextInput',
                value: '?',
                clearBG: true,
                color: 'white',
            },
            {
                type: 'Indicator',
                color: '#6B6B6B',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'hidden_event',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'etc',
        isNotFor: [],
        func: function(sprite, script) {},
    },
    hidden_loop: {
        color: '#7C7C7C',
        skeleton: 'basic_loop',
        statements: [
            {
                accept: 'basic',
            },
        ],
        params: [
            {
                type: 'Image',
                img: '/img/assets/maze/icon/group.png',
                size: {
                    width: 47,
                    height: 20,
                },
            },
            {
                type: 'Indicator',
                color: '#6B6B6B',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'hidden_if',
        },
        class: 'etc',
        isNotFor: [],
        func: function(sprite, script) {},
    },
    hidden_if_else: {
        color: '#7C7C7C',
        skeleton: 'basic_double_loop',
        template: '         %1       %2%3',
        statements: [
            {
                accept: 'basic',
            },
            {
                accept: 'basic',
            },
        ],
        params: [
            {
                type: 'TextInput',
                value: '?',
                clearBG: true,
                color: 'white',
            },
            {
                type: 'Indicator',
                color: '#6B6B6B',
                size: 12,
            },
            {
                type: 'LineBreak',
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'hidden_if',
        },
        class: 'etc',
        isNotFor: [],
        func: function(sprite, script) {},
    },
    hidden_string: {
        color: '#7C7C7C',
        skeleton: 'basic_string_field',
        template: '    %1    ',
        fontColor: '#fff',
        statements: [],
        params: [
            {
                type: 'TextInput',
                value: '?',
                clearBG: true,
                color: 'white',
            },
        ],
        events: {},
        def: {
            params: [],
            type: 'hidden_string',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'etc',
        isNotFor: [],
        func: function(sprite, script) {},
    },
    hidden_boolean: {
        color: '#7C7C7C',
        skeleton: 'basic_boolean_field',
        template: '    %1    ',
        fontColor: '#fff',
        statements: [],
        params: [
            {
                type: 'TextInput',
                value: '?',
                clearBG: true,
                color: 'white',
            },
        ],
        events: {},
        def: {
            params: [],
            type: 'hidden_boolean',
        },
        paramsKeyMap: {},
        class: 'etc',
        isNotFor: [],
        func: function(sprite, script) {},
    },
    //endregion basic 기본
    //region basic 기본
    boolean_shell: {
        color: '#AEB8FF',
        skeleton: 'basic_boolean_field',
        template: '%1',
        isPrimitive: true,
        params: [
            {
                type: 'Text',
                text: 'A',
                color: '#3D3D3D',
            },
        ],
        func: function(sprite, script) {},
    },
    //endregion basic 기본
};

Object.assign(Entry.block, block, blocks.getBlocks());

(function() {
    // console.log('hw', Entry.HW, Entry.Arduino);
    for(let id in Entry.HARDWARE_LIST) {
        const hw = Entry.HARDWARE_LIST[id];
        if(!hw) {
            continue;
        }
        if('setLanguage' in hw) {
            var hwLang = hw.setLanguage();
            var data = hwLang[global.Lang.type];
            for(let key in data) {
                Object.assign(Lang[key], data[key]);
            }
        }
    };

    for (var type in Entry.block) {
        var block = Entry.block[type];
        if (!block.isNotFor) block.isNotFor = [];
        if (block.parent) {
            var f = function() {};
            f.prototype = Entry.block[block.parent];
            var schema = new f();
            schema.syntax = undefined;
            for (var key in block) {
                schema[key] = block[key];
            }
            Entry.block[type] = schema;
        }
    }
})();

if (typeof exports == 'object') {
    exports.block = Entry.block;
}
