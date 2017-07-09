// ==UserScript==
// @name Cake OPR
// @description Improving the user experience of https://opr.ingress.com/recon
// @homepageURL https://github.com/cake-ingress/cake-opr
// @namepsace https://opr.ingress.com
// @version 0.1.1
// @date 2017-07-09
// @match https://opr.ingress.com/recon
// @require http://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// ==/UserScript==

(function() {
    var container = $("form[name='answers']");

    var rowOriginalOne = $(container).children('div.row:eq(0)');
    var rowOriginalTwo = $(container).children('div.row:eq(1)');
    var rowFour = $(container).children('div.row:eq(3)');

    var divPicAndShouldIt = $(rowOriginalOne).children('div:eq(0)');
    var divTitleAndDesc = $(rowOriginalOne).children('#descriptionDiv');
    var divRatings = $(rowOriginalOne).children('div:eq(2)');

    var divCheckLocation = $(rowOriginalTwo).children('div:eq(0)');
    var divDuplicates = $(rowOriginalTwo).children('div:eq(1)');

    disableAutomaticScrolling();
    moveSectionsAbout();
    addFullSizeImageLinks();
    displayStatsAllTheTime();

    function disableAutomaticScrolling() {
        // Disable scrolling when clicking ratings
        var w = typeof unsafeWindow == "undefined" ? window : unsafeWindow;
        w.angular.element($(divTitleAndDesc)).scope().answerCtrl.goToLocation = null;
    }

    function moveSectionsAbout () {
        $(rowOriginalTwo).insertBefore($(rowOriginalOne));
        $(divPicAndShouldIt).insertBefore($(divDuplicates));
        $(divCheckLocation).insertBefore($(divTitleAndDesc));
        $(divTitleAndDesc).insertAfter($(divPicAndShouldIt));

        $(rowOriginalOne).css('padding-top', '40px');

        $(divPicAndShouldIt).css('clear', 'left');
        $(divTitleAndDesc).css('clear', 'both');

        $('<div>')
            .attr('id', 'topLeft')
            .addClass('col-xs-12 col-sm-6')
            .appendTo($(rowOriginalTwo))
            .append($(divPicAndShouldIt))
            .append($(divTitleAndDesc));

        $('<div>')
            .attr('id', 'topRight')
            .addClass('col-xs-12 col-sm-6')
            .appendTo($(rowOriginalTwo))
            .append(divDuplicates);

        $(divPicAndShouldIt)
            .removeClass('col-sm-4')
            .addClass('col-sm-12')
            .css('padding-top', '40px');

        $(divTitleAndDesc)
            .removeClass('col-sm-4')
            .addClass('col-sm-12');

        $(divDuplicates)
            .removeClass('col-sm-6')
            .addClass('col-sm-12');

        $(divRatings)
            .css('padding-top', '20px');

        $(divCheckLocation)
            .removeClass('col-sm-6')
            .addClass('col-sm-8');

        $(divRatings)
            .append('<br><br><br><br>')
            .append($(divCheckLocation).children('div:eq(1)')) // Is it accurant text
            .append($(divCheckLocation).children("div[class='btn-group']:eq(0)")) // Is it accurate buttons
            .append($(divCheckLocation).children("div[ng-show='!subCtrl.draggableMarker']")) // Suggest disabled text
            .append($(divCheckLocation).children("div[ng-show='subCtrl.draggableMarker']")) // Suggest enabled text
            .append($(divCheckLocation).children("div[id='safetyDiv']")) // Safe access text
            .append($(divCheckLocation).children("div[class='btn-group']:eq(0)")); // Safe access buttons

        $(container).children('div:last') // Comments
            .addClass('col-sm-6')
            .addClass('col-xs-12')
            .appendTo($(rowFour));

        $(rowFour)
            .css('padding-top', '20px')
            .css('padding-bottom', '20px');

        $("div[id='submitDiv'")
            .insertBefore($(rowFour));

    }

    function addFullSizeImageLinks ()  {
        // Main portal for review image has loaded
        $('div[class="ingress-background"] > img:eq(0)').on('load', function () {
            $('<a>')
                .insertAfter($(divPicAndShouldIt).children('div[class="ingress-background"]'))
                .attr('href', $('div[class="ingress-background"] > img:eq(0)').attr('src') + '=s0')
                .attr('target', '_blank')
                .text('Full size image')
                .css('font-weight', 'bold');
        });

        // When the map is clicked, if info bubble appears
        $('div#map').on('click', thumbnailBigLink);

        // When a thumbnail in the scrolling list is clicked
        $('div#map-filmstrip > ul').on('click', thumbnailBigLink);

        // Check if needed and make link to full size image if so
        function thumbnailBigLink() {
            if (
                $('div#content').is(':visible') && // Info bubble
                !$('#thumbnailBigLink').is(':visible') // No link already
            ) {
                $('<a>')
                    .insertAfter('div#content > img')
                    .attr('href', $('div#content img').attr('src') + '=s0')
                    .attr('target', '_blank')
                    .attr('id', 'thumbnailBigLink')
                    .text('Full size image')
                    .css('font-weight', 'bold')
                    .css('padding-top', '10px')
                    .css('padding-bottom', '10px');

                $('<br>')
                    .insertAfter('div#content > img');
            }
        }
    }

    function displayStatsAllTheTime() {
        var statImage = $('div#player_stats > div > img:eq(1)');
        var statLevel = 'Uknown';

        switch ($(statImage).attr('src')) {
            case '/img/great.png':
                statLevel = 'Great';
                break;
            case '/img/good.png':
                statLevel = 'Good';
                break;
            case '/img/poor.png':
                statLevel = 'Poor';
                break;
        }

        var statAnalysed = parseInt($('div#player_stats > div > p:eq(1) > span:last').text(), 10)||null;
        var statCreated = parseInt($('div#player_stats > div > p:eq(2) > span:last').text(), 10)||null;
        var statRejected = parseInt($('div#player_stats > div > p:eq(3) > span:last').text(), 10)||null;
        var statPending = ((statAnalysed - statCreated) - statRejected)||null;

        if (statPending < 0) statPending = null;

        var statCreatedPercent = (statCreated / (statAnalysed / 100)).toFixed()||null;
        var statRejectedPercent = (statRejected / (statAnalysed / 100)).toFixed()||null;
        var statPendingPercent = (statPending / (statAnalysed / 100)).toFixed()||null;

        if (statCreatedPercent === 'Infinity') statCreatedPercent = '?';
        if (statRejectedPercent === 'Infinity') statRejectedPercent = '?';
        if (statPendingPercent === 'Infinity'||isNaN(statPendingPercent)) statPendingPercent = '?';

        $('<span>')
            .insertBefore($('button.pull-right'))
            .css('white-space', 'pre')
            .html(statLevel+
                '  /  <small>Analysed: '+(statAnalysed||'?')+
                '</small>  /  <small>Created: '+(statCreated||'?')+' - '+
                    (statCreatedPercent||'?')+'%'+
                '</small>  /  <small>Rejected: '+(statRejected||'?')+' - '+
                    (statRejectedPercent||'?')+'%'+
                '</small>  /  <small>Other: '+(statPending||'?')+' - '+
                    (statPendingPercent||'?')+'%</small>'
            );
    }
})();