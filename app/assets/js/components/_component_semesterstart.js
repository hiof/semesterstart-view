(function(Hiof, undefined) {


    Path.map("#/finn-studie").enter(function() {
        //Reset checkboxes
        //resetFilter();
        scrollToElement('#content');
    }).to(function() {
        semesterStartLoadData();
    });
    Path.map("#/finn-studie/").enter(function() {
        //Reset checkboxes
        //resetFilter();
        scrollToElement('#content');
    }).to(function() {
        semesterStartLoadData();
    });


    Path.map("#/detaljer/:course/:page").enter(function() {
        //Reset checkboxes
        //resetFilter();
        scrollToElement('#content');
    }).to(function() {
        var options = {};
        options.id = this.params.page;
        options.courseId = this.params.course;
        options.template = 'details';

        if(options.id === '30712'){
            options.openingday = true;
        }else{
            options.url = 'http://hiof.no/api/v1/page/';
        }


        semesterStartLoadData(options);
    });

    Path.map("#/detaljer/:course").enter(function() {
        //Reset checkboxes
        //resetFilter();
        scrollToElement('#content');
    }).to(function() {
        var options = {};
        options.courseId = this.params.course;
        options.template = 'single';
        semesterStartLoadData(options);
    });


    initatePathSemesterStart = function() {
        // Load root path if no path is active
        Path.root("#/finn-studie");
    };
    semesterStartAppendData = function(data, settings) {
        //var data = semesterStartLoadData(options);
        //debug(data);
        data.meta = settings;
        data.meta.type = 'studystart';

        var templateSource;

        if (settings.template === 'details') {
            templateSource = Hiof.Templates['page/show'];
        } else if (settings.template === 'single') {
            templateSource = Hiof.Templates['study/semester-start-single'];
        } else {
            templateSource = Hiof.Templates['study/semester-start'];
        }

        var markup = templateSource(data);
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
            url: 'http://hiof.no/api/v1/semesterstart/',
            calendar: null
        }, options);

        //debug(settings);

        var contentType = "application/x-www-form-urlencoded; charset=utf-8";
        if (window.XDomainRequest) { //for IE8,IE9
            contentType = "text/plain";
        }

        //debug("Settings: ");
        //debug(settings);
        $.ajax({
            url: settings.url,
            method: 'GET',
            async: true,
            dataType: 'json',
            data: settings,
            contentType: contentType,
            success: function(data) {
                //alert("Data from Server: "+JSON.stringify(data));
                //debug("Data: ");
                //debug(data);
                //return data;
                semesterStartAppendData(data, settings);
                //Hiof.articleDisplayView(data, settings);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                //debug("jqXHR: ");
                //debug(jqXHR);
                //debug("textStatus: ");
                //debug(textStatus);
                //debug("errorThrown: ");
                //debug(errorThrown);
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
        $(document).on('click', '.openingday-readmore', function(e){
            e.preventDefault();
            $(this).parent().toggleClass("open");
        });
    });


})(window.Hiof = window.Hiof || {});
