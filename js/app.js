sickconsole = function(message) {
    if (console) {
        console.log('SICKSENSE LOG: ' + message);
    }
};

$(document).foundation();

var app = angular.module('sicksense', []);

app.factory('shared', function() {
    return {};
});


/**
 * Browser warning.
 */
jQuery(document).ready(function ($) {
    $.reject({
        reject: {
            all: false,
            msie: 9
        },
        header: 'เว็บเบราเซอร์ของคุณล้าสมัยแล้ว',
        paragraph1: 'คุณกำลังใช้เบราเซอร์ที่เราไม่ได้รองรับ',
        paragraph2: 'โปรดติดตั้งเบราเซอร์ที่เราสนับสนุนตามที่แสดงข้างล่างนี้เพื่อใช้งานเว็บได้อย่างถูกต้อง',
        close: false,
        closeLink: 'ปิดหน้าต่างนี้',
        closeMessage: 'ปิดหน้าต่างนี้และยอมรับความเสี่ยงของการแสดงผลที่ไม่ถูกต้อง',
        imagePath: '/bower_components/jReject/images/'
    });
});
