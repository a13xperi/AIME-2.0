"""
Manifest Loader

Loads and validates green manifests from the course_data directory.
"""
import json
import os
from typing import Dict, Optional
from pathlib import Path


def load_manifest(dtm_id: str, course_data_root: str = "course_data") -> Optional[Dict]:
    """
    Load a green manifest by dtm_id.
    
    Args:
        dtm_id: DTM identifier (e.g., "riverside_2023_20cm")
        course_data_root: Root directory for course data
        
    Returns:
        Manifest dictionary or None if not found
    """
    manifest_path = os.path.join(course_data_root, "manifests", f"{dtm_id}.json")
    
    if not os.path.exists(manifest_path):
        return None
    
    with open(manifest_path, 'r') as f:
        return json.load(f)


def load_manifest_from_registry(dtm_id: str, datasets_file: str = "course_data/datasets.json") -> Optional[Dict]:
    """
    Load manifest by looking up dtm_id in datasets.json registry.
    
    Args:
        dtm_id: DTM identifier
        datasets_file: Path to datasets.json
        
    Returns:
        Manifest dictionary or None if not found
    """
    # Load registry
    if not os.path.exists(datasets_file):
        return None
    
    with open(datasets_file, 'r') as f:
        registry = json.load(f)
    
    # Find dataset
    dataset = None
    for ds in registry.get("datasets", []):
        if ds.get("dtm_id") == dtm_id:
            dataset = ds
            break
    
    if not dataset:
        return None
    
    # Load manifest
    manifest_path = dataset.get("manifest_path")
    if not manifest_path:
        return None
    
    # Resolve path relative to course_data root
    course_data_root = os.path.dirname(datasets_file)
    full_manifest_path = os.path.join(course_data_root, manifest_path)
    
    if not os.path.exists(full_manifest_path):
        return None
    
    with open(full_manifest_path, 'r') as f:
        return json.load(f)


def resolve_dtm_path(dtm_id: str, datasets_file: str = "course_data/datasets.json") -> Optional[str]:
    """
    Resolve dtm_id to actual grid file path.
    
    Args:
        dtm_id: DTM identifier
        datasets_file: Path to datasets.json
        
    Returns:
        Absolute path to grid file or None if not found
    """
    # Load registry
    if not os.path.exists(datasets_file):
        return None
    
    with open(datasets_file, 'r') as f:
        registry = json.load(f)
    
    # Find dataset
    dataset = None
    for ds in registry.get("datasets", []):
        if ds.get("dtm_id") == dtm_id:
            dataset = ds
            break
    
    if not dataset:
        return None
    
    # Get grid file path
    grid_path = dataset.get("grid_file_path")
    if not grid_path:
        return None
    
    # Resolve to absolute path
    if os.path.isabs(grid_path):
        return grid_path if os.path.exists(grid_path) else None
    else:
        # Relative to repo root
        repo_root = os.path.dirname(os.path.dirname(datasets_file))
        full_path = os.path.join(repo_root, grid_path)
        return full_path if os.path.exists(full_path) else None


if __name__ == '__main__':
    # Test loading
    print("Testing Manifest Loader")
    print("=" * 50)
    
    dtm_id = "riverside_2023_20cm"
    
    # Test direct load
    manifest = load_manifest(dtm_id)
    if manifest:
        print(f"✅ Loaded manifest for {dtm_id}")
        print(f"   Course: {manifest.get('course_id')}")
        print(f"   Hole: {manifest.get('hole_id')}")
        print(f"   Grid: {manifest.get('grid_dimensions')}")
    else:
        print(f"❌ Manifest not found for {dtm_id}")
    
    # Test registry lookup
    manifest2 = load_manifest_from_registry(dtm_id)
    if manifest2:
        print(f"✅ Loaded via registry for {dtm_id}")
    else:
        print(f"❌ Registry lookup failed for {dtm_id}")
    
    # Test path resolution
    grid_path = resolve_dtm_path(dtm_id)
    if grid_path:
        print(f"✅ Resolved grid path: {grid_path}")
    else:
        print(f"❌ Could not resolve grid path for {dtm_id}")

