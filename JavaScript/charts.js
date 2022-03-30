
/// <reference path="../amcharts_5.1.8/amcharts5/xy.js" />
/// <reference path="../amcharts_5.1.8/amcharts5/index.js" />

var chart;
var chartTwo;
var overdue;
var root;
var root2;
var root3;
$(document).ready(function () {


    // Create root and chart
    root = am5.Root.new("chartdiv");
    root2 = am5.Root.new("chartdiv2");
    root3 = am5.Root.new("overdue");

    root.setThemes([
        am5themes_Animated.new(root)
    ]);
    root2.setThemes([
        am5themes_Animated.new(root2)
    ]);

    root3.setThemes([
        am5themes_Animated.new(root3)
    ]);


    chart = root.container.children.push(
        am5percent.PieChart.new(root, {
            layout: root.verticalHorizontal
        })
    );

    chartTwo = root2.container.children.push(
        am5percent.PieChart.new(root2, {
            layout: root.verticalHorizontal
        })
    );

    overdue = root3.container.children.push(
       
        am5xy.XYChart.new(root3, {
            panY: false,
            wheelY: false,
            layout: root3.verticalLayout
        })
    );

    // Define data
    var data = [{
        status: "Completed",
        learners: 100000
    }, {
        status: "Incomplete",
        learners: 160000
    }, {
        status: "Not Started",
        learners: 80000
    }];

    var data2 = [{
        status: "Passed",
        learners: 29
    },
    {
        status: "Failed",
        learners: 2
    }
    ];

    var ovdata = [
        {
            status: "< 30",
            learners: "50",

        },
        {
            status: "< 60",
            learners: "40",
        },
        {
            status: "< 90",
            learners: "8",
        },
        {
            status: "> 90",
            learners: "10",
        }
    ];

    // Craete Y-axis
    var yAxis = overdue.yAxes.push(
        am5xy.ValueAxis.new(root3, {
            renderer: am5xy.AxisRendererY.new(root, {})
        })
    );

    // Create X-Axis
    var xAxis = overdue.xAxes.push(
        am5xy.CategoryAxis.new(root3, {
            renderer: am5xy.AxisRendererX.new(root, { }),
        })
    );
   // xAxis.data.setAll(ovdata);
   // yAxis.data.setAll([{ category: "30 days" }, { category: "60 days" }, { category: "90 days" }, { category: "over 90" }]);
    var ovSeries = overdue.series.push(
        am5xy.ColumnSeries.new(root3, {
            name: "Series",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "value",
            valueXField: "category"
        })
    );

    ovSeries.data.setAll([{
        category: "30 days",
        value: 12        
    },
        {
            category : "60 days",
            value : 30
        },
        {
            category: "90 days",
            value: 28
        },
        {
            category: "over 90 days",
            value : 2
        }]);

   

   

    // Create series
    var series = chart.series.push(
        am5percent.PieSeries.new(root, {
            name: "Series",
            valueField: "learners",
            categoryField: "status",
            layout: root.verticalHorizontal
        })
    );

    series.data.setAll(data);

    var seriesTwo = chartTwo.series.push(
        am5percent.PieSeries.new(root2, {
            name: "SeriesTwo",
            valueField: "learners",
            categoryField: "status",
            layout: root.verticalHorizontal
        })
    );

    seriesTwo.data.setAll(data2);

    // Disabling labels and ticks
    //  series.labels.template.set("visible", false);
    // series.ticks.template.set("visible", false);
    var legend = chart.children.push(am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        layout: root.horizontalLayout
    }));

    //  legend.data.setAll(series.dataItems);


});

let savePDF = function () {
    var exporting = am5plugins_exporting.Exporting.new(root, {
        menu: am5plugins_exporting.ExportingMenu.new(root, {})
    });

    var exporting2 = am5plugins_exporting.Exporting.new(root2, {
        menu: am5plugins_exporting.ExportingMenu.new(root2, {})
    });

    Promise.all([
        exporting.getPdfmake(),
        exporting.export("png"),
        exporting2.export("png")
    ]).then(function (res) {

        var pdfMake = res[0];

        // pdfmake is ready
        // Create document template
        var doc = {
            pageSize: "A4",
            pageOrientation: "portrait",
            pageMargins: [30, 30, 30, 30],
            content: []
        };

        var pdfMake = res[0];
        // pdfmake is ready
        // Create document template
        var doc = {
            pageSize: "A4",
            pageOrientation: "portrait",
            pageMargins: [30, 30, 30, 30],
            content: []
        };

        doc.content.push({
            image: res[1],
            width: 530
        });
        doc.content.push({
            image: res[2],
            width: 530
        });

        pdfMake.createPdf(doc).download("report.pdf");
    });
};