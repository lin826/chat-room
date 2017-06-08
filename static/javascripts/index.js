$(function () {
    var $messages = $('.messages-content');

    $(window).load(function () {
      $('#newtag').css('visibility','hidden');
      $messages.mCustomScrollbar();
      updateScrollbar();
    });

    var namespace = '';
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + namespace);

    socket.on('connect', function () {
        //console.log('connected!');
        socket.emit('join', {room: 'A_Room'});
    });

    function updateScrollbar() {
        $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'last');
    }

    function insertMessage() {
        //console.log('insertMessage');
        var msg = $('.message-input').val();
        if ($.trim(msg) === '') {
            return false;
        }

        if( $("input:checked").val() === undefined ){
          window.alert("Please select a related topic.");
          return false;
        }

        if( $("input:checked").val() === 'NEW' && $(".message-newtagcat").val() ){
          var obj = {
              msg: msg,
              room: 'A_Room',
              tag: $(".message-newtagcat").val()
          };
        }
        else {
          var obj = {
              msg: msg,
              room: 'A_Room',
              tag: $("input:checked").val()
          };
        }
        socket.emit('sendInquiry', obj);
        $('.message-input').val(null);
    }


    socket.on('getInquiry', function (msg) {
      var new_m = $('<div class="message new" style = " border-left: 6px solid ' + msg.Color
          + ' ;"><figure class="avatar"><img src="/static/mugshot/'
          + msg.PictureUrl + '" /></figure>' + msg.msg + '</div>');
      new_m.prepend('<div class="timestamp">' + msg.Name + ' at ' + msg.time + '</div>');
      new_m.appendTo($('.mCSB_container')).addClass('new');
      if( msg.Name === $("h1").html() ) {
        $('.message-input').val(null);
      }
      $('<div class="tagcat"> # ' + msg.Tag + '</div>').appendTo($('.message:last'));
      updateScrollbar();
      socket.emit('sendRead');
    });


    $('.message-submit').click(function () {
        insertMessage();
    });

    $('.tag-table-item').click(function () {
        var v = this.value;
        $(".message").show();
        if(v !== ''){
          $(".tagcat").each(function( obj ) {
            if( this.innerHTML !== '#' + v ){
              this.parentElement.style.display = "none";
            }
          });
        }
        updateScrollbar();
    });

    $('.chat-unread').click(function () {
        $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', '.unread-line');
    });

    $('.add-tag').click(function () {
        var tag_content = window.prompt(" Please enter your tag ", "");
        if ( tag_content ) {
          var new_tag = $('<input class="message-tagcat" type="radio" name="cat">');
          new_tag.val(tag_content);
          new_tag.appendTo( $('.tag-box') );
          var new_tag_html = $('<text> ' + tag_content + ' </text>');
          new_tag_html.appendTo( $('.tag-box') );
        }
    });

    $(window).on('keydown', function (e) {
        if (e.which == 13) {
            insertMessage();
            return false;
        }
    });
});
