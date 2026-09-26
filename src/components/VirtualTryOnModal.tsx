import React, { useState, useRef, useEffect } from 'react';
import { EyewearProduct } from '../types/optical';
import { FrameGraphic } from './FrameGraphic';
import { Camera, X, RefreshCw, Sliders, Check, Sparkles, ChevronRight, Eye } from 'lucide-react';

interface VirtualTryOnModalProps {
  product: EyewearProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: EyewearProduct, color: string) => void;
}

export const VirtualTryOnModal: React.FC<VirtualTryOnModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [useWebcam, setUseWebcam] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [frameScale, setFrameScale] = useState<number>(100);
  const [verticalOffset, setVerticalOffset] = useState<number>(0);
  const [pupilDistance, setPupilDistance] = useState<number>(63);
  const [snapped, setSnapped] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Model portraits
  const MODEL_FACES = [
    {
      name: 'Elena (Oval Face)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      width: '128mm',
    },
    {
      name: 'Marcus (Square Face)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      width: '135mm',
    },
    {
      name: 'Aria (Round Face)',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
      width: '125mm',
    },
  ];

  useEffect(() => {
    if (product) {
      setSelectedColor(product.defaultColor);
    }
  }, [product]);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
    }
  }, [isOpen]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setUseWebcam(true);
    } catch {
      setCameraError('Camera access not permitted or unavailable. Using studio face models instead.');
      setUseWebcam(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setUseWebcam(false);
  };

  if (!isOpen || !product) return null;

  const activeColorObj = product.colors.find((c) => c.name === selectedColor) || product.colors[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-200 max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={() => {
            stopCamera();
            onClose();
          }}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-700 flex items-center justify-center shadow-md transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Virtual Mirror Viewport */}
        <div className="relative md:w-3/5 bg-slate-900 flex items-center justify-center overflow-hidden h-64 sm:h-80 md:min-h-[500px] md:h-auto shrink-0">
          {useWebcam ? (
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-cover transform -scale-x-100"
            />
          ) : (
            <img
              src={MODEL_FACES[selectedModel].avatar}
              alt={MODEL_FACES[selectedModel].name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover filter contrast-[1.02]"
            />
          )}

          {/* AR Simulated Eyewear Overlay */}
          <div
            className="absolute pointer-events-none transition-all duration-75 flex items-center justify-center"
            style={{
              top: `calc(40% + ${verticalOffset}px)`,
              left: '50%',
              transform: `translate(-50%, -50%) scale(${frameScale / 100})`,
              width: '280px',
            }}
          >
            <FrameGraphic
              shape={product.shape}
              type={product.customSvgType}
              colorHex={activeColorObj.hex}
              className="w-full filter drop-shadow-[0_8px_12px_rgba(0,0,0,0.5)]"
              showLensGlint={true}
            />
          </div>

          {/* Live PD Target Markers */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs border border-white/10">
            <Eye className="w-3.5 h-3.5 text-[#e01a76]" />
            <span>Virtual Fitting · PD: {pupilDistance}mm</span>
          </div>

          {/* Camera / Studio Toggle Floating Bar */}
          <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between gap-2 bg-black/70 backdrop-blur-md p-2 rounded-xl border border-white/15">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {!useWebcam &&
                MODEL_FACES.map((m, idx) => (
                  <button
                    key={m.name}
                    onClick={() => setSelectedModel(idx)}
                    className={`px-2.5 py-1 text-xs rounded-lg transition-all ${
                      selectedModel === idx
                        ? 'bg-[#e01a76] text-white font-medium shadow-sm'
                        : 'text-slate-300 hover:text-white bg-white/10'
                    }`}
                  >
                    {m.name.split(' ')[0]}
                  </button>
                ))}
            </div>

            <button
              onClick={useWebcam ? stopCamera : startCamera}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-medium transition-colors shrink-0"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{useWebcam ? 'Use Sample Model' : 'Enable Webcam'}</span>
            </button>
          </div>
        </div>

        {/* Right Side: Adjustment Controls & Purchase */}
        <div className="md:w-2/5 p-6 flex flex-col justify-between bg-white overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#e01a76] tracking-wider uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>3D Virtual Try-On</span>
            </div>
            <h2 className="text-xl font-bold font-display text-slate-900 leading-snug">
              {product.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {product.shapeLabel} · {product.material}
            </p>

            <div className="flex items-baseline gap-2 mt-3 pb-4 border-b border-slate-100">
              <span className="text-2xl font-bold text-slate-900 font-display">
                ₹{product.price.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-[#e01a76] bg-pink-50 px-2 py-0.5 rounded-md">
                SAVE {product.discountPercent}%
              </span>
            </div>

            {cameraError && (
              <div className="mt-3 p-2.5 bg-amber-50 text-amber-800 text-xs rounded-lg border border-amber-200">
                {cameraError}
              </div>
            )}

            {/* Colorway Selection */}
            <div className="mt-4">
              <label className="text-xs font-semibold text-slate-700 block mb-2">
                Selected Finish: <span className="font-normal text-slate-900">{selectedColor}</span>
              </label>
              <div className="flex items-center gap-2.5">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-7 h-7 rounded-full transition-all flex items-center justify-center ${
                      selectedColor === color.name
                        ? 'ring-2 ring-offset-2 ring-[#e01a76] scale-110'
                        : 'hover:scale-105 border border-slate-300'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {selectedColor === color.name && (
                      <Check className={`w-3.5 h-3.5 ${color.hex === '#d4af37' ? 'text-black' : 'text-white'}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Real-time AR Geometry Calibration */}
            <div className="mt-5 space-y-3.5 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-slate-500" />
                  Fit Calibration
                </span>
                <button
                  onClick={() => {
                    setFrameScale(100);
                    setVerticalOffset(0);
                    setPupilDistance(63);
                  }}
                  className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Reset
                </button>
              </div>

              {/* Scale */}
              <div>
                <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                  <span>Frame Scale</span>
                  <span className="font-mono">{frameScale}%</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="125"
                  value={frameScale}
                  onChange={(e) => setFrameScale(Number(e.target.value))}
                  className="w-full accent-[#e01a76] h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              {/* Vertical Height */}
              <div>
                <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                  <span>Bridge Height</span>
                  <span className="font-mono">{verticalOffset > 0 ? `+${verticalOffset}px` : `${verticalOffset}px`}</span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  value={verticalOffset}
                  onChange={(e) => setVerticalOffset(Number(e.target.value))}
                  className="w-full accent-[#e01a76] h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              {/* PD Slider */}
              <div>
                <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                  <span>Pupillary Distance (PD)</span>
                  <span className="font-mono">{pupilDistance} mm</span>
                </div>
                <input
                  type="range"
                  min="56"
                  max="70"
                  value={pupilDistance}
                  onChange={(e) => setPupilDistance(Number(e.target.value))}
                  className="w-full accent-[#e01a76] h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
            <button
              onClick={() => {
                onAddToCart(product, selectedColor);
                onClose();
              }}
              className="w-full py-3 px-4 bg-[#e01a76] hover:bg-[#b7005d] text-white font-semibold rounded-xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <span>Add This Look To Bag</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <p className="text-center text-[11px] text-slate-400">
              30-day zero-risk returns · Certified optometrist fitting
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
