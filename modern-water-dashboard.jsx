import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { AreaChart, Area } from 'recharts';

// Component for the modern dashboard
function ModernWaterDashboard() {
  // State for active tabs and UI interaction
  const [activeTab, setActiveTab] = useState('raw');
  const [chartHover, setChartHover] = useState(null);
  const [selectedYearGroup, setSelectedYearGroup] = useState('2yr'); // '2yr' or '200yr'

    // Data loaded from Excel (using globals)
  const rawOutflowData = window.rawOutflowData || [];
  const percentageChangeData = window.percentageChangeData || [];
  const trendData = window.trendData || [];
  const boxPlotData = window.boxPlotData || {};

  // Poll for data availability and show a loading state if not ready
  const [dataLoaded, setDataLoaded] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.rawOutflowData && window.rawOutflowData.length > 0) {
        setDataLoaded(true);
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);
  
  if (!dataLoaded) {
    return <div>Loading data...</div>;
  }

  // Calculate statistics for box plot visualization (simplified)
  const calculateStats = (data) => {
    const sorted = [...data].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const median = sorted[Math.floor(sorted.length * 0.5)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const avg = sorted.reduce((a, b) => a + b, 0) / sorted.length;
    
    return { min, max, q1, median, q3, avg };
  };

  // Get domain range for the selected year group
  const getDistributionYAxisRange = (yearGroup) => {
    if (yearGroup === '2yr') {
      return [1.0, 2.6]; // Range that covers both 2yr low and peak
    } else {
      return [7.0, 24.0]; // Range that covers both 200yr low and peak
    }
  };
  
  // Generate distribution data for both low and peak in area chart format
  const generateAreaDistributionData = (yearGroup) => {
    const lowKey = `${yearGroup}-low`;
    const peakKey = `${yearGroup}-peak`;
    
    const lowStats = {
      current: calculateStats(boxPlotData[lowKey].current),
      baseline: calculateStats(boxPlotData[lowKey].baseline),
      replant: calculateStats(boxPlotData[lowKey].replant),
      urban: calculateStats(boxPlotData[lowKey].urban)
    };
    
    const peakStats = {
      current: calculateStats(boxPlotData[peakKey].current),
      baseline: calculateStats(boxPlotData[peakKey].baseline),
      replant: calculateStats(boxPlotData[peakKey].replant),
      urban: calculateStats(boxPlotData[peakKey].urban)
    };
    
    return [
      {
        group: "Low",
        data: [
          { 
            name: 'Current', 
            min: lowStats.current.min,
            q1: lowStats.current.q1,
            median: lowStats.current.median,
            q3: lowStats.current.q3,
            max: lowStats.current.max,
            avg: lowStats.current.avg
          },
          { 
            name: '2050 Baseline', 
            min: lowStats.baseline.min,
            q1: lowStats.baseline.q1,
            median: lowStats.baseline.median,
            q3: lowStats.baseline.q3,
            max: lowStats.baseline.max,
            avg: lowStats.baseline.avg
          },
          { 
            name: 'Replant', 
            min: lowStats.replant.min,
            q1: lowStats.replant.q1,
            median: lowStats.replant.median,
            q3: lowStats.replant.q3,
            max: lowStats.replant.max,
            avg: lowStats.replant.avg
          },
          { 
            name: 'Urban', 
            min: lowStats.urban.min,
            q1: lowStats.urban.q1,
            median: lowStats.urban.median,
            q3: lowStats.urban.q3,
            max: lowStats.urban.max,
            avg: lowStats.urban.avg
          }
        ]
      },
      {
        group: "Peak",
        data: [
          { 
            name: 'Current', 
            min: peakStats.current.min,
            q1: peakStats.current.q1,
            median: peakStats.current.median,
            q3: peakStats.current.q3,
            max: peakStats.current.max,
            avg: peakStats.current.avg
          },
          { 
            name: '2050 Baseline', 
            min: peakStats.baseline.min,
            q1: peakStats.baseline.q1,
            median: peakStats.baseline.median,
            q3: peakStats.baseline.q3,
            max: peakStats.baseline.max,
            avg: peakStats.baseline.avg
          },
          { 
            name: 'Replant', 
            min: peakStats.replant.min,
            q1: peakStats.replant.q1,
            median: peakStats.replant.median,
            q3: peakStats.replant.q3,
            max: peakStats.replant.max,
            avg: peakStats.replant.avg
          },
          { 
            name: 'Urban', 
            min: peakStats.urban.min,
            q1: peakStats.urban.q1,
            median: peakStats.urban.median,
            q3: peakStats.urban.q3,
            max: peakStats.urban.max,
            avg: peakStats.urban.avg
          }
        ]
      }
    ];
  };

  // Get distribution data for the current selected year group
  const areaDistributionData = generateAreaDistributionData(selectedYearGroup);

  // Custom tooltip for the bar chart with enhanced styling to match Image 2
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const entry = payload[0];
      return (
        <div className="bg-white p-4 rounded shadow-lg border border-gray-200" style={{ minWidth: '200px' }}>
          <div className="font-semibold text-gray-800 text-base mb-2">{label}</div>
          <div style={{ color: entry.color }} className="text-base font-medium">
            {entry.name}: {entry.value.toFixed(2)} cms
          </div>
        </div>
      );
    }
    return null;
  };
  
  // Custom tooltip for the percentage chart - shows only the hovered item
  const PercentageTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Only show the first item in the payload (the one being hovered)
      const entry = payload[0];
      return (
        <div className="bg-white p-4 rounded shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{label}</p>
          <p style={{ color: entry.color }} className="text-sm font-medium mt-1">
            {entry.name}: {entry.value.toFixed(2)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-6 px-4 shadow-md">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Max Outflow Uncertainty Dashboard</h1>
          <p className="text-blue-100 max-w-3xl">
            Interactive analysis of climate scenarios (2050 baseline, Urban development, Replanting efforts)
            and their impact on maximum water outflow across different rainfall event severities.
          </p>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-6xl mx-auto py-8 px-4">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap mb-8 border-b border-gray-200">
          <button 
            onClick={() => setActiveTab('raw')} 
            className={`px-4 py-3 font-medium text-sm rounded-t-lg mr-2 transition-colors ${
              activeTab === 'raw' 
                ? 'bg-white border-b-2 border-blue-700 text-blue-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Raw Outflow
          </button>
          <button 
            onClick={() => setActiveTab('distribution')} 
            className={`px-4 py-3 font-medium text-sm rounded-t-lg mr-2 transition-colors ${
              activeTab === 'distribution' 
                ? 'bg-white border-b-2 border-blue-700 text-blue-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Distribution Analysis
          </button>
          <button 
            onClick={() => setActiveTab('percentage')} 
            className={`px-4 py-3 font-medium text-sm rounded-t-lg mr-2 transition-colors ${
              activeTab === 'percentage' 
                ? 'bg-white border-b-2 border-blue-700 text-blue-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Percentage Change
          </button>
          <button 
            onClick={() => setActiveTab('trends')} 
            className={`px-4 py-3 font-medium text-sm rounded-t-lg transition-colors ${
              activeTab === 'trends' 
                ? 'bg-white border-b-2 border-blue-700 text-blue-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Trend Analysis
          </button>
        </div>
        
        {/* Chart Containers */}
        {activeTab === 'raw' && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Raw Max Outflow Comparison</h2>
            <p className="text-gray-600 mb-6 text-sm italic">Summary values representing multiple return periods</p>
            
            <div 
              className="bg-blue-50 p-4 rounded-lg mb-6 border-l-4 border-blue-500" 
              onMouseEnter={() => setChartHover('raw')}
              onMouseLeave={() => setChartHover(null)}
            >
              <p className={`transition-opacity duration-300 ${chartHover === 'raw' ? 'opacity-100' : 'opacity-70'}`}>
                This chart compares the absolute maximum outflow values (in cms) across all scenarios and return periods. 
                Higher values indicate increased water flow volume during rainfall events.
              </p>
            </div>
            
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={rawOutflowData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="category" 
                    angle={-30} 
                    textAnchor="end" 
                    tick={{ fontSize: 12 }}
                    height={60}
                  />
                  <YAxis 
                    label={{ value: 'Max Outflow (cms)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    content={<CustomTooltip />} 
                    cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                    wrapperStyle={{ zIndex: 1000 }} // Ensure tooltip is on top
                    allowEscapeViewBox={{ x: true, y: true }}
                  />
                  <Legend wrapperStyle={{ paddingTop: 20 }} />
                  <Bar dataKey="Current" name="Current Conditions" fill="#0056b3" radius={[4, 4, 0, 0]} isAnimationActive={true} />
                  <Bar dataKey="Baseline" name="2050 Baseline (ViT)" fill="#fd7e14" radius={[4, 4, 0, 0]} isAnimationActive={true} />
                  <Bar dataKey="Replant" name="Replanting Efforts" fill="#17a2b8" radius={[4, 4, 0, 0]} isAnimationActive={true} />
                  <Bar dataKey="Urban" name="Urban Development" fill="#dc3545" radius={[4, 4, 0, 0]} isAnimationActive={true} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        
        {activeTab === 'distribution' && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-1">
              Distribution Analysis ({selectedYearGroup === '2yr' ? '2-Year' : '200-Year'} Return Period)
            </h2>
            <p className="text-gray-600 mb-4 text-sm italic">Combined low and peak scenario distribution</p>
            
            {/* Period selector */}
            <div className="flex flex-wrap mb-6">
              <button 
                onClick={() => setSelectedYearGroup('2yr')} 
                className={`px-4 py-2 mr-2 mb-2 text-sm rounded-md transition-colors ${
                  selectedYearGroup === '2yr' 
                    ? 'bg-blue-700 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                2-Year Return Period
              </button>
              <button 
                onClick={() => setSelectedYearGroup('200yr')} 
                className={`px-4 py-2 mb-2 text-sm rounded-md transition-colors ${
                  selectedYearGroup === '200yr' 
                    ? 'bg-blue-700 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                200-Year Return Period
              </button>
            </div>
            
            <div 
              className="bg-blue-50 p-4 rounded-lg mb-6 border-l-4 border-blue-500"
              onMouseEnter={() => setChartHover('dist')}
              onMouseLeave={() => setChartHover(null)}
            >
              <p className={`transition-opacity duration-300 ${chartHover === 'dist' ? 'opacity-100' : 'opacity-70'}`}>
                This chart visualizes the statistical distribution of max outflow values for both low and peak events in
                the {selectedYearGroup === '2yr' ? '2-year' : '200-year'} return period. Each chart shows min/max range, 
                quartiles (colored areas), median (line), and average values (dots).
              </p>
            </div>

            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center mr-6">
                <div className="w-16 h-6 bg-blue-100 border border-blue-500 flex items-center justify-center">
                  <div className="w-16 h-px bg-blue-700"></div>
                </div>
                <span className="text-sm text-gray-700 ml-2">Box = 25%-75% quartiles, Line = median</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-sm text-gray-700">Point = average value</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Low Event Chart */}
              <div>
                <h3 className="text-lg font-medium text-center mb-2 text-gray-700">Low Events</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={areaDistributionData[0].data}
                      margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis 
                        domain={getDistributionYAxisRange(selectedYearGroup)}
                        label={{ value: `Max Outflow (cms)`, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                        tick={{ fontSize: 11 }}
                      />
                      <Tooltip 
                        formatter={(value) => [value.toFixed(4), 'Value']}
                        cursor={{ strokeDasharray: '3 3' }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-3 rounded shadow-lg border border-gray-200">
                                <div className="font-semibold text-gray-800 mb-1">{data.name} - Low</div>
                                <div className="text-sm">
                                  <div>Min: {data.min.toFixed(4)} cms</div>
                                  <div>Max: {data.max.toFixed(4)} cms</div>
                                  <div>Median: {data.median.toFixed(4)} cms</div>
                                  <div>Average: {data.avg.toFixed(4)} cms</div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      
                      {/* Box for min-max range */}
                      <Area 
                        type="monotone" 
                        dataKey="min" 
                        stackId="1" 
                        stroke="none" 
                        fill="rgba(0,0,0,0)" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="q1" 
                        stackId="1" 
                        stroke="none" 
                        fill="rgba(0,86,179,0.1)" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="median" 
                        stackId="1" 
                        stroke="#0056b3" 
                        strokeWidth={2}
                        fill="rgba(0,86,179,0.2)" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="q3" 
                        stackId="1" 
                        stroke="none" 
                        fill="rgba(0,86,179,0.1)" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="max" 
                        stackId="1" 
                        stroke="none" 
                        fill="rgba(0,0,0,0)" 
                      />
                      
                      {/* Line for average */}
                      <Line 
                        type="monotone" 
                        dataKey="avg" 
                        stroke="#007bff" 
                        strokeWidth={0} 
                        dot={{ 
                          r: 5, 
                          fill: '#2196F3',
                          strokeWidth: 1,
                          stroke: '#0056b3'
                        }}
                        activeDot={{ r: 7 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Peak Event Chart */}
              <div>
                <h3 className="text-lg font-medium text-center mb-2 text-gray-700">Peak Events</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={areaDistributionData[1].data}
                      margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis 
                        domain={getDistributionYAxisRange(selectedYearGroup)}
                        label={{ value: `Max Outflow (cms)`, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                        tick={{ fontSize: 11 }}
                      />
                      <Tooltip 
                        formatter={(value) => [value.toFixed(4), 'Value']}
                        cursor={{ strokeDasharray: '3 3' }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-3 rounded shadow-lg border border-gray-200">
                                <div className="font-semibold text-gray-800 mb-1">{data.name} - Peak</div>
                                <div className="text-sm">
                                  <div>Min: {data.min.toFixed(4)} cms</div>
                                  <div>Max: {data.max.toFixed(4)} cms</div>
                                  <div>Median: {data.median.toFixed(4)} cms</div>
                                  <div>Average: {data.avg.toFixed(4)} cms</div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      
                      {/* Box for min-max range */}
                      <Area 
                        type="monotone" 
                        dataKey="min" 
                        stackId="1" 
                        stroke="none" 
                        fill="rgba(0,0,0,0)" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="q1" 
                        stackId="1" 
                        stroke="none" 
                        fill="rgba(220,53,69,0.1)" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="median" 
                        stackId="1" 
                        stroke="#dc3545" 
                        strokeWidth={2}
                        fill="rgba(220,53,69,0.2)" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="q3" 
                        stackId="1" 
                        stroke="none" 
                        fill="rgba(220,53,69,0.1)" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="max" 
                        stackId="1" 
                        stroke="none" 
                        fill="rgba(0,0,0,0)" 
                      />
                      
                      {/* Line for average */}
                      <Line 
                        type="monotone" 
                        dataKey="avg" 
                        stroke="#dc3545" 
                        strokeWidth={0} 
                        dot={{ 
                          r: 5, 
                          fill: '#dc3545',
                          strokeWidth: 1,
                          stroke: '#b02a37'
                        }}
                        activeDot={{ r: 7 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2 text-gray-800">Key Statistics</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded-lg overflow-hidden">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Scenario</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Type</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Min</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Max</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Average</th>
                      </tr>
                    </thead>
                    <tbody>
                      {areaDistributionData[0].data.map((item, index) => (
                        <tr key={`low-${index}`} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="px-3 py-2 text-xs text-gray-800 font-medium">{item.name}</td>
                          <td className="px-3 py-2 text-xs text-gray-800">Low</td>
                          <td className="px-3 py-2 text-xs text-gray-800">{item.min.toFixed(3)}</td>
                          <td className="px-3 py-2 text-xs text-gray-800">{item.max.toFixed(3)}</td>
                          <td className="px-3 py-2 text-xs text-gray-800">{item.avg.toFixed(3)}</td>
                        </tr>
                      ))}
                      {areaDistributionData[1].data.map((item, index) => (
                        <tr key={`peak-${index}`} className={index % 2 === 1 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="px-3 py-2 text-xs text-gray-800 font-medium">{item.name}</td>
                          <td className="px-3 py-2 text-xs text-gray-800">Peak</td>
                          <td className="px-3 py-2 text-xs text-gray-800">{item.min.toFixed(3)}</td>
                          <td className="px-3 py-2 text-xs text-gray-800">{item.max.toFixed(3)}</td>
                          <td className="px-3 py-2 text-xs text-gray-800">{item.avg.toFixed(3)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2 text-gray-800">Key Insights</h3>
                {selectedYearGroup === '2yr' ? (
                  <ul className="list-disc pl-6 space-y-2 text-sm text-gray-800">
                    <li>The <span className="font-medium">Urban</span> scenario shows the highest peak flow values (2.43 cms).</li>
                    <li>The <span className="font-medium">Current</span> conditions have the lowest outflow values across both low and peak events.</li>
                    <li>The <span className="font-medium">Replant</span> strategy is more effective for peak events, showing ~4.2% reduction from baseline.</li>
                    <li>The relative difference between low and peak events stays consistent across all scenarios.</li>
                  </ul>
                ) : (
                  <ul className="list-disc pl-6 space-y-2 text-sm text-gray-800">
                    <li>All future scenarios show dramatically higher values (~60%+) compared to current conditions.</li>
                    <li>The <span className="font-medium">Replant</span> scenario offers minimal reduction for extreme 200-year events.</li>
                    <li>The <span className="font-medium">Urban</span> development impact becomes less significant at 200-year peak events.</li>
                    <li>The gap between low and peak values is much wider than in 2-year return periods.</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'percentage' && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Percentage Change from 2050 Baseline</h2>
            <p className="text-gray-600 mb-6 text-sm italic">Calculated from summary values representing multiple return periods</p>
            
            <div 
              className="bg-blue-50 p-4 rounded-lg mb-6 border-l-4 border-blue-500"
              onMouseEnter={() => setChartHover('percent')}
              onMouseLeave={() => setChartHover(null)}
            >
              <p className={`transition-opacity duration-300 ${chartHover === 'percent' ? 'opacity-100' : 'opacity-70'}`}>
                This chart shows how the Urban and Replant scenarios compare to the 2050 Baseline in percentage terms.
                Negative values indicate reduced outflow compared to the baseline scenario.
              </p>
            </div>
            
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={percentageChangeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="category" 
                    angle={-30} 
                    textAnchor="end" 
                    tick={{ fontSize: 12 }}
                    height={60}
                  />
                  <YAxis 
                    label={{ value: 'Change from Baseline (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                    tick={{ fontSize: 12 }}
                    domain={[-6, 2]}
                    tickFormatter={(value) => `${value.toFixed(1)}%`}
                  />
                  <Tooltip content={<PercentageTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
                  <Legend wrapperStyle={{ paddingTop: 20 }} />
                  <Bar dataKey="Urban" name="Urban vs 2050" fill="#dc3545" radius={[4, 4, 0, 0]} isAnimationActive={true} />
                  <Bar dataKey="Replant" name="Replant vs 2050" fill="#17a2b8" radius={[4, 4, 0, 0]} isAnimationActive={true} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        
        {activeTab === 'trends' && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Trend Analysis: Scenario Changes Across Events</h2>
            <p className="text-gray-600 mb-4 text-sm italic">
              Showing percentage change from current conditions
            </p>
            
            <div 
              className="bg-blue-50 p-4 rounded-lg mb-6 border-l-4 border-blue-500"
              onMouseEnter={() => setChartHover('trends')}
              onMouseLeave={() => setChartHover(null)}
            >
              <p className={`transition-opacity duration-300 ${chartHover === 'trends' ? 'opacity-100' : 'opacity-70'}`}>
                This visualization shows how the impact of different scenarios changes across rainfall event severities.
                The chart displays percentage changes relative to current conditions, highlighting how climate change and land use 
                strategies affect water outflows differently across event scales.
              </p>
            </div>
            
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trendData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    angle={-30} 
                    textAnchor="end" 
                    tick={{ fontSize: 12 }}
                    height={60}
                  />
                  <YAxis 
                    label={{ value: 'Change from Current (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                    domain={[0, 70]}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    formatter={(value, name, props) => {
                      // For percentage values
                      return [`${parseFloat(value).toFixed(1)}%`, name];
                    }}
                    labelFormatter={(value) => `Return Period: ${value}`}
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '6px' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: 20 }} />
                  
                  {/* Display order matters - rendering from bottom to top */}
                  <Line 
                    type="monotone" 
                    dataKey="Urban" 
                    name="Urban Development"
                    stroke="#dc3545" 
                    dot={{ r: 6, strokeWidth: 2 }}
                    strokeWidth={3}
                    activeDot={{ r: 8 }}
                  />
                  
                  <Line 
                    type="monotone" 
                    dataKey="Replant" 
                    name="Replanting Efforts"
                    stroke="#17a2b8" 
                    dot={{ r: 6, strokeWidth: 2 }}
                    strokeWidth={3}
                    activeDot={{ r: 8 }}
                  />
                  
                  <Line 
                    type="monotone" 
                    dataKey="Baseline" 
                    name="2050 Baseline (ViT)"
                    stroke="#fd7e14" 
                    dot={{ r: 6, strokeWidth: 2 }}
                    strokeWidth={3}
                    activeDot={{ r: 8 }}
                  />
                  
                  {/* Reference line for current conditions (0% change) */}
                  <Line 
                    type="monotone" 
                    dataKey="Current" 
                    name="Current Conditions"
                    stroke="#0056b3" 
                    dot={{ r: 6, strokeWidth: 2 }}
                    strokeWidth={3}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2 text-gray-800">Key Observations</h3>
                <ul className="list-disc pl-6 space-y-2 text-sm text-gray-800">
                  <li>The impact of <span className="font-medium text-orange-600">climate change (2050 baseline)</span> increases with rainfall severity - up to <span className="font-medium">45%</span> higher outflow for 200-year events.</li>
                  <li><span className="font-medium text-teal-600">Replanting efforts</span> are most effective at reducing outflow during smaller events (2-year return periods).</li>
                  <li><span className="font-medium text-red-600">Urban development</span> shows minimal additional impact at extreme events (200-year peak).</li>
                  <li>All future scenarios converge at extreme events, suggesting limited mitigation options for the most severe rainfall scenarios.</li>
                </ul>
              </div>
              
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2 text-gray-800">Implications</h3>
                <ul className="list-disc pl-6 space-y-2 text-sm text-gray-800">
                  <li>Planning for <span className="font-medium">greater outflow capacity</span> is critical across all future scenarios.</li>
                  <li>The most dramatic increases in outflow occur between current conditions and the 2050 baseline.</li>
                  <li>Mitigation strategies have diminishing returns as rainfall severity increases.</li>
                  <li>Under 200-year peak events, all climate scenarios produce over <span className="font-medium">45% more outflow</span> compared to current conditions.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-gray-400 text-sm">
            Max Outflow Uncertainty Dashboard | Created with React & Recharts | Data from uncertainty.csv
          </p>
        </div>
      </footer>
    </div>
  );
}

window.ModernWaterDashboard = ModernWaterDashboard;