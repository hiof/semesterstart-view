class SemesterstartView {

  /**
  * Setup constants
  */
  constructor() {
    this.view = new View();
    this.breadcrumbTemplate = Hiof.Templates['semesterstart/breadcrumbs'];
    this.pageShowTemplate = Hiof.Templates['page/show'];
    this.semesterstartSingle = Hiof.Templates['semesterstart/single'];
    this.semesterstartList = Hiof.Templates['semesterstart/list'];
    this.defaults = {
      // These are the defaults.
      id: null,
      server: 'www2',
      courseId: null,
      template: "list",
      openingday: false,
      url: '//www.hiof.no/api/v2/semesterstart/list/',
      calendar: null,
      type: null,
    };
  }

  /**
   * Gets the data with view.getData and render it to the page
   * @param {Object[]} options - Object contains options from the route
   * @return {View} - View rendered within #semesterstart container
  */
  renderSemesterstart(options = {}){
    let settings = Object.assign(
      {},
      this.defaults,
      options
    );
    let that = this;
    this.view.getData(settings, that).success(function(data){
      // Attach settings as meta object to data
      data.meta = settings;
      data.meta.type = 'studystart';

      // Setup the template-combo
      if (settings.template === 'details') {
        markup = that.breadcrumbTemplate(data) + that.pageShowTemplate(data);
      } else if (settings.template === 'item') {
        markup = that.breadcrumbTemplate(data) + that.semesterstartSingle(data);
      } else {
        markup = that.semesterstartList(data);
      }

      // Insert the data-prop template to the page
      $('#semesterstart').html(markup);

      //Activate footable if there is a table on the page
      if ($('.footable').length) {
        $('.footable').footable();
      }

    });
  };
}



(function(Hiof, undefined) {
  let thisSemesterstartView = new SemesterstartView();

  /** Routes */
  Path.map("#/finn-studie").enter(function() {
    var thisView = new View();
    thisView.scrollToElement('#content');
  }).to(function() {
    thisSemesterstartView.renderSemesterstart();
    //semesterStartLoadData();
  });
  Path.map("#/finn-studie/").enter(function() {
    var thisView = new View();
    thisView.scrollToElement('#content');
  }).to(function() {
    thisSemesterstartView.renderSemesterstart();
    //semesterStartLoadData();
  });
  Path.map("#/detaljer/:course/:page").enter(function() {
    var thisView = new View();
    thisView.scrollToElement('#content');
  }).to(function() {
    var options = {};
    options.id = this.params.page;
    options.courseId = this.params.course;
    options.template = 'details';
    options.url = '//www.hiof.no/api/v1/page/' + '?id=' + this.params.page + '&server=www2';
    thisSemesterstartView.renderSemesterstart(options);
  });
  Path.map("#/detaljer/:course").enter(function() {
    var thisView = new View();
    thisView.scrollToElement('#content');
  }).to(function() {
    var options = {};
    options.courseId = this.params.course;
    options.template = 'item';
    options.type = 'item';
    options.url = '//www.hiof.no/api/v2/semesterstart/list/' + '?type=item&studyprogramcode=' +this.params.course;
    console.log(options);
    thisSemesterstartView.renderSemesterstart(options);
  });
  initatePathSemesterStart = function() {
    // Load root path if no path is active
    Path.root("#/finn-studie");
  };






  $(function() {
    if ($('#semesterstart').length) {
      //semesterStart();
      initatePathSemesterStart();
      Path.listen();
    }

    $(document).on('click', '#semesterstart a:not(".newstudent-readmore")', function(e) {
      //e.preventDefault();
      var url = $(this).attr('href');
      if (url.substring(0, 2) == "#/") {
        //e.preventDefault();
        //console.log('String starts with #/');
      } else if (url.substring(0, 1) == "#") {
        //e.preventDefault();
        //console.log('String starts with #');

        url = url + "";

        e.preventDefault();
        //f ($('.newstudent').length) {
        //  if (!$('.newstudent').hasClass('open')) {
        //    $('.newstudent').toggleClass("open");
        //  }
        //


        setTimeout(function() {
          var thisView = new View();
          thisView.scrollToElement(url);
        }, 100);
        //debug('String starts with #');
      }
    });


  });


})(window.Hiof = window.Hiof || {});
