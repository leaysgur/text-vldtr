var test = require('tape');
var TextVldtr = require('./../src/text-vldtr');

test('Export test', function(t) {
    t.ok(TextVldtr, 'エクスポートされてる');

    t.equal(typeof TextVldtr, 'function', 'クラス(Function)である');

    t.end();
});

var test = require('tape');
var TextVldtr = require('./../src/text-vldtr');

test('Base test', function(t) {
    var t1 = new TextVldtr(),
        t2 = new TextVldtr();
    t.notEqual(t1, t2, '別インスタンスが返る');

    var setting = {
        minLen: 4,
        maxLen: 3
    };
    t.throws(function() { new TextVldtr(setting) }, 'ルールがng')

    setting = {
        required: {
            combineNum: 3,
            kind: ['NUMBER']
        }
    };
    t.throws(function() { new TextVldtr(setting) }, 'ルールがng')

    setting = {
        forbidden: ['SYMBOLS']
    };
    t.throws(function() { new TextVldtr(setting) }, 'ルールがng')


    setting = {
        required: {
            combineNum: 3,
            kind: ['JAPANEEEEEEEESE']
        }
    };
    t.throws(function() { new TextVldtr(setting) }, 'ルールがng')

    setting = {
        forbidden: ['NUMBER'],
        required: {
            kind: ['NUMBER']
        }
    };
    t.throws(function() { new TextVldtr(setting) }, 'ルールがng')


    t.end();
});

var test = require('tape');
var TextVldtr = require('./../src/text-vldtr');

test('Length test', function(t) {
    var setting = {};
    setting = {
        minLen: 0,
        maxLen: 5
    };
    var t1 = new TextVldtr(setting);
    console.log('Rule:', setting);

    [
        // 結果コードを期待するテキスト
        { code: 0, text: '',       msg: '0文字もok' },
        { code: 0, text: '123',    msg: '範囲内' },
        { code: 0, text: '1',      msg: '範囲内' },
        { code: 0, text: '12345',  msg: '範囲内' },
        { code: 2, text: '123456', msg: '5文字超えたらng' }
    ].forEach(function(c) {
        t.equal(t1.validateText(c.text).code, c.code, (c.msg || undefined));
    });


    setting = {
        minLen: 3,
        maxLen: 8
    };
    var t2 = new TextVldtr(setting);
    console.log('Rule:', setting);

    [
        { code: 0, text: '123',       msg: '最小' },
        { code: 0, text: '12345',     msg: 'ok' },
        { code: 0, text: '12345678',  msg: 'ok' },
        { code: 2, text: '123456789', msg: '超えたらng' },
        { code: 1, text: '',          msg: '未入力ダメ' }
    ].forEach(function(c) {
        t.equal(t2.validateText(c.text).code, c.code, (c.msg || undefined));
    });

    t.end();
});

var test = require('tape');
var TextVldtr = require('./../src/text-vldtr');

test('Char type test', function(t) {
    var setting = {};
    setting = {
        forbidden: ['JAPANESE', 'SYMBOL']
    };
    var t1 = new TextVldtr(setting);
    console.log('Rule:', setting);

    [
        // 結果コードを期待するテキスト
        { code: 0, text: 'abc',        msg: 'ok' },
        { code: 0, text: '123',        msg: 'ok' },
        { code: 0, text: 'a1s2d3',     msg: 'ok' },
        { code: 0, text: 'HOGEHOGE',   msg: 'ok' },
        { code: 3, text: 'あいうえお', msg: '禁止文字' },
        { code: 3, text: 'てすと',     msg: '禁止文字' },
        { code: 3, text: 'てす*&^',    msg: '禁止文字' },
        { code: 3, text: 'hoge!!',     msg: '禁止文字' },
        { code: 3, text: 'がーん。',   msg: '禁止文字' },
        { code: 3, text: '10%',        msg: '禁止文字' }
    ].forEach(function(c) {
        t.equal(t1.validateText(c.text).code, c.code, (c.msg || undefined));
    });


    setting = {
        minLen: 2,
        maxLen: 5,
        forbidden: ['SYMBOL'],
        required: {
            combineNum: 1,
            kind: ['LC_ALPHABET', 'NUMBER', 'JAPANESE']
        }
    };
    var t2 = new TextVldtr(setting);
    console.log('Rule:', setting);

    [
        { code: 0, text: '123',    msg: 'ok' },
        { code: 0, text: 'aaa',    msg: 'ok' },
        { code: 0, text: 'あいう', msg: 'ok' },
        { code: 0, text: 'a12',    msg: 'ok' },
        { code: 0, text: 'AbC',    msg: 'ok' },
        { code: 3, text: 'a#s',    msg: '禁止文字' },
        { code: 3, text: '#ああ',  msg: '禁止文字' },
        { code: 3, text: '(_0_)',  msg: '禁止文字' },
        { code: 4, text: 'AAA',    msg: '必須文字がない' }
    ].forEach(function(c) {
        t.equal(t2.validateText(c.text).code, c.code, (c.msg || undefined));
    });


    setting = {
        required: {
            combineNum: 2,
            kind: ['LC_ALPHABET', 'NUMBER', 'JAPANESE']
        }
    };
    var t3 = new TextVldtr(setting);
    console.log('Rule:', setting);

    [
        { code: 0, text: 'a1',          msg: 'ok' },
        { code: 0, text: '1a',          msg: 'ok' },
        { code: 0, text: 'aお',         msg: 'ok' },
        { code: 0, text: '問題ない777', msg: 'ok' },
        { code: 4, text: '777',         msg: '必須文字足りない' },
        { code: 4, text: 'foo',         msg: '必須文字足りない' },
    ].forEach(function(c) {
        t.equal(t3.validateText(c.text).code, c.code, (c.msg || undefined));
    });


    t.end();
});