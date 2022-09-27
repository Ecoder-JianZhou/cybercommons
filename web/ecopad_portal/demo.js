
$(function () {
  // this is the jQuery abbreviation for the function that is called at the
  // document.ready event and is executed as soon as the document is fully loaded
  //
  user_url = "/api" + "/user.json/";
  console.log(user_url);
  // If we are logged in the following user_url will be available at the server
  // (in the background django will check if the session cockie it sent us earlier
  // which will be integrated by the browser into all our subsequent requests
  // authorizes us to visit this url but the only thing we have to know is that
  // the following ajax request will only succeed if we are logged in.
  ul = document.getElementById("user");
  $.getJSON(user_url, function (data) {
    console.log("success");
    console.log(data.username);
    show_logout(ul);
  }).fail(function () {
    console.log("fail");
    show_login(ul);
  });
});

//const base_url = "/ecopad_portal/index.html";
const base_url = window.location.pathname;
function show_login(ul) {
  ul.innerHTML = `
<li>
  <a id="login" href="/api/api-auth/login/?next=${base_url}">Log in</a>
</li>`;
}

function show_logout(ul) {
  ul.innerHTML = `
  <li id=user class="dropdown">
    <a  href="#" class="dropdown-toggle" data-toggle="dropdown">
      ecopad
      <b class="caret"></b>
    </a>
    <ul class="dropdown-menu">
      <li><a href="/api/api-auth/logout/?next=">Log out</a></li>
    </ul>
  </li>
`;
}


postJSON = function(url, data, callback,fail) {
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
  $.getJSON(user_url, function (data) {
    console.log("success");
    console.log(data.username);
    let amplitude = parseFloat(form.elements["amplitude"].value),
    phase = parseFloat(form.elements["phase"].value),
    url = "http://localhost/api/queue/run/ecopadq.tasks.tasks.test/"
    postJSON(
    	url=url,
    	data={
    	  "queue": "celery",
    	  "args": [amplitude,phase],
    	  "kwargs": {},
    	  "tags": []
    	},
    	callback=function(data,textStatus,jqXHR){
	  		log(textStatus);
        log(`sent json data to ${url}`)
        log(`received the following result url ${data.result_url}`)
        show_result(data.result_url);
	  	},
    	fail=function(){log(`failed to send data to ${url}`)}
    );
    }).fail(function () {
      console.log("not loged id");
      let slink=`/api/api-auth/login/?next=${base_url}`
      window.location = slink
    });

});
