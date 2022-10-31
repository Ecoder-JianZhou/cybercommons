
// $(function () {
//   // this is the jQuery abbreviation for the function that is called at the
//   // document.ready event and is executed as soon as the document is fully loaded
//   //
//   user_url = "/api" + "/user.json/";
//   console.log(user_url);
//   // If we are logged in the following user_url will be available at the server
//   // (in the background django will check if the session cockie it sent us earlier
//   // which will be integrated by the browser into all our subsequent requests
//   // authorizes us to visit this url but the only thing we have to know is that
//   // the following ajax request will only succeed if we are logged in.
//   ul = document.getElementById("user");
//   $.getJSON(user_url, function (data) {
//     console.log("success");
//     console.log(data.username);
//     show_logout(ul);
//   }).fail(function () {
//     console.log("fail");
//     show_login(ul);
//   });
// });

// //const base_url = "/ecopad_portal/index.html";
// const base_url = window.location.pathname;
// function show_login(ul) {
//   ul.innerHTML = `
// <li>
//   <a id="login" href="/api/api-auth/login/?next=${base_url}">Log in</a>
// </li>`;
// }

// function show_logout(ul) {
//   ul.innerHTML = `
//   <li id=user class="dropdown">
//     <a  href="#" class="dropdown-toggle" data-toggle="dropdown">
//       ecopad
//       <b class="caret"></b>
//     </a>
//     <ul class="dropdown-menu">
//       <li><a href="/api/api-auth/logout/?next=">Log out</a></li>
//     </ul>
//   </li>
// `;
// }

// Add by Jian to set the lastest forecast time:
// lastTime = getTime();
// $("#forecast_time").text(lastTime); // Jian

postJSON1 = function(url, data, callback,fail) {
	//https://api.jquery.com/jquery.ajax/
        return jQuery.ajax({
            'type': 'POST',
            'url': url,
            'contentType': 'application/json',
            'data': JSON.stringify(data),
            'dataType': 'json',
            'success': callback,
            'error':fail,
            'beforeSend':function(xhr, settings){
                xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
            }
        });
}
    
function getCookie(name) {
  //about cookies in django
  //https://django-book.readthedocs.io/en/latest/chapter14.html
  var cookieValue = null;

  if (document.cookie && document.cookie != '') {
    var cookies = document.cookie.split(';');

    for (var i = 0; i < cookies.length; i++) {
      var cookie = jQuery.trim(cookies[i]);

      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) == (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }

  return cookieValue;
};

function sleep(ms){
  return new Promise(resolve => setTimeout(resolve,ms))
};

function show_result(result_url){
  // This function is seperate since
  // is calls itself  recursively until
  // the the asyncronous calls checks of the result status
  // finally succeed.
  // The function uses two typical JAVASCRIPT programming constructs
  // 1.) promise chaning https://javascript.info/promise-basics
  // 2.) callbacks https://javascript.info/callbacks
  // which are surprising for programmers not familiar with asyncronous programming.
  var ms =5000
  jQuery.getJSON(result_url).then(
    function(anwser){
      let status=anwser.result.status;
      console.log(status);
      if( status === 'PENDING'){
        log(`I will call me again after ${ms/1000} seconds.`)
        log(result_url)
        log(status)
        sleep(ms).then(
          function(){show_result(result_url);}
        );
      } else if (status === 'SUCCESS'){
          let file_path = anwser.result.result;
          // in this case the result is a path 
          // to the result file (within the root of the webserser)
          log(status)
          log(file_path)

          // use Plotly.d3 library to read the csv file 
          Plotly.d3.csv(
            file_path,
            function(allRows){
              // prepare the rusult
              console.log(allRows);
              var x = [], y = [];

              for (var i=0; i<allRows.length; i++) {
                row = allRows[i];
                x.push( row['ts'] );
                y.push( row['xs'] );
              }
              log("read x and y arrays, going to plot");
              //log(`x=${x} y=${y}`);
              var trace1 = {
                x: x,
                y: y,
                type: 'scatter'
              };
              
              var data = [trace1];
              
              Plotly.newPlot('plotDiv', data);
            } );
      };
    }
  )
  
}                   

function log(html){
  let loglist = document.getElementById('log_o')
  loglist.innerHTML+=`${html} </li>`
}

const p=document.getElementById("status");
const csrftoken = getCookie('csrftoken')
const form = document.querySelector("#signup");
form.addEventListener("submit", function (event) {
	// stop form submission since we want to make a json post instead 
	event.preventDefault();
	// @Nico
  // additional validation code for the form would go here and look like ...  
  // let amplitudeValid  = validate_amplitude(form.elements["amplitude"] ); 
  // let phaseValid = validate_phi(form.elements["phase"] ); 
  // if (amplitudeValid && phaseValid) {..
  // where  validate_phi and validate_amplitude would not only return true or false 
  // but also trigger CSS class changes to show for instance problematic fields in red
  // and so on.  But this code would be highly dependent on the css-framework used
  // and has changed considerably in modern bootstrap5 and even HTML
  // which now provides much of what used to need javascript code earlier see e.g.:
  // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#the-constraint-validation-api
  // So some of the old bootstrap3 code of the original ecopad has become
  // obsolete which is the reason why I wanted to prevent it from being copied and pasted from this prototype
  // but rather let you choose more modern tools if necessarry.  
  //
  // check if we are logged in and 
  user_url = "/api" + "/user.json/";
  console.log(user_url);
  // If we are logged in the following user_url will be available at the server
  // (in the background django will check if the session cockie it sent us earlier
  // which will be integrated by the browser into all our subsequent requests
  // authorizes us to visit this url but the only thing we have to know is that
  // the following ajax request will only succeed if we are logged in.
  ul = document.getElementById("user");
  // add by Jian: get value from html ---
    // var index = obj.selectedIndex; 
  // var text = obj.options[index].text; 
  var obj_modelName = document.getElementById("model_name");
  var model_name = obj_modelName.options[obj_modelName.selectedIndex].value;
  var obj_siteName  = document.getElementById("site_name");
  var site_name = obj_siteName.options[obj_siteName.selectedIndex].value;
  
  var obj_func  = document.getElementById("function");
  var func_name = obj_func.options[obj_func.selectedIndex].value;
  var url = "http://localhost/api/queue/run/ecopadq.tasks.tasks.test_run_"+func_name+"/"
  if (func_name == "auto_forecast"){
    url = "http://localhost/api/queue/run/ecopadq.tasks.tasks.run_auto_forecast"
  }
  console.log("Running model: ", model_name)
  console.log("Running site: ", site_name)
  console.log("Running function: ", url)
  // end of Jian

  $.getJSON(user_url, function (data) {
    console.log("success");
    console.log(data.username);
    // let amplitude = parseFloat(form.elements["amplitude"].value), // changed by Jian 
    // phase = parseFloat(form.elements["phase"].value),  // changed by Jian

    //url = "http://localhost/api/queue/run/ecopadq.tasks.tasks.run_simulation/"
    console.log(url)
    postJSON1(
    	url=url,
    	data={
    	  "queue": "celery",
    	  // "args": [amplitude,phase],
        "args":[model_name,site_name],  // changed by Jian  to test
    	  "kwargs": {},
    	  "tags": []
    	},
    	callback=function(data,textStatus,jqXHR){
	  		log(textStatus);
        log(`sent json data to ${url}`)
        log(`received the following result url ${data.result_url}`)
        if (func_name == "simulation" || func_name == "data_assimilation"){
          show_result(data.result_url);
        } else {
          log(`Your running function is: ${func_name}. Successful!!!`)
        }
        
	  	},
    	fail=function(){log(`failed to send data to ${url}`)}
    );
    }).fail(function () {
      console.log("not loged id");
      let slink=`/api/api-auth/login/?next=${base_url}`
      window.location = slink
    });

});



// add by Jian to plot the results of forecasting
function showForecastResults(){
  var exp_idx  = document.getElementById("forecast_select").selectedIndex;
  var var_idx  = document.getElementById("forecast_var").selectedIndex;
  // if     
  var val      = document.getElementById("forecast_select").options[exp_idx].value;
  var val_text = document.getElementById("forecast_select").options[exp_idx].text;
  // if (exp_idx == 0 || var_idx ==0){
  //   console.log("both variable and experiment need be choosed!")
  // }else{
  // console.log(index)
  // console.log(val)
  var fileForecast = "/data/show_forecast_results/lastest_forecast_results_";
  switch(val){
    case "EM1_FORECAST_380_0":
      console.log(val);
      fileForecast = fileForecast+"380ppm_0degree.txt";
      break;
    case "EM1_FORECAST_380_2.25":
      console.log(val);
      fileForecast = fileForecast+"380ppm_2_25degree.txt";
      break;
    case "EM1_FORECAST_380_4.5":
      console.log(val);
      fileForecast = fileForecast+"380ppm_4_5degree.txt";
      break;
    case "EM1_FORECAST_380_6.75":
      console.log(val);
      fileForecast = fileForecast+"380ppm_6_75degree.txt";
      break;
    case "EM1_FORECAST_380_9":
      console.log(val);
      fileForecast = fileForecast+"380ppm_9degree.txt";
      break;
    case "EM1_FORECAST_900_0":
      console.log(val);
      fileForecast = fileForecast+"900ppm_0degree.txt";
      break;
    case "EM1_FORECAST_900_2.25":
      console.log(val);
      fileForecast = fileForecast+"900ppm_2_25degree.txt";
      break;
    case "EM1_FORECAST_900_4.5":
      console.log(val);
      fileForecast = fileForecast+"900ppm_4_5degree.txt";
      break;
    case "EM1_FORECAST_900_6.75":
      console.log(val);
      fileForecast = fileForecast+"900ppm_6_75degree.txt";
      break;
    case "EM1_FORECAST_900_9":
      console.log(val);
      fileForecast = fileForecast+"900ppm_9degree.txt";
      break;
  }

  var obj_var = document.getElementById("forecast_var");
  // var var_name = obj_var.options[obj_var.selectedIndex].value;
  var var_name = obj_var.options[obj_var.selectedIndex].text;

  console.log(fileForecast)
  // use Plotly.d3 library to read the csv file 
  Plotly.d3.csv(
    fileForecast,
    function(allRows){
      // prepare the rusult
      console.log(allRows);
      var x = [], y = [];

      for (var i=0; i<allRows.length; i++) {
        row = allRows[i];
        x.push( row['sdoy'] );
        y.push( row[var_name] );
      }
      // log("read x and y arrays, going to plot");
      //log(`x=${x} y=${y}`);
      var trace1 = {
        x: x,
        y: y,
        type: 'scatter'
      };
      
      var data = [trace1];
      var layout = {
        showlegend: false,
        title:val_text,
        yaxis: {title: var_name},
        xaxis: {title: "Time"},
      }
      Plotly.newPlot('plotDiv1', data, layout);
    } );
  // }
}

// function getTime(){
//   updataTimeFile = "/data/show_forecast_results/log_forecast_time.txt"
//   var lastestTime;
//   var reader = new FileReader();
//   reader.readAsText(updataTimeFile, "UTF-8");
//   reader.onload = function (e) {
//       var content = e.target.result;
//       console.log(content);
//       var arr = content.split('\n');
//       console.log(arr[arr.length-2])
//       lastestTime = arr[arr.length-1]
//   }
//   return lastestTime;
// }

// function getTime(){
//   updataTimeFile = "/data/show_forecast_results/log_forecast_time.txt"
//   var lastestTime;
//   var fso=new ActiveXObject(Scripting.FileSystemObject);
//   var f = fso.opentextfile(updataTimeFile,1,false);
//   console.log(f.ReadAll())
// }