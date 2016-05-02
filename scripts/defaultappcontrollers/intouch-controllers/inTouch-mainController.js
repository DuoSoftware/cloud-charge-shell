mambatiFrameworkShell.controller('duoworld-framework-shell-launcher-connect-ctrl', function ($scope, $rootScope, $mdSidenav, $presence, $chat, $fws, $auth, $state, $timeout, $mdDialog, $mdUtil, dataHandler, $objectstore, $http, $mdToast) {

    $presence.onOnline(function (e, data) {


    });

    
    $fws.command("myGroups", {
        user: $auth.getUserName()
    });


    //$presence.setOnline();

    $fws.onRecieveCommand("chat_send_response", function (e, data) {
        console.log(data);
    });

    //-----------------------------------webrtc-------------------------------
    var Test = {
        OnConnected: function (err, res) {
            console.log("connected event fired");
            $rootScope.callConnected = true;
            $scope.startTimer();
            $scope.stopBeep();
        },
        OnDisconnected: function (err, res) {
            console.log("disconnect event fired");
            console.log('calling status :', $scope.calling);
            if ($rootScope.callConnected == true) {
                console.log("disconnecting the current call");
                $rootScope.callConnected = false;
                $scope.end_call();
                $scope.itwf.call();
                dataHandler.addToCallLog($rootScope.dialingUser, 'incoming');
            } else if ($scope.itw.calling == true) {
                console.log("call timed out on widget");
                $rootScope.callConnected = false;
                $scope.showTimeoutAlert();
                $scope.itwf.call();
            } else if ($scope.calling == true) {
                console.log("call timed out on main app");
                $rootScope.callConnected = false;
                $scope.showTimeoutAlert();
                $scope.end_call();
            } else {
                console.log("disconnecting the incoming call");
                $mdDialog.cancel();
                dataHandler.addToCallLog($rootScope.dialingUser, 'missed');
            };
        },
        OnIncomingCall: function (err, res) {
            console.log(res);
            $rootScope.callingID = res.id;
            var incomingUser = res.user.replace("_", "@");
            incomingUser = incomingUser.replace("_", ".");
            $rootScope.dialingUser = dataHandler.getUserDetails(incomingUser);
            console.log($rootScope.dialingUser, $rootScope.callingID);
            $scope.showIncomingCall();
        },

        CreateUA: function (username, password, server) {
            ConfigAgent(username, password, server, Test.OnConnected, Test.OnDisconnected, Test.OnIncomingCall, function (e, r) {
                $scope.connecting = false;
            });
        },

        RegUA: function () {
            RegisterUser(function (e, r) {});
        },

        CallUsers: function (username, VidSt) {
            CallUser(username, VidSt, 'remoteVideo', 'localVideo', function (e, r) {
                $rootScope.callingID = r;
                console.log("calling id", username);
            });
        },

        EndCalls: function () {
            DisconnectCall($rootScope.callingID, function (err, res) {

            });
        },
        AnswerCall: function (VidSt) {
            console.log("calling id is", $rootScope.callingID);
            var res = AnswerCall($rootScope.callingID, VidSt, 'remoteVideo', 'localVideo');

        },
        HoldCall: function () {
            console.log("HOLD PRESSED");
            var remote = document.getElementById('remoteVideo');
            var local = document.getElementById('localVideo');
            console.log("Remote is " + remote.muted);
            remote.pause();
            local.pause();
            local.muted = true;
            remote.muted = true;
        },
        UnHoldCall: function () {
            console.log("HOLD PRESSED");
            var remote = document.getElementById('remoteVideo');
            var local = document.getElementById('localVideo');
            console.log("Remote is " + remote.muted);
            remote.play();
            local.play();
            local.muted = false;
            remote.muted = false;
        }
    };
    //---------------------------------timer relatedfunctions-----------------
    $scope.timerRunning = false;

    $scope.startTimer = function () {
        $scope.$broadcast('timer-start');
        $scope.timerRunning = true;
    };

    $scope.stopTimer = function () {
        $scope.$broadcast('timer-stop');
        $scope.timerRunning = false;
    };

    $scope.$on('timer-stopped', function (event, data) {
        console.log('Timer Stopped - data = ', data);
    });



    //    ----------------------------------------------------init functions--------------------------------------------------------------
    // intouch widget's variables
    $scope.itw = {
        conversationOpen: false,
        showContact: false,
        calling: false,
        clickIcon: "icons/ic_call_24px.svg"
    };
    $scope.itwf = {};
    $scope.selectedUser = "Duo Connect";
    $scope.currentUser = "Hey there";
    $scope.today = new Date();
    $scope.currentMessage = "";
    $rootScope.searchText = "";
    $scope.showNote = false;
    $scope.minimizeIcon = false;
    $scope.dialingNumber = "";
    $scope.clickIcon = "icons/ic_call_24px.svg";
    $scope.color = "green";
    $scope.calling = false;
    $scope.profile_pic = "images/connect/chat2.jpg";
    $rootScope.callConnected = false;
    $scope.notConnected = true;
    $scope.connecting = false;
    $rootScope.users = $scope.users;
    $rootScope.primarypalette = "#512DA8";
    $rootScope.accentpalette = "#FF5722";
    $rootScope.selfCam = true;
    $scope.showChatSettingsPane = false;
    $scope.messageProgress = false;

    function intouchInit() {
        $scope.callLog = dataHandler.getCallLog();
        $scope.convoImages = dataHandler.getConvoImages();
        $scope.activityFeed = dataHandler.getActivities();
        $scope.conversations = dataHandler.getAllConversations();
        $scope.users = dataHandler.getUsers();
        dataHandler.nativeUser($auth.getUserName());
        $scope.channels = dataHandler.getAllChannels();
    };

    var retriveUserProfile = function () {
        var userProfileInfo = $auth.getSession();
        var client = $objectstore.getClient("duosoftware.com", "profile", true);
        client.onGetOne(function (userProfileInfo) {
            console.log("user profile details");
            console.log(userProfileInfo);
            $scope.userProfileInfo = userProfileInfo;
            // $scope.getProfilePicture();
        });
        client.onError(function (data) {
            // alert ("Error occured");
        });
        client.getByKey($auth.getUserName());
    };
    retriveUserProfile();

    $scope.getProfilePicture = function () {
        var client = $objectstore.getClient('duoworld.duoweb.info', "profilepictures", true);
        client.onGetOne(function (data) {
            if (data)
                console.log(data);
            //made the profile picture a rootscope variable, so it could be accessible from anywhere without another service call
            $rootScope.profilePicture = data.Body;
        });
        client.onError(function (data) {
            Toast("Error occured while fetching profile picture");
        });
        client.getByKey($auth.getUserName());
    };


    if ($rootScope.sipUserRegistration == true) {
        $scope.currentUser = $auth.getUserName();
        var sipUsername = $scope.currentUser.replace(/@/g, "_");
        sipUsername = sipUsername.replace(/\./g, "_");
        console.log(sipUsername, $scope.currentUser);
        Test.CreateUA(sipUsername, "duos123", "45.55.191.56:5066");
        $rootScope.callingCredentials = {
            username: sipUsername,
            password: "duos123",
            server: "45.55.191.56:5066"
        };
        //$scope.currentUser = $auth.getUserName();
        $scope.notConnected = false;
        $scope.connecting = false;
    } else {
        $scope.connecting = true;
    };

    $rootScope.sipUserRegistrationInit = function () {
        $scope.currentUser = $auth.getUserName();
        var sipUsername = $scope.currentUser.replace(/@/g, "_");
        sipUsername = sipUsername.replace(/\./g, "_");
        console.log(sipUsername, $scope.currentUser);
        Test.CreateUA(sipUsername, "duos123", "45.55.191.56:5066");
        $rootScope.callingCredentials = {
            username: sipUsername,
            password: "duos123",
            server: "45.55.191.56:5066"
        };
        //$scope.currentUser = $auth.getUserName();
        $scope.notConnected = false;
        $scope.connecting = false;
    };



    $timeout(function () {
        intouchInit();
        console.log("channeldata");
    }, 500);

    //------------------------------------------------------end of init functions---------------------------------------------------


    //------------------------------------selecting currenty focused user/conversation-----------------------------------------------
    //selectedUser - focused user
    //Conversation - focused conversation
    //mySelf - logged in user
    //Channel - focused channel

    $scope.selectUser = function (username) {
        $scope.selectedUser = dataHandler.getUserDetails(username);
        dataHandler.setSelectedUser($scope.selectedUser);

        $scope.mySelf = dataHandler.getNativeUser();
        $scope.Conversation = dataHandler.getConversationForSelectedUser(username);

        $scope.Conversation.userDetails = $scope.selectedUser;

        removeNotification($scope.users, username);


        if ($scope.Conversation.messages.length == 0) {
            $scope.messageProgress = true;
            $fws.command("chatmessageRetrive", {
                user1: $scope.mySelf,
                user2: username
            });
        }
    };

    
    $fws.onRecieveCommand("chat_retrive_response", function (e, data) {
        console.log(data);
        $scope.messageProgress = false;
        $scope.Conversation.messages = data;
        console.log($scope.Conversation);
    });

    $scope.selectChannel = function (groupId) {
        $scope.mySelf = dataHandler.getNativeUser();
        $scope.Channel = dataHandler.getChannelDataForSelectedChannel(groupId);
        if ($scope.Channel.messages.length == 0) {
            $scope.messageProgress = true;
            $fws.command("groupchatRetrive", {
                from: $scope.mySelf,
                groupid: groupId
            });

        }
        console.log($scope.Channel);
        $state.go("channel");
    };

    
    $fws.onRecieveCommand("groupchat_retrive_response", function (e, data) {
        console.log(data);
        $scope.messageProgress = false;
        $scope.Channel.messages = data;
    });

    $scope.toggleChatSettings = function () {
        $scope.showChatSettingsPane = !$scope.showChatSettingsPane;
    };

    $scope.closeChatSettings = function () {
        $scope.showChatSettingsPane = false;
    };


    //-------------------------------------------end of selecting currenty focused user/conversation----------------------------------------

    //------------------------------------------messaging related functions start---------------------------------------------------------

    //main application messaging method-switch to conversation view
    $scope.message = function (username) {
        $scope.selectUser(username);
        $state.go("conversation");
    };
    //widget messaging method-switch to conversation view
    $scope.widgetmessage = function (username) {
        $scope.selectUser(username);
        $scope.data.selectedIndex = 2;
        $scope.itw.conversationOpen = true;
    };

    //widget- go back to conversation list
    $scope.goBack = function () {
        $scope.itw.conversationOpen = false;
    };

    //ending text messages
    $scope.sendMessage = function (keyEvent, msg) {
        if (keyEvent.which === 13) {
            $rootScope.searchText = "";
            if (msg) {
                $fws.command("chatmessage", {
                    to: $scope.selectedUser.username,
                    from: $scope.mySelf,
                    message: msg
                });
                dataHandler.storeSentMsg(msg, $scope.Conversation.convo_id, $scope.selectedUser.username);
            }
        }
    };

    $scope.sendMessageClick = function(msg){
        $rootScope.searchText = "";

        if (msg) {
            $fws.command("chatmessage", {
                to: $scope.selectedUser.username,
                from: $scope.mySelf,
                message: msg
            });
            dataHandler.storeSentMsg(msg, $scope.Conversation.convo_id, $scope.selectedUser.username);
        }

    }

    $scope.sendChannelMessage = function (keyEvent, msg) {
        if (keyEvent.which === 13) {
            $rootScope.searchText = "";
            if (msg) {
                $fws.command("groupchat", {
                    from: $scope.mySelf,
                    message: msg,
                    groupid: $scope.Channel.groupid
                });
                //dataHandler.storeChannelSentMsg(msg, $scope.Channel.groupid);
            }
        }
    };

    //a message recieved on a channel

    $fws.onRecieveCommand("groupchat_send_notification", function (e, data) {
        console.log(data);
        dataHandler.storeChannelMsg(data.message, data.groupid, data.from, data.timestamp);
    });

    //a message delivery response on a channel
    $fws.onRecieveCommand("groupchat_send_response", function (e, data) {
        console.log(data);
    });

    //a message delivery response on a conversation
    $fws.onRecieveCommand("chat_send_response", function (e, data) {
        console.log(data);
    });

    //user being added to a new group

    $fws.onRecieveCommand("groupchat_addtogroup_notification", function (e, data) {
        console.log(data);
        dataHandler.deleteAllChannels();
        $fws.command("myGroups", {
            user: $auth.getUserName()
        });
        $scope.channels = dataHandler.getAllChannels();
    });

    $fws.onRecieveCommand("groupchat_addedtogroup_notification", function (e, data) {
        console.log(data);
        dataHandler.addUserToGroup(data);
    });

    //user accesslevel being changed success notification
    $fws.onRecieveCommand("groupchat_statusmodifier_response", function (e, data) {
        console.log(data);
    });

    //user accesslevel being changed notification
    $fws.onRecieveCommand("groupchat_accessmodifier_notificaton", function (e, data) {
        console.log(data);
        dataHandler.modifyAccess(data);
    });

    //user removed from group status response
    $fws.onRecieveCommand("groupchat_removefromgroup_response", function (e, data) {
        console.log(data);
    });

    //user removed from group notification
    $fws.onRecieveCommand("removefromgroup_removed_notification", function (e, data) {
        console.log(data);
        dataHandler.removeUserFromChannel(data.groupid, data.removed, data.remover);
    });



    //---------------------------------------end of messaging related functions--------------------------------------------------

    //--------------------------------start of notification related functions--------------------------------------------
    var removeNotification = function (arr, me) {
        var i = arr.length;
        while (i--)
            if (arr[i].username === me) {
                arr[i].count = 0;
            };
        };

        $scope.notifyUser = function (data) {
            for (i = 0; i < $scope.users.length; i++) {
                if ($scope.users[i].username == data.from && data.from !== $scope.selectedUser.username) {
                    $scope.users[i].count = $scope.users[i].count + 1;
                    console.log("notified", $scope.users);
                    $scope.playNotificationBeep();
                };
            }
        };

        $scope.playNotificationBeep = function () {
            var audio = document.getElementById("notificationTune");
            audio.load();
            audio.play();

        };


    //-----------------------------------------end of notification related functions----------------------------------------------

    //----------------------------------start of call related functions---------------------------------------------------
    $scope.endCall = false;
    $scope.startCall = true;
    $scope.webCam = "icons/ic_videocam_24px.svg";
    $scope.callhold = "icons/ic_pause_24px.svg";

    $scope.makeCall = function (reciever, video) {
        var recieverSipUsername = reciever.replace(/@/g, "_");
        recieverSipUsername = recieverSipUsername.replace(/\./g, "_");
        console.log(recieverSipUsername);
        $timeout(function () {
            Test.CallUsers(recieverSipUsername, video);
        }, 500);
    };

    $scope.call = function (username) {
        $scope.calling = true;
        console.log('calling state in calling function:', $scope.calling);
        var con = dataHandler.getConversationForSelectedUser(username);
        $rootScope.dialingUser = dataHandler.getUserDetails(username);
        $state.go("call");
        $scope.callBtn = false;
        $scope.playBeep();
        dataHandler.addToCallLog($rootScope.dialingUser, 'outgoing');
        $scope.makeCall(username, false);
    };

    $scope.videocall = function (username) {
        $scope.calling = true;
        var con = dataHandler.getConversationForSelectedUser(username);
        $rootScope.dialingUser = dataHandler.getUserDetails(username);
        $state.go("call");
        $scope.callBtn = false;
        $scope.playBeep();
        dataHandler.addToCallLog($rootScope.dialingUser, 'outgoing');
        $scope.makeCall(username, true);
        //        $rootScope.selfCam = true;
        $scope.webCam = "icons/ic_videocam_off_24px.svg"
    };

    $scope.gotoConversation = function (data) {
        $scope.message(data);
    };

    $scope.playBeep = function () {
        var audio = document.getElementById("dialerTune");
        audio.loop = true;
        audio.load();
        audio.play();
    };

    $scope.decline = function () {
        $mdDialog.hide('declined');
    };
    $scope.accept = function () {
        $mdDialog.hide('accepted');
    };

    $scope.end_call = function () {
        console.log("disconnecting call");
        $scope.stopTimer();
        $scope.calling = false;
        $scope.endCall = true;
        $scope.stopBeep();
        $rootScope.videoCall = false;
        $rootScope.selfCam = false;
        $scope.gotoConversation($rootScope.dialingUser.username);
        Test.EndCalls();
    };

    $scope.callHold = function () {
        if ($scope.callhold == "icons/ic_pause_24px.svg") {
            $scope.callhold == "icons/ic_local_play_24px.svg";
            Test.HoldCall();
        } else {
            $scope.callhold == "icons/ic_pause_24px.svg";
            Test.UnHoldCall();
        };
    };

    $scope.webCamOn = function () {
        if ($rootScope.selfCam == true) {
            $scope.webCam = "icons/ic_videocam_24px.svg ";
            $rootScope.selfCam = false;
        } else {
            $scope.webCam = "icons/ic_videocam_off_24px.svg ";
            $rootScope.selfCam = true;
        }
    };

    $scope.mic = "icons/ic_mic_24px.svg";
    $scope.micOn = function () {
        if ($scope.mic == "icons/ic_mic_24px.svg") {
            $scope.mic = "icons/ic_mic_off_24px.svg ";
        } else {
            $scope.mic = "icons/ic_mic_24px.svg ";
        }
    };

    $scope.stopBeep = function () {
        var audio = document.getElementById("dialerTune");
        audio.pause();
    };

    //widget dialpad start

    $scope.widgetcall = function (username) {
        $scope.data.selectedIndex = 1;
        $scope.itwf.callFromDialpad(username);
    };

    $scope.changeNumber = function (num) {

        if ($scope.dialingNumber == null || $scope.dialingNumber == "") {
            $scope.dialingNumber = num;
            //            $scope.dialingNumber = currentNumber;
            $rootScope.filterNumber = $scope.dialingNumber;
        } else {
            //            currentNumber = currentNumber + num;
            $scope.dialingNumber = $scope.dialingNumber + num;
            $rootScope.filterNumber = $scope.dialingNumber;
        }
        console.log($scope.dialingNumber);
    };

    $scope.backspace = function () {
        console.log($scope.dialingNumber.toString());
        $scope.dialingNumber = $scope.dialingNumber.toString();
        $scope.dialingNumber = $scope.dialingNumber.substring(0, $scope.dialingNumber.length - 1);
        $rootScope.filterNumber = $scope.dialingNumber;
    };

    $scope.itwf.call = function () {
        if ($scope.itw.clickIcon == 'icons/ic_call_24px.svg') {
            $scope.itw.clickIcon = 'icons/ic_call_end_24px.svg';
            $scope.color = "red";
            $scope.itw.calling = true;
            $scope.checkContact($scope.dialingNumber);
            $scope.playBeep();
        } else {
            $scope.itw.clickIcon = 'icons/ic_call_24px.svg';
            $scope.color = "green";
            $scope.itw.calling = false;
            $scope.stopBeep();
            Test.EndCalls();

        }
    };

    $scope.itwf.callFromDialpad = function (username) {
        var user = dataHandler.getUserDetails(username);
        if ($scope.itw.clickIcon == 'icons/ic_call_24px.svg') {
            $scope.dialingNumber = user.mobile;
            $scope.itw.clickIcon = 'icons/ic_call_end_24px.svg';
            $scope.color = "red";
            $scope.itw.calling = true;
            $scope.reciever_name = user.fname;
            $scope.profile_pic = user.profile_pic;
            dataHandler.addToCallLog(user, 'outgoing');
            $scope.makeCall(username, false);
            $scope.playBeep();
        } else {
            $scope.itw.clickIcon = 'icons/ic_call_24px.svg';
            $scope.color = "green";
            $scope.itw.calling = false;
            $scope.stopBeep();
            Test.EndCalls();

        }
    };

    $scope.stopBeep = function () {
        var audio = document.getElementById("dialerTune");
        audio.pause();
    };

    $scope.checkContact = function (number) {
        $scope.reciever_name = "UNKNOWN";
        $scope.profile_pic = "images/connect/chat2.jpg";
        var flag = false;
        for (i = 0; i < $scope.users.length; i++) {
            if ($scope.users[i].mobile == number) {
                $scope.reciever_name = $scope.users[i].fname + " " + $scope.users[i].lname;
                $scope.profile_pic = $scope.users[i].profile_pic;
                dataHandler.addToCallLog($scope.users[i], 'outgoing');
                flag = true;
            };
        }

        if (flag == false) {
            dataHandler.addToCallLog(number, 'unknown');
        };
    };
    //end of dialpad

    $scope.showIncomingCall = function () {

        $mdDialog.show({
            controller: 'CallCtrl',
            templateUrl: 'partials/intouch-templates/intouch.modal-templates-incomingCall.html',
            parent: angular.element(document.body),
        })
        .then(function (answer) {
            console.log(answer);
            if (answer == 'accepted') {
                var call = {
                    type: 'call',
                    msg: 'accepted'
                };
                $state.go("call");
                $rootScope.callConnected = true;
                $timeout(function () {
                    Test.AnswerCall('true');
                }, 500);
            } else {
                var call = {
                    type: 'call',
                    msg: 'declined'
                };
                Test.EndCalls();
            };
        }, function () {

        });
    };

    $scope.showOfflineAlert = function (username, ev) {
        var userDetails = dataHandler.getUserDetails(username);
        $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('oh! ' + userDetails.fname + ' is not available at the moment')
            .content('Why not drop a text?.')
            .ariaLabel('Alert Dialog Demo')
            .ok('Got it!')
            .targetEvent(ev)
            );
    };

    $scope.showTimeoutAlert = function () {
        $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('Timeout!')
            .content('drop a text or may be try again!')
            .ariaLabel('Alert Dialog Demo')
            .ok('Got it!')

            );
    };
    //-------------------------------------------------end of call related functions----------------------------------------

    //------------------------------------profile dialog start-----------------------------------------------------
    $scope.showProfile = function (ev) {
        $mdDialog.show({
            controller: ProfileController,
            templateUrl: 'partials/intouch-templates/intouch.modal-templates-profile.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            resolve: {
                data: function () {
                    return angular.copy($scope.user_key);
                }
            }
        });
    };

    $scope.showProfile = function (ev, person) {
        $mdDialog.show({
            controller: ProfileController,
            templateUrl: 'partials/intouch-templates/intouch.modal-templates-profile.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            resolve: {
                data: function () {
                    return angular.copy(person);
                }
            }
        });
    };

    function ProfileController($scope, $mdDialog, data) {
        $scope.user = data;
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
    };
    $scope.widgetshowProfile = function (person) {
        $scope.data.selectedIndex = 3;
        $scope.itw.showContact = true;
        $scope.selectedContact = person;
    };

    $scope.showContactList = function () {
        $scope.itw.showContact = false;
    };

    //----------------------------------------------profile dialog end--------------------------------------------------

    //channels start
    $scope.showCreateNewChannelDialog = function (ev) {
        var tempObj = {
            users: $scope.users,
        };
        $mdDialog.show({
            controller: 'addUserController',
            templateUrl: 'partials/intouch-templates/intouch.modal-templates-newChannel.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            resolve: {
                data: function () {
                    return angular.copy(tempObj);
                }
            }
        }).then(function () {

        });
    };

    $fws.onRecieveCommand("chat_groupmaker_response", function (e, data) {
        console.log(data);
        $mdDialog.hide();
        Toast(data);
    });

    $fws.onRecieveCommand("groupchat_addtogroup_response", function (e, data) {
        console.log(data);
        $mdDialog.hide();
    });

    $fws.onRecieveCommand("groupchat_accessmodifier_response", function (e, data) {
        console.log(data);
        //$mdDialog.hide();
    });

    $scope.addMoreUsers = function (ev, channel) {
        var tempObj = {
            users: $scope.users,
            channel: channel
        };
        $mdDialog.show({
            controller: 'addUserController',
            templateUrl: 'partials/intouch-templates/intouch.modal-templates-addusers.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            resolve: {
                data: function () {
                    return angular.copy(tempObj);
                }
            }
        }).then(function (members) {
            dataHandler.addUsersToChannel(members, $scope.Channel);
        });
    };

    $scope.leaveChannel = function (ev) {
        var confirm = $mdDialog.confirm()
        .title('Would you like to leave ' + $scope.Channel.topic + '?')
        .content('you wont be able to send messages in this channel.')
        .ariaLabel('Lucky day')
        .targetEvent(ev)
        .ok('Please do it!')
        .cancel('No! dont do it');
        $mdDialog.show(confirm).then(function () {
            $scope.Channel.data.status = "inactive";
            $fws.command("removefromgroup", {
                from: $scope.mySelf,
                user: $scope.mySelf,
                access: $scope.Channel.data.accessLevel,
                groupid: $scope.Channel.groupid,
                status: 'inactive'
            });
            $state.go('home');
        }, function () {

        });
    };

    $scope.showChannelUserOptions = function (ev, user) {
        if (user !== dataHandler.getNativeUser()) {
            var tempObj = {
                user: dataHandler.getUserDetails(user),
                channel: $scope.Channel
            };

            $mdDialog.show({
                controller: channelUserOptionsController,
                templateUrl: 'partials/intouch-templates/intouch.modal-templates-user-settings.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                resolve: {
                    data: function () {
                        return angular.copy(tempObj);
                    }
                }
            })
            .then(function (answer) {
                dataHandler.updateChannel(answer);
                $scope.Channel = answer;
            }, function () {

            });
        };
    };

    function channelUserOptionsController($scope, $mdDialog, data) {
        $scope.nateiveUserAccessLevel = false;
        $scope.nativeUser = dataHandler.getNativeUser();
        for (b = 0; b < data.channel.members.length; b++) {
            if ($scope.nativeUser == data.channel.members[b].name) {
                $scope.nativeUserAccessLevel = data.channel.members[b].accessLevel;
            };
        };

        if ($scope.nativeUserAccessLevel == 'SuperAdmin' || $scope.nativeUserAccessLevel == 'Admin') {
            $scope.nateiveUserAccessLevel = true;
        };

        $scope.user = data.user;
        $scope.channel = data.channel;

        for (a = 0; a < $scope.channel.members.length; a++) {
            if ($scope.channel.members[a].name == $scope.user.username) {
                $scope.user.accessLevel = $scope.channel.members[a].accessLevel;
            }
        };

        $scope.updateUserAccessLevel = function () {
            for (a = 0; a < $scope.channel.members.length; a++) {
                if ($scope.channel.members[a].name == $scope.user.username) {
                    $scope.channel.members[a].accessLevel = $scope.user.accessLevel;
                }
            };

            $fws.command("chatAccessModifier", {
                from: $scope.channel.data.name,
                user: $scope.user.username,
                groupid: $scope.channel.groupid,
                access: $scope.user.accessLevel,
                status: 'active'
            });

            $mdDialog.hide($scope.channel);
        };

        $scope.removeUserFromChannel = function () {
            if ($scope.channel.data.accessLevel == "SuperAdmin" || $scope.channel.data.accessLevel == "Admin") {
                for (a = 0; a < $scope.channel.members.length; a++) {
                    if ($scope.channel.members[a].name == $scope.user.username) {
                        if ($scope.channel.members[a].accessLevel == "member") {

                            $fws.command("removefromgroup", {
                                from: $scope.channel.data.name,
                                user: $scope.channel.members[a].name,
                                access: $scope.channel.members[a].accessLevel,
                                groupid: $scope.channel.groupid,
                                status: 'inactive'
                            });
                            //$scope.channel.members.splice(a, 1)
                        } else {
                            Toast("you don't have enough access to proceed!");
                        };
                    }
                };
            } else {
                Toast("you don't have enough access to proceed!");
            };

            $mdDialog.hide($scope.channel);
        };
    };

    //generate unique id
    $scope.createuuid = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    };

    //generate a toast - variable is the message to be displayed
    function Toast(text) {
        $mdToast.show(
            $mdToast.simple()
            .content(text)
            .position("bottom right")
            .hideDelay(3000)
            );
    };


});
