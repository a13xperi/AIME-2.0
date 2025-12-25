"""
PuttSolver DLL Wrapper

Wraps the Windows PuttSolver.dll for use in the PuttSolver service.
This module handles DLL loading, function calls, and error handling.

Note: This requires Windows x64 and the LabVIEW Runtime Engine.
"""
import os
import sys
import ctypes
from pathlib import Path
from typing import Dict, List, Tuple, Optional
import logging

logger = logging.getLogger(__name__)

# DLL function signatures
DLL_SOLVE_SINGLE = "DLL_SolveSingle"
DLL_GET_PLOT_LENGTH = "DLL_GetPlotLength"
DLL_GET_PLOT_DATA = "DLL_GetPlotData"

# Expected DLL path (relative to putt-solver-service directory)
DLL_PATH = Path(__file__).parent.parent / "ovation_golf" / "dll" / "PuttSolver.dll"

# DLL Error Code Mapping
# These codes are based on common LabVIEW DLL patterns
# Actual codes may need to be verified with Ovation Golf documentation
DLL_ERROR_CODES = {
    0: {"message": "Success", "user_friendly": "Putt solved successfully"},
    1: {"message": "Invalid input parameters", "user_friendly": "Invalid ball or cup position"},
    2: {"message": "DTM file not found", "user_friendly": "Green data file not found"},
    3: {"message": "DTM file read error", "user_friendly": "Could not read green data file"},
    4: {"message": "Out of bounds", "user_friendly": "Ball or cup position is outside the green"},
    5: {"message": "Invalid stimp value", "user_friendly": "Stimp meter reading is out of valid range"},
    6: {"message": "Solver convergence failure", "user_friendly": "Could not calculate putt solution"},
    7: {"message": "Memory allocation error", "user_friendly": "System error: insufficient memory"},
    8: {"message": "Internal solver error", "user_friendly": "Solver encountered an internal error"},
    -1: {"message": "Unknown error", "user_friendly": "An unexpected error occurred"},
}


class PuttSolverError(Exception):
    """Base exception for PuttSolver DLL errors."""
    pass


class DLLLoadError(PuttSolverError):
    """Raised when DLL cannot be loaded."""
    pass


class DLLCallError(PuttSolverError):
    """Raised when a DLL function call fails."""
    def __init__(self, error_code: int, message: str, user_friendly: str = None):
        self.error_code = error_code
        self.message = message
        self.user_friendly = user_friendly or message
        super().__init__(self.user_friendly)


class DLLValidationError(PuttSolverError):
    """Raised when input validation fails before DLL call."""
    pass


class PuttSolverDLL:
    """
    Wrapper for PuttSolver.dll
    
    Handles DLL loading, function calls, and data marshalling.
    """
    
    def __init__(self, dll_path: Optional[str] = None):
        """
        Initialize DLL wrapper.
        
        Args:
            dll_path: Path to PuttSolver.dll (defaults to ovation_golf/dll/PuttSolver.dll)
        """
        self.dll_path = dll_path or str(DLL_PATH)
        self.dll = None
        self._load_dll()
    
    def _load_dll(self):
        """Load the PuttSolver DLL."""
        if not os.path.exists(self.dll_path):
            error_msg = (
                f"PuttSolver.dll not found at: {self.dll_path}\n"
                f"Note: DLL requires Windows x64 and LabVIEW Runtime Engine."
            )
            logger.error(error_msg)
            raise DLLLoadError(error_msg)
        
        try:
            self.dll = ctypes.CDLL(self.dll_path)
            self._setup_function_signatures()
            logger.info(f"Successfully loaded PuttSolver.dll from {self.dll_path}")
        except OSError as e:
            error_msg = (
                f"Failed to load PuttSolver.dll: {e}\n"
                f"This may be due to:\n"
                f"  1. Missing LabVIEW Runtime Engine\n"
                f"  2. Wrong architecture (requires Windows x64)\n"
                f"  3. Missing DLL dependencies"
            )
            logger.error(error_msg)
            raise DLLLoadError(error_msg) from e
        except Exception as e:
            error_msg = f"Unexpected error loading DLL: {e}"
            logger.exception(error_msg)
            raise DLLLoadError(error_msg) from e
    
    def _setup_function_signatures(self):
        """Configure function signatures for DLL calls."""
        # DLL_SolveSingle signature
        # int32_t DLL_SolveSingle(
        #     double HoleX, double HoleY,
        #     double BallX, double BallY,
        #     double StimpFt, double StimpIn,
        #     char Instruction[], int32_t InstructionLength,
        #     char DTMPath[]
        # )
        self.dll.DLL_SolveSingle.argtypes = [
            ctypes.c_double,  # HoleX
            ctypes.c_double,  # HoleY
            ctypes.c_double,  # BallX
            ctypes.c_double,  # BallY
            ctypes.c_double,  # StimpFt
            ctypes.c_double,  # StimpIn
            ctypes.c_char_p,  # Instruction buffer
            ctypes.c_int32,   # InstructionLength
            ctypes.c_char_p   # DTMPath
        ]
        self.dll.DLL_SolveSingle.restype = ctypes.c_int32
        
        # DLL_GetPlotLength signature
        # int32_t DLL_GetPlotLength(void)
        self.dll.DLL_GetPlotLength.argtypes = []
        self.dll.DLL_GetPlotLength.restype = ctypes.c_int32
        
        # DLL_GetPlotData signature
        # void DLL_GetPlotData(double PlotX[], double PlotY[], int32_t LengthX, int32_t LengthY)
        self.dll.DLL_GetPlotData.argtypes = [
            ctypes.POINTER(ctypes.c_double),  # PlotX array
            ctypes.POINTER(ctypes.c_double),   # PlotY array
            ctypes.c_int32,                   # LengthX
            ctypes.c_int32                    # LengthY
        ]
        self.dll.DLL_GetPlotData.restype = None
    
    def _validate_inputs(
        self,
        hole_x: float,
        hole_y: float,
        ball_x: float,
        ball_y: float,
        stimp_ft: float,
        dtm_path: str
    ):
        """Validate inputs before calling DLL."""
        errors = []
        
        # Validate coordinates (reasonable range: -100 to 100 meters)
        if not (-100 <= hole_x <= 100):
            errors.append(f"Hole X position out of range: {hole_x}")
        if not (-100 <= hole_y <= 100):
            errors.append(f"Hole Y position out of range: {hole_y}")
        if not (-100 <= ball_x <= 100):
            errors.append(f"Ball X position out of range: {ball_x}")
        if not (-100 <= ball_y <= 100):
            errors.append(f"Ball Y position out of range: {ball_y}")
        
        # Validate stimp (typical range: 6-15 feet)
        if not (0 <= stimp_ft <= 20):
            errors.append(f"Stimp value out of range: {stimp_ft}")
        
        # Validate DTM path
        if not dtm_path:
            errors.append("DTM path is required")
        elif not os.path.exists(dtm_path):
            errors.append(f"DTM file not found: {dtm_path}")
        
        if errors:
            error_msg = "Input validation failed:\n" + "\n".join(f"  - {e}" for e in errors)
            logger.warning(error_msg)
            raise DLLValidationError(error_msg)
    
    def _get_error_info(self, error_code: int) -> Dict[str, str]:
        """Get error information for a given error code."""
        if error_code in DLL_ERROR_CODES:
            return DLL_ERROR_CODES[error_code]
        else:
            return {
                "message": f"Unknown error code: {error_code}",
                "user_friendly": f"An error occurred (code: {error_code})"
            }
    
    def solve_single(
        self,
        hole_x: float,
        hole_y: float,
        ball_x: float,
        ball_y: float,
        stimp_ft: float,
        stimp_in: float,
        dtm_path: str,
        instruction_buffer_size: int = 256,
        validate_inputs: bool = True
    ) -> Tuple[int, str]:
        """
        Call DLL_SolveSingle to solve a putt.
        
        Args:
            hole_x: Cup X position (meters, green-local)
            hole_y: Cup Y position (meters, green-local)
            ball_x: Ball X position (meters, green-local)
            ball_y: Ball Y position (meters, green-local)
            stimp_ft: Stimpmeter reading (feet)
            stimp_in: Stimpmeter reading (inches)
            dtm_path: Path to DTM file (absolute path)
            instruction_buffer_size: Size of instruction text buffer
            validate_inputs: Whether to validate inputs before calling DLL
            
        Returns:
            Tuple of (return_code, instruction_text)
            return_code: 0 = success, non-zero = error
            
        Raises:
            DLLValidationError: If input validation fails
            DLLCallError: If DLL call fails with a known error code
            RuntimeError: If DLL is not loaded or unexpected error occurs
        """
        if not self.dll:
            raise RuntimeError("DLL not loaded")
        
        # Validate inputs if requested
        if validate_inputs:
            self._validate_inputs(hole_x, hole_y, ball_x, ball_y, stimp_ft, dtm_path)
        
        # Prepare instruction buffer
        instruction_buffer = ctypes.create_string_buffer(instruction_buffer_size)
        
        # Convert DTM path to bytes
        try:
            dtm_path_bytes = dtm_path.encode('utf-8')
        except UnicodeEncodeError as e:
            error_msg = f"DTM path encoding error: {e}"
            logger.error(error_msg)
            raise DLLValidationError(error_msg) from e
        
        # Call DLL with error handling
        try:
            return_code = self.dll.DLL_SolveSingle(
                ctypes.c_double(hole_x),
                ctypes.c_double(hole_y),
                ctypes.c_double(ball_x),
                ctypes.c_double(ball_y),
                ctypes.c_double(stimp_ft),
                ctypes.c_double(stimp_in),
                instruction_buffer,
                ctypes.c_int32(instruction_buffer_size),
                dtm_path_bytes
            )
        except Exception as e:
            error_msg = f"DLL call exception: {e}"
            logger.exception(error_msg)
            raise DLLCallError(-1, error_msg, "Failed to call solver function") from e
        
        # Extract instruction text
        try:
            instruction_text = instruction_buffer.value.decode('utf-8', errors='ignore').strip()
        except Exception as e:
            logger.warning(f"Failed to decode instruction text: {e}")
            instruction_text = ""
        
        # Log error if return code is non-zero
        if return_code != 0:
            error_info = self._get_error_info(return_code)
            logger.warning(
                f"DLL returned error code {return_code}: {error_info['message']}"
            )
        
        return (return_code, instruction_text)
    
    def get_plot_length(self) -> int:
        """
        Get the number of plot points available.
        
        Returns:
            Number of plot points (0 if no points available)
            
        Raises:
            RuntimeError: If DLL is not loaded
            DLLCallError: If DLL call fails
        """
        if not self.dll:
            raise RuntimeError("DLL not loaded")
        
        try:
            length = self.dll.DLL_GetPlotLength()
            if length < 0:
                logger.warning(f"Unexpected negative plot length: {length}")
                return 0
            return length
        except Exception as e:
            error_msg = f"Failed to get plot length: {e}"
            logger.exception(error_msg)
            raise DLLCallError(-1, error_msg, "Failed to retrieve plot data") from e
    
    def get_plot_data(self, max_points: int = 1000) -> List[Tuple[float, float]]:
        """
        Retrieve plot points from the DLL.
        
        Args:
            max_points: Maximum number of points to retrieve (default: 1000)
            
        Returns:
            List of (x, y) tuples in green-local meters
            
        Raises:
            RuntimeError: If DLL is not loaded
            DLLCallError: If DLL call fails
        """
        if not self.dll:
            raise RuntimeError("DLL not loaded")
        
        # Validate max_points
        if max_points <= 0:
            raise ValueError(f"max_points must be positive, got: {max_points}")
        
        # Get actual plot length
        try:
            plot_length = self.get_plot_length()
        except DLLCallError:
            # If we can't get plot length, return empty list
            logger.warning("Could not get plot length, returning empty plot")
            return []
        
        if plot_length <= 0:
            return []
        
        # Allocate arrays
        num_points = min(plot_length, max_points)
        if num_points > max_points:
            logger.warning(
                f"Plot has {plot_length} points, limiting to {max_points}"
            )
        
        try:
            plot_x = (ctypes.c_double * num_points)()
            plot_y = (ctypes.c_double * num_points)()
            
            # Call DLL
            self.dll.DLL_GetPlotData(
                plot_x,
                plot_y,
                ctypes.c_int32(num_points),
                ctypes.c_int32(num_points)
            )
            
            # Convert to list of tuples with validation
            points = []
            for i in range(num_points):
                x = float(plot_x[i])
                y = float(plot_y[i])
                # Validate coordinates (reasonable range)
                if not (-1000 <= x <= 1000) or not (-1000 <= y <= 1000):
                    logger.warning(f"Plot point {i} has suspicious coordinates: ({x}, {y})")
                points.append((x, y))
            
            return points
        except Exception as e:
            error_msg = f"Failed to get plot data: {e}"
            logger.exception(error_msg)
            raise DLLCallError(-1, error_msg, "Failed to retrieve plot points") from e


def solve_putt_with_dll(
    ball_local_m: Dict[str, float],
    cup_local_m: Dict[str, float],
    stimp: float,
    dtm_path: str
) -> Dict:
    """
    Solve a putt using the PuttSolver DLL.
    
    Args:
        ball_local_m: Ball position {"x": float, "y": float} in green-local meters
        cup_local_m: Cup position {"x": float, "y": float} in green-local meters
        stimp: Stimpmeter reading (feet)
        dtm_path: Absolute path to DTM file
        
    Returns:
        Dictionary with solution data:
        {
            "success": bool,
            "instruction_text": str,
            "plot_points_local": List[{"x": float, "y": float}],
            "error": Optional[str],
            "error_code": Optional[int],
            "error_category": Optional[str]  # "validation", "dll_load", "dll_call", "unknown"
        }
    """
    try:
        # Initialize DLL wrapper
        dll_wrapper = PuttSolverDLL()
        
        # Convert stimp to feet and inches
        stimp_ft = float(stimp)
        stimp_in = (stimp_ft - int(stimp_ft)) * 12.0
        
        # Call solver
        return_code, instruction_text = dll_wrapper.solve_single(
            hole_x=cup_local_m["x"],
            hole_y=cup_local_m["y"],
            ball_x=ball_local_m["x"],
            ball_y=ball_local_m["y"],
            stimp_ft=stimp_ft,
            stimp_in=stimp_in,
            dtm_path=dtm_path,
            validate_inputs=True
        )
        
        if return_code != 0:
            error_info = dll_wrapper._get_error_info(return_code)
            return {
                "success": False,
                "error": error_info["user_friendly"],
                "error_code": return_code,
                "error_category": "dll_call",
                "instruction_text": instruction_text
            }
        
        # Get plot points
        try:
            plot_points = dll_wrapper.get_plot_data()
            plot_points_local = [{"x": p[0], "y": p[1]} for p in plot_points]
        except DLLCallError as e:
            # If plot data fails, still return the instruction text
            logger.warning(f"Failed to get plot data: {e}")
            plot_points_local = []
        
        return {
            "success": True,
            "instruction_text": instruction_text,
            "plot_points_local": plot_points_local
        }
    
    except DLLLoadError as e:
        logger.error(f"DLL load error: {e}")
        return {
            "success": False,
            "error": "PuttSolver DLL could not be loaded. Please ensure Windows x64 and LabVIEW Runtime Engine are installed.",
            "error_category": "dll_load",
            "error_details": str(e)
        }
    except DLLValidationError as e:
        logger.warning(f"Input validation error: {e}")
        return {
            "success": False,
            "error": f"Invalid input: {str(e)}",
            "error_category": "validation",
            "error_details": str(e)
        }
    except DLLCallError as e:
        logger.error(f"DLL call error: {e}")
        return {
            "success": False,
            "error": e.user_friendly,
            "error_code": e.error_code,
            "error_category": "dll_call",
            "error_details": e.message
        }
    except Exception as e:
        logger.exception("Unexpected error in solve_putt_with_dll")
        return {
            "success": False,
            "error": f"An unexpected error occurred: {str(e)}",
            "error_category": "unknown",
            "error_details": str(e)
        }


if __name__ == "__main__":
    # Test DLL wrapper (only works on Windows)
    if sys.platform != "win32":
        print("⚠️  DLL wrapper requires Windows x64")
        print("   This is a mock/test on non-Windows systems")
    else:
        print("Testing PuttSolver DLL wrapper...")
        # Add test code here when on Windows

