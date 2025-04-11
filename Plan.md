<Plan>
Focus on visual and aesthetic improvements for the water dashboard including:
1. Enhanced color scheme with modern blue gradient
2. Improved chart styling with consistent colors and better tooltips
3. Modern card design with subtle shadows and rounded corners
4. Smooth animations for tab transitions and chart rendering
5. Improved typography for better readability
6. Loading animation enhancements
</Plan>

<file path="/Users/alikara/Desktop/508 website/index.html" action="modify">
  <change>
    <description>Enhance header and overall styling with modern gradient and improved typography</description>
    <search>
===
  <style>
    /* Keep existing styles for overall layout and non-React tabs */
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f8f9fa;
      color: #333;
    }
    
    .header {
      background: linear-gradient(to right, #0d47a1, #1976d2);
      color: white;
      padding: 2rem 1rem;
      text-align: center;
    }
===
    </search>
    <content>
===
  <style>
    /* Keep existing styles for overall layout and non-React tabs */
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f5f7fa;
      color: #333;
      line-height: 1.6;
    }
    
    .header {
      background: linear-gradient(135deg, #0d47a1, #1976d2, #2196f3);
      color: white;
      padding: 2.5rem 1rem;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      position: relative;
      overflow: hidden;
    }
    
    .header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
      opacity: 0.2;
    }
    
    .header h1 {
      margin-bottom: 0.5rem;
      font-weight: 600;
      letter-spacing: -0.5px;
      font-size: 2.4rem;
    }
    
    .header p {
      max-width: 700px;
      margin: 0 auto;
      opacity: 0.9;
      font-size: 1.1rem;
    }
===
    </content>
  </change>
  
  <change>
    <description>Enhance tab styling for more modern look with animations</description>
    <search>
===
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }
    
    .tab-links {
      display: flex;
      flex-wrap: wrap;
      border-bottom: 1px solid #dee2e6;
      margin-bottom: 2rem;
    }
    
    .tab-link {
      padding: 0.75rem 1rem;
      cursor: pointer;
      background-color: #f1f1f1;
      border: none;
      border-radius: 5px 5px 0 0;
      margin-right: 0.5rem;
      margin-bottom: -1px; /* Overlap border */
      transition: all 0.3s;
      border: 1px solid transparent;
      border-bottom: none;
    }
    
    .tab-link.active {
      background-color: white;
      border-color: #dee2e6 #dee2e6 white;
      border-bottom: 3px solid #1976d2;
      color: #1976d2;
      font-weight: bold;
    }
    
    .tab-link:hover:not(.active) {
      background-color: #e9ecef;
    }
===
    </search>
    <content>
===
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2.5rem 1.5rem;
    }
    
    .tab-links {
      display: flex;
      flex-wrap: wrap;
      border-bottom: 1px solid rgba(0,0,0,0.08);
      margin-bottom: 2.5rem;
      padding-bottom: 3px;
    }
    
    .tab-link {
      padding: 0.8rem 1.2rem;
      cursor: pointer;
      background-color: transparent;
      border: none;
      border-radius: 8px 8px 0 0;
      margin-right: 0.75rem;
      margin-bottom: -1px; /* Overlap border */
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      position: relative;
      font-weight: 500;
      color: #6c757d;
      font-size: 0.95rem;
    }
    
    .tab-link.active {
      background-color: rgba(25, 118, 210, 0.04);
      color: #1976d2;
      font-weight: 600;
    }
    
    .tab-link.active::after {
      content: '';
      position: absolute;
      bottom: -3px;
      left: 0;
      width: 100%;
      height: 3px;
      background: linear-gradient(90deg, #1976d2, #42a5f5);
      border-radius: 3px 3px 0 0;
      animation: slideIn 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    
    @keyframes slideIn {
      from { transform: scaleX(0.6); opacity: 0.6; }
      to { transform: scaleX(1); opacity: 1; }
    }
    
    .tab-link:hover:not(.active) {
      background-color: rgba(0,0,0,0.03);
      color: #495057;
    }
===
    </content>
  </change>
  
  <change>
    <description>Improve tab content styling with modern card design</description>
    <search>
===
    .tab-content {
      display: none;
      background-color: white;
      padding: 2rem;
      border: 1px solid #dee2e6;
      border-top: none;
      border-radius: 0 5px 5px 5px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }
    
    .tab-content.active {
      display: block;
    }
===
    </search>
    <content>
===
    .tab-content {
      display: none;
      background-color: white;
      padding: 2.5rem;
      border-radius: 12px;
      box-shadow: 0 5px 20px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.05);
      margin-bottom: 2.5rem;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.4s ease-out;
    }
    
    .tab-content.active {
      display: block;
      opacity: 1;
      transform: translateY(0);
    }
===
    </content>
  </change>
  
  <change>
    <description>Enhance info boxes and cards with better styling</description>
    <search>
===
    .info-box {
      background-color: #e6f3ff;
      padding: 1rem;
      border-left: 4px solid #1976d2;
      border-radius: 4px;
      margin-bottom: 1.5rem;
    }
    
    .footer {
      background-color: #343a40;
      color: #adb5bd;
      padding: 1.5rem 1rem;
      text-align: center;
      margin-top: 2rem;
    }
    
    .grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    
    @media (min-width: 768px) {
      .grid {
        grid-template-columns: 1fr 1fr;
      }
    }
    
    .card {
      background-color: #f1f1f1;
      padding: 1.5rem;
      border-radius: 4px;
    }
===
    </search>
    <content>
===
    .info-box {
      background-color: rgba(33, 150, 243, 0.05);
      padding: 1.25rem;
      border-left: 4px solid #2196f3;
      border-radius: 8px;
      margin-bottom: 1.8rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.03);
      transition: all 0.3s ease;
    }
    
    .info-box:hover {
      background-color: rgba(33, 150, 243, 0.08);
      box-shadow: 0 3px 12px rgba(0,0,0,0.05);
    }
    
    .footer {
      background: linear-gradient(to right, #111827, #1f2937);
      color: #cbd5e1;
      padding: 2.5rem 1rem;
      text-align: center;
      margin-top: 3rem;
      box-shadow: 0 -1px 5px rgba(0,0,0,0.05);
    }
    
    .grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.8rem;
    }
    
    @media (min-width: 768px) {
      .grid {
        grid-template-columns: 1fr 1fr;
      }
    }
    
    .card {
      background-color: #ffffff;
      padding: 1.8rem;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .card:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 18px rgba(0,0,0,0.08);
    }
===
    </content>
  </change>
  
  <change>
    <description>Enhance typography and headings</description>
    <search>
===
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    table th, table td {
      padding: 0.5rem;
      text-align: left;
      border-bottom: 1px solid #dee2e6;
    }
    
    table th {
      background-color: #f1f1f1;
    }
    
    h1, h2, h3 {
      margin-top: 0;
    }
        
    .subtitle {
      font-style: italic;
      color: #6c757d;
      margin-bottom: 1.5rem;
    }
===
    </search>
    <content>
===
    table {
      width: 100%;
      border-collapse: collapse;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.03);
    }
    
    table th, table td {
      padding: 0.75rem 1rem;
      text-align: left;
      border-bottom: 1px solid rgba(0,0,0,0.05);
    }
    
    table th {
      background: linear-gradient(to bottom, #f8f9fa, #f1f3f5);
      font-weight: 600;
      color: #495057;
      position: relative;
    }
    
    table tbody tr:hover {
      background-color: rgba(0,0,0,0.01);
    }
    
    h1, h2, h3 {
      margin-top: 0;
      color: #1a202c;
      letter-spacing: -0.3px;
    }
    
    h2 {
      font-size: 1.75rem;
      margin-bottom: 0.6rem;
      font-weight: 600;
    }
    
    h3 {
      font-size: 1.35rem;
      margin-bottom: 1rem;
      font-weight: 600;
      color: #2d3748;
    }
        
    .subtitle {
      font-style: italic;
      color: #6c757d;
      margin-bottom: 1.8rem;
      font-size: 1.05rem;
      opacity: 0.85;
      border-bottom: 1px dashed rgba(0,0,0,0.08);
      padding-bottom: 0.8rem;
    }
===
    </content>
  </change>
  
  <change>
    <description>Add beautiful loading animation</description>
    <search>
===
          loadingDiv.style.zIndex = '10';
          loadingDiv.innerHTML = '<p>Loading data from Excel...</p>';
===
    </search>
    <content>
===
          loadingDiv.style.zIndex = '10';
          loadingDiv.innerHTML = `
            <div style="text-align:center;">
              <div class="wave-loader" style="margin-bottom:15px;">
                <div></div><div></div><div></div><div></div><div></div>
              </div>
              <p>Loading data from Excel...</p>
            </div>
          `;
          
          // Add wave loader animation
          if (!document.getElementById('wave-loader-style')) {
            const style = document.createElement('style');
            style.id = 'wave-loader-style';
            style.textContent = `
              .wave-loader {
                display: flex;
                justify-content: center;
                align-items: flex-end;
                height: 40px;
              }
              .wave-loader > div {
                background-color: #2196f3;
                height: 100%;
                width: 5px;
                margin: 0 2px;
                border-radius: 3px;
                animation: wave 1.2s infinite ease-in-out;
              }
              .wave-loader > div:nth-child(2) { animation-delay: -1.1s; }
              .wave-loader > div:nth-child(3) { animation-delay: -1.0s; }
              .wave-loader > div:nth-child(4) { animation-delay: -0.9s; }
              .wave-loader > div:nth-child(5) { animation-delay: -0.8s; }
              @keyframes wave {
                0%, 40%, 100% { transform: scaleY(0.3); }
                20% { transform: scaleY(1); }
              }
            `;
            document.head.appendChild(style);
          }
===
    </content>
  </change>
  
  <change>
    <description>Improve chart styling for better visuals</description>
    <search>
===
    function initializeRawChart(canvasElement) {
        console.log("Attempting to initialize Raw Chart...");
        // Canvas element is now passed as an argument
        if (!canvasElement) {
             console.warn("initializeRawChart: Received null canvas element.");
             if (rawChartInstance) { rawChartInstance.destroy(); rawChartInstance = null; }
             return;
        }
===
    </search>
    <content>
===
    // Add global chart styling for consistent visuals
    Chart.defaults.font.family = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#495057';
    Chart.defaults.elements.line.tension = 0.2;
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    Chart.defaults.plugins.tooltip.titleColor = '#1a202c';
    Chart.defaults.plugins.tooltip.bodyColor = '#4a5568';
    Chart.defaults.plugins.tooltip.borderColor = 'rgba(0, 0, 0, 0.1)';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.padding = 10;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
    Chart.defaults.plugins.tooltip.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    Chart.defaults.plugins.tooltip.boxPadding = 6;
    Chart.defaults.elements.point.radius = 4;
    Chart.defaults.elements.point.hoverRadius = 6;
    
    function initializeRawChart(canvasElement) {
        console.log("Attempting to initialize Raw Chart...");
        // Canvas element is now passed as an argument
        if (!canvasElement) {
             console.warn("initializeRawChart: Received null canvas element.");
             if (rawChartInstance) { rawChartInstance.destroy(); rawChartInstance = null; }
             return;
        }
===
    </content>
  </change>
  
  <change>
    <description>Update chart options with modern styling</description>
    <search>
===
                options: { 
                    responsive: true, 
                    maintainAspectRatio: false, 
                    scales: { 
                        y: { 
                            beginAtZero: true, 
                            title: { display: true, text: 'Average Max Outflow (cms)' } 
                        },
                        x: {
                            ticks: {
                                autoSkip: false, // Prevent labels from being skipped
                                maxRotation: 45, // Rotate labels if needed
                                minRotation: 30
                            }
                        }
                    }, 
                    plugins: { 
                        tooltip: { 
                            callbacks: { 
                                label: function(context) { return `${context.dataset.label}: ${context.raw.toFixed(3)} cms`; } 
                            } 
                        } 
                    } 
                }
===
    </search>
    <content>
===
                options: { 
                    responsive: true, 
                    maintainAspectRatio: false,
                    animation: {
                        duration: 1500,
                        easing: 'easeOutQuart'
                    },
                    scales: { 
                        y: { 
                            beginAtZero: true, 
                            title: { 
                                display: true, 
                                text: 'Average Max Outflow (cms)',
                                font: {
                                    weight: '600',
                                    size: 13
                                },
                                padding: {bottom: 10}
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.04)',
                                drawBorder: false
                            },
                            ticks: {
                                padding: 8
                            }
                        },
                        x: {
                            ticks: {
                                autoSkip: false, // Prevent labels from being skipped
                                maxRotation: 45, // Rotate labels if needed
                                minRotation: 30,
                                padding: 10
                            },
                            grid: {
                                display: false
                            }
                        }
                    }, 
                    plugins: { 
                        tooltip: { 
                            callbacks: { 
                                label: function(context) { return `${context.dataset.label}: ${context.raw.toFixed(3)} cms`; } 
                            },
                            displayColors: true,
                            boxWidth: 8,
                            boxHeight: 8,
                            usePointStyle: true,
                            caretPadding: 5,
                            titleMarginBottom: 8
                        },
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                usePointStyle: true,
                                pointStyle: 'circle'
                            }
                        }
                    } 
                }
===
    </content>
  </change>
  
  <change>
    <description>Add subtle scroll to top button for better navigation</description>
    <search>
===
  <script>
    // Initialize data containers - will be filled from Excel
===
    </search>
    <content>
===
  <!-- Scroll to top button -->
  <button id="scrollTopBtn" style="position: fixed; bottom: 30px; right: 30px; width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #1976d2, #42a5f5); color: white; border: none; box-shadow: 0 3px 10px rgba(0,0,0,0.2); cursor: pointer; display: none; z-index: 1000; opacity: 0; transition: opacity 0.3s ease, transform 0.3s ease;">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 19V5M5 12l7-7 7 7"/>
    </svg>
  </button>
  
  <script>
    // Initialize data containers - will be filled from Excel
===
    </content>
  </change>
  
  <change>
    <description>Add scroll to top button functionality</description>
    <search>
===
    });
    
  </script>
===
    </search>
    <content>
===
    });
    
    // Scroll to top button functionality
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    
    window.addEventListener('scroll', function() {
      if (document.documentElement.scrollTop > 300) {
        scrollTopBtn.style.display = 'block';
        setTimeout(() => {
          scrollTopBtn.style.opacity = '1';
          scrollTopBtn.style.transform = 'translateY(0)';
        }, 10);
      } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.transform = 'translateY(10px)';
        setTimeout(() => {
          if (document.documentElement.scrollTop <= 300) {
            scrollTopBtn.style.display = 'none';
          }
        }, 300);
      }
    });
    
    scrollTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
    
  </script>
===
    </content>
  </change>
</file>
