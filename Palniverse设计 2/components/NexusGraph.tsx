
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { AuraObject } from '../types';

interface NexusGraphProps {
  objects: AuraObject[];
}

const NexusGraph: React.FC<NexusGraphProps> = ({ objects }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [timeRange, setTimeRange] = useState(100);

  useEffect(() => {
    if (!svgRef.current || objects.length === 0) return;

    const width = 400;
    const height = 400;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Orbits
    const orbits = [80, 140, 190];
    svg.append('g').selectAll('circle')
      .data(orbits)
      .join('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', d => d)
      .attr('fill', 'none')
      .attr('stroke', '#EBF5FF')
      .attr('stroke-dasharray', '4 4');

    const nodes = [
      { id: 'user', name: 'Self', group: 'center', score: 100 },
      ...objects.map(o => ({ 
        id: o.id, 
        name: o.name, 
        group: 'pal', 
        score: o.relationshipScore,
        imageUrl: o.imageUrl
      }))
    ];

    const simulation = d3.forceSimulation(nodes as any)
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('radial', d3.forceRadial((d: any) => {
        if (d.id === 'user') return 0;
        // Map relationshipScore to orbits
        if (d.score > 80) return orbits[0];
        if (d.score > 40) return orbits[1];
        return orbits[2];
      }, width / 2, height / 2).strength(1));

    // Dynamic Connections (Inter-pal)
    const links: any[] = [];
    objects.forEach((o, i) => {
       objects.slice(i + 1).forEach(other => {
          if (Math.random() > 0.6) {
             links.push({ source: o.id, target: other.id, weight: Math.random() * 5 });
          }
       });
    });

    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#007AFF22')
      .attr('stroke-width', d => d.weight);

    const nodeGroup = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g');

    // User node
    nodeGroup.filter((d: any) => d.id === 'user')
      .append('circle')
      .attr('r', 12)
      .attr('fill', '#007AFF')
      .attr('stroke', 'white')
      .attr('stroke-width', 4);

    // Pal nodes
    const palNodes = nodeGroup.filter((d: any) => d.id !== 'user');
    
    palNodes.append('circle')
      .attr('r', 18)
      .attr('fill', 'white')
      .attr('stroke', '#EBF5FF')
      .attr('stroke-width', 2);

    palNodes.append('clipPath')
      .attr('id', d => `clip-${d.id}`)
      .append('circle')
      .attr('r', 16);

    palNodes.append('image')
      .attr('xlink:href', d => (d as any).imageUrl)
      .attr('width', 32)
      .attr('height', 32)
      .attr('x', -16)
      .attr('y', -16)
      .attr('clip-path', d => `url(#clip-${d.id})`);

    nodeGroup.append('text')
      .text(d => d.name)
      .attr('dy', 30)
      .attr('text-anchor', 'middle')
      .attr('font-size', '8px')
      .attr('font-weight', 'bold')
      .attr('fill', '#333');

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      nodeGroup.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

  }, [objects, timeRange]);

  return (
    <div className="space-y-6">
      <div className="glass rounded-[40px] p-4 bg-[#FFFFFF] shadow-inner relative overflow-hidden aspect-square border border-gray-50">
        <svg ref={svgRef} className="w-full h-full" viewBox="0 0 400 400"></svg>
        <div className="absolute top-8 left-8">
           <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Galaxy Mesh v2.5</span>
        </div>
      </div>

      <div className="px-4 space-y-4">
        <div className="flex justify-between items-center">
           <span className="text-[10px] font-bold text-gray-400">PAST WEEK</span>
           <span className="text-[10px] font-bold text-[#007AFF]">NOW</span>
        </div>
        <input 
          type="range" 
          value={timeRange}
          onChange={e => setTimeRange(parseInt(e.target.value))}
          className="w-full h-1 bg-blue-50 rounded-lg appearance-none cursor-pointer accent-[#007AFF]"
        />
        <p className="text-[10px] text-center text-gray-400 uppercase tracking-tight">Slide to observe relationship evolution</p>
      </div>

      <div className="grid grid-cols-3 gap-2 px-2">
         {['Intimate', 'Guardian', 'Observer'].map(type => (
           <div key={type} className="bg-white p-3 rounded-2xl border border-gray-50 text-center">
             <p className="text-[8px] font-bold text-gray-300 uppercase">{type}</p>
             <p className="text-xs font-bold text-gray-800">
               {objects.filter(o => {
                 if(type === 'Intimate') return o.relationshipScore > 80;
                 if(type === 'Guardian') return o.relationshipScore > 40;
                 return o.relationshipScore <= 40;
               }).length}
             </p>
           </div>
         ))}
      </div>
    </div>
  );
};

export default NexusGraph;
