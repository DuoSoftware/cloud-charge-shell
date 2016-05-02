angular.module('widget', ['chart.js'])
    .controller('clockWidgetController', ['$scope', '$mdDialog', function ($scope, $mdDialog) {
        var dateFormat = function ($scope) {
            var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
                timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
                timezoneClip = /[^-+\dA-Z]/g,
                pad = function (val, len) {
                    val = String(val);
                    len = len || 2;
                    while (val.length < len) val = "0" + val;
                    return val;
                };

            // Regexes and supporting functions are cached through closure
            return function (date, mask, utc) {
                var dF = dateFormat;

                // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
                if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
                    mask = date;
                    date = undefined;
                }

                // Passing date through Date applies Date.parse, if necessary
                date = date ? new Date(date) : new Date;
                if (isNaN(date)) throw SyntaxError("invalid date");

                mask = String(dF.masks[mask] || mask || dF.masks["default"]);

                // Allow setting the utc argument via the mask
                if (mask.slice(0, 4) == "UTC:") {
                    mask = mask.slice(4);
                    utc = true;
                }

                var _ = utc ? "getUTC" : "get",
                    d = date[_ + "Date"](),
                    D = date[_ + "Day"](),
                    m = date[_ + "Month"](),
                    y = date[_ + "FullYear"](),
                    H = date[_ + "Hours"](),
                    M = date[_ + "Minutes"](),
                    s = date[_ + "Seconds"](),
                    L = date[_ + "Milliseconds"](),
                    o = utc ? 0 : date.getTimezoneOffset(),
                    flags = {
                        d: d,
                        dd: pad(d),
                        ddd: dF.i18n.dayNames[D],
                        dddd: dF.i18n.dayNames[D + 7],
                        m: m + 1,
                        mm: pad(m + 1),
                        mmm: dF.i18n.monthNames[m],
                        mmmm: dF.i18n.monthNames[m + 12],
                        yy: String(y).slice(2),
                        yyyy: y,
                        h: H % 12 || 12,
                        hh: pad(H % 12 || 12),
                        H: H,
                        HH: pad(H),
                        M: M,
                        MM: pad(M),
                        s: s,
                        ss: pad(s),
                        l: pad(L, 3),
                        L: pad(L > 99 ? Math.round(L / 10) : L),
                        t: H < 12 ? "a" : "p",
                        tt: H < 12 ? "am" : "pm",
                        T: H < 12 ? "A" : "P",
                        TT: H < 12 ? "AM" : "PM",
                        Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                        o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                        S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
                    };

                return mask.replace(token, function ($0) {
                    return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
                });
            };
        }();

        // Some common format strings
        dateFormat.masks = {
            "default": "ddd mmm dd yyyy HH:MM:ss",
            shortDate: "m/d/yy",
            mediumDate: "mmm d, yyyy",
            longDate: "mmmm d, yyyy",
            fullDate: "dddd, mmmm d, yyyy",
            shortTime: "h:MM TT",
            mediumTime: "h:MM:ss TT",
            longTime: "h:MM:ss TT Z",
            isoDate: "yyyy-mm-dd",
            isoTime: "HH:MM:ss",
            isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
            isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
        };

        // Internationalization strings
        dateFormat.i18n = {
            dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
            monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
        };

        // For convenience...
        Date.prototype.format = function (mask, utc) {
            return dateFormat(this, mask, utc);
        };


        // Clock Widget's date and time... 
        var monthDay = dateFormat('mmmm d,yyyy');
        console.log(monthDay);
        $('#clockmonthDay').append(monthDay);

        var year = dateFormat('yyyy');
        console.log(year);
        $('#clockyear').append(year);


        // Clock Widget's Rotation 
        $(function () {

            setInterval(function () {
                var seconds = new Date().getSeconds();
                var sdegree = seconds * 6;
                var srotate = "rotate(" + sdegree + "deg)";

                $("#clocksec").css({
                    "transform": srotate
                });

            }, 1000);

            setInterval(function () {
                var hours = new Date().getHours();
                $('#clockHours').text(hours);
                var mins = new Date().getMinutes();
                $('#clockMins').text(mins);
                var hdegree = hours * 30 + (mins / 2);
                var hrotate = "rotate(" + hdegree + "deg)";

                $("#clockhour").css({
                    "transform": hrotate
                });

            }, 1000);


            setInterval(function () {
                var mins = new Date().getMinutes();
                //$scope.clockComponentMins = mins;
                //console.log(mins);
                var mdegree = mins * 6;
                var mrotate = "rotate(" + mdegree + "deg)";

                $("#clockmin").css({
                    "transform": mrotate
                });

            }, 1000);

        });

        $scope.clockComponentSelectformat = function (ev) {
            $mdDialog.show({
                    controller: clockComponentformatController,
                    templateUrl: 'partials/widget-modal-templates/clockComponentformat.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
                .then(function (answer) {
                    var monthDay = dateFormat(answer);
                    $('#clockmonthDay').text(monthDay);

                }, function () {

                });
        };

        function clockComponentformatController($scope, $mdDialog) {
            $scope.formats = [{
                    name: "default",
                    format: "ddd mmm dd yyyy HH:MM:ss"
                },
                {
                    name: "shortDate",
                    format: "m/d/yy"
                },
                {
                    name: "longDate",
                    format: "mmmm d, yyyy"
                },
                {
                    name: "fullDate",
                    format: "dddd, mmmm d, yyyy"
                },
                {
                    name: "shortTime",
                    format: "h:MM TT"
                },
                {
                    name: "mediumTime",
                    format: "h:MM:ss TT"
                },
                {
                    name: "longTime",
                    format: "h:MM:ss TT Z"
                },
                {
                    name: "isoDate",
                    format: "yyyy-mm-dd"
                },
                {
                    name: "isoTime",
                    format: "HH:MM:ss"
                },
                {
                    name: "isoDateTime",
                    format: "yyyy-mm-dd'T'HH:MM:ss"
                },
                {
                    name: "isoUtcDateTime",
                    format: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
                }];

            $scope.clockComponentformatChange = function (data) {
                $mdDialog.hide(data);
            };
            $scope.closeWidgetOptions = function () {
                $mdDialog.cancel();
            };
        };

}])
    /////////////////////////////////////////weather widget////////////////////////////////////////////////
    .controller('weatherWidgetController', ['$scope', '$http', '$mdDialog', function ($scope, $http, $mdDialog) {
        $scope.loadWeather = function (data) {
            $scope.weatherComponentCity = data;
            //complete config  
            //            function () {
            $http.get('http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22' + data + '%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys')
                .success(function (data) {
                    console.log(data);

                    if (data.query.results.channel.item.condition == undefined) {
                        $scope.weatherComponentError = true;
                        $scope.weatherComponentCity = "Oops.. Weather details regarding this location is not available";
                        $scope.weatherComponentWeather = [];
                    } else {
                        $scope.weatherComponentError = false;
                        $scope.weatherForcast = data.query.results.channel.item.forecast;
                        $scope.weatherComponentWeather = data.query.results.channel.item.condition;
                        //                        var time = ($scope.weatherComponentWeather.date).slice(17, 18);
                        //                        var fix = ($scope.weatherComponentWeather.date).slice(22, 24);
                        //console.log(time, fix, $scope.weatherComponentWeather.date);

                        //                        if ((fix == 'am' && time > 6) || (fix == 'pm' && time < 6)) {
                        //                            $scope.weatherComponentBg = "images/widget/weatherComponentBg.jpg";
                        $scope.showMoon = "";
                        switch ($scope.weatherComponentWeather.text) {
                            case 'Sunny':
                                $scope.weatherComponentIcon = 'sun';
                                break;
                            case 'Fair':
                                $scope.weatherComponentIcon = 'sun';
                                break;
                            case 'Haze':
                                $scope.weatherComponentIcon = 'partialyCloud';
                                break;
                            case 'Partly Cloudy':
                                $scope.weatherComponentIcon = 'partialyCloud';
                                break;
                            case 'Mostly Cloudy':
                                $scope.weatherComponentIcon = 'cloud';
                                break;
                            case 'Cloudy':
                                $scope.weatherComponentIcon = 'cloud';
                                break;
                            case 'Mostly Cloudy':
                                $scope.weatherComponentIcon = 'cloud';
                                break;
                            case 'Rain':
                                $scope.weatherComponentIcon = 'rainy';
                                break;
                            case 'Rain Shower':
                                $scope.weatherComponentIcon = 'rainy';
                                break;
                            case 'Heavy Rain':
                                $scope.weatherComponentIcon = 'rainy';
                                break;
                            case 'Light Rain':
                                $scope.weatherComponentIcon = 'drizzle';
                                break;
                            case 'Light Shower':
                                $scope.weatherComponentIcon = 'drizzle';
                                break;
                            case 'Drizzle':
                                $scope.weatherComponentIcon = 'drizzle';
                                break;
                            case 'Drizzling':
                                $scope.weatherComponentIcon = 'drizzle';
                                break;
                            case 'Thunderstorm':
                                $scope.weatherComponentIcon = 'thunder';
                                break;
                            case 'Heavy Thunderstorm':
                                $scope.weatherComponentIcon = 'thunder';
                                break;
                            case 'Light Rain with Thunder':
                                $scope.weatherComponentIcon = 'rainthunder';
                                break;
                            case 'Rainstorm':
                                $scope.weatherComponentIcon = 'rainthunder';
                                break;
                            default:
                                $scope.weatherComponentIcon = 'partialyCloud';
                                break;
                        };
                        //                        } else {
                        //                            $scope.weatherComponentBg = "images/widget/weatherComponentBg2.jpg";
                        //                            $scope.showMoon = "moon";
                        //                            switch ($scope.weatherComponentWeather.text) {
                        //                                case 'Clear':
                        //                                    $scope.weatherComponentIcon = 'night';
                        //                                    break;
                        //                                case 'Fair':
                        //                                    $scope.weatherComponentIcon = 'nightpartialyCloud';
                        //                                    break;
                        //                                case 'Partly Cloudy':
                        //                                    $scope.weatherComponentIcon = 'nightpartialyCloud';
                        //                                    break;
                        //                                case 'Mostly Cloudy':
                        //                                    $scope.weatherComponentIcon = 'nightcloud';
                        //                                    $scope.showMoon = "";
                        //                                    break;
                        //                                case 'Cloudy':
                        //                                    $scope.weatherComponentIcon = 'nightcloud';
                        //                                    $scope.showMoon = "";
                        //                                    break;
                        //                                case 'Mostly Cloudy':
                        //                                    $scope.weatherComponentIcon = 'nightcloud';
                        //                                    break;
                        //                                case 'Rain':
                        //                                    $scope.weatherComponentIcon = 'nightrainy';
                        //                                    break;
                        //                                case 'Rain Shower':
                        //                                    $scope.weatherComponentIcon = 'nightrainy';
                        //                                    break;
                        //                                case 'Heavy Rain':
                        //                                    $scope.weatherComponentIcon = 'nightrainy';
                        //                                    break;
                        //                                case 'Light Rain':
                        //                                    $scope.weatherComponentIcon = 'nightdrizzle';
                        //                                    break;
                        //                                case 'Light Rain Shower':
                        //                                    $scope.weatherComponentIcon = 'nightdrizzle';
                        //                                    break;
                        //                                case 'Light Shower':
                        //                                    $scope.weatherComponentIcon = 'nightdrizzle';
                        //                                    break;
                        //                                case 'Drizzle':
                        //                                    $scope.weatherComponentIcon = 'nightdrizzle';
                        //                                    break;
                        //                                case 'Drizzling':
                        //                                    $scope.weatherComponentIcon = 'nightdrizzle';
                        //                                    break;
                        //                                case 'Thunderstorm':
                        //                                    $scope.weatherComponentIcon = 'nightthunder';
                        //                                    break;
                        //                                case 'Heavy Thunderstorm':
                        //                                    $scope.weatherComponentIcon = 'nightthunder';
                        //                                    break;
                        //                                case 'Light Rain with Thunder':
                        //                                    $scope.weatherComponentIcon = 'nightrainthunder';
                        //                                    break;
                        //                                case 'Rainstorm':
                        //                                    $scope.weatherComponentIcon = 'nightrainthunder';
                        //                                    break;
                        //                                default:
                        //                                    $scope.weatherComponentIcon = 'night';
                        //                                    break;
                        //                            };
                        //                        };
                    }

                })
                .error(function (err) {
                    console.log('Error retrieving markets');
                });
            //            };
            //$scope.finish();

        };
        $scope.locZip = "colombo";
        $scope.weatherComponentError = false;
        $scope.loadWeather($scope.locZip);

        $scope.weatherComponentSelectCity = function (ev) {
            $mdDialog.show({
                    controller: weatherComponentCitySelectorController,
                    templateUrl: 'partials/widget-modal-templates/weatherComponentCitySelector.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
                .then(function (answer) {
                    $scope.loadWeather(answer);
                }, function () {

                });
        };

        function weatherComponentCitySelectorController($scope, $mdDialog) {
            $scope.cities = ['colombo', 'galle', 'kandy'];
            $scope.weatherComponentCitySelectorChange = function (city) {
                $mdDialog.hide(city);
            };
            $scope.closeWidgetOptions = function () {
                $mdDialog.cancel();
            };
        };


}])
    //////////////////////////////////////////////user profile widget start/////////////////////////////////////////////////////////////////
    .controller('userprofileWidgetController', ['$scope', '$auth', '$objectstore', function ($scope, $auth, $objectstore) {
        (function () {
            var menu_trigger = $("[data-card-menu]");
            var back_trigger = $("[data-card-back]");

            menu_trigger.click(function () {
                $(".card, body").toggleClass("show-menu");
            });

            back_trigger.click(function () {
                $(".card, body").toggleClass("show-menu");
            });

            //            var retriveUserProfile = function () {
            //                var userProfileInfo = $auth.getSession();
            //                console.log(userProfileInfo);
            //                var client = $objectstore.getClient("duosoftware.com", "profile", true);
            //
            //                client.onGetOne(function (userProfileInfo) {
            //                    console.log(userProfileInfo);
            //                    if (userProfileInfo) {
            //                        $scope.shellUserProfileSection = userProfileInfo;
            //                        console.log(userProfileInfo);
            //                    } else {
            //
            //                    }
            //                });
            //
            //                client.onError(function (data) {
            //                    // alert ("Error occured");
            //                    console.log(data);
            //                });
            //
            //                client.getByKey($auth.getUserName());
            //            };
            //
            //            retriveUserProfile();
            $scope.shellUserProfileSection = {
                bannerPicture: "images/userassets/contactcoverimg/cover3.jpg",
                company: "duo",
                country: "sl",
                email: "shelltest@duoworld.com",
                id: "admin@duosoftware.com",
                name: "Shell Test",
                phone: "11223344",
                zipcode: "123"
            };



            $scope.getProfilePicture = function () {

                var client = $objectstore.getClient("duosoftware.com", "profilepictures", true);

                client.onGetOne(function (data) {
                    if (data)
                        $scope.profilePicture = data.Body;
                    console.log(data);
                });

                client.onError(function (data) {
                    console.log(data);
                    //alert ("Error occured");
                });

                client.getByKey('shelltest@duoworld.com');
            };

            $scope.getProfilePicture();
            console.log($scope.shellUserProfileSection, $scope.profilePicture);
        })();
}])
    ////////////////////////////////////calender widget///////////////////////////////////////////////////////////////
    .controller('calenderWidgetController', ['$scope', function ($scope) {
        (function () {
            $scope.days = [];
            $scope.month = 01;
            createCal();

            function createCal() {
                $scope.days = [];
                for (m = 1; m < 13; m++) {
                    var firstDay = new Date(m + '.01.2015').getDay();
                    //console.log(firstDay);
                    if (firstDay == 0) {
                        firstDay = 7;
                    };
                    for (i = 0; i < 40; i++) {

                        if (i + 1 < firstDay) {
                            var obj = {
                                class: 'day invalid',
                                date: '',
                                month: m
                            };
                            $scope.days.push(obj);
                        } else {
                            if (new Date(m + '.' + parseInt(i + 2 - firstDay) + '.2015') == 'Invalid Date') {
                                // console.log('invlid date found');
                            } else {
                                if (m == 2 && parseInt(i + 2 - firstDay) > 28) {
                                    //console.log('feb escape');
                                } else {
                                    //console.log(m, parseInt(i + 2 - firstDay), new Date(m + '.' + parseInt(i + 2 - firstDay) + '.2015'));
                                    var obj = {
                                        class: 'day',
                                        date: parseInt(i + 2 - firstDay),
                                        month: m,
                                        task: '',
                                    };
                                    $scope.days.push(obj);
                                };
                            };
                        };
                    };
                    //console.log($scope.days);
                };
            };

            $scope.previousMonth = function () {
                if ($scope.month == 1) {
                    $scope.month = 12;
                } else {
                    $scope.month = $scope.month - 1;

                };
                //createCal();
            };

            $scope.nextMonth = function () {
                if ($scope.month == 12) {
                    $scope.month = 1;

                } else {
                    $scope.month = $scope.month + 1;
                };
                //createCal();
            };

            $scope.monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        }.call(this));

}])
    .controller('chartsWidgetController', function ($scope) {
        $scope.labels1 = ["January", "February", "March", "April", "May", "June", "July"];
        //$scope.series = ['Series A', 'Series B'];
        $scope.data1 = [
               65, 59, 80, 81, 56, 55, 40
            ];
        $scope.onClick = function (points, evt) {
            console.log(points, evt);
        };
        $scope.labels2 = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
        $scope.series2 = ['Series A', 'Series B'];

        $scope.data2 = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];
    })

.directive('clockComponent', function () {
    return {
        //        restrict: 'E',
        controller: 'clockWidgetController',
        template: " <div class='widget-card' style='background-color:{{$root.shellConfig.themeconfiguration.primarypalette}};padding:4px;'><md-button style='min-width: 10px;' ng-click='clockComponentSelectformat($event);'> <md-icon style='color:{{$root.shellConfig.themeconfiguration.accentpalette}}' md-svg-icon='icons/ic_menu_24px.svg' alt='menu'></md-icon></md-button><ul id='clockclock'><li id='clockhour'></li><li id='clockmin'></li><li id='clocksec'></li></ul><div id='clockdate'><p style='font-size:35px;font-weight:300;color:{{$root.shellConfig.themeconfiguration.accentpalette}};margin:10px;'><span id='clockHours'></span> : <span id='clockMins'></span> </p><span id=clockmonthDay'></span></div></div>"
    };
})

.directive('weatherComponent', function () {
        return {
            //            restrict: 'E',
            controller: 'weatherWidgetController',
            template: ' <div class="weather-wrapper" style="height:100%;" layout="column">\
    <div  class="weather widget-card " style="background-color:{{$root.shellConfig.themeconfiguration.primarypalette}};width: 100%;height: 80%;border-bottom: 5px {{$root.shellConfig.themeconfiguration.accentpalette}} solid;">\
 <md-button style="min-width: 10px;" ng-click="weatherComponentSelectCity($event);"><md-icon style="color: {{$root.shellConfig.themeconfiguration.accentpalette}}" md-svg-icon="icons/ic_menu_24px.svg" alt="menu"></md-button>\
   <div ng-if="!weatherComponentError" class="weather-icon {{weatherComponentIcon}}"><div class="{{showMoon}}"></div></div>\
        <h1 ng-if="!weatherComponentError" class="weather-card-title" style="color:{{$root.shellConfig.themeconfiguration.accentpalette}};">{{weatherComponentWeather.temp}} F</h1>\
        <p  class="weather-card-title2">{{weatherComponentCity}} <br><span style="font-size: medium;"> {{weatherComponentWeather.text}}<span></p>\
    </div>\
<div class="weather-forcast-container" layout="row">\
            <div ng-repeat="f in weatherForcast" class="weather-forcast-item" flex layout="row" layout-align="center center" ><p>{{f.day}}<br><span>{{f.high}} F</span></p></div>\
            </div> </div>'
        };
    })
    .directive('userprofileComponent', function () {
        return {
            //            restrict: 'E',
            controller: 'userprofileWidgetController',
            template: '<div class=" widget-card " style="background-color:white;"><!-- Face 2 -->\
  <div class=" card-face face-2"><!-- Back trigger -->\
    <button data-card-back="data-card-back" class="card-face__back-button"><img src="http://imgh.us/arrow_1.svg" width="19" height="19" draggable="false"/></button><img src="http://imgh.us/Likes.png" width="100" height="100" draggable="false" class="card-face__stats"/><img src="http://imgh.us/Followers.png" width="100" height="100" draggable="false" class="card-face__stats"/><img src="http://imgh.us/Views.png" width="100" height="100" draggable="false" class="card-face__stats"/><!-- Settings Button --><img src="http://imgh.us/cog.svg" width="17" height="17" draggable="false" class="card-face__settings-button"/>\
  </div><!-- Face 1 -->\
  <div class="card-face face-1"><!-- Menu trigger -->\
<div style="background-image:url(images/userprofileComponentBg.jpg);background-size:cover;width: 100%;height: 45%;position: absolute;"></div>\
    <button data-card-menu="data-card-menu" class="card-face__menu-button"><img src="http://imgh.us/dots_1.svg" width="5" height="23" draggable="false"/></button><!-- Avatar -->\
    <div class="card-face__avatar"><!-- Bullet notification --><span class="card-face__bullet">2</span><!-- User avatar --><img src="http://i.imgur.com/gGdWosb.png" width="110" height="110" draggable="false"/></div><!-- Name -->\
    <h2 class="card-face__name">{{shellUserProfileSection.name}}</h2><!-- Title --><span class="card-face__title">{{shellUserProfileSection.company}}</span><!-- Cart Footer -->\
    <div class="card-face-footer">\
                <ng-md-icon icon="mail" style="fill:darkgrey" ng-click="showHiddenContent = true; hiddenContent = shellUserProfileSection.email;" ></ng-md-icon>\
                <ng-md-icon icon="phone" style="fill:darkgrey" ng-click="showHiddenContent = true; hiddenContent = shellUserProfileSection.phone"></ng-md-icon>\
                <ng-md-icon icon="home" style="fill:darkgrey" ng-click="showHiddenContent = true;  hiddenContent = shellUserProfileSection.country"></ng-md-icon>\
<p ng-if="showHiddenContent" style="font-size: small;color: #93A7B0;">{{hiddenContent}}</p>\
  </div>\
</div>'
        };
    })

.directive('calenderComponent', function () {
        return {
            //            restrict: 'E',
            controller: 'calenderWidgetController',
            template: "<div class='widget-card'><section class='calendar'>\
<ng-md-icon style='position: absolute;left: 40px;min-width: 5px;top: 25px;fill:white;' ng-click='previousMonth();' icon='navigate_before'>p</ng-md-icon>\
  <h1>{{monthNames[month]}} 2015</h1>\
<ng-md-icon style='position: absolute;right: 40px;min-width: 5px;top: 25px;fill:white' ng-click='nextMonth();' icon='navigate_next'>p</ng-md-icon>\
  <form action='#'>\
    <label class='weekday'>Mo</label>\
    <label class='weekday'>Tu</label>\
    <label class='weekday'>We</label>\
    <label class='weekday'>Th</label>\
    <label class='weekday'>Fr</label>\
    <label class='weekday'>Sa</label>\
    <label class='weekday'>Su</label>\
    <label class='day' data-day='{{day.day}}' ng-repeat='day in days' ng-if='day.month == month'>\
      <input class='appointment' date-day='{{day.day}}' ng-model='day.task' placeholder='What would you like to do?' required='true' type='text'>\
      <span>{{day.date}}</span>\
      <em></em>\
    </label>\
 <div class='clearfix'></div>\
  </form>\
</section></div>"
        };
    })
    .directive('piechartsComponent', function () {
        return {
            restrict: 'E',
            controller: 'chartsWidgetController',
            template: '<div class="widget-card chart-card-square" style="width:300px;" ><p class="chartsWidgetTitle">Sales for 2015 1st quarter</p><div layout="column" layout-align="center center" style="height:240px;"><canvas id="pie" class="chart chart-pie" chart-data="data1" chart-labels="labels1">\
        </canvas></div> </div>'
        };
    })
    .directive('linechartsComponent', function () {
        return {
            restrict: 'E',
            controller: 'chartsWidgetController',
            template: '<div class="widget-card chart-card-long" ><p class="chartsWidgetTitle">Sales for 2015 1st quarter</p><canvas id="line" class="chart chart-line" chart-data="data2" chart-labels="labels2" chart-legend="true">\
</canvas</div>'
        };
    })
    .directive('barchartsComponent', function () {
        return {
            restrict: 'E',
            controller: 'chartsWidgetController',
            template: '<div class="widget-card chart-card-long"><p class="chartsWidgetTitle">Sales for 2015 1st quarter</p><canvas id="bar" class="chart chart-bar" chart-data="data2" chart-labels="labels2">\
        </canvas> </div>'
        };
    })
    .directive('doughnutchartsComponent', function () {
        return {
            restrict: 'E',
            controller: 'chartsWidgetController',
            template: '<div class="widget-card chart-card-square"><p class="chartsWidgetTitle">Sales for 2015 1st quarter</p><div layout="column" layout-align="center center" style="height:240px;"><canvas id="doughnut" class="chart chart-doughnut" chart-data="data1" chart-labels="labels1">\
        </canvas></div> </div>'
        };
    })
    .directive('radarchartsComponent', function () {
        return {
            //            restrict: 'E',
            controller: 'chartsWidgetController',
            template: '<div class="widget-card chart-card-square"><p class="chartsWidgetTitle">Sales for 2015 1st quarter</p><div layout="column" layout-align="center center" style="height:240px;"><canvas id="radar" class="chart chart-radar" chart-data="data2" chart-labels="labels2">\
        </canvas></div> </div>'
        };
    });
//    .directive('instagramComponent', function () {
//        return {
//            restrict: 'E',
//            controller: 'instagramWidgetController',
//            template: ' '
//        };
//    });
