tbfine(function (){

return {
	init: function (){
	　　$('.commentlist .url').attr('target','_blank')

		$('.comment-user-change').on('click', function(){
			$(this).hide()
			$('#comment-author-info').slideDown(300)
		})

		/* 
	     * comment
	     * ====================================================
	    */
	    var edit_mode = '0',
	        txt1 = '<div class="comt-tip comt-loading">评论提交中...</div>',
	        txt2 = '<div class="comt-tip comt-error">#</div>',
	        txt3 = '">',
	        cancel_edit = '取消编辑',
	        edit,
	        num = 1,
	        comm_array = [];
	    comm_array.push('');

	    $comments = $('#comments-title');
	    $cancel = $('#cancel-comment-reply-link');
	    cancel_text = $cancel.text();
	    $submit = $('#commentform #submit');
	    $submit.attr('disabled', false);
	    $('.comt-tips').append(txt1 + txt2);
	    $('.comt-loading').hide();
	    $('.comt-error').hide();
	    $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
	    $('#commentform').submit(function() {
	        $('.comt-loading').slideDown(300);
	        $submit.attr('disabled', true).fadeTo('slow', 0.5);
	        if (edit) $('#comment').after('<input type="text" name="edit_id" id="edit_id" value="' + edit + '" style="display:none;" />');
	        $.ajax({
	            url: jsui.uri + '/action/comment.php',
	            data: $(this).serialize(),
	            type: $(this).attr('method'),
	            error: function(request) {
	                $('.comt-loading').slideUp(300);
	                $('.comt-error').slideDown(300).html(request.responseText);
	                setTimeout(function() {
	                        $submit.attr('disabled', false).fadeTo('slow', 1);
	                        $('.comt-error').slideUp(300)
	                    },
	                    3000)
	            },
	            success: function(data) {
	                $('.comt-loading').slideUp(300);
	                comm_array.push($('#comment').val());
	                $('textarea').each(function() {
	                    this.value = ''
	                });
	                var t = addComment,
	                    cancel = t.I('cancel-comment-reply-link'),
	                    temp = t.I('wp-temp-form-div'),
	                    respond = t.I(t.respondId),
	                    post = t.I('comment_post_ID').value,
	                    parent = t.I('comment_parent').value;
	                if (!edit && $comments.length) {
	                    n = parseInt($comments.text().match(/\d+/));
	                    $comments.text($comments.text().replace(n, n + 1))
	                }
	                new_htm = '" id="new_comm_' + num + '"></';
	                new_htm = (parent == '0') ? ('\n<ol style="clear:both;" class="commentlist commentnew' + new_htm + 'ol>') : ('\n<ul class="children' + new_htm + 'ul>');
	                ok_htm = '\n<span id="success_' + num + txt3;
	                ok_htm += '</span><span></span>\n';

	                if (parent == '0') {
	                    if ($('#postcomments .commentlist').length) {
	                        $('#postcomments .commentlist').before(new_htm);
	                    } else {
	                        $('#respond').after(new_htm);
	                    }
	                } else {
	                    $('#respond').after(new_htm);
	                }

	                $('.comment-user-change').show()
	                $('#comment-author-info').slideUp()

	                if( !$('.comment-user-avatar-name').length ){
	                	$('.comt-title img').after('<p class="comment-user-avatar-name"></p>')	
	                }
	                $('.comment-user-avatar-name').text( $('#commentform #author').val() )

	                // console.log( $('#new_comm_' + num) )
	                $('#new_comm_' + num).hide().append(data);
	                $('#new_comm_' + num + ' li').append(ok_htm);
	                $('#new_comm_' + num).fadeIn(1000);
	                /*$body.animate({
	                        scrollTop: $('#new_comm_' + num).offset().top - 200,014
	                    },
	                    500);*/
	                $('#new_comm_' + num).find('.comt-avatar .avatar').attr('src', $('.commentnew .avatar:last').attr('src'));
	                countdown();
	                num++;
	                edit = '';
	                $('*').remove('#edit_id');
	                cancel.style.display = 'none';
	                cancel.onclick = null;
	                t.I('comment_parent').value = '0';
	                if (temp && respond) {
	                    temp.parentNode.insertBefore(respond, temp);
	                    temp.parentNode.removeChild(temp)
	                }
	            }
	        });
	        return false
	    });
	    addComment = {
	        moveForm: function(commId, parentId, respondId, postId, num) {
	            var t = this,
	                div, comm = t.I(commId),
	                respond = t.I(respondId),
	                cancel = t.I('cancel-comment-reply-link'),
	                parent = t.I('comment_parent'),
	                post = t.I('comment_post_ID');
	            if (edit) exit_prev_edit();
	            num ? (t.I('comment').value = comm_array[num], edit = t.I('new_comm_' + num).innerHTML.match(/(comment-)(\d+)/)[2], $new_sucs = $('#success_' + num), $new_sucs.hide(), $new_comm = $('#new_comm_' + num), $new_comm.hide(), $cancel.text(cancel_edit)) : $cancel.text(cancel_text);
	            t.respondId = respondId;
	            postId = postId || false;
	            if (!t.I('wp-temp-form-div')) {
	                div = document.createElement('div');
	                div.id = 'wp-temp-form-div';
	                div.style.display = 'none';
	                respond.parentNode.insertBefore(div, respond)
	            }!comm ? (temp = t.I('wp-temp-form-div'), t.I('comment_parent').value = '0', temp.parentNode.insertBefore(respond, temp), temp.parentNode.removeChild(temp)) : comm.parentNode.insertBefore(respond, comm.nextSibling);
	            $body.animate({
	                    scrollTop: $('#respond').offset().top - 180
	                },
	                400);
	                // pcsheight()
	            if (post && postId) post.value = postId;
	            parent.value = parentId;
	            cancel.style.display = '';
	            cancel.onclick = function() {
	                if (edit) exit_prev_edit();
	                var t = addComment,
	                    temp = t.I('wp-temp-form-div'),
	                    respond = t.I(t.respondId);
	                t.I('comment_parent').value = '0';
	                if (temp && respond) {
	                    temp.parentNode.insertBefore(respond, temp);
	                    temp.parentNode.removeChild(temp)
	                }
	                this.style.display = 'none';
	                this.onclick = null;
	                return false
	            };
	            try {
	                t.I('comment').focus()
	            } catch (e) {}
	            return false
	        },
	        I: function(e) {
	            return document.getElementById(e)
	        }
	    };

	    function exit_prev_edit() {
	        $new_comm.show();
	        $new_sucs.show();
	        $('textarea').each(function() {
	            this.value = ''
	        });
	        edit = ''
	    }
	    var wait = 15,
	        submit_val = $submit.val();

	    function countdown() {
	        if (wait > 0) {
	            $submit.val(wait);
	            wait--;
	            setTimeout(countdown, 1000)
	        } else {
	            $submit.val(submit_val).attr('disabled', false).fadeTo('slow', 1);
	            wait = 15
	        }
	    }
	}
}

})

// 初始化
$(function(){
	inlojv_js_getqqinfo();
});

// 设置cookie 
function setCookie(a,c){var b=30;var d=new Date();d.setTime(d.getTime()+b*24*60*60*1000);document.cookie=a+"="+escape(c)+";expires="+d.toGMTString()}
// 获取cookie
function getCookie(b){var a,c=new RegExp("(^| )"+b+"=([^;]*)(;|$)");if(a=document.cookie.match(c)){return unescape(a[2])}else{return null}}

// 核心函数
function inlojv_js_getqqinfo(){
	// 获取cookie
	if(getCookie('comt-avatar') && getCookie('user_qq') ){
	
			$('div.comment-user-avatar img').attr('src',getCookie('user_avatar'));
			$('#qq').val(getCookie('user_qq'));
	}

	$('#qq').on('blur',function(){
		var qq=$('#qq').val(); // 获取访客填在qq表单上的qq数字，其中#yuao-comt-qq表示QQ input标签上的id，改成你自己的！	
		$('#email').val($.trim(qq)+'@qq.com'); // 将获取到的qq，改成qq邮箱填入邮箱表单，其中#yuao-comt-email表示邮箱input标签上的id，改成你自己的！		
 $('#url').val('http://user.qzone.qq.com/'+$('#qq').val());
				// ajax方法获取昵称
		$.ajax({
			type: 'get',
			url:'http://www.52dsz.cn/wp-content/themes/dux/qq.php?type=getqqnickname&qq='+qq,  // func_getqqinfo.php是后端处理文件，注意路径，127.0.0.1 改成你自己的域名
			dataType: 'jsonp',
			jsonp: 'callback',
			jsonpCallback: 'portraitCallBack',
			success: function(data) {
				// console.log(data);
				$('#author').val(data[qq][6]);	// 将返回的qq昵称填入到昵称input表单上，其中#yuao-comt-author表示昵称input标签上的id，改成你自己的！
				alert('已自动填写QQ信息，请确认！'); // 弹出警告
				setCookie('user_qq',qq);	// 设置cookie
			},
			error: function() {
				$('#qq,#author,#email').val(''); // 如果获取失败则清空表单，注意input标签上的id，改成你自己的！
				alert('QQ信息获取失败！请重新填写。\n如需自定义信息请不要点击第一个框！'); // 弹出警告
				
			}
		});
		// 获取头像
		$.ajax({
			type: 'get',
			url: 'http://www.52dsz.cn/wp-content/themes/dux/qq.php?type=getqqavatar&qq='+qq, // func_getqqinfo.php是后端处理文件，注意路径，127.0.0.1 改成你自己的域名！
			dataType: 'jsonp',
			jsonp: 'callback',
			jsonpCallback: 'qqavatarCallBack',
			success: function(data) {		
				$('avatar avatar-50 photo').attr('src',data[qq]);	// 将返回的qq头像设置到你评论表单区域显示头像的节点上，div.comment-user-avatar img表示头像节点img标签，改成你自己的！
				setCookie('user_avatar',data[qq]);	 // 设置cookie
			},
			error: function() {
				$('#qq,#author,#url,#email').val(''); // 清空表单
			}
		});
	});
}
//清空信息表
$(function(){
	$("input:djqk").click(function() {
		$("input[id='#qq,#author,#url,#email']").val("").focus(); // 清空并获得焦点
	});
})