

var dataset;

function UpdateParallelCoordinate(dataset) {
   // console.log(dataset);
    
    var width = 1000;
    var height = 600;
    var padding = 50;
    var keynum = dataset[0] ? Object.keys(dataset[0]).length: 0; 
    var color = d3.scale.category10();
    var colornum =  10;  //10/20
    
    
    var lineFunction = d3.svg.line()
                      .x(function(d) { return d.x;})
                      .y(function(d) { return d.y;})
                     .interpolate("linear");    
    
    
    var svg = d3.select('parallel-coordinate').select('#chart').append('svg')
                                .attr('width',width)
                                .attr('height',height);
    svg.append('g')
    .attr('id','lineSet');
    svg.append('g')
    .attr('id','axisSet');
    
    
    
    //console.log(dataset);
    
     function CreateScale(key){
            return  d3.scale.linear()
                                .domain([0, d3.max(dataset, function(d){return +eval('d.' + key);})])
                                .range([2 * padding, height - padding]);
         //console.log(height - padding);
     };
     
    //dataset --> (x,y)
    function reShapeData(dataset){
        
            //line() only works if you provide an array of coordinates[{x:,y:},{x:,y:}...]
            //so we reshape the dataset so that it reflects that structure
            //for each datum {a,b,c} : and for each key, we create [{x:,y:},{x:,y:}...] that contains the coordinates of ONE line
            //Coordinates are the different points on each axis. So x is calculated by counting on which axis it is
            //y is calculated with the scale for that key, on the value of that key
            //Ex : {x:padding,y:aScale(15)},{x:padding + width til next axis,y:bScale(20),{x:padding + 2*width til next axis,y:cScale(10)}...}
            var newDataset = [];
            dataset.forEach(function(group,indexGroup){
                newDataset.push([]);
                Object.keys(group).forEach(function(key,indexKey){
                    //console.log(key); key:attribute name
                    newDataset[indexGroup].push({x:padding + indexKey*( width -2 * padding)/(keynum - 1), y:CreateScale(key)(group[key])});
                });
            });
            return newDataset;
        };

     function DrawAxis() {
          //Axis
        var axis = svg.select('#axisSet').selectAll('.axis')
                         .data(Object.keys(dataset[0])); //mapping axis per keys in the dataset (ie 'a','b','c'...)
         

                   axis.enter()
                         .append('g')
                         .attr('class','axis')
                         .append('text')
                         .text(function(d){return d;})
                         .attr('y', padding);// position of attribute name 

                    axis //.transition()
                        //.duration(1000)
                        .attr('transform',function(d,i){return 'translate('+ (padding + i * (width - 2 * padding)/(keynum - 1))+')';})
                        .each(function(d){
                            d3.select(this).call(d3.svg.axis()
                                                .scale(CreateScale(d)) //for each key there is a specific scale
                                                .orient('left')
                                                );
                            });

                    axis.exit()
                        .remove();
    
     } 
     function DrawLine() {
            var lines = svg.select('#lineSet').selectAll('.lines')
                                            .data(reShapeData(dataset));
          //      console.log(lines);
         
                    lines.enter()
                            .append('path')
                            .attr('class','lines')
                            .attr('fill', 'none')
                            .attr('d','M'+ padding +' ' + (height / 2)+' L'+(width - padding)+' '+(height /2) + '');
                
               // console.log(lines)
         
         
                            //??
                        //   .attr('stroke-width', '1px')
         
         
       //     console.log(color);
                    lines .attr('stroke','blue')
                        //    .attr('stroke-width', '1px')
                            .attr('stroke-opacity','0');
                            

                    lines.transition()
                            .attr('d',function(d){return lineFunction(d);})
                            .attr('stroke',function(d, i){return color(Math.floor( (d[0].y * colornum) / (height - 2 * padding) ));})
                            .attr('stroke-opacity','0.5');

                    lines.exit()
                            .remove();

/*
    d3.selectAll('.lines').on('mouseover',function(){
        d3.selectAll('.lines').attr('stroke','#777777');
        d3.select(this).attr('stroke','#5500FF');
     })
     
     */
         
         
    }
    
    
    DrawAxis();
    DrawLine();
    
}


/* get dataset*/

d3.csv("Fisher.csv", function(error, data){
        if (error)
            alert('Error when loading dataset');
        UpdateParallelCoordinate(data);
        });


/*d3.json("data.json", function(error, data){
        if (error)
            alert('Error when loading dataset');
        UpdateParallelCoordinate(data);
        });
*/


