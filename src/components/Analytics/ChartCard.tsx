import React, { useRef, useState } from 'react';
import { Card, CardContent, Typography, Box, IconButton, Tooltip, MenuItem, Menu } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { toPng } from 'html-to-image';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  hasData?: boolean;
  exportData?: any[];
}

export const ChartCard: React.FC<ChartCardProps> = ({ title, children, hasData = true, exportData }) => {
  // Reference to the graph container to capture the image
  const chartRef = useRef<HTMLDivElement>(null);

  // Manages opening/closing of the export menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Exportation PNG Logic
  const handleExportPNG = async () => {
    handleClose();
    if (chartRef.current === null) return;

    try {
      // Download everything except the item with id "export-controls"
      const filter = (node: HTMLElement) => {
        return node.id !== 'export-controls';
      };

      const dataUrl = await toPng(chartRef.current, { backgroundColor: '#ffffff', pixelRatio: 2, filter: filter});
      const link = document.createElement('a');
      link.download = `${title.replace(/\s+/g, '_').toLowerCase()}.png`;
      link.href = dataUrl;
      link.click(); 
    } catch (err) {
      console.error("Errore durante l'esportazione in PNG: ", err);
    }
  }

  // Expotation CSV Logic
  const handleExportCSV = () => {
    handleClose();
    if(!exportData || exportData.length === 0) return;
    
    // Extracting headers from the first object's keys
    const headers = Object.keys(exportData[0]).join(',');
    
    // Creating rows by mapping values
    const rows = exportData.map(obj => Object.values(obj).join(',')).join('/n');

    const csvContent = `${headers}\n${rows}`;

    // Creating and downloading the CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${title.replace(/\s+/g, '_').toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3 }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box ref={chartRef} sx={{ background: 'white', p: 1, borderRadius: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography  variant= "h6" color= "text.secondary" sx={{ fontWeight: "bold" }} >
              {title}
            </Typography>
            <Box id="export-controls">
              <Tooltip title="Export Options">
                <IconButton onClick={handleClick} size="small" color="primary">
                  <DownloadIcon />
                </IconButton>
              </Tooltip>

              {/* Dropdown menu to choose the format */}
              <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem onClick={handleExportPNG}>Download as PNG</MenuItem>
                {/* Show CSV button only if exportData prop is passed */}
                {exportData && <MenuItem onClick={handleExportCSV}>Download as CSV</MenuItem>}
              </Menu>
            </Box>
          </Box>
        
          {/* Empty State Management */}
          {!hasData ? (
            <Box sx={{ display:"flex", justifyContent: "center", alignItems: "center", height: 300 }}>
              <Typography variant="body1" color="text.disabled">
                No data for selected period
              </Typography>
            </Box>
          ) : (
            <Box sx={{ width: '100%', height: 300 }}>
              {children}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};