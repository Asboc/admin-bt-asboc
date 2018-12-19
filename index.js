$(function () {
Lotto = {};
Lotto.comment = function(){
$("#qq").blur(function(){
$('#qq').attr("sl",true);
$("#ajaxloading").html('<a style="font-size:12px;margin-left:5px;color:red">正在获取QQ信息..</a>');
    $.getJSON('../qq.php?qq='+$('#qq').val()+'&callback=?', function(q){
    if(q.name){
    $('#author').val(q.name);
    $('#email').val($('#qq').val()+'@qq.com');
    $('#url').val('http://user.qzone.qq.com/'+$('#qq').val());
    $('#qq').attr("disabled",false);
    $("#ajaxloading").hide();
    }else{
    $("#ajaxloading").hide();
    $("#error").html('qq账号错误').show().fadeOut(4000);
   $('#qq').attr("sl",false);
    }
    });
});
}
Lotto.run = function(){this.comment();};
Lotto.run();
});