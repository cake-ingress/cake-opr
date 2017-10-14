// ==UserScript==
// @name Cake OPR
// @description Improving the user experience of https://opr.ingress.com/recon
// @homepageURL https://github.com/cake-ingress/cake-opr
// @namepsace https://opr.ingress.com
// @version 0.1.3
// @date 2017-10-14
// @match https://opr.ingress.com/recon*
// @include https://opr.ingress.com/recon*
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

    var divDuplicates = $(rowOriginalTwo).children('div:eq(0)');
    var divCheckLocation = $(rowOriginalTwo).children('div:eq(2)');

    moveSectionsAbout();
    displayStatsAllTheTime();

    function moveSectionsAbout() {
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
            .removeClass('col-sm-push-6')
            .addClass('col-sm-12');

        $(divRatings)
            .css('padding-top', '20px');

        $(divCheckLocation)
            .removeClass('col-sm-6')
            .removeClass('col-sm-pull-6')
            .addClass('col-sm-8');

        $(divRatings)
            .prepend('<br><br>')
            .append('<br><br>')
            .append($(divCheckLocation).children('div:eq(1)')) // Is it accurate text
            .append($(divCheckLocation).children("div[class='btn-group']:eq(0)")) // Is it accurate buttons
            .append($(divCheckLocation).children("div[ng-show='!subCtrl.draggableMarker']")) // Suggest disabled text
            .append($(divCheckLocation).children("div[ng-show='subCtrl.draggableMarker']")) // Suggest enabled text
            .append($(divCheckLocation).children("div[id='safetyDiv']")) // Safe access text
            .append($(divCheckLocation).children("div[class='btn-group']:eq(0)")); // Safe access buttons

        $(divRatings) // Move 'Suggest a new location'
            .children('div:eq(3)')
            .insertBefore(
                $(divRatings).children('div:eq(1)')
            )
            .append('<br><br>')
            .children('p').css('font-size', '30px');

        $(container).children('div:last') // Comments
            .addClass('col-sm-6')
            .addClass('col-xs-12')
            .appendTo($(rowFour));

        $(rowFour)
            .css('padding-top', '20px')
            .css('padding-bottom', '20px');

        $("div[id='submitDiv'")
            .insertBefore($(rowFour));

        $("div[id='street-view")
            .css('height', '500px');
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

        var badgeCounts = [ 0, 100, 750, 2500, 5000, 10000 ];
        var badgeNames = [ 'None', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Onyx' ];
        var totalForBadge = statCreated + statRejected;
        var badgeLevel = 0;

        $.each(badgeCounts, function(index, value) {
            if ( totalForBadge > value ) {
                badgeLevel = index;
                return true;
            } else {
                return false;
            }
        });

        var badgeNameText = badgeNames[badgeLevel];
        var badgeAltText = badgeCounts[badgeLevel]+' - '+( badgeCounts[badgeLevel+1]-1 );
        var badgeToGo = badgeCounts[badgeLevel+1] - totalForBadge||'-';
        var badgeNextNameText = badgeNames[badgeLevel+1]||'-';

        $('<span>')
            .insertBefore($('button.pull-right'))
            .css('white-space', 'pre')
            .css('float', 'left')
            .html(statLevel+'  /  <span title="'+badgeAltText+'">'+badgeNameText+ ' badge '+
                totalForBadge.toLocaleString()+
                '  /  '+badgeToGo.toLocaleString()+' to get '+badgeNextNameText+'</span><br>'+
                '<small>Analysed: '+(statAnalysed.toLocaleString()||'?')+
                '</small>  /  <small>Created: '+(statCreated.toLocaleString()||'?')+' - '+
                    (statCreatedPercent||'?')+'%'+
                '</small>  /  <small>Rejected: '+(statRejected.toLocaleString()||'?')+' - '+
                    (statRejectedPercent||'?')+'%'+
                '</small>  /  <small>Other: '+(statPending.toLocaleString()||'?')+' - '+
                    (statPendingPercent||'?')+'%</small>'
            );
    }
})();