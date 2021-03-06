// we need to fix this file. remove template variables/decide where it is going to live

(function($) {

    var drugNames =
        [
        {% for results in events %}
        "{{ results.term }}",
        {% endfor %}
    ];

    var adverseEffectsData = {
        name: 'Counts',
        // data points with extra properties:
        data: [
        {% for results in events %}
        {x: {{ forloop.counter0 }}, y: {{ results.count }}, investigation: true},
        {% endfor %}
        ]
        // data points with just "y" values:
        //data: [123, 234, 345, 456, 12, 23, 34]
    };

    function createAdverseEffectsChart(categoryArray, seriesData) {
        $('#adverseChart').highcharts({
            credits: {
                enabled: false
            },
            chart: {
                type: 'column'
            },
            title: {
                text: 'Counts for drugs with adverse effects'
            },
            subtitle: {
                text: '{{ q }}'
            },
            xAxis: {
                categories: categoryArray,
                crosshair: false
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Number of adverse effects'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span>',
                pointFormat: '<div><span style="color:{series.color};">{series.name}</span>: <b>{point.y:.0f}</b></div>' +
                    '<div>Undergoing Investigation: <em>{point.investigation}</em></div>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                },
                series: {
                    point: {
                        events: {
                            click: function(event) {
                                var dataPoint = event.point;
                                var xLabel = dataPoint.series.chart.axes[0].categories[dataPoint.x];
                                console.log(xLabel+" clicked", dataPoint);

                                // option 1: remove the current chart before replacing it.
                                //$("#adverseChart").highcharts().destroy();

                                // option 2: create the chart below the current chart
                                getDataAndCreateProductChart(xLabel); // <-- long name here :)
                            }
                        }
                    }
                }
            },
            series: [seriesData]
        });
    }

    function getDataAndCreateProductChart(productName) {

        $.getJSON("{% url 'search_detail' %}", {"browse_type": "events", "q": "{{ q }}", "filter_string": productName})
            .fail(function() {
                console.log("error getting data");
            })
            .done(function(results) {
                console.log(results);
                var productData = results;
                createProductChart(productName, productData);
            });
    }

    function createProductChart(productName, productDataArray) {
        $('#productChart').highcharts({
            credits: {
                enabled: false
            },
            chart: {
                type: 'column'
            },
            title: {
                text: productName+" effects grouped by sex"
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: [
                    "0-100",
                ],
                crosshair: false
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Number off effects'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.0f}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: productDataArray
        });
    }

    /*
    we can also use ajax to fetch the data passed to this function. something like:

    $.getJSON("/some/url/here")
        .fail(function() {
            console.log("error getting data");
        })
        .done(function(result) {
            var names = result.names;
            var effectsData = result.adverseEffectsData;
            createAdverseEffectsChart(names, effectsData);
        });
    */

    createAdverseEffectsChart(drugNames, adverseEffectsData);
})(jQuery);
