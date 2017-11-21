// --------------------------------------------------------------------
//
// ==UserScript==
// @name          淘宝联盟到手价显示
// @namespace     https://github.com/kingems/tblmdsj
// @version       0.1.1
// @author        kingem(kingem@126.com)
// @description   淘宝联盟搜索结果显示到手价
// @grant         GM_addStyle
// @require       https://cdn.staticfile.org/jquery/2.1.1/jquery.min.js
// @include       http://pub.alimama.com/*
// @run-at        document-end
// ==/UserScript==
//
// --------------------------------------------------------------------
(function(){
var shareRatio = 0.95,
    fee = 0.1;
    function getPrices(singleLine) {
        var values = [], match,percent;
        var text = $(singleLine).text();
        match = text.match(/￥([\d,]+\.\d{2})/);;
        if (match) {
            values.push(match[1].replace(",", ""));
        }
        percent = text.match(/(\.\d{2})*(\d+\.\d{2})%/);
        if (percent){
            values.push(percent[2].replace("%", ""));
        }
        return values;
    }
    function process(searchResults) {
        if (location.href.indexOf("channel")==-1){
            shareRatio = 1;
        }
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
                        commission = price * parseFloat(result[1])* shareRatio * (1-fee)/100,
                        value = String(Math.round((price - commission)*100, 2)),
                        integerPrice = value.substr(0, value.length-2),
                        decimalPrice = value.substr(value.length-2, 2),
                        commissionValue = String(Math.round(commission*100, 2)),
                        commissionIntegerPrice = commissionValue.substr(0, commissionValue.length-2),
                        commissionDecimalPrice = commissionValue.substr(commissionValue.length-2, 2),
                        addHtml = $('<div class="content-line btn-brand"></div>');
                    $(addHtml).html('<span class="number number-24"><b>到手价</b>：￥'
                                 + '<span class="integer">' + (integerPrice.length > 0 ? integerPrice : '0') + '</span>'
                                 + '<span class="pointer">.</span>'
                                 + '<span class="decimal">' + decimalPrice + '</span></span>'
                                 + '<p><span class="number number-24"><b>&nbsp;&nbsp;&nbsp;佣金</b>：￥'
                                 + '<span class="integer">' + (commissionIntegerPrice.length > 0 ? commissionIntegerPrice : '0') + '</span>'
                                 + '<span class="pointer">.</span>'
                                 + '<span class="decimal">' + commissionDecimalPrice + '</span></span></p>');
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
                        commission = price * parseFloat(result[1])* shareRatio * (1-fee)/100,
                        value = String(Math.round((price- commission)*100, 2)),
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
