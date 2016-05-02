mambatiFrameworkShell.factory('dataHandler', function ($timeout, $chat, $presence, $auth, $objectstore,$rootScope ,$fws ) {


    var conversations = [];
    var callLog = [];
    var notifications = [];
    var nativeUser = "";
    var selectedUser = "";
    var activities = [];
    var convoImages = [];
    var channels = [];
    //    var users = [{
    //        username: 'eranga@duo.com',
    //        Msg: [],
    //        count: 0,
    //        fname: 'Eranga Manoj',
    //        //                    lname: contacts[i].lname,
    //        location: 'Sri Lanka',
    //        email: 'eranga@duo.com',
    //        mobile: '012345678',
    //        profile_pic: '',
    //        status: "offline",
    //        quickNote: ""
    //    }, {
    //        username: 'senal@duo.com',
    //        Msg: [],
    //        count: 0,
    //        fname: 'Senal dulaj',
    //        //                    lname: contacts[i].lname,
    //        location: 'Sri Lanka',
    //        email: 'senal@duo.com',
    //        mobile: '012345678',
    //        profile_pic: '',
    //        status: "offline",
    //        quickNote: ""
    //    }, {
    //        username: 'pule@duo.com',
    //        Msg: [],
    //        count: 0,
    //        fname: 'Pulathisi Basnayake',
    //        //                    lname: contacts[i].lname,
    //        location: 'Sri Lanka',
    //        email: 'pule@duo.com',
    //        mobile: '012345678',
    //        profile_pic: '',
    //        status: "offline",
    //        quickNote: ""
    //    }, {
    //        username: 'lakshan@duo.com',
    //        Msg: [],
    //        count: 0,
    //        fname: 'Lakshan Biber',
    //        //                    lname: contacts[i].lname,
    //        location: 'Sri Lanka',
    //        email: 'lakshan@duo.com',
    //        mobile: '012345678',
    //        profile_pic: '',
    //        status: "offline",
    //        quickNote: ""
    //    }];

    var users = [];

    $fws.onRecieveCommand("groupchat_mygroups_response", function (e, data) {
        //channels = [];
        var data = JSON.parse(data);
        console.log(data);
        for (a = 0; a < data.length; a++) {
            data[a].messages = [];
            channels.push(data[a]);
        };
    });


    function getConversation(username) {
        var flag = [];
        for (i = 0; i < conversations.length; i++) {
            if (conversations[i].members.length == 2) {
                if (conversations[i].members[0] == username && conversations[i].members[1] == nativeUser) {
                    flag = conversations[i];
                } else if (conversations[i].members[0] == username && conversations[i].members[1] == nativeUser) {
                    flag = conversations[i];
                };
            };
        };

        return flag;

    };

    function generateID() {
        return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    };

    function createNewConversation(username) {
        var obj = {
            convo_id: generateID(),
            convo_name: username,
            members: [username, nativeUser],
            messages: []
        };
        conversations.push(obj);
        console.log("new conversation created");
        return obj;
    };

    function addIncomingCallToLog(user) {
        var obj = {
            dialer: user,
            reciever: nativeUser,
            dateTime: new Date(),
            count: 1,
            type: 'recieved'
        };
        callLog.push(obj);
        addIncomingCallActivity(obj);
    };

    function addMissedCallToLog(user) {

        var obj = {
            dialer: user,
            reciever: nativeUser,
            dateTime: new Date(),
            count: 1,
            type: 'missed'
        };
        callLog.push(obj);
        addMissedCallActivity(obj);
    };

    function addOutgoingCallToLog(user) {
        var obj = {
            dialer: nativeUser,
            reciever: user,
            dateTime: new Date(),
            count: 1,
            type: 'dialed'
        };

        var lastCall = lastCallMade();
        if (lastCall !== null) {
            if (lastCall.reciever.username == user.username) {
                callLog.pop();
                obj.count = lastCall.count + 1;
                callLog.push(obj);
                addOutgoingCallActivity(obj);
            } else {
                callLog.push(obj);
                addOutgoingCallActivity(obj);
            };
        } else {
            callLog.push(obj);
            addOutgoingCallActivity(obj);
        };
    };

    function addUnknownOutgoingCallToLog(data) {
        var obj = {
            dialer: nativeUser,
            reciever: {
                profile_pic: 'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozOUUwQzZGRTE2QkIxMUUzQUVGNUZDQ0I3MzQ1ODU1QiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozOUUwQzZGRjE2QkIxMUUzQUVGNUZDQ0I3MzQ1ODU1QiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjJGNTQ1QkZGMTZCQjExRTNBRUY1RkNDQjczNDU4NTVCIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjJGNTQ1QzAwMTZCQjExRTNBRUY1RkNDQjczNDU4NTVCIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+za7CHgAAEmJJREFUeNrsXWlw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',
                fname: data,
                lname: ''
            },
            dateTime: new Date(),
            count: 1,
            type: 'dialed'
        };
        callLog.push(obj);
        addOutgoingCallActivity(obj);
    };


    function lastCallMade() {
        var i = parseInt(callLog.length - 1);
        if (i > -1) {
            var lastCall = callLog[i];
        } else {
            lastCall = null;
        };
        return lastCall;
    };

    function getProfileData(username) {
        for (i = 0; i < users.length; i++) {
            if (username == users[i].username) {
                var obj = users[i];
            };
        };

        return obj;
    };


    function addStateChangeActivity(data) {
        var profile = getProfileData(data.userName);
        var obj = {
            username: profile.username,
            fname: profile.fname,
            lname: profile.lname,
            profile_pic: profile.profile_pic,
            state: data.state,
            dateTime: new Date(),
            type: "stateChange"

        };
        activities.push(obj);
        //        $timeout(function () {
        //            activities.shift();
        //        }, 10000);
};

function addOutgoingCallActivity(data) {
    var obj = {
        fname: data.reciever.fname,
        lname: data.reciever.lname,
        profile_pic: data.reciever.profile_pic,
        dateTime: data.dateTime,
        type: "outgoingCall"

    };
    activities.push(obj);
        //        $timeout(function () {
        //            activities.shift();
        //        }, 10000);
};

function addIncomingCallActivity(data) {
    var obj = {
        fname: data.dialer.fname,
        lname: data.dialer.lname,
        profile_pic: data.dialer.profile_pic,
        dateTime: data.dateTime,
        type: "incomingCall"

    };
    activities.push(obj);
        //        $timeout(function () {
        //            activities.shift();
        //        }, 10000);
};

function addMissedCallActivity(data) {
    var obj = {
        fname: data.dialer.fname,
        lname: data.dialer.lname,
        profile_pic: data.dialer.profile_pic,
        dateTime: data.dateTime,
        type: "missedCall"

    };
    activities.push(obj);
        //        $timeout(function () {
        //            activities.shift();
        //        }, 10000);
};

function addOnlineUsersActivity(data) {
    var profile = getProfileData(data.userName);
    var obj = {
        username: profile.username,
        fname: profile.fname,
        lname: profile.lname,
        profile_pic: profile.profile_pic,
        state: data.state,
        dateTime: new Date(),
        type: "onlineUsers"

    };
    activities.push(obj);
        //        $timeout(function () {
        //            activities.shift();
        //        }, 10000);
};

function storeRecievedMsg(data, sender) {
    var obj = {
        message: data.content,
        from: sender,
        time: data.timestamp,
        type: data.type
    };
    var flag = false;
    for (i = 0; i < conversations.length; i++) {
        if (conversations[i].members.length == 2) {
            if (conversations[i].members[0] == sender && conversations[i].members[1] == nativeUser) {
                conversations[i].messages.push(obj);
                flag = true;
            } else if (conversations[i].members[0] == sender && conversations[i].members[1] == nativeUser) {
                conversations[i].messages.push(obj);
                flag = true;
            };
        };
    };

    if (flag == false) {
        conversation = createNewConversation(sender);
        for (i = 0; i < conversations.length; i++) {
            if (conversations[i].members.length == 2) {
                if (conversations[i].members[0] == sender && conversations[i].members[1] == nativeUser) {
                    conversations[i].messages.push(obj);
                    flag = true;
                } else if (conversations[i].members[0] == sender && conversations[i].members[1] == nativeUser) {
                    conversations[i].messages.push(obj);
                    flag = true;
                };
            };
        };
    };

};

function storeConvoImages(data) {
    console.log(data);
    if (data.type == "file") {
        convoImages.push(data);
    };
    console.log(convoImages);
};

function notifyUser(data) {
    console.log("notify user triggered for", data.from);
    for (i = 0; i < users.length; i++) {
        if (users[i].username == data.from && data.from !== selectedUser.username) {
            users[i].count = users[i].count + 1;
            console.log("notified");
            playNotificationBeep();
        };
    }
};

function playNotificationBeep() {
    var audio = document.getElementById("notificationTune");
    audio.load();
    audio.play();

};

$fws.onRecieveCommand("chat_send_notification", function (e, data) {
    console.log(data);
    storeRecievedMsg(data, data.from);
    notifyUser(data);
});

$presence.onUserStateChanged(function (e, data) {
    console.log(data);
    addStateChangeActivity(data);
    if (data.state == "online") {
        for (i = 0; i < users.length; i++) {
            console.log(i, users[i].username);
            if (users[i].username == data.userName) {
                users[i].status = "online";
            };
        }

    } else {
        for (i = 0; i < users.length; i++) {
            console.log(i, users[i].username);
            if (users[i].username == data.userName) {
                users[i].status = "offline";
            };
        }
    }
});

$presence.onStateChanged(function (e, data) {
    $presence.getOnlineUsers();
    console.log(e, data);
});

function createOnlineUsers(data) {
    for (i = 0; i < users.length; i++) {
        console.log(i, users[i].username);
        for (x = 0; x < data.length; x++) {
            if (users[i].username == data[x].userName) {
                users[i].status = "online";
                addOnlineUsersActivity(data[x]);
            };
        }
    }
    console.log(users);
};

$presence.onOnlineUsersLoaded(function (e, data) {
    var newUsers = [];
    var cUser = $auth.getUserName();
    for (var uIndex in data.users)
        if (data.users[uIndex].userName != nativeUser)
            newUsers.push(data.users[uIndex]);
        createOnlineUsers(newUsers);
    });

function getUserProfileDetails(username) {
    var tempObj = "";
    var client = $objectstore.getClient("duosoftware.com", "profile", true);
    client.onGetOne(function (userProfileInfo) {
        console.log("retrieving contatct list user profile details");
        console.log(userProfileInfo);
        tempObj = userProfileInfo;
    });
    client.onError(function (data) {
            // alert ("Error occured");
        });
    client.getByKey(username);
    return tempObj;
};

function getUserProfilePicture(username) {
    var profilepicture = "";
    var client = $objectstore.getClient('duoworld.duoweb.info', "profilepictures", true);
    client.onGetOne(function (data) {
        if (data)
            // console.log(data);
        profilepicture = data.Body;
    });
    client.onError(function (data) {
            //Toast("Error occured while fetching profile picture");
        });
    client.getByKey(username);
    return profilepicture;
};

return {
    getAllContacts: function () {
        return contacts;
    },
    getAllConversations: function () {
        return conversations;
    },
    getConversationForSelectedUser: function (username) {
        var conversation = getConversation(username);
        if (conversation.convo_id == undefined) {
            conversation = createNewConversation(username);
        };
        return conversation;
    },

    nativeUser: function (username) {
        nativeUser = username;
    },
    getNativeUser: function () {
        return nativeUser;
    },

    storeSentMsg: function (msg, id, to) {
        var obj = {
            from: nativeUser,
            message: msg,
            to: to,
            time: new Date()

        };
        for (a = 0; a < conversations.length; a++) {
            if (conversations[a].convo_id == id) {
                conversations[a].messages.push(obj);
            };
        };
    },
    addToCallLog: function (data, type) {
        if (type == 'incoming') {
            addIncomingCallToLog(data);
        } else if (type == 'outgoing') {
            addOutgoingCallToLog(data);
        } else if (type == 'missed') {
            addMissedCallToLog(data);
        } else if (type == 'unknown') {
            addUnknownOutgoingCallToLog(data);
        };

    },
    addToActivityLog: function (data, type) {
        if (type == 'stateChange') {
            addStateChangeActivity(data);
        } else if (type == 'outgoingCall') {
            addOutgoingCallActivity(data);
        } else if (type == 'incomingCall') {
            addIncomingCallActivity(data)
        } else if (type == 'missedCall') {
            addMissedCallActivity(data)
        } else if (type == 'onlineUsers') {
            addOnlineUsersActivity(data);
        };
    },
    makeACall: function (user, state) {
            //addCallState(user.username, state);
        },

        getCallLog: function () {
            return callLog;
        },

        addNotification: function () {

        },
        getActivities: function () {
            return activities;
        },
        getUserDetails: function (username) {
            console.log(username);
            var retunObj = "";
            for (a = 0; a < users.length; a++) {
                if (username == users[a].username) {
                    retunObj = users[a];
                };
            };
            console.log(retunObj);
            return retunObj;
        },
        storeConvoImages: function (data) {
            storeConvoImages(data);
        },
        getConvoImages: function () {
            return convoImages;
        },
        createAllUsers: function (data) {
            console.log(data);

            for (i = 0; i < data.length; i++) {
                console.log(data[i].email);
                var obj = {
                    username: data[i].email,
                    Msg: [],
                    count: 0,
                    fname: data[i].name,
                    //                    lname: contacts[i].lname,
                    location: data[i].country,
                    email: data[i].email,
                    mobile: data[i].phone,
                    profile_pic: data[i].profileImg,
                    status: "offline",
                    quickNote: ""
                };

                if (obj.profile_pic == "" || obj.profile_pic == null) {
                    obj.profile_pic = "iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozOUUwQzZGRTE2QkIxMUUzQUVGNUZDQ0I3MzQ1ODU1QiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozOUUwQzZGRjE2QkIxMUUzQUVGNUZDQ0I3MzQ1ODU1QiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjJGNTQ1QkZGMTZCQjExRTNBRUY1RkNDQjczNDU4NTVCIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjJGNTQ1QzAwMTZCQjExRTNBRUY1RkNDQjczNDU4NTVCIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+za7CHgAAEmJJREFUeNrsXWlw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";
                    console.log("default profile picture applied");
                };

                if (obj.username !== nativeUser) {
                    users.push(obj);
                };



            };
            console.log(users);
        },
        getUsers: function () {
            return users;
        },
        setSelectedUser: function (user) {
            selectedUser = user;
        },
        getAllChannels: function () {
            return channels;
        },
        getChannelDataForSelectedChannel: function (groupId) {
            var flag;
            for (b = 0; b < channels.length; b++) {
                if (channels[b].groupid == groupId) {
                    flag = channels[b];
                };
            }
            return flag;
        },
        storeChannelMsg: function (msg, groupid, from, timestamp) {
            var obj = {
                message: msg,
                from: from,
                time: timestamp
            }
            for (c = 0; c < channels.length; c++) {
                if (channels[c].groupid == groupid) {
                    console.log('group found');
                    channels[c].messages.push(obj);
                }
            }
        },
        createNewChannel: function (data) {
            var newChannel = {
                groupid: nativeUser + data.topic,
                topic: data.topic,
                messages: [],
                data: {
                    accessLevel: "SuperAdmin",
                    name: nativeUser,
                    status: "active"
                },
                members: [{
                    accessLevel: "SuperAdmin",
                    name: nativeUser,
                    status: "active"
                }]
            };

            $fws.command("groupmaker", {
                creatorid: nativeUser,
                topic: data.topic,
                img: "images/appIcons/bubbles.png",
                description: "this is to be added"
            });


            for (u = 0; u < data.members.length; u++) {
                var tempObj = {
                    accessLevel: "member",
                    name: data.members[u],
                    status: "active"
                }
                newChannel.members.push(tempObj);
                $fws.command("addToGroup", {
                    user: tempObj.name,
                    from: nativeUser,
                    groupid: newChannel.groupid,
                    topic: newChannel.topic,
                    access: "member",
                    status: "active"
                });
            };
            channels.push(newChannel);
        },

        addUsersToChannel: function (data, channelData) {
            for (x = 0; x < channels.length; x++) {
                if (channels[x].groupid == channelData.groupid) {
                    for (y = 0; y < data.members.length; y++) {
                        //                        var tempObj = {
                        //                            accessLevel: "member",
                        //                            name: data.members[y],
                        //                            status: "active"
                        //                        }
                        //channels[x].members.push(tempObj);
                        $fws.command("addToGroup", {
                            user: data.members[y],
                            from: nativeUser,
                            groupid: channelData.groupid,
                            topic: channelData.topic,
                            access: "member",
                            status: "active"
                        });
                    };
                };
            };
        },
        updateChannel: function (data) {
            for (z = 0; z < channels.length; z++) {
                if (channels[z].groupid == data.groupid) {
                    channels[z] = data;
                };
            };
        },
        addUserToGroup: function (data) {
            for (a = 0; a < channels.length; a++) {
                console.log(data.groupid, channels[a].groupid);
                if (data.groupid == channels[a].groupid) {
                    var tempObj = {
                        accessLevel: "member",
                        name: data.added,
                        status: "active"
                    }
                    channels[a].members.push(tempObj);

                    var notification = {
                        type: "notification",
                        message: data.added + " added to the channel by " + data.adder
                    };
                    channels[a].messages.push(notification);
                    console.log(channels[a]);
                }
            };
        },
        removeUserFromChannel: function (groupid, userid, remover) {
            for (b = 0; b < channels.length; b++) {
                if (groupid == channels[b].groupid) {
                    for (c = 0; c < channels[b].members.length; c++) {
                        if (userid == channels[b].members[c].name) {
                            channels[b].members[c].status = 'inactive';
                            var notification = {
                                type: "notification",
                                message: userid + " has been removed from the channel by " + remover
                            };
                            channels[b].messages.push(notification);
                            console.log(channels[b]);

                        };
                    };
                }
            };
        },
        deleteAllChannels: function () {
            channels = [];
        },
        modifyAccess: function (groupid, userid, access) {
            for (d = 0; d < channels.length; d++) {
                if (groupid == channels[d].groupid) {
                    for (e = 0; e < channels[d].members.length; e++) {
                        if (userid == channels[d].members[e].name) {
                            channels[d].members[e].accessLevel = access;

                            var temp = {
                                type: "notification",
                                message: "your access level changed to " + access
                            }

                            channels[d].messages.push(temp);
                        }
                    };
                }
            };
        }


    }

});
