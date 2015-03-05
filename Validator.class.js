/* array of page objects, process function get's called upon next page navigation
 * will proceed to next page if return true, or display errors and return false
 *
 */
Agency.Validator = {

	pageObject: {},

	run: function(){
		return Agency.pages[Agency.Page.current - 1].validate();
	},
	
	/* errors is an array of Error Objects */
	errors: {
		REQUIRED: [],
		FORMATTING: []
	},

	resetErrors: function(){
		this.errors['REQUIRED'] = [];
		this.errors['FORMATTING'] = [];
		this.errors['EQUALITY'] = [];
	},

	isFormatted: {
		EMAIL: function(val){
			if(val == '' || val == undefined)
				return true;
			var reg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
			return reg.test(val);
		}
	},

	requiredFields: {},



	Error: function(field,message){
		this.field = field;
		this.message = message;
	},

	Format: function(type,field){
		this.type = type;
		this.field = field;
	},
	filterRequired: function(){
		//start by using ALL page fields, then exclude NON-required
		return Agency.Page.fields.filter(function(index){
			//keep in collection if NOT found in exclude
			return $.inArray($(this).attr('name'), Agency.Validator.pageObject.exclude) === -1;
		});

	},
	required: function(){
		//reset errors
		this.resetErrors();
		//get required fields - filter out excludes
		this.requiredFields = this.filterRequired(this.pageObject.exclude);
		//remove any existing error class
		//this.requiredFields.removeClass('error');
		var blankRadios = [];
		//enforce required
		this.requiredFields.each(function(index){
			if($(this).val() == "" && $(this).attr('type') != 'radio'){
				var e = new Agency.Validator.Error($(this).attr('name'), $(this).attr('name') + " is a required field.");
				Agency.Validator.errors['REQUIRED'].push(e);
			}else if($(this).attr('type') == 'radio'){
				//set to zero blank radios
				if(blankRadios[$(this).attr('name')] == undefined)
					blankRadios[$(this).attr('name')] = 0;
				//increment blank radios if 
				if(!$(this).prop('checked')){
					blankRadios[$(this).attr('name')]++;
					console.log('found blank Radio ');
				}
			}else{
				$(this).removeClass('error').addClass('success');
			}

		});

		//process blank radios
		if(Object.keys(blankRadios).length > 0){
			for(var key in blankRadios){
				//if more than one radio is blank, of the same field
				if(blankRadios[key] > 1){
					var e = new Agency.Validator.Error(key, "Please select a value for the " + key + " Radio Option");
					Agency.Validator.errors['REQUIRED'].push(e);
				}
			}
		}
	},
	formatter: function(){
		//enforce required
		for(var i = 0; i < this.pageObject.formats.length; i++){
			//get field val
			var val = $('[name='+this.pageObject.formats[i].field+']').val();
			//get function by format type
			var checkFormat = this.isFormatted[this.pageObject.formats[i].type];
			//if the specified format has no validator fuction - continue
			if(checkFormat == undefined || typeof checkFormat != "function")
				continue;
			//proceed to check formatting
			if(!checkFormat(val)){
				var e = new this.Error(this.pageObject.formats[i].field, this.pageObject.formats[i].field + " is an invalid " + this.pageObject.formats[i].type + " format.");
				this.errors['FORMATTING'].push(e);
			}
		}
	},
	enforce: function(pageObject){
		this.pageObject = pageObject;
		//if exclude is null - it means NONE are required
		if(this.pageObject.exclude == null)
			return true;

		//enforce required
		this.required(this.pageObject.exclude);
		//check error length
		if(!this.errors['REQUIRED'].length){
			//no required errors
			//let's check formatting
			this.formatter(this.pageObject.formats);
			//if all good, return valid this.pageObject
			if(!this.errors['FORMATTING'].length){
				//finally, if all is good, verify equality if necessary
				this.equality();
				//output equality errors if found
				if(!this.errors['EQUALITY'].length){
					return true;
				}else{
					this.outputErrors('EQUALITY');
				}
			}else{
				this.outputErrors('FORMATTING');
			}

		}else{
			this.outputErrors('REQUIRED');
		}
		//finally - return false if not all passed validation
		return false;
	},
	equality: function(){
		if(this.pageObject.equality != undefined && this.pageObject.equality){
			for(var i = 0; i < Agency.Page.fields.length; i++){
				var err = 0;

				var x = i++;
				if($(Agency.Page.fields[x]).val().toLowerCase() != $(Agency.Page.fields[i]).val().toLowerCase() && i < Agency.Page.fields.length - 1){
					var e = new this.Error($(Agency.Page.fields[x + 1]).attr('name'), $(Agency.Page.fields[x + 1]).attr('name') + " must be all equal values.");
					$(Agency.Page.fields[x + 1]).removeClass('success').addClass('error');
					$(Agency.Page.fields[x]).removeClass('success').addClass('error');
					this.errors['EQUALITY'].push(e);
					//add to err - multiple values might be dis-similar
					err++;
				}
				//return false if more than 0 are dis-similar
				if(err > 0) return false;
			}
			
		}
	},
	outputErrors: function(key){
			console.log(this.errors[key]);
			//focus first error field
			$("[name=" + this.errors[key][0].field + "]").trigger('focus');
			//loop and set error classes
			for(var i = 0; i < this.errors[key].length; i++){
				var Error = this.errors[key][i];
				console.log(Error);
				$("[name=" + Error.field + "]").removeClass('success').addClass('error');
			}
			if(key == "EQUALITY"){
				var message = "All fields must have the same value. Please correct."; 
			}else{
				var message = "Please correct the required fields below."; 
			}
			if(Agency.Page.current == 6)
				alert(message);

			var h1 = Agency.Page.htmlContainer.find("h1:first");
			h1.next('p').clearQueue().finish();
			h1.after("<p class='message_error'>" + message + "</p>");
			h1.next('p').fadeOut(8000, function(){
				this.remove();
			});

	}


}
