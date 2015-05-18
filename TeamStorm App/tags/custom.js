$(function bind_textbox_tags() {
    var ajax_request = false;
    $('textarea.autosize.mention,textarea.autosize.txt-post').textntags({
        onDataRequest:function (mode, query, triggerChar, callback) {
            // fix for overlapping requests
            if(ajax_request) ajax_request.abort();
            ajax_request = $.getJSON(localStorage.getItem('site_url') + 'tags/key?q=' + query, function(responseData) {
                query = query.toLowerCase();
                responseData = _.filter(responseData, function(item) { return item.name.toLowerCase().indexOf(query) > -1; });
                callback.call(this, responseData);
                ajax_request = false;
				$('.textntags-wrapper .textntags-tag-list li').mouseover(function(){
					$('.textntags-wrapper .textntags-tag-list li').removeClass('active');
					$(this).addClass('active');
				});
            });
        }
    });
});