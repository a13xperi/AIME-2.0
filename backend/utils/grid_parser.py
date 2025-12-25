"""
Grid Parser for Ovation Golf DTM Data

Parses tab-separated elevation grid files and extracts metadata.
"""
import os
from typing import Dict, List, Tuple, Optional
import numpy as np


def parse_grid_file(file_path: str) -> Dict:
    """
    Parse an Ovation Golf grid file and extract metadata.
    
    Grid format:
    - Tab-separated values
    - Each row is a line of elevation values
    - -1.000 indicates no data / out of bounds
    - Values are in meters (elevation)
    
    Args:
        file_path: Path to the grid file
        
    Returns:
        Dictionary with grid metadata:
        {
            'rows': int,
            'cols': int,
            'grid_spacing_m': float,  # Assumed 0.2m (20cm) from filename
            'has_data': bool,
            'elevation_range': {'min': float, 'max': float},
            'data_coverage': float  # Percentage of cells with data
        }
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Grid file not found: {file_path}")
    
    with open(file_path, 'r') as f:
        lines = f.readlines()
    
    if not lines:
        raise ValueError("Grid file is empty")
    
    # Parse grid dimensions
    first_line = lines[0].strip()
    cols = len(first_line.split('\t'))
    rows = len(lines)
    
    # Extract elevation values
    elevations = []
    for line in lines:
        values = line.strip().split('\t')
        for val in values:
            try:
                elev = float(val)
                if elev != -1.0:  # Skip no-data markers
                    elevations.append(elev)
            except ValueError:
                continue
    
    # Calculate metadata
    has_data = len(elevations) > 0
    elevation_range = {
        'min': min(elevations) if elevations else None,
        'max': max(elevations) if elevations else None
    }
    
    total_cells = rows * cols
    data_coverage = (len(elevations) / total_cells * 100) if total_cells > 0 else 0.0
    
    # Extract grid spacing from filename (e.g., "Riverside_20cm_Grid.txt" -> 0.2m)
    grid_spacing_m = 0.2  # Default 20cm
    if '20cm' in file_path.lower():
        grid_spacing_m = 0.2
    elif '10cm' in file_path.lower():
        grid_spacing_m = 0.1
    elif '50cm' in file_path.lower():
        grid_spacing_m = 0.5
    
    return {
        'rows': rows,
        'cols': cols,
        'grid_spacing_m': grid_spacing_m,
        'has_data': has_data,
        'elevation_range': elevation_range,
        'data_coverage': data_coverage,
        'total_cells': total_cells,
        'data_cells': len(elevations)
    }


def estimate_green_size(grid_metadata: Dict) -> Dict[str, float]:
    """
    Estimate green size from grid metadata.
    
    Args:
        grid_metadata: Output from parse_grid_file()
        
    Returns:
        Dictionary with 'width' and 'depth' in meters
    """
    rows = grid_metadata['rows']
    cols = grid_metadata['cols']
    spacing = grid_metadata['grid_spacing_m']
    
    # Grid dimensions in meters
    width = cols * spacing
    depth = rows * spacing
    
    return {
        'width': round(width, 2),
        'depth': round(depth, 2)
    }


if __name__ == '__main__':
    # Test with Riverside grid
    grid_file = 'ovation_golf/dll/Riverside_20cm_Grid.txt'
    if os.path.exists(grid_file):
        metadata = parse_grid_file(grid_file)
        print("Grid Metadata:")
        print(f"  Rows: {metadata['rows']}")
        print(f"  Cols: {metadata['cols']}")
        print(f"  Grid Spacing: {metadata['grid_spacing_m']}m")
        print(f"  Has Data: {metadata['has_data']}")
        print(f"  Elevation Range: {metadata['elevation_range']}")
        print(f"  Data Coverage: {metadata['data_coverage']:.1f}%")
        
        green_size = estimate_green_size(metadata)
        print(f"\nEstimated Green Size:")
        print(f"  Width: {green_size['width']}m")
        print(f"  Depth: {green_size['depth']}m")
    else:
        print(f"Grid file not found: {grid_file}")


