$(document).ready(function () {
    $(document).delegate('.open', 'click', function (event) {
        $(this).addClass('oppenned');
        event.stopPropagation();
    });

    $(document).delegate('body', 'click', function (event) {
        $('.open').removeClass('oppenned');
    });

    $(document).delegate('.cls', 'click', function (event) {
        $('.open').removeClass('oppenned');
        event.stopPropagation();
    });
});

$(function () {
    const socket = io('/rooms');

    // Elements
    const $messageForm = document.querySelector('#message-form');
    const $messageFormInput = $messageForm.querySelector('input');
    const $messageFormButton = $messageForm.querySelector('button');
    const $sendLocationButton = document.querySelector('#send-location');
    const $messages = document.querySelector('#messages');

    // Templates
    const messageTemplate = document.querySelector('#message-template').innerHTML;
    const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML;
    const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

    // Options
    const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

    // Autoscrolling Methods
    const autoscroll = () => {
        // New message element
        const $newMessage = $messages.lastElementChild;

        // Height of the new message
        const newMessageStyles = getComputedStyle($newMessage);
        const newMessageMargin = parseInt(newMessageStyles.marginBottom);
        const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

        // Visible height
        const visibleHeight = $messages.offsetHeight;

        // Height of messages container
        const containerHeight = $messages.scrollHeight;

        // How far have I scrolled?
        const scrollOffset = $messages.scrollTop + visibleHeight;

        if (containerHeight - newMessageHeight <= scrollOffset) {
            $messages.scrollTop = $messages.scrollHeight;
        }
    }

    // Rendering text messages on the template
    socket.on("message", (message) => {
        console.log(message);
        const html = Mustache.render(messageTemplate, {
            username: message.username,
            message: message.text,
            createdAt: moment(message.createdAt).format('h:mm a')
        });
        $messages.insertAdjacentHTML('beforeend', html);
        autoscroll();
    });

    // Rendering location messages on the template
    socket.on('locationMessage', (message) => {
        console.log(message);
        const html = Mustache.render(locationMessageTemplate, {
            username: message.username,
            url: message.url,
            createdAt: moment(message.createdAt).format('h:mm a')
        });
        $messages.insertAdjacentHTML('beforeend', html);
        autoscroll();
    });

    // Rendering room users data to the sidebar
    socket.on('roomData', ({ room, users }) => {
        const html = Mustache.render(sidebarTemplate, {
            room,
            users
        });
        document.querySelector('#sidebar').innerHTML = html;
    });

    // Sending Text messages
    $messageForm.addEventListener("submit", (e) => {
        e.preventDefault();

        $messageFormButton.setAttribute('disabled', 'disabled');
        const message = e.target.elements.message.value;

        socket.emit('sendMessaging', message, (error) => {
            $messageFormButton.removeAttribute('disabled');
            $messageFormInput.value = '';
            $messageFormInput.focus();

            if (error) {
                return console.log(error);
            }
            console.log('\t:Message Delivered! ');
        });
    });

    // Sending Location
    $sendLocationButton.addEventListener("click", () => {
        if (!navigator.geolocation) {
            return alert("Geo-Location feature not supported by your browser. ");
        }
        $sendLocationButton.setAttribute('disabled', 'disabled');

        navigator.geolocation.getCurrentPosition((position) => {
            socket.emit('sendLocation', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }, () => {
                $sendLocationButton.removeAttribute('disabled');
                console.log('\t:Location shared! ');
            });
        })
    });

    socket.emit('join', { username, room }, (error) => {
        if (error) {
            alert(error);
            location.href = '/chat/room-enter'
        }
    });

});