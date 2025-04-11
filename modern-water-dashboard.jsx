import { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { AreaChart, Area } from 'recharts';
import { ReferenceArea } from 'recharts';

// Component for the modern dashboard
function ModernWaterDashboard() {
  // State for active tabs and UI interaction
  const [activeTab, setActiveTab] = useState('raw');
  const [chartHover, setChartHover] = useState(null);
  const [selectedYearGroup, setSelectedYearGroup] = useState('2yr'); // '2yr' or '200yr'
  const [comparisonMode, setComparisonMode] = useState('grouped'); // 'grouped' or 'stacked'
  
  // State for chart zooming
  const [trendZoom, setTrendZoom] = useState({
    left: 'dataMin',
    right: 'dataMax',
    top: 'dataMax + 5',
    bottom: 'dataMin - 5',
    refAreaLeft: '',
    refAreaRight: ''
  });
  
  // State for distribution tab zooming
  const [distributionZoom, setDistributionZoom] = useState({
    lowDomain: null,
    peakDomain: null
  });

    // Data loaded from Excel (using globals)
  const rawOutflowData = window.rawOutflowData || [];
  const percentageChangeData = window.percentageChangeData || [];
  const trendData = window.trendData || [];
  const boxPlotData = window.boxPlotData || {};

  // Poll for data availability and show a loading state if not ready
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.rawOutflowData && window.rawOutflowData.length > 0) {
        setDataLoaded(true);
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);
  
  // Animation functions for distribution tab
  const animateDistribution = () => {
    setIsAnimating(true);
    // Animation will be handled in the component render
    setTimeout(() => setIsAnimating(false), 3000);
  };
  
  // Auto-trigger animation when distribution tab is activated
  useEffect(() => {
    if (activeTab === 'distribution' && dataLoaded) {
      // Short delay to ensure components are rendered
      setTimeout(() => {
        animateDistribution();
      }, 500);
    }
  }, [activeTab, dataLoaded]);
  
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
            name: '2025 Baseline', 
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
            name: '2025 Baseline', 
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

  // Modern custom tooltip for the bar chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const entry = payload[0];
      const bgColor = entry.color + '10'; // Add slight transparency to the background color
      
      return (
        <div className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-md p-4 rounded-lg shadow-lg border border-gray-100" 
          style={{ 
            minWidth: '220px', 
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            borderLeft: `4px solid ${entry.color}`
          }}>
          <div className="font-semibold text-gray-800 text-base mb-2 pb-2 border-b border-gray-100">{label}</div>
          <div style={{ color: entry.color }} className="text-base font-medium flex items-center">
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: entry.color, marginRight: '8px' }}></div>
            {entry.name}: {entry.value.toFixed(2)} cms
          </div>
        </div>
      );
    }
    return null;
  };
  
  // Modern custom tooltip for the percentage chart
  const PercentageTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Only show the first item in the payload (the one being hovered)
      const entry = payload[0];
      const valueColor = entry.value < 0 ? '#10b981' : '#ef4444'; // Green for negative values (improvements), red for positive
      
      return (
        <div className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-md p-4 rounded-lg shadow-lg border border-gray-100"
          style={{ 
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            borderLeft: `4px solid ${entry.color}`
          }}>
          <p className="font-semibold text-gray-800 pb-2 border-b border-gray-100">{label}</p>
          <div className="mt-2 flex items-center">
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: entry.color, marginRight: '8px' }}></div>
            <span style={{ color: entry.color }} className="font-medium mr-2">{entry.name}:</span>
            <span style={{ color: valueColor }} className="font-bold">{entry.value.toFixed(2)}%</span>
          </div>
          <p className="text-xs text-gray-500 mt-1 italic">
            {entry.value < 0 ? 'Reduction' : 'Increase'} from 2050 baseline
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{
      backgroundImage: `
        radial-gradient(circle at 20% 35%, rgba(37, 99, 235, 0.03) 0%, transparent 50%),
        radial-gradient(circle at 75% 80%, rgba(14, 165, 233, 0.03) 0%, transparent 50%),
        linear-gradient(135deg, rgba(240, 249, 255, 0.5) 0%, transparent 100%)
      `,
      backgroundAttachment: 'fixed'
    }}>
      {/* Modern Glass Header */}
      <header className="bg-gray-900 bg-opacity-95 backdrop-filter backdrop-blur-md text-white py-3 px-4 shadow-md flex items-center h-16 sticky top-0 z-50">
        <div className="max-w-full w-full mx-auto flex justify-between items-center">
          <h1 className="text-lg font-medium flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-blue-400 mr-2"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg>
            <span className="text-blue-400 font-semibold">Madias Creek Watershed</span> 
            <span className="ml-2 opacity-90">ʔakisq̓nuk Territory Analysis</span>
          </h1>
          <div className="text-xs text-gray-300 flex items-center">
            <span className="bg-blue-800 bg-opacity-30 px-3 py-1.5 rounded-md mr-2 font-medium flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 mr-1.5"><path d="M5.12 17.76l7.07-7.06l7.07 7.06M5.12 11.29l7.07-7.07l7.07 7.07"></path></svg>
              Hydrologic Assessment
            </span>
          </div>
        </div>
      </header>
      
      {/* Modern Main Content with Glass Container */}
      <main className="max-w-6xl mx-auto py-6 px-4">
        {/* Modern Navigation Tabs with Icons */}
        <div className="flex flex-wrap mb-6 gap-2 border-b border-gray-200 pb-2">
          <button 
            onClick={() => setActiveTab('raw')} 
            className={`px-4 py-2.5 font-medium text-xs sm:text-sm rounded-lg mr-1 transition-all flex items-center ${
              activeTab === 'raw' 
                ? 'bg-white shadow-sm border-b-2 border-blue-600 text-blue-700 transform translate-y-0.5' 
                : 'bg-gray-100 bg-opacity-70 text-gray-600 hover:bg-gray-200 hover:text-gray-700'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
            Scenario Comparison
          </button>
          <button 
            onClick={() => setActiveTab('distribution')} 
            className={`px-4 py-2.5 font-medium text-xs sm:text-sm rounded-lg mr-1 transition-all flex items-center ${
              activeTab === 'distribution' 
                ? 'bg-white shadow-sm border-b-2 border-blue-600 text-blue-700 transform translate-y-0.5' 
                : 'bg-gray-100 bg-opacity-70 text-gray-600 hover:bg-gray-200 hover:text-gray-700'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><path d="M3 3v18h18"></path><path d="M18 12H6"></path><path d="M18 7H6"></path><path d="M18 17H6"></path></svg>
            Distribution Analysis
          </button>
          <button 
            onClick={() => setActiveTab('percentage')} 
            className={`px-4 py-2.5 font-medium text-xs sm:text-sm rounded-lg mr-1 transition-all flex items-center ${
              activeTab === 'percentage' 
                ? 'bg-white shadow-sm border-b-2 border-blue-600 text-blue-700 transform translate-y-0.5' 
                : 'bg-gray-100 bg-opacity-70 text-gray-600 hover:bg-gray-200 hover:text-gray-700'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><path d="M19 5L5 19"></path><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg>
            Percentage Change
          </button>
          <button 
            onClick={() => setActiveTab('trends')} 
            className={`px-4 py-2.5 font-medium text-xs sm:text-sm rounded-lg transition-all flex items-center ${
              activeTab === 'trends' 
                ? 'bg-white shadow-sm border-b-2 border-blue-600 text-blue-700 transform translate-y-0.5' 
                : 'bg-gray-100 bg-opacity-70 text-gray-600 hover:bg-gray-200 hover:text-gray-700'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
            Trend Analysis
          </button>
        </div>
        
        {/* Comparison Mode Toggle */}
        {activeTab === 'raw' && (
          <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem'}}>
            <div className="feature-toggle" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(241, 245, 249, 0.7)', padding: '0.4rem 0.7rem', borderRadius: '6px', fontSize: '0.8rem', color: '#475569'}}>
              <span>Comparison Mode:</span>
              <select 
                value={comparisonMode}
                onChange={(e) => setComparisonMode(e.target.value)}
                style={{background: 'white', border: '1px solid #e2e8f0', padding: '0.3rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', color: '#334155'}}
              >
                <option value="grouped">Grouped</option>
                <option value="stacked">Stacked</option>
              </select>
            </div>
          </div>
        )}
        
        {/* Chart Containers */}
        {activeTab === 'raw' && (
          <div className="bg-white bg-opacity-95 backdrop-filter backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6 border border-gray-100 transform transition-all hover:shadow-xl hover:translate-y-[-2px]">
            <h2 className="text-xl font-semibold mb-1 bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">Climate & Land-Use Scenario Impacts</h2>
            <p className="text-gray-600 mb-4 text-xs italic">Summary values representing multiple return periods</p>
            
            <div 
              className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg mb-5 border border-blue-200" 
              style={{ position: 'relative', overflow: 'hidden' }}
              onMouseEnter={() => setChartHover('raw')}
              onMouseLeave={() => setChartHover(null)}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, width: '5px', height: '100%', background: 'linear-gradient(to bottom, #2563eb, #60a5fa)' }}></div>
              <p className={`transition-opacity duration-300 text-sm ml-2 ${chartHover === 'raw' ? 'opacity-100' : 'opacity-70'}`}>
                This chart compares the absolute maximum outflow values (in cms) across all scenarios and return periods. 
                Higher values indicate increased water flow volume during rainfall events.
              </p>
            </div>
            
            <div className="h-[450px]"> {/* Increased height for better visualization */}
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
                  <Legend 
                    wrapperStyle={{ paddingTop: 20 }} 
                    iconType="circle"
                    iconSize={8}
                  />
                  <Bar 
                    dataKey="Current" 
                    name="2025 Baseline" 
                    fill="#2563eb" 
                    radius={[4, 4, 0, 0]} 
                    isAnimationActive={true} 
                    stackId={comparisonMode === 'stacked' ? 'stack' : undefined}
                  />
                  <Bar 
                    dataKey="Baseline" 
                    name="2050 Baseline (ViT)" 
                    fill="#f59e0b" 
                    radius={[4, 4, 0, 0]} 
                    isAnimationActive={true} 
                    stackId={comparisonMode === 'stacked' ? 'stack' : undefined}
                  />
                  <Bar 
                    dataKey="Replant" 
                    name="Replanting Efforts" 
                    fill="#0ea5e9" 
                    radius={[4, 4, 0, 0]} 
                    isAnimationActive={true} 
                    stackId={comparisonMode === 'stacked' ? 'stack' : undefined}
                  />
                  <Bar 
                    dataKey="Urban" 
                    name="Urban Development" 
                    fill="#ef4444" 
                    radius={[4, 4, 0, 0]} 
                    isAnimationActive={true} 
                    stackId={comparisonMode === 'stacked' ? 'stack' : undefined}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Insight Cards */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-white rounded-lg shadow-sm border border-blue-100 p-4 transition-transform duration-300 hover:shadow-md hover:translate-y-[-2px]">
                <div className="absolute top-0 right-0 bg-blue-100 text-blue-700 px-2 py-1 text-xs font-medium rounded-bl-lg">KEY INSIGHT</div>
                <h3 className="text-sm font-semibold text-blue-700 mt-2">Replanting Effectiveness</h3>
                <p className="text-xs text-gray-600 mt-1">Replanting efforts show a notable reduction in peak flow rates compared to the 2050 baseline, especially during moderate rainfall events.</p>
              </div>
              
              <div className="relative overflow-hidden bg-gradient-to-r from-amber-50 to-white rounded-lg shadow-sm border border-amber-100 p-4 transition-transform duration-300 hover:shadow-md hover:translate-y-[-2px]">
                <div className="absolute top-0 right-0 bg-amber-100 text-amber-700 px-2 py-1 text-xs font-medium rounded-bl-lg">FORECAST</div>
                <h3 className="text-sm font-semibold text-amber-700 mt-2">Climate Change Impact</h3>
                <p className="text-xs text-gray-600 mt-1">The 2050 baseline shows increased flow rates across all return periods, with the most significant increases in extreme events.</p>
              </div>
              
              <div className="relative overflow-hidden bg-gradient-to-r from-red-50 to-white rounded-lg shadow-sm border border-red-100 p-4 transition-transform duration-300 hover:shadow-md hover:translate-y-[-2px]">
                <div className="absolute top-0 right-0 bg-red-100 text-red-700 px-2 py-1 text-xs font-medium rounded-bl-lg">WARNING</div>
                <h3 className="text-sm font-semibold text-red-700 mt-2">Urban Development Risk</h3>
                <p className="text-xs text-gray-600 mt-1">Urban development scenarios show the highest peak flows, increasing flood risk in downstream communities by up to 4%.</p>
              </div>
              
              <div className="relative overflow-hidden bg-gradient-to-r from-green-50 to-white rounded-lg shadow-sm border border-green-100 p-4 transition-transform duration-300 hover:shadow-md hover:translate-y-[-2px]">
                <div className="absolute top-0 right-0 bg-green-100 text-green-700 px-2 py-1 text-xs font-medium rounded-bl-lg">RECOMMENDATION</div>
                <h3 className="text-sm font-semibold text-green-700 mt-2">Mitigation Strategy</h3>
                <p className="text-xs text-gray-600 mt-1">Combined approach of replanting and flow control structures could offset expected climate change impacts in 2-year events.</p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'distribution' && (
          <div className="bg-white bg-opacity-95 backdrop-filter backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6 border border-gray-100 transform transition-all hover:shadow-xl hover:translate-y-[-2px]">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-1 bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                Distribution Analysis ({selectedYearGroup === '2yr' ? '2-Year' : '200-Year'} Return Period)
              </h2>
              <p className="text-gray-600 text-xs italic">Combined low and peak scenario distribution</p>
            </div>
            
            {/* Period selector with modern styling */}
            <div className="flex flex-wrap mb-5">
              <button 
                onClick={() => setSelectedYearGroup('2yr')} 
                className={`px-4 py-2 mr-3 mb-2 text-sm rounded-full transition-all ${
                  selectedYearGroup === '2yr' 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center">
                  {selectedYearGroup === '2yr' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  )}
                  2-Year Return Period
                </div>
              </button>
              <button 
                onClick={() => setSelectedYearGroup('200yr')} 
                className={`px-4 py-2 mb-2 text-sm rounded-full transition-all ${
                  selectedYearGroup === '200yr' 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center">
                  {selectedYearGroup === '200yr' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  )}
                  200-Year Return Period
                </div>
              </button>
            </div>
            
            <div 
              className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg mb-5 border border-blue-200" 
              style={{ position: 'relative', overflow: 'hidden' }}
              onMouseEnter={() => setChartHover('dist')}
              onMouseLeave={() => setChartHover(null)}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, width: '5px', height: '100%', background: 'linear-gradient(to bottom, #2563eb, #60a5fa)' }}></div>
              <p className={`transition-opacity duration-300 text-sm ml-2 ${chartHover === 'dist' ? 'opacity-100' : 'opacity-70'}`}>
                This chart visualizes the statistical distribution of max outflow values for both low and peak events in
                the {selectedYearGroup === '2yr' ? '2-year' : '200-year'} return period. Each chart shows min/max range, 
                quartiles (colored areas), median (line), and average values (dots).
              </p>
            </div>

            <div className="flex items-center justify-center mb-4">
                <div className="text-xs text-gray-500 flex items-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    Double-click to reset view
                </div>
              <div className="flex items-center mr-4">
                <div className="w-14 h-5 bg-blue-100 border border-blue-500 flex items-center justify-center">
                  <div className="w-14 h-px bg-blue-700"></div>
                </div>
                <span className="text-xs text-gray-700 ml-1">Box = 25%-75% quartiles, Line = median</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-xs text-gray-700">Point = average value</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Low Event Chart */}
              <div>
                <h3 className="text-md font-medium text-center mb-1 text-gray-700">Low Events</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={areaDistributionData[0].data}
                      margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                      onDoubleClick={() => setDistributionZoom({...distributionZoom, lowDomain: null})}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis 
                        domain={distributionZoom.lowDomain || getDistributionYAxisRange(selectedYearGroup)}
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
                        isAnimationActive={true}
                        animationDuration={isAnimating ? 2000 : 300}
                        animationEasing="ease-out"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="q1" 
                        stackId="1" 
                        stroke="none" 
                        fill="rgba(0,86,179,0.1)"
                        isAnimationActive={true}
                        animationDuration={isAnimating ? 2000 : 300}
                        animationEasing="ease-out"
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
                <h3 className="text-md font-medium text-center mb-1 text-gray-700">Peak Events</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={areaDistributionData[1].data}
                      margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                      onDoubleClick={() => setDistributionZoom({...distributionZoom, peakDomain: null})}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis 
                        domain={distributionZoom.lowDomain || getDistributionYAxisRange(selectedYearGroup)}
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
                        isAnimationActive={true}
                        animationDuration={isAnimating ? 2000 : 300}
                        animationEasing="ease-out"
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
                    <li>The <span className="font-medium">2025 Baseline</span> conditions have the lowest outflow values across both low and peak events.</li>
                    <li>The <span className="font-medium">Replant</span> strategy is more effective for peak events, showing ~4.2% reduction from baseline.</li>
                    <li>The relative difference between low and peak events stays consistent across all scenarios.</li>
                  </ul>
                ) : (
                  <ul className="list-disc pl-6 space-y-2 text-sm text-gray-800">
                    <li>All future scenarios show dramatically higher values (~60%+) compared to 2025 baseline conditions.</li>
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
          <div className="bg-white bg-opacity-95 backdrop-filter backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6 border border-gray-100 transform transition-all hover:shadow-xl hover:translate-y-[-2px]">
            <h2 className="text-xl font-semibold mb-1 bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">Percentage Change from 2050 Baseline</h2>
            <p className="text-gray-600 mb-4 text-xs italic">Calculated from summary values representing multiple return periods</p>
            
            <div 
              className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg mb-5 border border-blue-200" 
              style={{ position: 'relative', overflow: 'hidden' }}
              onMouseEnter={() => setChartHover('percent')}
              onMouseLeave={() => setChartHover(null)}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, width: '5px', height: '100%', background: 'linear-gradient(to bottom, #2563eb, #60a5fa)' }}></div>
              <p className={`transition-opacity duration-300 text-sm ml-2 ${chartHover === 'percent' ? 'opacity-100' : 'opacity-70'}`}>
                This chart shows how the Urban and Replant scenarios compare to the 2050 Baseline in percentage terms.
                Negative values indicate reduced outflow compared to the baseline scenario.
              </p>
            </div>
            
            <div className="h-[450px]"> {/* Increased height for better visualization */}
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
          <div className="bg-white bg-opacity-95 backdrop-filter backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6 border border-gray-100 transform transition-all hover:shadow-xl hover:translate-y-[-2px]">
            <h2 className="text-xl font-semibold mb-1 bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">Trend Analysis: Scenario Changes Across Events</h2>
            <p className="text-gray-600 mb-4 text-xs italic">
              Showing percentage change from current conditions
            </p>
            
            <div 
              className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg mb-5 border border-blue-200" 
              style={{ position: 'relative', overflow: 'hidden' }}
              onMouseEnter={() => setChartHover('trends')}
              onMouseLeave={() => setChartHover(null)}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, width: '5px', height: '100%', background: 'linear-gradient(to bottom, #2563eb, #60a5fa)' }}></div>
              <p className={`transition-opacity duration-300 text-sm ml-2 ${chartHover === 'trends' ? 'opacity-100' : 'opacity-70'}`}>
                This visualization shows how the impact of different scenarios changes across rainfall event severities.
                The chart displays percentage changes relative to current conditions, highlighting how climate change and land use 
                strategies affect water outflows differently across event scales.
              </p>
            </div>
            
            <div className="h-[450px]"> {/* Increased height for better visualization */}
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trendData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  onMouseDown={(e) => {
                    if (e && e.activeLabel) {
                      setTrendZoom(prev => ({...prev, refAreaLeft: e.activeLabel}));
                    }
                  }}
                  onMouseMove={(e) => {
                    if (trendZoom.refAreaLeft && e && e.activeLabel) {
                      setTrendZoom(prev => ({...prev, refAreaRight: e.activeLabel}));
                    }
                  }}
                  onMouseUp={() => {
                    if (trendZoom.refAreaLeft && trendZoom.refAreaRight) {
                      // Calculate new zoom bounds
                      let nameIndices = trendData.map(item => item.name);
                      let leftIndex = nameIndices.indexOf(trendZoom.refAreaLeft);
                      let rightIndex = nameIndices.indexOf(trendZoom.refAreaRight);
                      
                      // Ensure left is before right
                      if (leftIndex > rightIndex) {
                        [leftIndex, rightIndex] = [rightIndex, leftIndex];
                      }
                      
                      // Get the values in the selected range
                      let yValues = [];
                      trendData.slice(leftIndex, rightIndex + 1).forEach(item => {
                        yValues.push(item.Baseline || 0);
                        yValues.push(item.Replant || 0);
                        yValues.push(item.Urban || 0);
                      });
                      
                      let maxY = Math.max(...yValues.filter(v => !isNaN(v)));
                      let minY = Math.min(...yValues.filter(v => !isNaN(v)));
                      
                      // Add padding to Y domain
                      minY = Math.max(0, minY - 5); // Ensure not below 0
                      maxY = maxY + 5;
                      
                      setTrendZoom({
                        refAreaLeft: '',
                        refAreaRight: '',
                        left: nameIndices[leftIndex],
                        right: nameIndices[rightIndex],
                        bottom: minY,
                        top: maxY
                      });
                    }
                  }}
                  onDoubleClick={() => {
                    // Reset zoom
                    setTrendZoom({
                      left: 'dataMin',
                      right: 'dataMax',
                      top: 'dataMax + 5',
                      bottom: 'dataMin - 5',
                      refAreaLeft: '',
                      refAreaRight: ''
                    });
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    angle={-30} 
                    textAnchor="end" 
                    tick={{ fontSize: 12 }}
                    height={60}
                    domain={[trendZoom.left, trendZoom.right]}
                  />
                  <YAxis 
                    label={{ value: 'Change from Current (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                    domain={[trendZoom.bottom, trendZoom.top]}
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
                  
                  {/* Selection area for zoom */}
                  {trendZoom.refAreaLeft && trendZoom.refAreaRight ? (
                    <ReferenceArea
                      x1={trendZoom.refAreaLeft}
                      x2={trendZoom.refAreaRight}
                      strokeOpacity={0.3}
                      fill="#0056b380" 
                    />
                  ) : null}
                  
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
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-center text-sm text-gray-500">
              <p>Click and drag to zoom in on an area. Double-click to reset zoom.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <h3 className="font-semibold text-md mb-1 text-gray-800">Key Observations</h3>
                <ul className="list-disc pl-6 space-y-2 text-sm text-gray-800">
                  <li>The impact of <span className="font-medium text-orange-600">climate change (2050 baseline)</span> increases with rainfall severity - up to <span className="font-medium">45%</span> higher outflow for 200-year events.</li>
                  <li><span className="font-medium text-teal-600">Replanting efforts</span> are most effective at reducing outflow during smaller events (2-year return periods).</li>
                  <li><span className="font-medium text-red-600">Urban development</span> shows minimal additional impact at extreme events (200-year peak).</li>
                  <li>All future scenarios converge at extreme events, suggesting limited mitigation options for the most severe rainfall scenarios.</li>
                </ul>
              </div>
              
              <div className="bg-gray-100 p-3 rounded-lg">
                <h3 className="font-semibold text-md mb-1 text-gray-800">Implications</h3>
                <ul className="list-disc pl-6 space-y-2 text-sm text-gray-800">
                  <li>Planning for <span className="font-medium">greater outflow capacity</span> is critical across all future scenarios.</li>
                  <li>The most dramatic increases in outflow occur between 2025 baseline and the 2050 baseline.</li>
                  <li>Mitigation strategies have diminishing returns as rainfall severity increases.</li>
                  <li>Under 200-year peak events, all climate scenarios produce over <span className="font-medium">45% more outflow</span> compared to 2025 baseline conditions.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Modern Glass Footer */}
      <footer className="bg-gray-900 bg-opacity-95 backdrop-filter backdrop-blur-md text-white py-4 px-4 shadow-inner border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <p className="text-gray-300 text-sm mb-1">
              Madias Creek Watershed Analysis Dashboard • Created for ʔakisq̓nuk First Nation & RDEK
            </p>
            <p className="text-gray-400 text-xs">
              Data from HEC-HMS modeling with GEOG 508 • Last updated April 2025
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Created by: Ali, Harrison, Adara, Kingsley
            </p>
            <div className="mt-3 flex justify-center space-x-4 text-xs text-gray-500">
              <span className="hover:text-blue-400 transition-colors duration-200 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                GitHub
              </span>
              <span className="hover:text-blue-400 transition-colors duration-200 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                Contact
              </span>
              <span className="hover:text-blue-400 transition-colors duration-200 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                Documentation
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

window.ModernWaterDashboard = ModernWaterDashboard;