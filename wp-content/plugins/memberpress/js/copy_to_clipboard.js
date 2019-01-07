var mepr_setup_clipboard = function(clipboard_class) {
  (function($) {
    if(clipboard_class==null) {
      clipboard_class='.mp-clipboardjs';
    }

    $(clipboard_class).each(function(i, el) {
      var $el = $(el),
        copy_text = 'Copy to Clipboard',
        copied_text = 'Copied!',
        copy_error_text = 'Oops, Copy Failed!',
        clipboard = new ClipboardJS(el),
        instance = $el
          .tooltipster({
            theme: 'tooltipster-borderless',
            content: copy_text,
            trigger: 'custom',
            triggerClose: {
              mouseleave: true,
              touchleave: true
            },
            triggerOpen: {
              mouseenter: true,
              touchstart: true
            }
          })
          .tooltipster('instance');

      clipboard
        .on('success', function(e) {
          instance
            .content(copied_text)
            .one('after', function(){
              instance.content(copy_text);
            });
        })
        .on('error', function(e) {
          instance
            .content(copy_error_text)
            .one('after', function(){
              instance.content(copy_text);
            });
        });
      });
  })(jQuery);
};
