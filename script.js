$(document).ready(function () {
    am4core.useTheme(am4themes_animated);

    var chart = am4core.create("chartdiv", am4charts.XYChart);

    $('.popup-open').click(function () {
        showButtons('add');
        $('#name').val('');
        $('#from_date').val('');
        $('#to_date').val('');
        $('.popup-fade').fadeIn();
        return false;
    });

    $('.popup-close').click(function () {
        $(this).parents('.popup-fade').fadeOut();
        return false;
    });

    $(document).keydown(function (e) {
        if (e.keyCode === 27) {
            e.stopPropagation();
            $('.popup-fade').fadeOut();
        }
    });

    $('.popup-fade').click(function (e) {
        if ($(e.target).closest('.popup').length == 0) {
            $(this).fadeOut();
        }
    });

    $(".saveData").click(function () {
        if ($('#name').val() == '' || $('#from_date').val() == '' || $('#to_date').val() == '') {
            alert('Incorrect values in fields');
            return;
        }
        id = 1 + Math.floor(Math.random() * 20000000);
        newEvent = {
            'id': id,
            name: $('#name').val(),
            fromDate: $('#from_date').val(),
            toDate: $('#to_date').val(),
            color: $('#color').val()
        };

        localStorage.setItem(id, JSON.stringify(newEvent));
        chart.data.push(newEvent);
        chart.validateData();
        $('.popup-fade').fadeOut();
    });



    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.paddingRight = 30;
    chart.dateFormatter.inputDateFormat = "yyyy-MM-dd HH:mm";

    var colorSet = new am4core.ColorSet();
    colorSet.saturation = 0.4;

    chart.data = [];
    for (let i = 0; i < localStorage.length; i++) {
        key = localStorage.key(i);
        gettedData = JSON.parse(localStorage.getItem(key));
        chart.data.push(gettedData);

    }
    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "name";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.inversed = true;

    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.dateFormatter.dateFormat = "yyyy-MM-dd HH:mm";
    dateAxis.renderer.minGridDistance = 70;
    dateAxis.baseInterval = { count: 30, timeUnit: "months" };
    dateAxis.max = new Date(2021, 11, 31, 24, 0, 0, 0).valueOf();
    dateAxis.strictMinMax = true;
    dateAxis.renderer.tooltipLocation = 0;

    var series1 = chart.series.push(new am4charts.ColumnSeries());
    series1.columns.template.width = am4core.percent(80);
    series1.columns.template.tooltipText = "{name}: {openDateX} - {dateX}";

    series1.dataFields.openDateX = "fromDate";
    series1.dataFields.dateX = "toDate";
    series1.dataFields.categoryY = "name";
    series1.columns.template.propertyFields.fill = "color"; // get color from data
    series1.columns.template.propertyFields.stroke = "color";
    series1.columns.template.strokeOpacity = 1;

    chart.scrollbarX = new am4core.Scrollbar();

    series1.columns.template.events.on("hit", function (ev) {
        fromDate = Date.parse(ev.target.dataItem.dataContext.fromDate);
        name = ev.target.dataItem.dataContext.name;
        toDate = ev.target.dataItem.dataContext.toDate;
        color = ev.target.dataItem.dataContext.color;
        targetid = ev.target.dataItem.dataContext.id;

        $('#name').val(name);
        $('#from_date').val($.format.date(fromDate, 'yyyy-MM-ddThh:mm'));
        $('#to_date').val($.format.date(toDate, 'yyyy-MM-ddThh:mm'));
        $('#color').val(color);
        showButtons('edit');

        $('.popup-fade').fadeIn();

        $(".editData").click(function () {
            needleItems = $.grep(chart.data, function (value) { return value.id !== targetid })
            chart.data = needleItems
            let newid = 1 + Math.floor(Math.random() * 20000000);
            let editedDataObject = {
                'id': newid,
                name: $('#name').val(),
                fromDate: $('#from_date').val(),
                toDate: $('#to_date').val(),
                color: $('#color').val()
            }
            chart.data.push(editedDataObject);
            localStorage.removeItem(targetid);
            localStorage.setItem(newid, JSON.stringify(editedDataObject));
            chart.validateData();
            $('.popup-fade').fadeOut();
        });
        $(".deleteData").click(function () {
            needleItems = $.grep(chart.data, function (value) { return value.id !== targetid });
            chart.data = needleItems
            localStorage.removeItem(targetid);
            chart.validateData();
            $('.popup-fade').fadeOut();
        })
    }, this);
});

function showButtons(type) {
    if (type == 'edit') {
        $('.saveData').css('display', 'none');
        $('.editData').css('display', 'block');
        $('.deleteData').css('display', 'block');
    }
    if (type == 'add') {
        $('.saveData').css('display', 'block');
        $('.editData').css('display', 'none');
        $('.deleteData').css('display', 'none');
    }
}