Agency = {

	release: '2014-01-21',
	company_id: null,
	Applicant: {
		data: false,
		accept: function(){
			$.ajax({
				url: "/ajax-agency-application-process.php?status=Accepted&application=" + Agency.Applicant.data.id,
				success: function(html){

				}
			});
			return false;
		},
		reject: function(){
			$.ajax({
				url: "/ajax-agency-application-process.php?status=Rejected&application=" + Agency.Applicant.data.id,
				success: function(html){
					if(html == "Success"){
						window.location.href="/agency_application.php";
					}else{
						alert("An error occurred during Applicant rejection. Please try again.");
						window.location.href="index.php?id=" + Agency.Applicant.data.id;
					}
				}
			});
			return false;
		},
		advance: function(){
			$snapshot = $("body").clone();
			Agency.Page.stateOpen($snapshot);
			$snapshot.find("#page-control").remove();
			$.ajax({
				async: false,
				url: "ajax-phase.php?action=advance",
				type: "POST",
				data: {id: Agency.Applicant.data.id, css: "themes/" + Agency.company_id + "/style/stylesheets/snapshot.css", snapshot: $snapshot.html()},
				success: function(html){
					$("#phase2").attr('value', 1);
					//window.location.href = "index.php?id="+Agency.Applicant.data.id;
					Agency.Page.finish();
				}
			});
			return false;
		}
	},
	author: 'NetHire Inc',
	version: '1.0',
	Page: {},
	Validator: {},
	loadApplicant: function(id){
		if(id == undefined || id == '' || id == null || id == 0)
			return;


		this.Page.loading_start();
		$.ajax({
			async: false,
			url: "ajax-applicant.php?id=" + id,
			dataType: "json",
			success: function(json){
				if(!json)
					return false;

				//if they're in phase2, then redirect to backend
				if(json.phase2 != null && json.phase2 != '0000-00-00 00:00:00' && !open)
					window.location.href = "/agency_application.php";


				Agency.Applicant.data = json;
				//must set the form id, so it will update upon save
				$("#id").attr('value', json.id);
				$("[name=source]").find('option[value="' + json.hear_about_us + '"]').attr('selected', 'selected');


				$("[name=salutation]").find('option[value="' + json.salutation + '"]').attr('selected', 'selected');


				$("[name=firstname]").attr('value', json.first_name);
				$("[name=lastname]").attr('value', json.last_name);
				$("[name=email1]").attr('value', json.email_address1);
				$("[name=email2]").attr('value', json.email_address2);
				$("[name=birth_date]").attr('value', json.custom25);
				$("[name=work_permit_expiry]").attr('value', json.custom26);
				$("[name=forklift_permit_expiry]").attr('value', json.custom27);
				$("[name=welding_permit_expiry]").attr('value', json.custom28);
				$("[name=sin]").val(json.custom29);
				$("[name=sin]").attr('value', json.custom29);
				$("[name=address_streetnumber]").attr('value', json.address_number);
				$("[name=address_street]").attr('value', json.address_street);
				$("[name=address_apt]").attr('value', json.address_unit);
				$("[name=city]").attr('value', json.address_city);



				$("[name=country]").find('option[value="' + json.address_country + '"]').attr('selected', 'selected');


				$("[name=province]").find('option[value="' + json.address_province + '"]').attr('selected', 'selected');



				$("[name=postal]").val(json.address_postal_code);
				$("[name=phone1]").val(json.phone_number1);

				$("[name=postal]").attr('value', json.address_postal_code);
				$("[name=phone1]").attr('value', json.phone_number1);

				$("[name=phonetype1]").find('option[value="' + json.phone_type1 + '"]').attr('selected', 'selected');



				$("[name=phone2]").val(json.phone_number2);
				$("[name=phone2]").attr('value', json.phone_number2);



				$("[name=phonetype2]").find('option[value="' + json.phone_type2 + '"]').attr('selected', 'selected');



				$("[name=phone3]").val(json.phone_number3);
				$("[name=phone3]").attr('value', json.phone_number3);



				$("[name=phonetype3]").find('option[value="' + json.phone_type3 + '"]').attr('selected', 'selected');
				//jobs
				if(json.exp_type1 == "Full-time")
					$("#input-job0_type_fulltime").attr("checked", "checked");
				if(json.exp_type1 == "Part-time")
					$("#input-job0_type_parttime").attr("checked", "checked");
				if(json.exp_type1 == "Agency")
					$("#input-job0_type_agency").attr("checked", "checked");


				if(json.exp_type2 == "Full-time")
					$("#input-job1_type_fulltime").attr("checked", "checked");
				if(json.exp_type2 == "Part-time")
					$("#input-job1_type_parttime").attr("checked", "checked");
				if(json.exp_type2 == "Agency")
					$("#input-job1_type_agency").attr("checked", "checked");


				if(json.exp_type3 == "Full-time")
					$("#input-job2_type_fulltime").attr("checked", "checked");
				if(json.exp_type3 == "Part-time")
					$("#input-job2_type_parttime").attr("checked", "checked");
				if(json.exp_type3 == "Agency")
					$("#input-job2_type_agency").attr("checked", "checked");







				$("#input-job0_company").attr('value', json.exp_company1);
				$("#input-job1_company").attr('value', json.exp_company2);
				$("#input-job2_company").attr('value', json.exp_company3);
				$("#input-job0_title").attr('value', json.exp_title1);
				$("#input-job1_title").attr('value', json.exp_title2);
				$("#input-job2_title").attr('value', json.exp_title3);
				$("#input-job0_location").attr('value', json.exp_location1);
				$("#input-job1_location").attr('value', json.exp_location2);
				$("#input-job2_location").attr('value', json.exp_location3);

				job1_date_from = [];
				job2_date_from = [];
				job3_date_from = [];
				job1_date_to = [];
				job2_date_to = [];
				job3_date_to = [];

				if(json.exp_time_from1 != null)
					job1_date_from = json.exp_time_from1.split('-');
				if(json.exp_time_from2 != null)
					job2_date_from = json.exp_time_from2.split('-');
				if(json.exp_time_from3 != null)
					job3_date_from = json.exp_time_from3.split('-');



				if(json.exp_time_to1 != null)
					job1_date_to = json.exp_time_to1.split('-');
				if(json.exp_time_to2 != null)
					job2_date_to = json.exp_time_to2.split('-');
				if(json.exp_time_to3 != null)
					job3_date_to = json.exp_time_to3.split('-');


				if(job1_date_from.length > 0)
					$("#input-job0_month_start").find('option[value="' + job1_date_from[1] + '"]').attr('selected', 'selected');
				if(job2_date_from.length > 0)
					$("#input-job1_month_start").find('option[value="' + job2_date_from[1] + '"]').attr('selected', 'selected');
				if(job3_date_from.length > 0)
					$("#input-job2_month_start").find('option[value="' + job3_date_from[1] + '"]').attr('selected', 'selected');
				if(job1_date_to.length > 0)
					$("#input-job0_month_end").find('option[value="' + job1_date_to[1] + '"]').attr('selected', 'selected');
				if(job2_date_to.length > 0)
					$("#input-job1_month_end").find('option[value="' + job2_date_to[1] + '"]').attr('selected', 'selected');
				if(job3_date_to.length > 0)
					$("#input-job2_month_end").find('option[value="' + job3_date_to[1] + '"]').attr('selected', 'selected');
				if(job1_date_from.length > 0)
					$("#input-job0_year_start").find('option[value="' + job1_date_from[0] + '"]').attr('selected', 'selected');
				if(job2_date_from.length > 0)
					$("#input-job1_year_start").find('option[value="' + job2_date_from[0] + '"]').attr('selected', 'selected');
				if(job3_date_from.length > 0)
					$("#input-job2_year_start").find('option[value="' + job3_date_from[0] + '"]').attr('selected', 'selected');
				if(job1_date_to.length > 0)
					$("#input-job0_year_end").find('option[value="' + job1_date_to[0] + '"]').attr('selected', 'selected');
				if(job2_date_to.length > 0)
					$("#input-job1_year_end").find('option[value="' + job2_date_to[0] + '"]').attr('selected', 'selected');
				if(job3_date_to.length > 0)
					$("#input-job2_year_end").find('option[value="' + job3_date_to[0] + '"]').attr('selected', 'selected');



				$("#input-job0_supervisor").attr('value', json.exp_supervisor1);
				$("#input-job1_supervisor").attr('value', json.exp_supervisor2);
				$("#input-job2_supervisor").attr('value', json.exp_supervisor3);
				$("#input-job0_phone").attr('value', json.exp_phone1);
				$("#input-job1_phone").attr('value', json.exp_phone2);
				$("#input-job2_phone").attr('value', json.exp_phone3);
				$("#input-job0_reason").text(json.exp_reason1);
				$("#input-job1_reason").text(json.exp_reason2);
				$("#input-job2_reason").text(json.exp_reason3);
				$("#input-job0_salary_from").attr('value', json.exp_salary_from1);
				$("#input-job1_salary_from").attr('value', json.exp_salary_from2);
				$("#input-job2_salary_from").attr('value', json.exp_salary_from3);
				$("#input-job0_salary_to").attr('value', json.exp_salary_to1);
				$("#input-job1_salary_to").attr('value', json.exp_salary_to2);
				$("#input-job2_salary_to").attr('value', json.exp_salary_to3);



				if(json.exp_salary_type1 == "Hourly")
					$("#input-job0_salary_type_hourly").attr('checked', "checked");
				else
					$("#input-job0_salary_type_salary").attr('checked', "checked");
				if(json.exp_salary_type2 == "Hourly")
					$("#input-job1_salary_type_hourly").attr('checked', "checked");
				else
					$("#input-job1_salary_type_salary").attr('checked', "checked");
				if(json.exp_salary_type3 == "Hourly")
					$("#input-job2_salary_type_hourly").attr('checked', "checked");
				else
					$("#input-job2_salary_type_salary").attr('checked', "checked");
					

				if(json.convicted){
					$("#input-convicted_1").attr('checked', "checked");
				}else{
					$("#input-convicted_0").attr('checked', "checked");
				}
				if(json.safety_boots){
					$("#input-safety_boots_1").attr('checked', "checked");
				}else{
					$("#input-safety_boots_0").attr('checked', "checked");
				}

				$("#input-transportation").find('option[value="' + json.transportation + '"]').attr('selected', 'selected');
				$("#input-education").find('option[value="' + json.education + '"]').attr('selected', 'selected');


				//check appropriate skills
				skills = json.skills.split(',');
				for(var i = 0; i < skills.length; i++){
					$("#skill" + skills[i]).attr("checked", "checked");
				}

				//input terms initials
				$("#terms input").attr('value', json.initials);
				
			Agency.Page.loading_finish();
			}
		});


	},
	init: function(id, open){
		this.loadApplicant(id);
		//pass open var to Page, if true, will show all pages on one page
		this.Page.init(open);
	},
	pages: [
	{
		title: "Start",
		equality: false,
		validate: function(){
			console.log('Processing Valid conditions for the ' + this.title + ' Page');
			return true;
		}
	},
	{
		title: "Application Details",
		exclude: ['birth_date', 'sin', 'email2', 'phone2', 'phone3', 'phonetype2', 'phonetype3','address_apt'],
		formats: [],
		equality: false,
		validate: function(){
			console.log('Processing Valid conditions for the ' + this.title + ' Page');
			//remove all error/success classes
			Agency.Page.fields.removeClass('error success');
			//create formats
			this.formats.push(new Agency.Validator.Format('EMAIL', 'email1'));
			this.formats.push(new Agency.Validator.Format('EMAIL', 'email2'));
			return Agency.Validator.enforce(this);
		}
	},
	{
		title: "Work Experience",
		exclude: null,
		formats: [],
		equality: false,
		validate: function(){
			console.log('Processing Valid conditions for the ' + this.title + ' Page');
			return Agency.Validator.enforce(this);
		}
	},
	{
		title: "Skills",
		exclude: null,
		formats: [],
		equality: false,
		validate: function(){
			console.log('Processing Valid conditions for the ' + this.title + ' Page');
			console.log('No required fields, moving on');
			return Agency.Validator.enforce(this);
		}
	},
	{
		title: "Details Continued",
		exclude: ['forklift_permit_expiry', 'welding_permit_expiry', 'work_permit_expiry','transportation'],
		formats: [],
		equality: false,
		validate: function(){
			console.log('Processing Valid conditions for the ' + this.title + ' Page');
			//remove all error/success classes
			Agency.Page.fields.removeClass('error success');
			return Agency.Validator.enforce(this);
		}
	},
	{
		title: "Terms",
		exclude: [],
		formats: [],
		equality: true,
		validate: function(){
			console.log('Processing Valid conditions for the ' + this.title + ' Page');
			//remove all error/success classes
			Agency.Page.fields.removeClass('error success');
			return Agency.Validator.enforce(this);
		}
	}
	]

};


