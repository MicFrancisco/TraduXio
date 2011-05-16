if (typeof console == "undefined") console={log:function(){}};

var workId;
var state;
(function($) {
    var url;
    
    $.functionName1 = function(){
    };
            
    outerLabel = {        
        fname1: function(){                
        }            
    };    

        
    $.transform = function(action,data){

        switch(action)
        {
        case 'extend':
        tdxio.page.setState('reset');
        //go to the last page, if you're not in it
        tdxio.page.displayWork(window.ajaxData,window.trId,true,window.ajaxData.work.Sentences.length-1,window.ajaxData.work.Sentences.length-1);
        tdxio.page.resetHeight();
        
        //append the form
        $('#work div.text').append(data.form);
          /*  $('#myForm').ajaxForm(function() { 
                alert("The text has been successfully extended!"); 
		});*/
		tdxio.page.resize();
		$.scrollTo($('#insert-text'));
		tdxio.page.setBlocked(true);
            break;
        case 'edit':

          break;
        case 'translate':
          break;
        default:
          
        }
     
    };
    
    $.updateTranslation = function(el,newEl){
		var i=0;
		for(i = 0; i<window.ajaxData.work.Interpretations.length;i++){
			if(window.ajaxData.work.Interpretations[i].work.id==window.trId){break;}
		}  
        if(el=="blocks"){
			window.translations[0].blocks = newEl;
			window.ajaxData.work.Interpretations[i].blocks=newEl;
			tdxio.page.displayWork(window.ajaxData,window.trId,window.back,window.begin,window.end);
			tdxio.page.setState(window.state);
			tdxio.page.adjust();
			tdxio.page.resize();
		}else if(el=="block"){
			window.translations[0].blocks[newEl.blockId].translation = newEl.newText;
			window.trWork.blocks[newEl.blockId].translation = newEl.newText;
			window.ajaxData.work.Interpretations[i].blocks[newEl.blockId].translation = newEl.newText;			
			tdxio.page.displayWork(window.ajaxData,window.trId,window.back,window.begin,window.end);
			tdxio.page.setState(window.state);
			tdxio.page.adjust();
			tdxio.page.resize();

		}
		else if(el=="title" || el=="author"){
			window.translations[0].work[el] = newEl;			
			window.ajaxData.work.Interpretations[i].work[el]=newEl;
			window.trWork.work[el]=newEl;  
		}
	};
    
    $.update = function(action,data){
        alert('update '+action);
        switch(action)
        {
        case 'extend':
            $('form#extend-form').remove();
            var lastId = $("#work div.text span:last")[0].id;
          //  alert(lastId);
            var newId = lastId;
            newId = newId.replace(/\d+$/,parseInt(lastId.match(/\d+$/))+1);
            $('#'+lastId).after("<span id='"+newId+"'>"+data.addedtext+"</span>" );
            $("#work div.text").height("");
            tdxio.page.resize();
            tdxio.page.setBlocked(false);
            break;
        case 'cut':
        case 'merge':    
            $.updateTranslation('blocks',data.newblocks);                        
            $.scrollTo($('#text'+workId+'-segment'+data.segToRed));
        break;        
        case 'translate':
        $.updateTranslation('block',data);
          break;
		case 'update-orig':
			window.ajaxData.work[data.el]=data.val;
		break;
		case 'update-tr':alert(data.el);alert(data.val);$.updateTranslation(data.el,data.val);
		break;
        default:
          
        }

    };
    
    $.showBlocks = function(show){
        if(show){
            $('.text').css('border','none');
            
        }else{
            $('.text').css('border','');
            
        }
      /*  window.ajaxData
        window.trId
        window.begin
        window.end*/
        
    };
    
    $.submitTranslation = function(blockId){
		var url = tdxio.baseUrl+"/translation/ajaxedit/id/"+window.trId;
		
		$.ajax({
                type: "post",
                url: encodeURI(url),
                dataType: "json",
                data: $("#translation .block.show.editable#"+blockId),
                clearForm: false,
                success:function(rdata,status){
                    if (rdata.response==false) {//error somewhere
						if(rdata.message.code == 2){tdxio.page.redirect(rdata.message.text);}
                        else alert(rdata.message.code);
                    }else {
						$("#translation .block.show.editable#"+blockId).text(this.value);
						$.update('translate',{'blockId':blockId.match(/\d/),'newText':rdata.newText});
                    }
                },
                error:function() {
                    alert("error saving the translation");
                },
                complete:function() {
                    //alert('complete');    
                }
            });
		
	};
    
    $(document).ready(function() {

		
    });
    
    

})(jQuery);
