import { ChevronUp } from "lucide-react";

interface HoleData {
  course: string;
  holeNumber: number;
  par: number;
  handicap: string;
  teeDistances: {
    name: string;
    yards: number;
  }[];
  greenDepth: number;
  greenWidth: number;
  yardageMarkers: number[];
}

interface HoleLayoutPanelProps {
  isExpanded: boolean;
  onToggle: () => void;
  onClose: () => void;
  holeData: HoleData | null;
}

export default function HoleLayoutPanel({
  isExpanded,
  onToggle,
  onClose,
  holeData
}: HoleLayoutPanelProps) {
  if (!holeData) return null;

  const normalizedCourseName = holeData.course
    .toLowerCase()
    .replace(/\s+golf\s+course/i, '')
    .replace(/\s+/g, '-')
    .trim();
  
  const imagePath = `/assets/courses/${normalizedCourseName}/hole${holeData.holeNumber}.png`;

  console.log('Loading hole layout image from:', imagePath); // Debug log

  return (
    <div className="fixed bottom-32 right-4 w-80 bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out">
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">
            {holeData.course} - Hole {holeData.holeNumber}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        
        <div className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? 'max-h-[600px]' : 'max-h-0'
        }`}>
          <img 
            src={imagePath} 
            alt={`Hole ${holeData.holeNumber} Layout`}
            className="w-full h-auto mb-4"
          />
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Par: {holeData.par}</span>
              <span>Handicap: {holeData.handicap}</span>
            </div>
            
            <div className="space-y-1">
              {holeData.teeDistances.map(tee => (
                <div key={tee.name} className="flex justify-between">
                  <span>{tee.name}:</span>
                  <span>{tee.yards} yards</span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between">
              <span>Green Size:</span>
              <span>{holeData.greenDepth}x{holeData.greenWidth} yards</span>
            </div>
            
            <div>
              <span className="block">Yardage Markers:</span>
              <span className="text-gray-600">
                {holeData.yardageMarkers.join(', ')} yards
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <button
        onClick={onToggle}
        className="w-full p-2 bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
      >
        <ChevronUp
          className={`transform transition-transform ${
            isExpanded ? '' : 'rotate-180'
          }`}
        />
      </button>
    </div>
  );
} 