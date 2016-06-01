/** This is a description of the foo function. */
function foo(title, author) {
}


(function(Hiof, undefined) {
  Path.map("#/finn-studie").enter(function() {
    var thisView = new View();
    thisView.scrollToElement('#content');
  }).to(function() {
    semesterStartLoadData();
  });
  Path.map("#/finn-studie/").enter(function() {
    var thisView = new View();
    thisView.scrollToElement('#content');
  }).to(function() {
    semesterStartLoadData();
  });
  Path.map("#/detaljer/:course/:page").enter(function() {
    var thisView = new View();
    thisView.scrollToElement('#content');
  }).to(function() {
    var options = {};
    options.id = this.params.page;
    options.courseId = this.params.course;
    options.template = 'details';
    options.url = 'http://hiof.no/api/v1/page/' + '?id=' + this.params.page + '&server=www2';
    semesterStartLoadData(options);
  });
  Path.map("#/detaljer/:course").enter(function() {
    var thisView = new View();
    thisView.scrollToElement('#content');
  }).to(function() {
    var options = {};
    options.courseId = this.params.course;
    options.template = 'item';
    options.url = 'http://hiof.no/api/v2/semesterstart/list/' + '?type=item&studyprogramcode=' +this.params.course;
    //console.log(options);
    semesterStartLoadData(options);
  });
  initatePathSemesterStart = function() {
    // Load root path if no path is active
    Path.root("#/finn-studie");
  };
  semesterStartAppendData = function(data, settings) {
    //var data = semesterStartLoadData(options);
    data.meta = settings;
    data.meta.type = 'studystart';
    //data.meta.name = data.semesterstart[8].name;
    //debug(data);
    var templateSource, markup;

    if (settings.template === 'details') {
      templateSourceBreadcrumb = Hiof.Templates['semesterstart/breadcrumbs'];
      templateSource = Hiof.Templates['page/show'];
      markup = templateSourceBreadcrumb(data) + templateSource(data);
    } else if (settings.template === 'item') {
      templateSourceBreadcrumb = Hiof.Templates['semesterstart/breadcrumbs'];
      templateSource = Hiof.Templates['semesterstart/single'];
      markup = templateSourceBreadcrumb(data) + templateSource(data);
    } else {
      templateSource = Hiof.Templates['semesterstart/list'];
      markup = templateSource(data);
    }

    $('#semesterstart').html(markup);
    if ($('.footable').length) {
      $('.footable').footable();
    }
    // Check if the user want to save theirs study preference
    //if (settings.template === 'single'){
    //    if (!$.cookie('semesterstart')) {
    //        debug('Semesterstart cookie does not excist');
    //    }
    //}
  };

  semesterStartLoadData = function(options) {
    // If options are not defined
    if (typeof options === 'undefined' || options === null) {
      // Get options from the initializer element
      //console.log("options is undefined");
      options = {};
    }

    // Setup the query
    var settings = $.extend({
      id: null,
      server: 'www2',
      courseId: null,
      template: "list",
      openingday: false,
      url: 'http://hiof.no/api/v2/semesterstart/list/',
      calendar: null,
      type: null,
    }, options);

    //console.log(settings);

    var contentType = "application/x-www-form-urlencoded; charset=utf-8";
    if (window.XDomainRequest) { //for IE8,IE9
      contentType = "text/plain";
    }

    //console.log("Settings: ");
    //console.log(settings);

    $.ajax({
      url: settings.url,
      method: 'GET',
      //async: true,
      dataType: 'json',
      //data: settings,
      contentType: contentType,
      success: function(data) {
        //alert("Data from Server: "+JSON.stringify(data));
        //console.log("Data: ");
        //console.log(data);
        //console.log(thisUrl);
        //return data;
        semesterStartAppendData(data, settings);
        //Hiof.articleDisplayView(data, settings);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log("jqXHR: ");
        console.log(jqXHR);
        console.log("textStatus: ");
        console.log(textStatus);
        console.log("errorThrown: ");
        console.log(errorThrown);
        //alert("You can not send Cross Domain AJAX requests: " + errorThrown);
      }

    });
  };


  semesterStart = function(courseid) {
    var options = {};

    options.template = 'list';
    if (typeof courseid === 'undefined' || courseid === null) {
      options.courseid = '';
    } else {
      options.courseid = courseid;
    }
    semesterStartLoadData(options);

  };





  $(function() {
    if ($('#semesterstart').length) {
      //semesterStart();
      initatePathSemesterStart();
      Path.listen();
    }
    $(document).on('click', '.newstudent-readmore', function(e) {
      e.preventDefault();
      $(this).parent().toggleClass("open");
    });

    $(document).on('click', '#semesterstart a:not(".newstudent-readmore")', function(e) {
      //e.preventDefault();
      var url = $(this).attr('href');
      if (url.substring(0, 2) == "#/") {
        //debug('String starts with #/');
      } else if (url.substring(0, 1) == "#") {
        url = url + "";
        e.preventDefault();
        if ($('.newstudent').length) {
          if (!$('.newstudent').hasClass('open')) {
            $('.newstudent').toggleClass("open");
          }
        }


        setTimeout(function() {
          //scrollToElement(url);
        }, 200);
        //debug('String starts with #');
      }
    });


  });


})(window.Hiof = window.Hiof || {});
