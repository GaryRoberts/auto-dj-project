
                var config = {
                    openSocket: function(config) {
                        var SIGNALING_SERVER = 'https://socketio-over-nodejs2.herokuapp.com:443/';

                        config.channel = config.channel || location.href.replace(/\/|:|#|%|\.|\[|\]/g, '');
                        var sender = Math.round(Math.random() * 999999999) + 999999999;

                        io.connect(SIGNALING_SERVER).emit('new-channel', {
                            channel: config.channel,
                            sender: sender
                        });

                        var socket = io.connect(SIGNALING_SERVER + config.channel);
                        socket.channel = config.channel;
                        socket.on('connect', function () {
                            if (config.callback) config.callback(socket);
                        });

                        socket.send = function (message) {
                            socket.emit('message', {
                                sender: sender,
                                data: message
                            });
                        };

                        socket.on('message', config.onmessage);
                    },
                    onRemoteStream: function(media) {
                        if(isbroadcaster) return;

                        var video = media.video;
                        videosContainer.insertBefore(video, videosContainer.firstChild);
                        rotateVideo(video);

                        document.querySelector('.hide-after-join').style.display = 'none';
                    },
                    onRoomFound: function(room) {
                        if(isbroadcaster) return;

                        conferenceUI.joinRoom({
                            roomToken: room.roomToken,
                            joinUser: room.broadcaster
                        });

                        document.querySelector('.hide-after-join').innerHTML = '<img src="https://www.webrtc-experiment.com/images/key-press.gif" style="margint-top:10px; width:50%;" />';
                    },
                    onNewParticipant: function(numberOfParticipants) {
                        var text = numberOfParticipants + ' users are viewing your screen!';
                        
                        if(numberOfParticipants <= 0) {
                            text = 'No one is viewing your screen YET.';
                        }
                        else if(numberOfParticipants == 1) {
                            text = 'Only one user is viewing your screen!';
                        }

                        document.title = text;
                        showErrorMessage(document.title, 'green');
                    },
                    oniceconnectionstatechange: function(state) {
                        var text = '';

                        if(state == 'closed' || state == 'disconnected') {
                            text = 'One of the participants just left.';
                            document.title = text;
                            showErrorMessage(document.title);
                        }

                        if(state == 'failed') {
                            text = 'Failed to bypass Firewall rules. It seems that target user did not receive your screen. Please ask him reload the page and try again.';
                            document.title = text;
                            showErrorMessage(document.title);
                        }

                        if(state == 'connected' || state == 'completed') {
                            text = 'A user successfully received your screen.';
                            document.title = text;
                            showErrorMessage(document.title, 'green');
                        }

                        if(state == 'new' || state == 'checking') {
                            text = 'Someone is trying to join you.';
                            document.title = text;
                            showErrorMessage(document.title, 'green');
                        }
                    }
                };

                function showErrorMessage(error, color) {
                    var errorMessage = document.querySelector('#logs-message');
                    errorMessage.style.color = color || 'red';
                    errorMessage.innerHTML = error;
                    errorMessage.style.display = 'block';
                }

                function getDisplayMediaError(error) {
                    if (location.protocol === 'http:') {
                        showErrorMessage('Please test this WebRTC experiment on HTTPS.');
                    } else {
                        showErrorMessage(error.toString());
                    }
                }

                function captureUserMedia(callback) {
                    var video = document.createElement('video');
                    video.muted = true;
                    video.volume = 0;
                    try {
                        video.setAttributeNode(document.createAttribute('autoplay'));
                        video.setAttributeNode(document.createAttribute('playsinline'));
                        video.setAttributeNode(document.createAttribute('controls'));
                    } catch (e) {
                        video.setAttribute('autoplay', true);
                        video.setAttribute('playsinline', true);
                        video.setAttribute('controls', true);
                    }

                    if(navigator.getDisplayMedia || navigator.mediaDevices.getDisplayMedia) {
                        function onGettingSteam(stream) {
                            video.srcObject = stream;
                            videosContainer.insertBefore(video, videosContainer.firstChild);

                            addStreamStopListener(stream, function() {
                                location.reload();
                            });

                            config.attachStream = stream;
                            callback && callback();
                            rotateVideo(video);

                            addStreamStopListener(stream, function() {
                                location.reload();
                            });

                            showPrivateLink();

                            document.querySelector('.hide-after-join').style.display = 'none';
                        }

                        if(navigator.mediaDevices.getDisplayMedia) {
                            navigator.mediaDevices.getDisplayMedia({video: true,audio:true}).then(stream => {
                                onGettingSteam(stream);
                            }, getDisplayMediaError).catch(getDisplayMediaError);
                        }
                        else if(navigator.getDisplayMedia) {
                            navigator.getDisplayMedia({video: true,audio:true}).then(stream => {
                                onGettingSteam(stream);
                            }, getDisplayMediaError).catch(getDisplayMediaError);
                        }
                    }
                    else {
                        if (DetectRTC.browser.name === 'Chrome') {
                            if (DetectRTC.browser.version == 71) {
                                showErrorMessage('Please enable "Experimental WebPlatform" flag via chrome://flags.');
                            } else if (DetectRTC.browser.version < 71) {
                                showErrorMessage('Please upgrade your Chrome browser.');
                            } else {
                                showErrorMessage('Please make sure that you are not using Chrome on iOS.');
                            }
                        }

                        if (DetectRTC.browser.name === 'Firefox') {
                            showErrorMessage('Please upgrade your Firefox browser.');
                        }

                        if (DetectRTC.browser.name === 'Edge') {
                            showErrorMessage('Please upgrade your Edge browser.');
                        }

                        if (DetectRTC.browser.name === 'Safari') {
                            showErrorMessage('Safari does NOT supports getDisplayMedia API yet.');
                        }
                    }
                }

                /* on page load: get public rooms */
                var conferenceUI = conference(config);

                /* UI specific */
                var videosContainer = document.getElementById("videos-container") || document.body;

                document.getElementById('share-screen').onclick = function() {
                    var roomName = document.getElementById('room-name') || { };
                    roomName.disabled = true;
                    captureUserMedia(function() {
                        conferenceUI.createRoom({
                            roomName: (roomName.value || 'Anonymous') + ' shared his screen with you'
                        });
                    });
                    this.disabled = true;
                };

                function rotateVideo(video) {
                    video.style[navigator.mozGetUserMedia ? 'transform' : '-webkit-transform'] = 'rotate(0deg)';
                    setTimeout(function() {
                        video.style[navigator.mozGetUserMedia ? 'transform' : '-webkit-transform'] = 'rotate(360deg)';
                    }, 1000);
                }

                function showPrivateLink() {
                    var uniqueToken = document.getElementById('unique-token');
                    uniqueToken.innerHTML = '<a href="' + location.href + '" target="_blank">Copy & Share This Private Room Link</a>';
                    uniqueToken.style.display = 'block';
                }