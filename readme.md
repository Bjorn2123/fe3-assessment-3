# Assessment 3 
Voor assessment 3 ben ik naar data gaan zoeken op de website van het CBS. Ik heb de dataset gevonden over [het aantal overledenen per ziekte](http://statline.cbs.nl/Statweb/publication/?DM=SLNL&PA=7052_95&D1=0-1,7,34,42,49,63,71,79&D2=a&D3=0&D4=65&HDR=T&STB=G1,G3,G2&VW=T)

Na het uitpluisen van deze data ben ik mezelf gaan afvragen wat ik precies wil laten zien en vanaf daar naar charts gaan kijken. Omdat assessment 2 niet gelukt is ben ik met een schone lei begonnen en heb ik daarom de [Bar chart](https://bl.ocks.org/mbostock/3885304) op de Gallery site gekozen.

## Stappen plan

Allereerst ben ik begonnen met het schoonmaken van mijn data zodat ik voor mezelf duidelijk had hoe mijn data er uit komt te zien.
Dit heb ik gedaan met de volgende codes:

```js
var header = doc.indexOf('2015');
    var footer = doc.indexOf('Centraal Bureau voor de Statistiek') - 3;
    var end = doc.indexOf('\n', header);
    doc = doc.substring(end, footer).trim();
    var data = d3.csvParseRows(doc, map);


    function map(d) {
        return {
            Ziekte: (d[3]),
            Totaal: Number(d[5]),
            Mannen: Number(d[6]),
            Vrouwen: Number(d[7])

        };
    }
```    
Daarna ben ik mijn eerste grafiek gaan maken met de volgende codes:

```js 
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
    
    firstX.domain(data.map(function (d, index) {
        return "Ziekte " + (index + 1);
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
            return firstX("Ziekte " + (index + 1));
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
```
Ik heb op dezelfde manier ook mijn tweede grafiek gemaakt maar heb ik de variabelen anders benoemd. 

Omdat ik in mijn tweede grafiek op de x as objecten uit mijn arrays wil laten zien heb ik objecten gemaakt. Zie onderstaande code

```js
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
```
Ik pak dus uit mijn data de woorden mannen, vrouwen en totaal en die plaats ik later in mijn code op de x as. Daarnaast filter ik dus de ziekte uit alles ziektes waarvan ik de waarden in grafiek twee wil laten zien.

Tevens maak ik een functie aan met een event click die de onChange functie laat werken waarmee ik dus transitie geef aan de verandering van mijn twee grafiek. Hiermee maak ik dus een functie die per ziekte andere data laat zien.

```js
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
```

Tot slot heb ik nog een sorteer functie aangemaakt waarmee mijn bars op grafiek 1 gesorteerd worden.

```js
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

        transition.select("axis axis--x")
            .call(firstX)
            .selectAll("g")
            .delay(delay);
    }
```



