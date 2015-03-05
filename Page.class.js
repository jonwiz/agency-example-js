Agency.Page = {

	total: 0,
	current: 1,
	open: 0,
	htmlContainer: {},
	fields: {},
	init: function(open){
		this.open = open;
		//init total pages
		this.total = $("#pages").children().length + 1;
		//view first page
		this.start();
		$("input[type=text]").attr("autocomplete", "off");

	},
	begin: function(){
		//only assign new application start time, if applicant not found
		if(!Agency.Applicant.data){
			$.ajax({
				url: "ajax-timestamp.php",
				success: function(html){
					$("#input-application_start").val(html);
				}

			});
		}

	},
	start: function(){
		this.current = 1;
		this.view();
		if(Agency.Applicant.data != false){
			this.next();
		}
	},
	equip: function(){
		//equip accordion
		if(this.htmlContainer.find(".accordion").length > 0)
			this.htmlContainer.find(".accordion").accordion();

		//equip datepickers
		if(this.htmlContainer.find(".datepicker").length > 0)
			this.htmlContainer.find(".datepicker").datepicker({changeMonth: true, changeYear: true, dateFormat: "yy-mm-dd"});
		if(this.htmlContainer.find(".datepicker-birth").length > 0)
			this.htmlContainer.find(".datepicker-birth").datepicker({changeMonth: true, changeYear: true, dateFormat: "yy-mm-dd",yearRange: "-65:-16"});

		if(this.htmlContainer.find(".phonemask").length > 0)
			this.htmlContainer.find(".phonemask").mask("(999) 999-9999? x9999");
		if(this.htmlContainer.find(".postalmask").length > 0)
			this.htmlContainer.find(".postalmask").mask("a9a-9a9");
		if(this.htmlContainer.find(".sinmask").length > 0)
			this.htmlContainer.find(".sinmask").mask("999 999 999");

		if($("ul.skills .parent").length > 0){
			$("ul.skills .parent ul li input").click(function(){
				var hid = $(this).parents(".parent").eq(0).find("input[type=hidden]:first");
				//also check parent hidden element category
				if($(this).prop("checked")){
					hid.val(hid.data('id'));
				//if we're de-selecting, check if ALL children are de-selected, then de-select the parent
				}else{
					console.log('check if all children are de-selected, if so, deselect parent');
					var childrenSelected = 0;
					for(var i = 0; i < $(this).parent().siblings().length; i++){
						if($(this).parent().siblings().eq(i).find('input:first').prop("checked"))
							childrenSelected++;
					}
					if(!childrenSelected)
						hid.val('');
					//if there are still some children selected, leave the parent alone
				}

			});
		}
		//equip paytype switcher for work experience page
		/*
		$(".paytype input[type=radio]").click(function(){
			var v = $(this).val();
			var hourly = $(this).parent().parent().find(".hourly");
			var salary = $(this).parent().parent().find(".salary");
			if(v == "Hourly"){
				hourly.show();
				salary.hide();
			}else if(v == "Salary"){
				hourly.hide();
				salary.show();
			}
		});
		*/
		
		this.getFields();
	},
	getFields: function(){
		this.fields = this.htmlContainer.find('[name]');

	},
	next: function(){
		//if current page invalid , don't show next
		if(!Agency.Validator.run())
			return;
		//increment if within bounds
		if(this.current < this.total)
			this.current += 1;
		//view page
		this.view();
	},
	back: function(){
		if(this.current > 1)
			this.current -= 1;
		this.view();
	},
	view: function(){
		if(this.current == 2)
			this.begin();
		//set container
		this.htmlContainer = $("#pages > div").eq(this.current - 1);

		if(!this.open){
			$("#pages > div").hide();
			//show current page
			this.htmlContainer.show();
		}

		//equip all jquery callbacks and plugins
		this.equip();

		//set progress bar
		this.updateProgressBar();


		//update page control
		this.updateControls();


		if(this.open)
			this.stateOpen($('body'));
		//place scroller at top of page upon changing pages
		$(window).scrollTop(0);


		if(this.current == this.total){
			this.finish();
		}
	},
	updateControls: function(){
		//if not editing applicant
		if(!Agency.Applicant.data){
			if(this.current > 1 && this.current != this.total){
				$("#page-control").show();
			}else{
				$("#page-control").hide();
			}
			if(this.current == this.total - 1){
				$(".button-continue").html("finish");
			}else{
				$(".button-continue").html("continue");
			}
		}else{
			if(this.current > 1 && this.current != this.total){
				$("#page-control").show();
			}else{
				$("#page-control").hide();
			}
			//if on the page before terms, AND we're editing an Applicant
			//let them accept or reject
			//$("#button-accept").show();
			if(this.current == this.total - 1){
				$("#button-advance").show();
				$("#button-continue").hide();
				$("#button-reject").show();
			}else{
				$("#button-continue").show();
				$(".button-continue").html("continue");
				$("#button-advance").hide();
				$("#button-reject").hide();
			}
		}
	},
	updateProgressBar: function(){
		var percent = this.getProgress();
		//if found progress htmlContainer
		if(this.htmlContainer.find(".progress").length > 0){
			//set progress bar to page percentage
			this.htmlContainer.find(".progress").progressbar({
				value: percent
			});
		}
	},
	getProgress: function(){
		return Math.ceil( (this.current / this.total) * 100);
	},
	finish: function(){
		$("form#app").submit();
	},
	stateOpen: function(ele){
		ele.find("#pages > div").attr("style", "display: block");
		$("#page-control").attr("style", "display: none");
		ele.find(".ui-accordion-content").attr("style", "display: block");
		ele.find(".success").removeClass('success');
		ele.find(".error").removeClass('error');
		ele.find(".progress").hide();
		ele.find(".page-header").hide();
		ele.find("#start div.l.half").eq(1).hide();
		//remove empty employers
		ele.find('.accordion > div').each(function(){
			var c = $(this).find('input[type=text]').eq(0).val();
			if(c == ''){
				$(this).prev().remove();
				$(this).remove();
			}
		});
	},
	loading_start: function(){
		//hide all children pages
		$("#pages > div").hide();
		$("#page-control").hide();
		$("#loading").html("Loading Applicant Data...").show();
	},
	loading_finish: function(){
		//hide all children pages
		$("#loading").hide();
	},

}
