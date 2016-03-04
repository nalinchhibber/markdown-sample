(function(){

	 function parseMD(){
		md_content = $('#md').val(),
		html_content = marked(md_content);

		$('#preview').html(html_content)      
	}		

	this.parseMD = parseMD
})();