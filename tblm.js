// --------------------------------------------------------------------
//
// ==UserScript==
// @name          淘宝联盟到手价显示
// @namespace     https://github.com/kingems/tblmdsj
// @version       0.1.0
// @author        kingem(kingem@126.com)
// @description   淘宝联盟到手价显示
// @grant         GM_addStyle
// @require       https://cdn.staticfile.org/jquery/2.1.1/jquery.min.js
// @include       http://pub.alimama.com/promo/*
// @run-at        document-end
// ==/UserScript==
//
// --------------------------------------------------------------------
(function(){
var shareRatio = 0.95,
    fee = 0.1;
    function getPrices(singleLine) {
        var values = [], match;
        $(singleLine).find(".yuan").each(function() {
            match = $(this).parent().text().match(/￥([\d,]+\.\d{2})/);
            if (match.length > 1) {
                values.push(match[1].replace(",", ""));
            }
        });
        return values;
    }
    function process(searchResults) {
        if (location.href.indexOf("table")==-1){
            var list = $(searchResults).find(".box-content");
            if (list.size() > 0) {
                $(list).each(function() {
                    var contentLines = $(this).children(".content-line");
                    var youhui = 0;
                    if (contentLines.length>3){
                       youhui = contentLines.eq(1).text().replace(/(\d+).*/,'$1');
                    };
                    var result = getPrices(contentLines);
                    var price = parseFloat(result[0])- youhui,
                        commission = parseFloat(result[1]) ,
                        value = String(Math.round((price - commission * shareRatio * (1-fee)) * 100, 2)),
                        integerPrice = value.substr(0, value.length-2),
                        decimalPrice = value.substr(value.length-2, 2),
                        addHtml = $('<div class="content-line btn-brand"></div>');
                    $(addHtml).html('<span class="number number-24"><b>到手价</b>：￥</span>'
                                 + '<span class="integer">' + (integerPrice.length > 0 ? integerPrice : '0') + '</span>'
                                 + '<span class="pointer">.</span>'
                                 + '<span class="decimal">' + decimalPrice + '</span></span>'
                                 +'<span class="number number-24"><b>&nbsp;&nbsp;&nbsp;佣金</b>：￥'+commission+'<span>');
                    $(addHtml).insertBefore($(contentLines).eq(1));
                    $(contentLines).last().remove();
                });
                $(searchResults).addClass("showprice");
            }
        }else {
            var list = $(searchResults).find(".tag-wrap");
            if (list.size() > 0) {
                $(list).each(function() {
                    var contentLines = $(this).children(".left");
                    var isyouhui = contentLines.eq(0).find(".money");
                    var youhui = 0;
                    if (isyouhui){
                       youhui = isyouhui.text().replace('元','');
                    };
                    var result = getPrices(contentLines);
                    var price = parseFloat(result[0])- youhui,
                        commission = parseFloat(result[1]),
                        value = String(Math.round((price - commission * shareRatio * (1-fee)) * 100, 2)),
                        integerPrice = value.substr(0, value.length-2),
                        decimalPrice = value.substr(value.length-2, 2),
                        addHtml = $('<td width="10%" class="left commission number number-16 color-red" p-id="361"></td>');
                    $(addHtml).html('<p><b>到手价</b>：</p><span class="yuan" p-id="363">￥</span>'
                                 + '<span class="integer" p-id="365">' + (integerPrice.length > 0 ? integerPrice : '0') + '</span>'
                                 + '<span class="pointer" p-id="367">.</span>'
                                 + '<span class="decimal" p-id="369">' + decimalPrice + '</span></span>');
                    $(addHtml).insertBefore($(contentLines).eq(1));
                    $(contentLines).last().remove();
                });
                $(searchResults).addClass("showprice");
            }
        }
    }
    setInterval(function() {
        var searchResults = $("#J_search_results");
        if (!$(searchResults).hasClass("showprice")) {
            process(searchResults);
        }
    }, 500);
})();