import React from 'react';

/**
 * Reusable chart card wrapper with loading and error states.
 */
export const ChartCard = ({ 
  title, 
  children, 
  loading = false, 
  error = null,
  className = '' 
}) => {
  return (
    <div className={`gradient-card rounded-xl border border-border shadow-lg p-6 transition-all duration-200 hover:border-primary/30 hover:glow-green ${className}`}>
      <h3 className="text-lg font-semibold mb-4 text-foreground">{title}</h3>
      
      {loading && (
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground mt-4">Loading chart data...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="flex items-center justify-center h-96 bg-destructive/10 rounded-lg border border-destructive/30">
          <div className="text-center">
            <p className="text-destructive font-semibold">Error loading chart</p>
            <p className="text-destructive/80 text-sm mt-2">{error}</p>
          </div>
        </div>
      )}
      
      {!loading && !error && children}
    </div>
  );
};

export default ChartCard;
