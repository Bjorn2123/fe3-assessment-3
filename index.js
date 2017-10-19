/* global d3*/
// Grafiek 1
var svg = d3.select("#svgleft"),
    margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
    },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var firstX = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    firstY = d3.scaleLinear().rangeRound([height, 0]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

////////////////////////////////////////////////////////////////////////////////////
//hier maak ik de variabelen aan voor mijn tweede grafiek
var secondSvg = d3.select("#svgright"),
    secondMargin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
    },
    secondWidth = +secondSvg.attr("width") - secondMargin.left - secondMargin.right,
    secondHeight = +secondSvg.attr("height") - secondMargin.top - secondMargin.bottom;

var secondX = d3.scaleBand().rangeRound([0, secondWidth]).padding(0.1),
    secondY = d3.scaleLinear().rangeRound([secondHeight, 0]);

var gTwo = secondSvg.append("g")
    .attr("transform", "translate(" + secondMargin.left + "," + secondMargin.top + ")");

////////////////////////////////////////////////////////////////////////////////////////

d3.text('data.csv').get(onload);

function onload(err, doc) {
    if (err) {
        throw err;
    }

    var header = doc.indexOf('2015');
    var footer = doc.indexOf('Centraal Bureau voor de Statistiek') - 3;
    var end = doc.indexOf('\n', header);
    doc = doc.substring(end, footer).trim();
    var data = d3.csvParseRows(doc, map);


    function map(d, i) {
        return {
            Ziekte: "Ziekte " + (i+1),
            Totaal: Number(d[5]),
            Mannen: Number(d[6]),
            Vrouwen: Number(d[7])

        };
    }


    ///////////////////////////////////////////
    //Hier maak ik mijn eerste grafiek
    


    firstX.domain(data.map(function (d) {
        return d.Ziekte;
    }));
    firstY.domain([0, d3.max(data, function (d) {
        return d.Totaal;
    })]);

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(firstX).ticks(data.length))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "2em")
        .attr("dy", "1em");

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(firstY).ticks(10))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Overledenen");


    g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d, index) {
            return firstX(d.Ziekte);
        })
        .attr("width", firstX.bandwidth())
        .attr("y", height)
        .attr("height", 0)
        .transition()
        .ease(d3.easeBounce)
        .duration(750)
        .delay(function (d, i) {
            return i * 1;
        })
        .attr("y", function (d) {
            return firstY(d.Totaal);
        })

    .attr("height", function (d) {
        return height - firstY(d.Totaal);
    });


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //sorteer functie

    // deze functie heb ik van het voorbeeld sortable chart.
    d3.select("input").on("change", change);

    // ik maak hier een variabele aan waarin ik een functie stop die de functie change in werk laat gaan als het input element in de HTML gecheckt wordt
    var sorteer = (function () {
        d3.select("input").property("checked", true).each(change);
    });

    function change() {

        var x0 = firstX.domain(data.sort(this.checked ? function (a, b) {
                    return b.Totaal - a.Totaal;
                } : function (a, b) {
                    return d3.ascending(a.Ziekte, b.Ziekte);
                })
                .map(function (d) {
           
                    return d.Ziekte;
                }))
            .copy();

        svg.selectAll(".bar")
            .sort(function (a, b) {
                return x0(a.Ziekte) - x0(b.Ziekte);
            });

        var transition = svg.transition().duration(750),
            delay = function (d, i) {
                return i * 50;
            };

        transition.selectAll(".bar")
            .delay(delay)
            .attr("x", function (d) {
                return x0(d.Ziekte);
            });

        transition.select(".axis--x")
            .call(d3.axisBottom(x0))
            .selectAll("g")
            .delay(delay);
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // De codes voor grafiek 2
    
    var data2 = [];
    var diseases = [];
    var disease = '';
    data.forEach(function (d) {
        diseases.push(d.Ziekte);
    })
    disease = diseases[0];
    data2 = data.filter(filterDisease);


    /* omdat ik wil werken met keys en values uit mijn array heb ik voor mannen, vrouwen en totaal een variabele gemaakt die ik een object geef.*/
    var mannenObject = {};
    var vrouwenObject = {};
    var totaalObject = {};
    var newData = [];
    // met onderstaande code maak ik als het ware een json file waarmee ik een naam geef aan mannen vrouwen en totaal en hun bijbehorende data pak en dat in het object zet. 
    mannenObject["name"] = "mannen";
    mannenObject["number"] = data2[0].Mannen;
    vrouwenObject["name"] = "vrouwen";
    vrouwenObject["number"] = data2[0].Vrouwen;
    totaalObject["name"] = "totaal";
    totaalObject["number"] = data2[0].Totaal;
    // hier zet ik de aangemaakte objecten in de variabele newData
    newData.push(mannenObject);
    newData.push(vrouwenObject);
    newData.push(totaalObject);

    // Ik maak hier mijn twee grafiek aan en zoals in bovenstaande comment gezegd laat ik de name die ik heb aangemaakt zien op de x as
    secondX.domain(newData.map(function (d) {
        return d.name;
    }));
    secondY.domain([0, d3.max(data, function (d) {
        return d.Totaal;
    })]);

    gTwo.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + secondHeight + ")")
        .call(d3.axisBottom(secondX))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "2em")
        .attr("dy", "1em");

    gTwo.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(secondY).ticks(10))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .text("Overledenen");


    gTwo.selectAll(".bar")
        .data(newData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return secondX(d.name);
        })
        .attr("y", function (d) {
            return secondY(d.number);
        })
        .attr("width", secondX.bandwidth())
        .attr("height", function (d) {
            return secondHeight - secondY(d.number);
        });


    // hieronder maak ik een click event aan die de function onChange in zn werk laat gaan.

    d3.selectAll(".bar").on('click', onChange);

    /* Nadat er geclickt wordt gaat onChange van start en geef ik de bar chart die aangeklikt is een class mee van active en laat ik dus per geklikte bar de objecten zien met de bijbehorende number */

    function onChange(e) {
        disease = e.Ziekte;
        this.classList.add("active");
        data2 = [];
        newData = [];
        data2 = data.filter(filterDisease);
        mannenObject["name"] = "mannen";
        mannenObject["number"] = data2[0].Mannen;
        vrouwenObject["name"] = "vrouwen";
        vrouwenObject["number"] = data2[0].Vrouwen;
        totaalObject["name"] = "totaal";
        totaalObject["number"] = data2[0].Totaal;
        newData.push(mannenObject);
        newData.push(vrouwenObject);
        newData.push(totaalObject);


        var barElement = gTwo.selectAll(".bar")
            .data(newData);
        barElement.transition().duration(750).ease(d3.easeBounce)
            .attr("class", "bar")
            .style("fill", "slateblue")
            .attr("x", function (d) {
                return secondX(d.name);
            })
            .attr("y", function (d) {
                return secondY(d.number);
            })

        .attr("width", secondX.bandwidth())
            .attr("height", function (d) {
                return secondHeight - secondY(d.number);
            });
    }

    function filterDisease(d) {
        return (d.Ziekte === disease);
    }


}