const dimensions = {
    width: 800,
    height: 700
}

const svg = d3.select('body').append('svg')
    .attr('width', dimensions.width)
    .attr('height', dimensions.height)

const g = svg.append('g')

d3.json('./nygeo.json').then(function (data) {

    d3.csv('./data.csv').then(function (bnbData) {

        console.log(data)

        const albersProj = d3.geoAlbers()
            .scale(90000)
            .rotate([74.00, 0])
            .center([0, 40.71])
            .translate([dimensions.width / 2, dimensions.height / 2]);

        const geoPath = d3.geoPath()
            .projection(albersProj)

        g.selectAll('path')
            .data(data.features)
            .enter()
            .append('path')
            .attr('fill', '#ccc')
            .attr('d', geoPath)

        // plots circles on the boston map
        g.selectAll('.circle')
            .data(bnbData)
            .enter()
            .append('circle')
            .attr('cx', function (d) {
                let scaledPoints = albersProj([d['longitude'], d['latitude']])
                return scaledPoints[0]
            })
            .attr('cy', function (d) {
                let scaledPoints = albersProj([d['longitude'], d['latitude']])
                return scaledPoints[1]
            })
            .attr('r', 3)
            .attr('fill', 'steelblue')
            .on("click", function (d) {
                d3.select(this)
                    .transition()
                    .duration(1000)
                    .style('opacity', 0)
                    .style("transform", "translate(-1000px)");
            });

    });
});