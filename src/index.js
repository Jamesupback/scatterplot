import React from 'react';
import ReactDOM from 'react-dom/client';
import { useRef,useEffect,useState } from 'react';
import * as d3 from 'd3';
import './index.css';

function App(){
  const svgref=useRef()
  const [info,setinfo]=useState([])
  useEffect(()=>{
    fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
    .then(response=>response.json())
    .then(data => {
      setinfo(data)
    })
  },[])
  //const dataset = [12, 31, 22, 17, 25, 18, 29, 14, 9];
  const times=info.map(item=>{
    const[min,sec]=item.Time.split(":")
    const date=new Date(0)
    date.setHours(0)
    date.setMinutes(min)
    date.setSeconds(sec)
   
    return date
  })
  const name=info.map(item=>item.Name)
  const nation=info.map(item=>item.Nationality)
  const years=info.map(item=>item.Year)
  const clean=info.map(item=>item.Doping)
  const dataset=info.map((item,index)=>{
    return[times[index],years[index],clean[index],name[index],nation[index]]
  })
  //console.log(times)
  const min=new Date(d3.min(years)-1,0)
  const max=new Date(d3.max(years)+1,0)
  var format = d3.timeFormat("%M:%S");
  const legend=["No doping allegations","Riders with doping allegations"]
  useEffect(()=>{
    const xscale=d3.scaleTime()
                    .domain([min,max])
                    .range([50,950])
    const yscale=d3.scaleTime()
                    .domain([d3.min(times),d3.max(times)])
                    .range([50,450])
    //date.setMinutes
    const svg=d3.select(svgref.current)
    svg.selectAll("circle")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("cx",(d,i)=>xscale(new Date(d[1],0)))
      .attr("cy",(d,i)=>yscale((d[0])))
      .attr("fill",(d,i)=>{
        if(d[2]==="")
        return "#FF983E"
        else
        return "#1F77B4"
      })
      .attr("stroke","black")
      .attr("r",6)
      .attr("class","dot")
      .attr("data-xvalue",(d,i)=>(new Date(d[1],0)))
      .attr("data-yvalue",(d,i)=>(d[0]))
      .on("mouseenter",(event,d)=>{
                    svg.append("rect")
                        .attr("id","frame")
                        .attr("x",xscale(new Date(d[1],0)))
                        .attr("y",yscale((d[0])))
                        .attr("width",()=>{
                          if(d[2].length==="")
                          return 150
                          else
                          return d[2].length*5
                        })
                        .attr("height","100")
                        .attr("fill","#87CEEB")
                        .attr("rx",10)
                        .attr("ry",10)
                    svg.append("text")
                        .attr("font-size",10+"px")
                        .attr("id","tooltip")
                        .attr("data-year",new Date(d[1],0))
                        .attr("x",xscale(new Date(d[1],0))+15)
                        .attr("y",yscale((d[0]))+30)
                        .append("tspan")
                        .text(d[3]+" : "+d[4])
                        .attr("dy","-0.5em")
                        .append("tspan")
                        .text("Time: "+format(d[0]))
                        .attr("dy","1.5em")
                        .attr("dx","-7em")
                        .append("tspan")
                        .text("Year: "+d[1])
                        .attr("dy","1.5em")
                        .attr("dx","-5em")
                        .append("tspan")
                        .text(d[2])
                        .attr("dy","1.5em")
                        .attr("dx","-10em")
                       

      })
      .on("mouseleave",(event,d)=>{
                    svg.select("#frame").remove()
                    svg.select("#tooltip").remove() 
      })
      svg.selectAll("rect")
          .data(legend)
          .enter()
          .append("rect")
          .attr("x",800)
          .attr("y",(d,i)=>250+i*35)
          .attr("width",20)
          .attr("height",20)
          .attr("fill",(d,i)=>{
            if(i===0)
            return "#FF983E"
            else
            return "#1F77B4" 
          })
      svg.selectAll("text")
          .data(legend)
          .enter()
          .append("text")
          .attr("id","legend")
          .attr("x",830)
          .attr("y",(d,i)=>263+i*35)
          .text(d=>d)
          .style("font-size",13+"px")
      const yaxis=d3.axisLeft(yscale)
                      .tickFormat(d=>format(d))
      svg.select("#y-axis").call(yaxis)
      .attr("transform","translate(50,0)")
      const xaxis=d3.axisBottom(xscale)
      svg.select("#x-axis").call(xaxis)
      .attr("transform","translate(0,450)")
  })
  return(
    <div id="title">
      <svg ref={svgref} width={1000} height={500}>
      <g id="x-axis"></g>
      <g id="y-axis"></g>
      </svg>
    </div>
    
  )
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


