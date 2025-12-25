#include "extcode.h"
#ifdef __cplusplus
extern "C" {
#endif

/*!
 * DLL_GetPlotData
 */
void __cdecl DLL_GetPlotData(double PlotX[], double PlotY[], int32_t LengthX, 
	int32_t LengthY);
/*!
 * DLL_GetPlotLength
 */
int32_t __cdecl DLL_GetPlotLength(void);
/*!
 * DLL_SolveSingle
 */
int32_t __cdecl DLL_SolveSingle(double HoleX, double HoleY, double BallX, 
	double BallY, double StimpFt, double StimpIn, char Instruction[], 
	int32_t InstructionLength, char DTMPath[]);

MgErr __cdecl LVDLLStatus(char *errStr, int errStrLen, void *module);

void __cdecl SetExecuteVIsInPrivateExecutionSystem(Bool32 value);

#ifdef __cplusplus
} // extern "C"
#endif

