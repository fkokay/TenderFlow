(function ($) {

    var methods = {

        init : function() {

            var styles = [
                'paddingTop',
                'paddingRight',
                'paddingBottom',
                'paddingLeft',
                'fontSize',
                'lineHeight',
                'fontFamily',
                'width',
                'fontWeight',
                'border-top-width',
                'border-right-width',
                'border-bottom-width',
                'border-left-width',
                '-moz-box-sizing',
                '-webkit-box-sizing',
                'box-sizing'
            ];

            return this.each(function(){

                if ((this.className.indexOf('flex-input')  == -1)) return false;

                var $textarea = $(this).css({'resize': 'none', overflow: 'hidden'});

				var	$clone = $('<div></div>').css({
					'position' : 'absolute',
					'display' : 'none',
					'word-wrap' : 'break-word',
					'white-space' : 'pre-wrap',
					'border-style' : 'solid'
				}).appendTo(document.body);

                function copyStyles(){
                    for (var i=0; i < styles.length; i++) {
                        $clone.css(styles[i],$textarea.css(styles[i]));
                    }
                }

                copyStyles();

                var hasBoxModel = $textarea.css('box-sizing') == 'border-box' || $textarea.css('-moz-box-sizing') == 'border-box' || $textarea.css('-webkit-box-sizing') == 'border-box';
                var heightCompensation = parseInt($textarea.css('border-top-width')) + parseInt($textarea.css('padding-top')) + parseInt($textarea.css('padding-bottom')) + parseInt($textarea.css('border-bottom-width'));
                var textareaHeight = parseInt($textarea.css('height'), 10);
                var lineHeight = parseInt($textarea.css('line-height'), 10) || parseInt($textarea.css('font-size'), 10);
                //var minheight = lineHeight * 2 > textareaHeight ? lineHeight * 2 : textareaHeight;
                var minheight = 38;
                var maxheight = parseInt($textarea.css('max-height'), 10) > -1 ? parseInt($textarea.css('max-height'), 10) : Number.MAX_VALUE;

                function updateHeight() {
                    var textareaContent = $textarea.val().replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g, '&amp;').replace(/\n/g, '<br/>');
                    $clone.html(textareaContent + '&nbsp;');
                    setHeightAndOverflow();
                }

                function setHeightAndOverflow() {

                    var cloneHeight = $clone.height();
                    var overflow = 'hidden';
                    var height = hasBoxModel ? (cloneHeight + lineHeight + heightCompensation)-18 : (cloneHeight + lineHeight)-18;
                    if (height > maxheight) {
                        height = maxheight;
                        overflow = 'auto';
                    } else if (height < minheight) {
                        height = minheight;
                    }
                    if ($textarea.height() !== height) {
                        $textarea.css({'overflow': overflow, 'height': height + 'px'});
                    }
                }

                $textarea.bind('keyup change cut paste focus', function () {
                    updateHeight();
                });

                $textarea.bind('blur',function(){
                    setHeightAndOverflow();
                });

                $textarea.bind('updateHeight', function(){
                    copyStyles();
                    updateHeight();
                });

                $(function(){
                    updateHeight();
                });
            });
        }
    };

    $.fn.flexible = function(method) {

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }
    };

})(jQuery);