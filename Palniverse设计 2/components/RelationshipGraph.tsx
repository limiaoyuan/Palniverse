
import React, { useEffect, useRef } from 'react';
// Import d3 module to handle the relationship graph visualization
import * as d3 from 'd3';
import { AuraObject } from '../types';

interface RelationshipGraphProps {
  objects: AuraObject[];
}

const RelationshipGraph: React.FC<RelationshipGraphProps> = ({ objects }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || objects.length === 0) return;

    const width = 400;
    const height = 400;
    // Fix: Reference d3 from the module import
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const nodes = [
      { id: 'user', name: 'Self', group: 0, size: 20 },
      ...objects.map(o => ({ id: o.id, name: o.name, group: 1, size: 15 }))
    ];

    const links = objects.map(o => ({
      source: 'user',
      target: o.id,
      value: o.relationshipScore
    }));

    // Add some random inter-object relationships for the "Theater" effect
    for (let i = 0; i < objects.length; i++) {
      for (let j = i + 1; j < objects.length; j++) {
        if (Math.random() > 0.5) {
          links.push({
            source: objects[i].id,
            target: objects[j].id,
            value: Math.floor(Math.random() * 50)
          });
        }
      }
    }

    // Fix: Use d3 from the imported module to initialize the simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .attr("stroke", "#007AFF")
      .attr("stroke-opacity", 0.2)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value) / 2);

    const node = svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", d => (d as any).size)
      .attr("fill", d => (d as any).id === 'user' ? '#007AFF' : '#FFFFFF')
      .attr("stroke", "#007AFF")
      .attr("stroke-width", 2)
      .call(drag(simulation) as any);

    const label = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text(d => (d as any).name)
      .attr("font-size", 10)
      .attr("dx", 15)
      .attr("dy", 4)
      .attr("fill", "#333");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);

      label
        .attr("x", (d: any) => d.x)
        .attr("y", (d: any) => d.y);
    });

    function drag(simulation: any) {
      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }
  }, [objects]);

  return (
    <div className="flex flex-col items-center">
      <div className="glass rounded-[24px] p-4 w-full h-[400px] shadow-sm relative overflow-hidden">
        <svg ref={svgRef} className="w-full h-full" viewBox="0 0 400 400"></svg>
        <div className="absolute top-4 left-4">
          <h3 className="text-xs font-bold tracking-widest text-gray-400">NEXUS NETWORK</h3>
        </div>
      </div>
      <p className="mt-4 text-xs text-gray-400 text-center px-6">
        The lines represent the resonance between you and your objects. Thicker lines indicate deeper bonds.
      </p>
    </div>
  );
};

export default RelationshipGraph;
